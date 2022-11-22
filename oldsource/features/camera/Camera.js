import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  RecordButton,
  GalleryPickerButton,
  CameraControlBtn,
  EffectsButton,
  StopRecordButton,
  SavePostButton,
} from './components/Buttons';

import {useNavigation} from '@react-navigation/native';
//import {createThumbnail} from 'react-native-create-thumbnail';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {SCREEN_WIDTH} from '../../constants/Variables';
import Colors from '../../constants/Colors';
import Icons, {IconsType} from '../../components/Icons';

const CameraScreen = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasAudioPermission, setHasAudioPermission] = useState(false);
  //const [flash, setFlash] = useState(FlashMode.on);
  const [isCameraReady, setIsCameraReady] = useState(false);
  //const [cameraType, setCameraType] = useState(CameraType.front);
  const [isRecording, setisRecording] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const getPermissionStatus = async () => {
    const cameraStatus = await Camera.getCameraPermissionStatus();
    if (cameraStatus === 'authorized') {
      setHasCameraPermission(true);
    } else if (cameraStatus === 'not-determined') {
      const newCameraPermission = await Camera.requestCameraPermission();
      if (newCameraPermission === 'authorized') {
        setHasCameraPermission(true);
      } else {
        setHasCameraPermission(false);
      }
    } else {
      setHasCameraPermission(false);
    }
    const audioStatus = await Camera.getMicrophonePermissionStatus();
    if (audioStatus === 'authorized') {
      setHasAudioPermission(true);
    } else if (audioStatus === 'not-determined') {
      const newMicrophonePermission =
        await Camera.requestMicrophonePermission();
      if (newMicrophonePermission === 'authorized') {
        setHasAudioPermission(true);
      } else {
        setHasAudioPermission(false);
      }
    } else {
      setHasAudioPermission(false);
    }
  };

  const recordVideo = async () => {
    // setisRecording(true);
    if (cameraRef) {
      try {
        const camOpts = {
          maxDuration: 60,
          quality: Camera.Constants.VideoQuality['720'],
        };
        setisRecording(true);
        //console.log('recording');
        const videoRecord = await cameraRef.recordAsync(camOpts);
        if (videoRecord) {
          const data = await videoRecord;
          const source = data.uri;
          //console.log('stopped recording');
          const videoThumbnail = await getThumbnail(source);
          // navigation.navigate("SavePost", {
          //   source: source,
          //   thumbnail: videoThumbnail,
          // });
        }
      } catch (error) {
        //console.log(error);
      }
    }
  };
  const stopVideo = async () => {
    setisRecording(false);
    if (cameraRef) {
      cameraRef.stopRecording();
    }
  };

  const pauseVideo = async () => {
    // setisRecording(false);
    if (cameraRef) {
      cameraRef.pauseRecording();
      //console.log('paused recording');
    }
  };

  const resumeVideo = async () => {
    //setisRecording(true);
    if (cameraRef) {
      cameraRef.resumePreview();
      //console.log('recording resumed');
    }
  };

  // const flipCamera = () => {
  //   if (cameraType === 'back') {
  //     setCameraType(CameraType.front);
  //   } else {
  //     setCameraType(CameraType.back);
  //   }
  // };

  const getThumbnail = async dataSource => {
    try {
      // const uri = await createThumbnail({
      //   url: dataSource,
      //   timeStamp: 1000,
      // });
      // return uri;
    } catch (error) {}
  };

  useEffect(() => {
    getPermissionStatus();
  }, []);
  const cameraRef = useRef(null);

  const devices = useCameraDevices();
  const device = devices.front;
  if (!device) {
    return <View />;
  }
  if (!hasCameraPermission || !hasAudioPermission) {
    return <View />;
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.bgMain,
        paddingBottom: insets.bottom,
      }}>
      <View style={{flex: 1}}>
        <Camera
          device={device}
          isActive={isFocused}
          preset="medium"
          //ratio="16:9"
          style={StyleSheet.absoluteFill}
          //style={styles.subCamera}
          ref={cameraRef}
          photo={true}
          video={true}
          audio={true}
          // type={cameraType}
          // flashMode={flash}
          // onCameraReady={() => setIsCameraReady(true)}
        />

        <View
          style={{
            top: 40,

            position: 'absolute',
            left: 15,
          }}>
          {/* <BackButton onPress={() => navigation.goBack()} /> */}
        </View>
        <View style={styles.sideControls}>
          {/* <CameraControlBtn name="Flip" icon="flip" touchFunc={flipCamera} /> */}
          <CameraControlBtn name="Text" icon="text" />
        </View>

        <View style={styles.bottomControls}>
          {isRecording ? (
            <View style={styles.galleryView}>
              <StopRecordButton stopVideo={stopVideo} />
            </View>
          ) : (
            <View style={styles.galleryView}>
              <Icons
                type={IconsType.Ionicons}
                name={'flash'}
                color={'white'}
                size={30}
              />
            </View>
          )}
          <View>
            <RecordButton
              isRecording={isRecording}
              recordVideo={recordVideo}
              isCamReady={isCameraReady}
              stopVideo={stopVideo}
              pauseVideo={pauseVideo}
              resumeVideo={resumeVideo}
            />
          </View>

          {isRecording ? (
            <View style={styles.galleryView}>
              <SavePostButton />
            </View>
          ) : (
            <View style={styles.galleryView}></View>
          )}
        </View>
      </View>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  sideControls: {
    width: 50,
    paddingTop: 20,
    height: 'auto',
    position: 'absolute',
    right: 15,
    borderRadius: 50,
    top: 100,
    backgroundColor: '#00000033',
    justifyContent: 'center',
  },
  galleryView: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subCamera: {
    flex: 1,
    backgroundColor: '#000',
    // aspectRatio: 9 / 16,
  },

  bottomControls: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  camerastory: {
    height: '8%',
    //justifyContent: "center",
    flexDirection: 'row',
    paddingLeft: SCREEN_WIDTH / 2 - 30,
  },
  unsellabel: {
    fontSize: 11,
    lineHeight: 15,
    paddingTop: 10,
  },
  sellabel: {
    fontSize: 13,
    color: '#D6C7D6',
    lineHeight: 15,
    paddingTop: 10,
    marginRight: 16,
  },
});
