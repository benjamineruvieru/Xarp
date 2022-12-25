import {
  StyleSheet,
  Pressable,
  View,
  SafeAreaView,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import React, {useEffect, useRef, useState, useReducer} from 'react';
import Colors from '../../constants/Colors';
import ListImages from './components/ListImages';
import SendTray from './components/SendTray';
import Icons, {IconsType} from '../../components/Icons';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants/Variables';
import {createThumbnail} from 'react-native-create-thumbnail';
import RNConvertPhAsset from 'react-native-convert-ph-asset';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Video from 'react-native-video';
import {useRoute} from '@react-navigation/native';

function reducer(state, action) {
  switch (action.type) {
    case 'change_uri': {
      return {
        ...state,
        uri: action.newUri,
        currentIndex: action.index,
        mediaType: action.mediaType,
        finalVideoUrl: Platform.OS === 'android' ? action.newUri : null,
        duration: action.duration,
      };
    }
    case 'change_videouri': {
      return {
        ...state,
        finalVideoUrl: action.newUri,
      };
    }
    case 'crop_image': {
      const map = state.croppedUri;
      map[action.index] = {uri: action.cropUri, size: action.size};
      return {
        ...state,
        croppedUri: map,
      };
    }
  }
  throw Error('Unknown action.');
}

const SendMedia = ({navigation}) => {
  const route = useRoute();
  const [state, dispatch] = useReducer(reducer, {
    uri: route.params[0].node.image.uri,
    duration: route.params[0].node.image.playableDuration * 1000,
    fullList: route.params,
    mediaType: route.params[0].node.type,
    currentIndex: 0,
    croppedUri: {},
    finalVideoUrl:
      Platform.OS === 'android' ? route.params[0].node.image.uri : null,
  });

  const [thumbList, setThumblist] = useState(null);
  const [pause, setPause] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'ios' && state.mediaType.includes('video')) {
      RNConvertPhAsset.convertVideoFromUrl({
        url: state.uri,
        convertTo: 'mov',
        quality: 'high',
      }).then(response => {
        dispatch({
          type: 'change_videouri',
          newUri: response.path,
        });
      });
    }
  }, [state.uri]);

  useEffect(() => {
    if (state.finalVideoUrl && state.mediaType.includes('video')) {
      renderThumbnails();
    }
  }, [state.finalVideoUrl]);

  const generateThumbnail = async timeStamp => {
    const response = await createThumbnail({
      url: state.finalVideoUrl,
      timeStamp: timeStamp,
    });

    return response;
  };

  const renderThumbnails = async () => {
    let list = [];

    for (let i = 7; i > 0; i--) {
      let path = await generateThumbnail(state.duration / i);
      list.push(path.path);
      setThumblist([...list]);
    }
  };
  const inset = useSafeAreaInsets();
  const vidoeRef = useRef();
  return (
    <SafeAreaView style={styles.container}>
      <Icons
        type={IconsType.AntDesign}
        color={'white'}
        name={'close'}
        size={30}
        fun={() => navigation.goBack()}
        style={{
          top: 10 + inset.top + StatusBar.currentHeight,
          left: 16,
        }}
      />
      <ListImages
        list={state.fullList}
        dispatch={dispatch}
        uri={state.uri}
        setThumblist={setThumblist}
      />
      {state.mediaType.includes('image') ? (
        <Image
          resizeMode="contain"
          source={{
            uri: state.croppedUri[state.currentIndex]
              ? state.croppedUri[state.currentIndex].uri
              : state.uri,
          }}
          style={styles.img}
        />
      ) : (
        <Pressable
          onPress={() => setPause(prev => !prev)}
          style={{justifyContent: 'center'}}>
          <Video
            source={{uri: state.finalVideoUrl}}
            ref={vidoeRef}
            style={styles.img}
            resizeMode={'contain'}
            paused={pause}
            onLoad={() => {
              vidoeRef.current.seek(0);
            }}
            repeat={true}
            onProgress={progress => {
              const num = progress.seekableDuration / progress.currentTime;
              const seekLength = SCREEN_WIDTH - 120;
              setProgress(seekLength / num);
            }}
          />
          {pause && (
            <View
              style={{
                position: 'absolute',
                alignSelf: 'center',
                backgroundColor: '#00000050',
                padding: 20,
                borderRadius: 360,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icons
                type={IconsType.Ionicons}
                name={'md-play'}
                color={'white'}
                size={50}
              />
            </View>
          )}
        </Pressable>
      )}
      <SendTray
        progress={progress}
        thumbList={thumbList}
        state={state}
        dispatch={dispatch}
        type={state.mediaType}
      />
    </SafeAreaView>
  );
};

export default SendMedia;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgMain,
    justifyContent: 'center',
  },
  img: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
});
