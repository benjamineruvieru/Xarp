import {StyleSheet, View} from 'react-native';
import React from 'react';
import Icons, {IconsType} from '../../../components/Icons';
import Text from '../../../components/Text';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const Head = ({openSheet}) => {
  const inset = useSafeAreaInsets();
  const styles = StyleSheet.create({
    topcontainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      position: 'absolute',
      top: inset.top,
      left: 0,
      right: 0,
      height: 70,
      zIndex: 1,
    },
  });
  return (
    <View style={styles.topcontainer}>
      <Icons
        type={IconsType.Feather}
        name={'settings'}
        color={'white'}
        size={20}
        fun={openSheet}
        style={{top: -2}}
      />

      <Text size={'title'}>Xarp Spaces</Text>
      <View />
    </View>
  );
};
