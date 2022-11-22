import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {RTCView} from 'react-native-webrtc';
import {joinCall, startCall, startWebcam} from '../../WebRTC_Functions';

const UserVideo = ({pc, remoteStream}) => {
  // const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [webcamStarted, setWebcamStarted] = useState(false);
  const [channelId, setChannelId] = useState(null);

  const datachannel = useRef();

  return (
    <View>
      <RTCView
        streamURL={localStream?.toURL()}
        style={{height: 200, width: 200}}
        objectFit="cover"
        mirror
      />
      <RTCView
        streamURL={remoteStream?.toURL()}
        style={{height: 200, width: 200}}
        objectFit="cover"
        mirror
      />
      <Button
        title={'Start Webcam'}
        onPress={() => {
          startWebcam({
            pc,
            datachannel,
            setLocalStream,
            //  setRemoteStream,
            setWebcamStarted,
          });
        }}
      />
      <Button
        title={'Start Call'}
        onPress={() => {
          startCall({
            pc,
            setChannelId,
          });
        }}
      />
      <TextInput style={{backgroundColor: 'white'}} />
      <Button
        title={'Join Call'}
        onPress={() => {
          joinCall({
            pc,
            datachannel,
            channelId: 'testUid',
          });
        }}
      />
    </View>
  );
};

export default UserVideo;

const styles = StyleSheet.create({});
