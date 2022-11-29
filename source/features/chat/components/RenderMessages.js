import * as Progress from 'react-native-progress';
import {getPercentWidth} from '../../../utilis/Functions';
import React from 'react';
import FileViewer from 'react-native-file-viewer';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Text from '../../../components/Text';
import Colors from '../../../constants/Colors';
import {getItem} from '../../../utilis/storage';

const openFile = async props => {
  const username = getItem('username');

  if (username === props.item.user) {
    await FileViewer.open(props.item.extra.senderPath);
  } else {
    await FileViewer.open(props.item.extra.receiverPath);
  }
};
const RenderMedia = ({props}) => {
  const username = getItem('username');

  const color =
    username === props.item.user ? Colors.primaryDark : Colors.otherDarker;

  return (
    <TouchableOpacity
      disabled={props.item.extra.progress < 1}
      onPress={() => openFile(props)}
      style={username === props.item.user ? styles.mefile : styles.otherfile}>
      <View
        style={{
          backgroundColor:
            username === props.item.user
              ? Colors.primaryDark
              : Colors.otherDarker,
          padding: 10,
          borderRadius: 5,
        }}>
        <Text>{props.item.message}</Text>
      </View>
      <Progress.Bar
        progress={props.item.extra.progress}
        width={getPercentWidth(70) - 20}
        color={color}
        borderColor={color}
        style={{marginVertical: 4}}
      />
      <View
        style={{
          paddingBottom: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text size={'small'}>{props.item.time}</Text>
        <Text size={'small'}>{props.item.extra.filesize}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const RenderMessages = props => {
  const username = getItem('username');

  return (
    <View style={{paddingHorizontal: 8, paddingTop: 6}}>
      {props.item.type === 'media' ? (
        <RenderMedia props={props} />
      ) : (
        <View style={username === props.item.user ? styles.me : styles.other}>
          <Text>{props.item.message}</Text>
          <View
            style={{
              paddingBottom: 5,
            }}>
            <Text size={'small'}>{props.item.time}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  me: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
    width: '70%',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: 0,
  },
  other: {
    backgroundColor: Colors.bgLighter,
    width: '70%',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: 0,
  },
  mefile: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
    width: '70%',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
    paddingBottom: 0,
  },
  otherfile: {
    backgroundColor: Colors.bgLighter,
    width: '70%',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
    paddingBottom: 0,
  },
});
