import {StyleSheet, Image, View} from 'react-native';
import React from 'react';
import {getPercentWidth} from '../../../../../source/utilis/Functions';

const FileComponent = props => {
  const styles = StyleSheet.create({
    container: {
      width: getPercentWidth(props.width),
      height: getPercentWidth(props.height),
    },
    img: {
      width: getPercentWidth(props.width),
      height: getPercentWidth(props.height),
    },
  });
  return (
    <View style={styles.container}>
      <Image
        style={styles.img}
        source={require('../../../../assets/images/file.png')}
      />
    </View>
  );
};

export default FileComponent;
