import {
  StyleSheet,
  View,
  Button,
  TextInput,
  SafeAreaView,
  Platform,
} from 'react-native';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {RTCView} from 'react-native-webrtc';
import RNFS from 'react-native-fs';
import {createChat} from '../engine/WebRTC_Functions';
import DocumentPicker from 'react-native-document-picker';
const ChatScreen = ({route}) => {
  const path = RNFS.ExternalStorageDirectoryPath + '/D.gif';
  const path2 = RNFS.ExternalStorageDirectoryPath + '/D2.gif';

  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [webcamStarted, setWebcamStarted] = useState(false);
  const [message, setMessage] = useState(null);
  const [fileResponse, setFileResponse] = useState([]);
  const {username} = route.params;
  const pc = useRef();
  const sendChannel = useRef();

  function handleReceiveMessage(e) {
    // Listener for receiving messages from the peer
    console.log('[INFO] Message received from peer ', Platform.OS, ' ', e.data);
    switch (e.data.action) {
      case 'message':
        console.log(e.data.message);
        break;
    }
  }
  function sendMessage(message) {
    sendChannel.current.send(message);
  }

  useEffect(() => {
    createChat({
      pc,
      setLocalStream,
      setRemoteStream,
      setWebcamStarted,
      sendChannel,
      username,
      handleReceiveMessage,
    });
  }, []);

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'formSheet',
      });
      console.log(response);
      setFileResponse(response);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  return (
    <SafeAreaView>
      {localStream && (
        <RTCView
          streamURL={localStream?.toURL()}
          style={styles.stream}
          objectFit="cover"
          mirror
        />
      )}

      {remoteStream && (
        <RTCView
          streamURL={remoteStream?.toURL()}
          style={styles.stream}
          objectFit="cover"
          mirror
        />
      )}
      <View>
        <TextInput
          value={message}
          placeholder="Message"
          //minLength={45}
          style={{borderWidth: 1, padding: 5}}
          onChangeText={newText => setMessage(newText)}
        />
        <Button
          title="Send mes"
          onPress={() => {
            handleDocumentSelection;
            sendMessage(message);
          }}
        />
        <Button
          title="File"
          onPress={() => {
            handleDocumentSelection();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  stream: {
    height: 200,
    width: 150,
  },
});
