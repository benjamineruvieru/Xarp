import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {getPercentWidth} from '../../source/utilis/Functions';

const RoundButton = props => {
  const styles = StyleSheet.create({
    button: {
      width: getPercentWidth(14),
      height: getPercentWidth(14),
      backgroundColor: props.color,
      borderRadius: 360,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  return (
    <TouchableOpacity
      disabled={!props.fun}
      onPress={props.fun}
      style={styles.button}>
      {props.children}
    </TouchableOpacity>
  );
};

export default RoundButton;
