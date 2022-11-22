import {StyleSheet, Image, View} from 'react-native';
import React from 'react';
import {getPercentWidth} from '../../../../../source/utilis/Functions';

const ImageComponent = props => {
  const styles = StyleSheet.create({
    container: {
      width: getPercentWidth(props.width),
      height: getPercentWidth(props.height),
    },
    img: {
      width: getPercentWidth(props.width),
      height: getPercentWidth(props.height),
      borderRadius: 5,
    },
  });
  return (
    <View style={styles.container}>
      <Image
        style={styles.img}
        source={require('../../../../assets/images/test.jpg')}
      />
    </View>
  );
};

export default ImageComponent;
