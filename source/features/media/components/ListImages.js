import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Colors from '../../../constants/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';

const ImageComp = ({uri, imgpath, index, img, setThumblist, dispatch}) => {
  const styles = StyleSheet.create({
    img: {height: 65, width: 65},
    imgview: {
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: uri === imgpath ? Colors.primary : Colors.bgLighter,
      borderWidth: 2,
    },
  });
  return (
    <Pressable
      onPress={() => {
        setThumblist(null);
        dispatch({
          type: 'change_uri',
          newUri: img.uri,
          index: index,
          mediaType: img.mediaType,
          duration: img.duration * 1000,
        });
      }}
      style={styles.imgview}>
      <Image
        source={{
          uri: imgpath,
        }}
        style={styles.img}
      />
    </Pressable>
  );
};

const ListImages = ({list, uri, setThumblist, dispatch}) => {
  const insets = useSafeAreaInsets();
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      position: 'absolute',
      top: insets.top + 60,
      left: 16,
      zIndex: 1,
    },
  });
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal
      contentContainerStyle={{paddingRight: 20}}
      style={styles.container}>
      {list.map((img, index) => (
        <ImageComp
          index={index}
          dispatch={dispatch}
          imgpath={img.node.image.uri}
          key={index}
          uri={uri}
          img={img}
          setThumblist={setThumblist}
        />
      ))}
    </ScrollView>
  );
};

export default ListImages;
