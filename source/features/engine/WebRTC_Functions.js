import {
  RTCPeerConnection,
  MediaStream,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
} from 'react-native-webrtc';

import firestore from '@react-native-firebase/firestore';
import {Platform} from 'react-native';

const servers = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun.stunprotocol.org',
        'stun:stun.l.google.com:19302',
      ],
    },
    {
      urls: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com',
    },
  ],
  iceCandidatePoolSize: 10,
};

export const createChat = async ({
  pc,
  setRemoteStream,
  setLocalStream,
  setWebcamStarted,
  username,
  sendChannel,
  handleReceiveMessage,
}) => {
  let mediaConstraints = {
    audio: true,
    video: {
      frameRate: 30,
      facingMode: 'user',
    },
  };

  pc.current = new RTCPeerConnection(servers);
  const local = await mediaDevices.getUserMedia(mediaConstraints);
  pc.current.addStream(local);
  setLocalStream(local);

  const remote = new MediaStream();
  setRemoteStream(remote);
  setWebcamStarted(true);
  // Push tracks from local stream to peer connection
  local.getTracks().forEach(track => {
    pc.current.getLocalStreams()[0].addTrack(track);
  });

  // Pull tracks from peer connection, add to remote video stream
  pc.current.ontrack = event => {
    event.streams[0].getTracks().forEach(track => {
      remote.addTrack(track);
    });
  };

  pc.current.onaddstream = event => {
    setRemoteStream(event.stream);
  };
  if (Platform.OS === 'ios') {
    startChat({pc, username: 'ben', sendChannel, handleReceiveMessage});
  } else {
    joinChat({pc, username, sendChannel, handleReceiveMessage});
  }
};

const startChat = async ({pc, username, sendChannel, handleReceiveMessage}) => {
  sendChannel.current = pc.current.createDataChannel('sendChannel');

  // listen to incoming messages from other peer
  sendChannel.current.onmessage = handleReceiveMessage;

  const channelDoc = firestore().collection('Channels').doc(username);
  const offerCandidates = channelDoc.collection('offerCandidates');
  const answerCandidates = channelDoc.collection('answerCandidates');

  pc.current.onicecandidate = async event => {
    if (event.candidate) {
      await offerCandidates.add(event.candidate.toJSON());
    }
  };

  //create offer
  const offerDescription = await pc.current.createOffer();
  await pc.current.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };

  await channelDoc.set({offer});

  // Listen for remote answer
  channelDoc.onSnapshot(snapshot => {
    const data = snapshot.data();
    if (!pc.current.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.current.setRemoteDescription(answerDescription);
    }
  });

  // When answered, add candidate to peer connection
  answerCandidates.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        const data = change.doc.data();
        pc.current.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
};

const joinChat = async ({pc, username, sendChannel, handleReceiveMessage}) => {
  const channelDoc = firestore().collection('Channels').doc(username);
  const offerCandidates = channelDoc.collection('offerCandidates');
  const answerCandidates = channelDoc.collection('answerCandidates');

  pc.current.onicecandidate = async event => {
    if (event.candidate) {
      await answerCandidates.add(event.candidate.toJSON());
    }
  };

  const channelDocument = await channelDoc.get();
  const channelData = channelDocument.data();
  console.log(channelData);

  const offerDescription = channelData.offer;

  await pc.current.setRemoteDescription(
    new RTCSessionDescription(offerDescription),
  );

  const answerDescription = await pc.current.createAnswer();
  await pc.current.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await channelDoc.update({answer});

  offerCandidates.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        const data = change.doc.data();
        pc.current.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });

  pc.current.ondatachannel = event => {
    sendChannel.current = event.channel;
    sendChannel.current.onmessage = handleReceiveMessage;
    console.log('[SUCCESS] Connection established');
  };
};
