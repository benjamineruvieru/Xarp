import {StyleSheet, Text as RNText, View} from 'react-native';
import React from 'react';

const Text = ({children, color = 'white', style, size, numLines}) => {
  const styles = StyleSheet.create({
    text: {
      fontFamily: 'Poppins-Medium',
      color: color,
      fontSize: size === 'small' ? 12 : size === 'title' ? 20 : 15,
      ...style,
    },
  });

  return (
    <View>
      <RNText numberOfLines={numLines} style={styles.text}>
        {children}
      </RNText>
    </View>
  );
};

export default Text;
