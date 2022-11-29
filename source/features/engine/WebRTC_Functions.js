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

const mediaAVConstraints = {
  audio: true,
  video: {
    minFrameRate: 30,
    frameRate: 60,
    facingMode: 'user',
  },
};
const mediaAConstraints = {
  audio: true,
};

export const startChat = async ({
  pc,
  username,
  sendChannel,
  handleReceiveMessage,
}) => {
  pc.current = new RTCPeerConnection(servers);

  sendChannel.current = pc.current.createDataChannel('sendChannel');

  sendChannel.current.onmessage = handleReceiveMessage;

  const channelDoc = firestore().collection('Channels').doc(username);

  //clear previous offer
  const shouldDel = await channelDoc.get().exists;
  if (shouldDel) {
    channelDoc.delete();
  }

  pc.current.onicecandidate = async event => {
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

  const subscriber = channelDoc.onSnapshot(async snapshot => {
    const data = snapshot.data();
    // Listen for remote answer
    if (!pc.current.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.current.setRemoteDescription(answerDescription);
      await channelDoc.update({
        answer: firestore.FieldValue.delete(),
      });
    }

    if (data?.answerCandidates) {
      const can = data?.answerCandidates[0];
      if (can) {
        pc.current.addIceCandidate(new RTCIceCandidate(can));
        await channelDoc.update({
          answerCandidates: firestore.FieldValue.arrayRemove(can),
        });
      } else {
        subscriber();
      }
    }
    //Clear offer after connect
    if (data?.answerCandidates && data?.offerCandidates) {
      const can1 = data?.answerCandidates[0];
      const can2 = data?.answerCandidates[0];
      if (!can1 && !can2) {
        setTimeout(() => {
          channelDoc.delete();
        }, 5000);
      }
    }
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
  };

  const channelDocument = await channelDoc.get();
  const channelData = channelDocument.data();
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

export const prepareToAnswerCall = async ({pcCall, dispatch, isVoiceCall}) => {
  pcCall.current = new RTCPeerConnection(servers);
  const local = await mediaDevices.getUserMedia(
    isVoiceCall ? mediaAConstraints : mediaAVConstraints,
  );
  pcCall.current.addStream(local);
  dispatch({
    type: 'setLocalStream',
    localStream: local,
  });
  const remote = new MediaStream();
  dispatch({
    type: 'setRemoteStream',
    remoteStream: remote,
  });

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
    dispatch({
      type: 'setRemoteStream',
      remoteStream: event.stream,
    });
  };
};

export const startCall = async ({
  pcCall,
  dispatch,
  sendMessage,
  isVoiceCall,
}) => {
  pcCall.current = new RTCPeerConnection(servers);

  const local = await mediaDevices.getUserMedia(
    isVoiceCall ? mediaAConstraints : mediaAVConstraints,
  );
  pcCall.current.addStream(local);
  dispatch({
    type: 'setLocalStream',
    localStream: local,
  });
  const remote = new MediaStream();
  dispatch({
    type: 'setRemoteStream',
    remoteStream: remote,
  });

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
    dispatch({
      type: 'setRemoteStream',
      remoteStream: event.stream,
    });
  };

  pcCall.current.onicecandidate = async event => {
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

export const answerCall = async ({
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
    if (event.candidate) {
      const message = {
        action: 'newIceAns',
        message: event.candidate.toJSON(),
      };

      sendMessage(message);
    }
  };

  offerCandidates.map(can => {
    pcCall.current.addIceCandidate(new RTCIceCandidate(can));
  });
};

export const receiveAnswer = ({answer, pcCall}) => {
  const answerDescription = new RTCSessionDescription(answer);
  pcCall.current.setRemoteDescription(answerDescription);
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

const WebRTCFunctions = {
  startChat,
  joinChat,
  prepareToAnswerCall,
  startCall,
  answerCall,
  addToRandomList,
  receiveAnswer,
  removeFromRandomList,
};

export default WebRTCFunctions;
