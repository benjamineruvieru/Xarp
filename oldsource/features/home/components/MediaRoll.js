import {
  Pressable,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {getPercentWidth} from '../../../../source/utilis/Functions';
import {FlashList} from '@shopify/flash-list';
import Icons, {IconsType} from '../../../components/Icons';
import Colors from '../../../constants/Colors';
import {useNavigation} from '@react-navigation/native';
import Text from '../../../components/Text';
import * as MediaLibrary from 'expo-media-library';

const SendButton = ({startEditting}) => {
  return (
    <TouchableOpacity
      onPress={startEditting}
      style={{
        position: 'absolute',
        bottom: 10,
        backgroundColor: Colors.primary,
        width: '95%',
        height: 45,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
      }}>
      <Text>SEND MEDIA</Text>
    </TouchableOpacity>
  );
};

const MediaRoll = () => {
  const [photos, setPhotos] = useState([]);

  const loadNextPagePictures = useCallback(
    async nextCursor => {
      try {
        const {assets, endCursor, hasNextPage} =
          await MediaLibrary.getAssetsAsync({
            first: 20,
            after: nextCursor,
            mediaType: ['video', 'photo'],
            sortBy: 'creationTime',
          });
        setPhotos(prev => [...(prev ?? []), ...assets]);

        if (hasNextPage) {
          loadNextPagePictures(endCursor);
        }
      } catch (error) {
        console.error('useGallery getPhotos error:', error);
      } finally {
      }
    },
    [photos],
  );

  useEffect(() => {
    if (photos.length < 1) {
      loadNextPagePictures();
    }
  }, [loadNextPagePictures, photos]);

  const [list, setList] = useState([]);

  const navigation = useNavigation();

  const startEditting = () => {
    navigation.navigate('SendMedia', list);
  };

  const addToList = item => {
    let tmp = list;
    if (list.includes(item)) {
      return;
    }
    // console.log(item.substring(item.indexOf('#') + 1, item.length));

    tmp.push(item);
    setList([...tmp]);
  };

  const removeFromList = item => {
    let tmp = list;

    let index = tmp.indexOf(item);

    tmp.splice(index, 1);
    setList([...tmp]);
  };

  const handleMediaPress = path => {
    if (list.includes(path)) {
      removeFromList(path);
    } else if (list.length > 0) {
      addToList(path);
    } else {
      navigation.navigate('SendMedia', [path]);
    }
  };

  const RenderItem = ({item}) => {
    return (
      <Pressable
        onPress={() => {
          // handleMediaPress(item.mediaType + '#' + item.uri);
          handleMediaPress(item);
        }}
        onLongPress={() => {
          // addToList(item.mediaType + '#' + item.uri);
          addToList(item);
        }}>
        {item.mediaType === 'video' && (
          <Icons
            style={{
              top: 3,
              left: 5,
              position: 'absolute',
            }}
            type={IconsType.Ionicons}
            name={'videocam'}
            color={Colors.white}
            size={13}
          />
        )}
        {list.includes(item) && (
          <View
            style={{
              width: getPercentWidth(30),
              height: getPercentWidth(30),
              position: 'absolute',
              top: 0,
              left: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#00000050',
              zIndex: 10,
            }}>
            <Icons
              type={IconsType.Feather}
              name={'check'}
              color={Colors.white}
              size={30}
            />
          </View>
        )}
        <Image
          style={{
            width: getPercentWidth(30),
            height: getPercentWidth(30),
          }}
          source={{uri: item.uri}}
        />
      </Pressable>
    );
  };

  return (
    <>
      <FlashList
        numColumns={3}
        estimatedItemSize={71}
        data={photos}
        extraData={list}
        renderItem={RenderItem}
        keyExtractor={(_, i) => i}
        ItemSeparatorComponent={() => <View style={{height: 5}} />}
      />
      {list.length > 0 && <SendButton startEditting={startEditting} />}
    </>
  );
};

export default MediaRoll;

const styles = StyleSheet.create({});
