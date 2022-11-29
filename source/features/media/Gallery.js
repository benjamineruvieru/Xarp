import {
  StyleSheet,
  View,
  Pressable,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import Colors from '../../constants/Colors';
import {getPercentWidth} from '../../utilis/Functions';
import {FlashList} from '@shopify/flash-list';
import Icons, {IconsType} from '../../components/Icons';
import Text from '../../components/Text';
import * as MediaLibrary from 'expo-media-library';

const SendButton = ({startEditting}) => {
  return (
    <TouchableOpacity
      onPress={startEditting}
      style={{
        position: 'absolute',
        bottom: 30,
        backgroundColor: Colors.primary,
        width: '85%',
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

const Gallery = ({navigation, route}) => {
  const [photos, setPhotos] = useState([]);
  const [list, setList] = useState([]);
  const {allowMultiple, imageOnly} = route.params;
  let mediaTypeArr;
  if (imageOnly) {
    mediaTypeArr = ['photo'];
  } else {
    mediaTypeArr = ['video', 'photo'];
  }
  const loadNextPagePictures = useCallback(
    async nextCursor => {
      try {
        const {assets, endCursor, hasNextPage} =
          await MediaLibrary.getAssetsAsync({
            first: 20,
            after: nextCursor,
            mediaType: mediaTypeArr,
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

  const startEditting = () => {
    navigation.navigate('SendMedia', list);
  };

  const addToList = item => {
    let tmp = list;
    if (list.includes(item)) {
      return;
    }

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
          handleMediaPress(item);
        }}
        onLongPress={() => {
          allowMultiple && addToList(item);
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

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  MediaLibrary.getPermissionsAsync().then(async res => {
    if (!res.canAskAgain || res.status === 'denied') {
      Linking.openSettings();
    } else if (!res.granted) {
      const res = await MediaLibrary.requestPermissionsAsync();
      if (!res.granted) {
        loadNextPagePictures();
      } else {
        navigation.goBack();
      }
    }
  });

  useEffect(() => {
    if (permissionResponse?.granted) {
      if (photos.length < 1) {
        loadNextPagePictures();
      }
    }
  }, [loadNextPagePictures, photos, permissionResponse]);

  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          top: 25,

          zIndex: 2,
          flexDirection: 'row',
          alignItems: 'center',
          left: 0,
          right: 0,
          paddingHorizontal: 20,
        }}>
        <Icons
          type={IconsType.AntDesign}
          name={'close'}
          size={25}
          color={'white'}
          fun={() => navigation.goBack()}
        />
        <View style={{alignItems: 'center', flex: 1}}>
          <Text size={'title'}>Gallery</Text>
        </View>
      </View>
      <FlashList
        inverted
        numColumns={3}
        estimatedItemSize={71}
        data={photos}
        extraData={list}
        renderItem={RenderItem}
        keyExtractor={(_, i) => i}
        ItemSeparatorComponent={() => <View style={{height: 5}} />}
      />
      {list.length > 0 && <SendButton startEditting={startEditting} />}
    </View>
  );
};

export default Gallery;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.bgMain},
});
