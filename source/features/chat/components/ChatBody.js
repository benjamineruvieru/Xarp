import React from 'react';
import {RenderMessages} from './RenderMessages';
import {FlashList} from '@shopify/flash-list';
import {Image, View, StyleSheet} from 'react-native';

export const ChatBody = ({messages, dispatch}) => {
  return (
    <View style={styles.body}>
      <Image
        resizeMode="cover"
        source={require('../../../assets/images/background.png')}
        style={styles.overlay_img}
      />
      <FlashList
        extraData={messages}
        inverted={true}
        estimatedItemSize={71}
        data={messages}
        renderItem={({item, index}) => (
          <RenderMessages item={item} index={index} dispatch={dispatch} />
        )}
        keyExtractor={(_, i) => i}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingBottom: 6,
  },

  overlay_img: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.1,
  },
});
