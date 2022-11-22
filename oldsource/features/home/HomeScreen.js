import {
  Button,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import World from './components/World';
import Icons, {IconsType} from '../../components/Icons';
import Colors from '../../constants/Colors';
import Text from '../../components/Text';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Components from './components/Components';
import Bottom from './Bottom';
import {Modalize} from 'react-native-modalize';
import Settings from './Settings';
import {getPercentHeight, spawn} from '../../../source/utilis/Functions';
import Participants from './Participants';
import {
  getLocalStream,
  goConsume,
  signalNewConsumerTransport,
} from './WebRTC_Functions';
import {RTCView} from 'react-native-webrtc';
import io from 'socket.io-client';
const ENDPOINT = 'ws://172.20.10.2:3000/mediasoup';
//const ENDPOINT = 'ws://localhost:3000/mediasoup';

const params = {
  // mediasoup params
  encodings: [
    {
      rid: 'r0',
      maxBitrate: 100000,
      scalabilityMode: 'S1T3',
    },
    {
      rid: 'r1',
      maxBitrate: 300000,
      scalabilityMode: 'S1T3',
    },
    {
      rid: 'r2',
      maxBitrate: 900000,
      scalabilityMode: 'S1T3',
    },
  ],
  // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
  codecOptions: {
    videoGoogleStartBitrate: 1000,
  },
};

const Top = ({openSheet, openSheetUsers}) => {
  const inset = useSafeAreaInsets();
  const styles = StyleSheet.create({
    topcontainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      position: 'absolute',
      top: inset.top,
      left: 0,
      right: 0,
      height: 70,
      zIndex: 1,
    },
  });
  return (
    <View style={styles.topcontainer}>
      <Icons
        type={IconsType.Feather}
        name={'settings'}
        color={'white'}
        size={23}
        fun={openSheet}
      />

      <Text size={'title'}>Xarp</Text>
      <Icons
        type={IconsType.Feather}
        name={'users'}
        color={'white'}
        size={23}
        fun={openSheetUsers}
      />
    </View>
  );
};

const UserCam = ({localStream}) => {
  const inset = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: 'red',
        position: 'absolute',
        left: 15,
        width: 150,
        height: 200,
        top: inset.top + 70,
      }}>
      <RTCView
        streamURL={localStream?.toURL()}
        style={{width: 150, height: 200, borderRadius: 10}}
        objectFit="cover"
        mirror
      />
    </View>
  );
};

const OtherUserCam = ({remoteStream}) => {
  return (
    <RTCView
      streamURL={remoteStream?.toURL()}
      style={{width: 150, height: 200, borderRadius: 10}}
      objectFit="cover"
      mirror
    />
  );
};

const HomeScreen = ({route}) => {
  const modalizeRef = useRef(null);
  const modalizeRefUsers = useRef(null);
  const socket = useRef(null);
  const inset = useSafeAreaInsets();
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [device, setDevice] = useState();
  const [consumerTransport, setConsumerTransport] = useState([]);
  const [videoOn, setVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [uid, setId] = useState();
  const [data, setData] = useState([]);
  const [channelId, setChannelId] = useState(null);
  // useEffect(() => {
  //   socket.current = io(ENDPOINT, {transports: ['websocket']});
  //   socket.current.on('connectionsuccess', ({socketId}) => {
  //     console.log('success', socketId);
  //     setId(socketId);
  //     const component = {
  //       id: socketId,

  //       component: 'user',
  //       text: 'Name',
  //       height: 15,
  //       width: 15,
  //       access: {
  //         move: [socketId],
  //         notvisible: [],
  //         shouldScale: true,
  //       },
  //       position: spawn(),
  //     };

  //     socket.current.emit(
  //       'send-component',
  //       {component: component, roomName: roomID},
  //       () => {},
  //     );
  //     setData(prev => [...prev, component]);

  //     getLocalStream({
  //       params,
  //       setLocalStream,
  //       device,
  //       setDevice,
  //       setConsumerTransport,
  //       setRemoteStream,
  //       socket: socket.current,
  //       roomID,
  //     });
  //   });

  //   socket.current?.on('addcomponent', ({component}) => {
  //     console.log('addcom id:', uid, component);
  //     setData(prev => [...prev, component]);
  //   });
  // }, []);

  // useEffect(() => {
  //   socket.current?.on('producer-closed', ({remoteProducerId, socketId}) => {
  //     console.log('con close', uid);
  //     if (consumerTransport) {
  //       console.log('about to del consumerTransport', consumerTransport);
  //       delete remoteStream[socketId];
  //       setRemoteStream({...remoteStream});
  //       const producerToClose = consumerTransport.find(
  //         transportData => transportData.producerId === remoteProducerId,
  //       );
  //       producerToClose.consumerTransport.close();
  //       producerToClose.consumer.close();

  //       let consumerTransports = consumerTransport.filter(
  //         transportData => transportData.producerId !== remoteProducerId,
  //       );
  //       setConsumerTransport([...consumerTransports]);
  //     }
  //   });
  // }, []);

  // const newProducer = useCallback(
  //   ({producerId, socketId}) => {
  //     console.log(
  //       'mew produv uid',
  //       uid,
  //       socketId,
  //       producerId,
  //       consumerTransport,
  //     );
  //     if (device) {
  //       const producerAvailable = consumerTransport.find(
  //         transportData => transportData.producerId === producerId,
  //       );
  //       if (!producerAvailable) {
  //         console.log('Not avail', uid);
  //         signalNewConsumerTransport({
  //           device,
  //           remoteProducerId: producerId,

  //           setRemoteStream,
  //           setConsumerTransport,
  //           socket: socket.current,
  //           socketId,
  //         });
  //       }
  //     }
  //   },
  //   [device, uid, consumerTransport],
  // );

  // useEffect(() => {
  //   socket.current?.on('new-producer', newProducer);
  //   return () => socket.current.off('new-producer', newProducer);
  // }, [device, uid, consumerTransport]);

  const toggleVideo = async () => {
    try {
      let videoTrack = await localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoOn;
      setVideoOn(prev => !prev);
      //localMediaStream = mediaStream;
    } catch (err) {
      // Handle Error
      console.log(err);
    }
  };

  const toggleAudio = async () => {
    try {
      const audioTrack = await localStream.getAudioTracks()[0];
      audioTrack.enabled = !isMuted;
      setIsMuted(prev => !prev);
    } catch (err) {
      // Handle Error
      console.log(err);
    }
  };

  const switchCam = async () => {
    try {
      const videoTrack = await localStream.getVideoTracks()[0];
      videoTrack._switchCamera();
    } catch (err) {
      console.log(err);
    }
  };

  const openSheet = () => {
    modalizeRef.current?.open();
  };
  const closeSheet = () => {
    modalizeRef.current?.close();
  };

  const openSheetUsers = () => {
    modalizeRefUsers.current?.open();
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Top openSheet={openSheet} openSheetUsers={openSheetUsers} />
        <View style={{top: 100, zIndex: 1}}>
          <Button
            title="Cam"
            onPress={() => {
              //toggleVideo();
              switchCam();
            }}
          />
          <Button
            title="Vidoe"
            onPress={() => {
              toggleVideo();
            }}
          />
          <Button
            title="Audio"
            onPress={() => {
              toggleAudio();
            }}
          />
        </View>
        {/* {localStream && <UserCam localStream={localStream} />} */}
        <View
          style={{
            backgroundColor: 'red',
            position: 'absolute',
            right: 15,
            width: 150,
            top: inset.top + 70,
          }}>
          {/* {remoteStream.map(stream => (
            <OtherUserCam
              key={stream.producerId}
              remoteStream={stream.remote}
            />
          ))} */}
        </View>
        <World
          remoteStream={remoteStream}
          data={data}
          child={Components}
          socket={socket}
          uid={uid}
          localStream={localStream}
        />
        <Bottom />
      </SafeAreaView>
      <SafeAreaView style={{flex: 0, backgroundColor: Colors.bgLighter}} />
      <Modalize
        handleStyle={{backgroundColor: 'white'}}
        handlePosition="inside"
        modalStyle={styles.sheet}
        ref={modalizeRef}
        modalHeight={getPercentHeight(55)}>
        <Settings />
      </Modalize>
      <Modalize
        handlePosition="inside"
        handleStyle={{backgroundColor: 'white'}}
        modalStyle={styles.sheet}
        ref={modalizeRefUsers}
        HeaderComponent={() => (
          <View
            style={{
              flexDirection: 'row',
              padding: 8,
              paddingHorizontal: 15,
              alignItems: 'center',
              paddingTop: 12,
            }}>
            <Icons
              type={IconsType.Feather}
              name={'users'}
              color={'white'}
              size={20}
              fun={openSheetUsers}
              style={{marginRight: 10}}
            />
            <Text>Participants (2)</Text>
          </View>
        )}
        modalHeight={getPercentHeight(55)}>
        <Participants />
      </Modalize>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.bgMain},
  sheet: {
    backgroundColor: Colors.bgLighter,
    paddingTop: 10,
  },
});
