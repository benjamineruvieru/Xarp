import {StyleSheet, Text as RNText, View} from 'react-native';
import React from 'react';

const Text = ({children, color = 'white', style, size, numLines}) => {
  const styles = StyleSheet.create({
    text: {
      fontFamily: 'Poppins-Medium',
      color: color,
      fontSize: size === 'small' ? 10 : size === 'title' ? 18 : 13,
      ...style,
    },
  });

  return (
    <RNText numberOfLines={numLines} style={styles.text}>
      {children}
    </RNText>
  );
};

export default Text;
