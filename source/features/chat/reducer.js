import InCallManager from 'react-native-incall-manager';
import BackgroundTimer from 'react-native-background-timer';

export function reducer(state, action) {
  switch (action.type) {
    case 'change_chatname': {
      return {
        ...state,
        chatname: action.chatname,
      };
    }
    case 'addUserDetails': {
      return {
        ...state,
        chatname: action.chatname,
        img: action.img,
      };
    }
    case 'change_status': {
      return {
        ...state,
        status: action.status,
      };
    }
    case 'stop_waiting': {
      return {
        ...state,
        waiting: false,
      };
    }
    case 'startCall': {
      return {
        ...state,
        isCalling: true,
        isVoiceCall: false,
      };
    }
    case 'startVoiceCall': {
      return {
        ...state,
        isCalling: true,
        isVoiceCall: true,
      };
    }
    case 'addMessage': {
      return {
        ...state,
        messages: [action.message, ...state.messages],
      };
    }
    case 'isReceivingCall': {
      return {
        ...state,
        isReceivingCall: true,
        offer: action.offer,
      };
    }
    case 'answeredCall': {
      return {
        ...state,
        isReceivingCall: false,
        answered: true,
      };
    }
    case 'receiveAnswer': {
      return {
        ...state,

        answered: true,
      };
    }
    case 'endCall': {
      InCallManager.stopRingtone();
      InCallManager.stop();
      BackgroundTimer.stopBackgroundTimer();

      state.localStream?.getTracks().map(track => {
        track.stop();
      });

      return {
        ...state,
        isCalling: false,
        answered: false,
        offer: null,
        isReceivingCall: false,
        localStream: null,
        isParticipantVideoOn: true,
      };
    }

    case 'setLocalStream': {
      return {
        ...state,
        localStream: action.localStream,
      };
    }

    case 'setRemoteStream': {
      return {
        ...state,
        remoteStream: action.remoteStream,
      };
    }

    case 'videoOn': {
      return {
        ...state,
        isParticipantVideoOn: true,
      };
    }

    case 'videoOff': {
      return {
        ...state,
        isParticipantVideoOn: false,
      };
    }

    case 'newIce': {
      return {
        ...state,
        offerCandidates: [action.ice, ...state.offerCandidates],
      };
    }
    case 'newIceAns': {
      return {
        ...state,
        answerCandidates: [action.ice, ...state.answerCandidates],
      };
    }

    case 'updateProgress': {
      const index = state.messages.findIndex(item => {
        return item.message === action.name;
      });

      if (index > -1) {
        const messages = [...state.messages];
        const olddata = state.messages[index];
        const pos = action.position + 150000;
        const nwprogress = pos >= action.size ? action.size : pos / action.size;
        olddata.extra.progress = nwprogress;
        messages[index] = olddata;
        return {
          ...state,
          messages: [...messages],
        };
      }
    }
  }
  throw Error('Unknown action.');
}
