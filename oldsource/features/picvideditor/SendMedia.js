import {
  StyleSheet,
  Pressable,
  View,
  SafeAreaView,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Colors from '../../constants/Colors';
import ListImages from './components/ListImages';
import SendTray from './components/SendTray';
import Icons, {IconsType} from '../../components/Icons';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants/Variables';
import {createThumbnail} from 'react-native-create-thumbnail';
import RNConvertPhAsset from 'react-native-convert-ph-asset';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Video from 'react-native-video';

const SendMedia = ({route, navigation}) => {
  let listtmp = route.params;

  const [list, setList] = useState(listtmp);
  const [path, setPath] = useState(list[0]);
  const [finalVideoUrl, setFinalVideoUrl] = useState(
    Platform.OS === 'android' ? list[0].uri : null,
  );
  const [recordedVideoTime, setrecordedVideoTime] = useState(
    list[0].duration * 1000,
  );
  const [thumbList, setThumblist] = useState(null);
  const [pause, setPause] = useState(true);
  const replacePath = (path, index) => {
    let tmp = list;
    let tmpmap = list[index];
    tmpmap.uri = path;
    tmp.splice(index, 1, tmpmap);
    setPath({...tmpmap});
    setList([...tmp]);
  };

  useEffect(() => {
    if (Platform.OS === 'ios' && path.mediaType === 'video') {
      console.log('getting');
      RNConvertPhAsset.convertVideoFromUrl({
        url: path.uri,
        convertTo: 'mov',
        quality: 'high',
      })
        .then(response => {
          console.log(response);
          setFinalVideoUrl(response.path);
        })
        .catch(err => {
          console.log(err, 'RNConvertPhAsset');
        });
    } else if (Platform.OS === 'android' && path.mediaType === 'video') {
      setFinalVideoUrl(path.uri);
    }
  }, [path]);

  useEffect(() => {
    if (finalVideoUrl && path.mediaType === 'video') {
      renderThumbnails();
    }
  }, [finalVideoUrl]);

  const generateThumbnail = async timeStamp => {
    console.log(timeStamp);
    const response = await createThumbnail({
      url: finalVideoUrl,
      timeStamp: timeStamp,
    });

    return response;
  };

  const renderThumbnails = async () => {
    let list = [];

    for (let i = 7; i > 0; i--) {
      let path = await generateThumbnail(recordedVideoTime / i);
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
        setrecordedVideoTime={setrecordedVideoTime}
        list={list}
        setPath={setPath}
        path={path}
        setThumblist={setThumblist}
      />
      {path.mediaType === 'photo' ? (
        <Image
          resizeMode="contain"
          source={{uri: path.uri}}
          style={styles.img}
        />
      ) : (
        <Pressable
          onPress={() => setPause(prev => !prev)}
          style={{justifyContent: 'center'}}>
          <Video
            source={{uri: finalVideoUrl}}
            ref={vidoeRef}
            style={styles.img}
            resizeMode={'contain'}
            paused={pause}
            onLoad={() => {
              vidoeRef.current.seek(0);
            }}
            repeat={true}
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
        thumbList={thumbList}
        type={path.mediaType}
        path={listtmp[list.indexOf(path)]?.uri}
        replacePath={replacePath}
        index={list.indexOf(path)}
        duration={path.duration}
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
