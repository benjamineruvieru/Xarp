import {
  RTCPeerConnection,
  MediaStream,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
} from 'react-native-webrtc';

import firestore from '@react-native-firebase/firestore';
import {getItem} from '../../utilis/storage';

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

export const prepareToAnswerCall = async ({
  pcCall,
  dispatch,
  setRemoteStream,
  isVoiceCall,
}) => {
  let mediaConstraints = {
    audio: true,
    video: {
      minFrameRate: 30,
      frameRate: 60,
      facingMode: 'user',
    },
  };
  let mediaConstraintsAudio = {
    audio: true,
  };

  pcCall.current = new RTCPeerConnection(servers);

  const local = await mediaDevices.getUserMedia(
    isVoiceCall ? mediaConstraintsAudio : mediaConstraints,
  );

  pcCall.current.addStream(local);
  dispatch({
    type: 'setLocalStream',
    localStream: local,
  });

  const remote = new MediaStream();
  setRemoteStream(remote);

  local.getTracks().forEach(track => {
    pcCall.current.getLocalStreams()[0].addTrack(track);
  });

  // Pull tracks from peer connection, add to remote video stream
  pcCall.current.ontrack = event => {
    event.streams[0].getTracks().forEach(track => {
      remote.addTrack(track);
    });
  };

  pcCall.current.onaddstream = event => {
    setRemoteStream(event.stream);
  };
};

export const answerVideoCall = async ({
  pcCall,
  sendMessage,
  offer,
  offerCandidates,
}) => {
  await pcCall.current.setRemoteDescription(new RTCSessionDescription(offer));

  const answerDescription = await pcCall.current.createAnswer();
  await pcCall.current.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  const message = {
    action: 'answer',
    message: answer,
  };

  sendMessage(message);

  pcCall.current.onicecandidate = async event => {
    console.log('pcCall rece sent candi');
    if (event.candidate) {
      const message = {
        action: 'newIceAns',
        message: event.candidate.toJSON(),
      };

      sendMessage(message);
    }
  };

  offerCandidates.map(can => {
    console.log('Rece pcCall addIce');
    pcCall.current.addIceCandidate(new RTCIceCandidate(can));
  });
};

export const receiveAnswer = ({answer, pcCall}) => {
  const answerDescription = new RTCSessionDescription(answer);
  pcCall.current.setRemoteDescription(answerDescription);
};

export const startVideoCall = async ({
  pcCall,
  dispatch,
  setRemoteStream,
  sendMessage,
  isVoiceCall,
}) => {
  let mediaConstraints = {
    audio: true,
    video: {
      minFrameRate: 30,
      frameRate: 60,
      facingMode: 'user',
    },
  };
  let mediaConstraintsAudio = {
    audio: true,
  };

  const local = await mediaDevices.getUserMedia(
    isVoiceCall ? mediaConstraintsAudio : mediaConstraints,
  );

  pcCall.current = new RTCPeerConnection(servers);

  pcCall.current.addStream(local);
  dispatch({
    type: 'setLocalStream',
    localStream: local,
  });

  const remote = new MediaStream();
  setRemoteStream(remote);

  //Push tracks from local stream to peer connection
  local.getTracks().forEach(track => {
    pcCall.current.getLocalStreams()[0].addTrack(track);
  });

  // Pull tracks from peer connection, add to remote video stream
  pcCall.current.ontrack = event => {
    event.streams[0].getTracks().forEach(track => {
      remote.addTrack(track);
    });
  };

  pcCall.current.onaddstream = event => {
    setRemoteStream(event.stream);
  };

  pcCall.current.onicecandidate = async event => {
    console.log('pcCall sent candi');
    if (event.candidate) {
      const message = {
        action: 'newIce',
        message: event.candidate.toJSON(),
      };

      sendMessage(message);
    }
  };

  const offerDescription = await pcCall.current.createOffer();
  await pcCall.current.setLocalDescription(offerDescription);
  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };

  const message = {
    action: 'offer',
    message: {offer, isVoiceCall},
  };

  sendMessage(message);
};

export const startChat = async ({
  pc,
  username,
  sendChannel,
  handleReceiveMessage,
}) => {
  pc.current = new RTCPeerConnection(servers);

  sendChannel.current = pc.current.createDataChannel('sendChannel');

  // listen to incoming messages from other peer
  sendChannel.current.onmessage = handleReceiveMessage;

  const channelDoc = firestore().collection('Channels').doc(username);

  const shouldDel = await channelDoc.get().exists;
  if (shouldDel) {
    console.log('deleting');
    channelDoc.delete();
  } else {
    console.log('didi deleting');
  }
  pc.current.onicecandidate = async event => {
    console.log('sender sent candi');
    if (event.candidate) {
      await channelDoc.update({
        offerCandidates: firestore.FieldValue.arrayUnion(
          event.candidate.toJSON(),
        ),
      });
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
  const password = getItem('password');
  if (password) {
    channelDoc.update({
      password: password,
    });
  }
  // Listen for remote answer
  const subscriber = channelDoc.onSnapshot(async snapshot => {
    const data = snapshot.data();
    if (!pc.current.currentRemoteDescription && data?.answer) {
      console.log('New answer');
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.current.setRemoteDescription(answerDescription);
      await channelDoc.update({
        answer: firestore.FieldValue.delete(),
      });
    }

    if (data?.answerCandidates) {
      const can = data?.answerCandidates[0];
      if (can) {
        console.log('Sender addIce');
        pc.current.addIceCandidate(new RTCIceCandidate(can));
        await channelDoc.update({
          answerCandidates: firestore.FieldValue.arrayRemove(can),
        });
      } else {
        subscriber();
      }
    }

    if (data?.answerCandidates && data?.offerCandidates) {
      const can1 = data?.answerCandidates[0];
      const can2 = data?.answerCandidates[0];
      if (!can1 && !can2) {
        channelDoc.delete();
      }
    }
  });
};

export const addToRandomList = ({username}) => {
  const ranchannelDoc = firestore().collection('Random').doc('users');
  ranchannelDoc.set({
    users: firestore.FieldValue.arrayUnion(username),
  });
};

export const removeFromRandomList = ({username}) => {
  const ranchannelDoc = firestore().collection('Random').doc('users');
  ranchannelDoc.set({
    users: firestore.FieldValue.arrayRemove(username),
  });
};

export const joinChat = async ({
  pc,
  username,
  sendChannel,
  handleReceiveMessage,
}) => {
  pc.current = new RTCPeerConnection(servers);

  const channelDoc = firestore().collection('Channels').doc(username);

  pc.current.onicecandidate = async event => {
    console.log('rece sent candi');
    if (event.candidate) {
      await channelDoc.update({
        answerCandidates: firestore.FieldValue.arrayUnion(
          event.candidate.toJSON(),
        ),
      });
    }
  };

  pc.current.ondatachannel = event => {
    sendChannel.current = event.channel;
    sendChannel.current.onmessage = handleReceiveMessage;
    console.log('[SUCCESS] Connection established');
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

  const subscriber = channelDoc.onSnapshot(async snapshot => {
    const data = snapshot.data();

    if (data?.offerCandidates) {
      const can = data?.offerCandidates[0];
      if (can) {
        console.log('Rece addIce');
        pc.current.addIceCandidate(new RTCIceCandidate(can));
        await channelDoc.update({
          offerCandidates: firestore.FieldValue.arrayRemove(can),
        });
      } else {
        subscriber();
      }
    }
  });
};

const WebRTCFunctions = {
  startChat: startChat,
  joinChat: joinChat,
};

export default WebRTCFunctions;
