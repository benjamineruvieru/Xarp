import {Image, StyleSheet} from 'react-native';
import React from 'react';
import {getPercentWidth} from '../../source/utilis/Functions';

const ProfilePic = () => {
  return (
    <Image
      style={styles.img}
      source={require('../assets/images/profile.jpg')}
    />
  );
};

export default ProfilePic;

const styles = StyleSheet.create({
  img: {
    borderRadius: 360,
    width: getPercentWidth(11),
    height: getPercentWidth(11),
  },
});
