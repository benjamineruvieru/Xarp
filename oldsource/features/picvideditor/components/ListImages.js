import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Colors from '../../../constants/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';

const ImageComp = ({
  path,
  imgpath,
  setPath,
  img,
  setrecordedVideoTime,
  setThumblist,
}) => {
  const styles = StyleSheet.create({
    img: {height: 65, width: 65},
    imgview: {
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: path.uri === imgpath ? Colors.primary : Colors.bgLighter,
      borderWidth: 2,
    },
  });
  return (
    <Pressable
      onPress={() => {
        setrecordedVideoTime(img.duration * 1000);
        setThumblist(null);
        setPath(img);
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

const ListImages = ({
  list,
  setPath,
  path,
  setrecordedVideoTime,
  setThumblist,
}) => {
  const insets = useSafeAreaInsets();
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      position: 'absolute',
      top: insets.top + 55,
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
      {list.map(img => (
        <ImageComp
          imgpath={img.uri}
          key={img.id}
          path={path}
          setPath={setPath}
          img={img}
          setrecordedVideoTime={setrecordedVideoTime}
          setThumblist={setThumblist}
        />
      ))}
    </ScrollView>
  );
};

export default ListImages;
