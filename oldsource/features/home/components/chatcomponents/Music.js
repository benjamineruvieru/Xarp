import {StyleSheet, Image, View} from 'react-native';
import React from 'react';
import {getPercentWidth} from '../../../../../source/utilis/Functions';

const MusicComponent = props => {
  const styles = StyleSheet.create({
    container: {
      width: getPercentWidth(props.width - 5),
      height: getPercentWidth(props.height - 5),
    },
    img: {
      width: getPercentWidth(props.width - 5),
      height: getPercentWidth(props.height - 5),
    },
  });
  return (
    <View style={styles.container}>
      <Image
        style={styles.img}
        source={require('../../../../assets/images/music.png')}
      />
    </View>
  );
};

export default MusicComponent;
