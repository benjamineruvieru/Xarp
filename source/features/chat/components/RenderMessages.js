import * as Progress from 'react-native-progress';
import {getPercentWidth} from '../../../utilis/Functions';
import React, {Children, useState} from 'react';
import FileViewer from 'react-native-file-viewer';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Text from '../../../components/Text';
import Colors from '../../../constants/Colors';
import {getItem, setItem} from '../../../utilis/storage';
import {CustomDialog} from '../../../components/Dialog';

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

const Touch = ({children, dispatch, index, style}) => {
  const [open, setOpen] = useState(false);

  return (
    <TouchableOpacity
      style={{...style}}
      onLongPress={() => {
        setOpen(true);
      }}>
      {children}
      <CustomDialog
        title={'Report this message'}
        message={
          'This message will be deleted and forwarded to our team for evaluation. If you wish to block this user, tap on their profile to find the block option'
        }
        open={open}
        closeModal={() => setOpen(false)}
        button={'Report'}
        onPress={() => {
          dispatch({
            type: 'delete_message',
            index: index,
          });
          setOpen(false);
        }}
      />
    </TouchableOpacity>
  );
};

export const RenderMessages = props => {
  const username = getItem('username');
  return (
    <Touch
      dispatch={props.dispatch}
      index={props.index}
      style={{paddingHorizontal: 8, paddingTop: 6}}>
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
    </Touch>
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
