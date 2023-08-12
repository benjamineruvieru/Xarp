import InCallManager from 'react-native-incall-manager';

const CallFunctions = ({
  localStream,
  setVideoOn,
  isMuted,
  sendMessage,
  videoOn,
  setIsMuted,
  setIsSpeakerOn,
}) => {
  const toggleVideo = () => {
    try {
      localStream.getVideoTracks().map(track => (track.enabled = !videoOn));

      setVideoOn(prev => {
        if (prev) {
          sendMessage({
            action: 'videoOff',
          });
        } else {
          sendMessage({
            action: 'videoOn',
          });
        }
        return !prev;
      });
    } catch (err) {}
  };

  const toggleAudio = async () => {
    try {
      localStream.getAudioTracks().forEach(track => (track.enabled = isMuted));
      setIsMuted(prev => !prev);
    } catch (err) {}
  };

  const switchCam = async () => {
    try {
      const videoTrack = await localStream.getVideoTracks()[0];
      videoTrack._switchCamera();
    } catch (err) {}
  };

  const toggleSpeaker = async () => {
    try {
      InCallManager.setForceSpeakerphoneOn(!isSpeakerOn);
      setIsSpeakerOn(prev => !prev);
    } catch (err) {}
  };

  return {toggleAudio, toggleVideo, switchCam, toggleSpeaker};
};

export default CallFunctions;
