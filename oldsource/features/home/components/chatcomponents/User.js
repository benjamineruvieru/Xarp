import {StyleSheet, Text as RNText, View, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getPercentWidth} from '../../../../../source/utilis/Functions';
import Text from '../../../../components/Text';
import Colors from '../../../../constants/Colors';
import {RTCView} from 'react-native-webrtc';

const UserCam = ({localStream, text, access, uid}) => {
  return (
    <View
      style={{
        width: 150,
        height: 200,
      }}>
      <RTCView
        streamURL={localStream?.toURL()}
        style={{width: 150, height: 200, borderRadius: 10}}
        objectFit="cover"
        mirror
      />
      <Text
        size={'small'}
        style={{alignSelf: 'center', marginTop: 5}}
        numLines={3}>
        {access.move.includes(uid) ? 'Me' : text}
      </Text>
    </View>
  );
};

const UserComponent = props => {
  const styles = StyleSheet.create({
    container: {
      width: vidOn ? 150 : getPercentWidth(props.width),
      height: vidOn ? 200 : getPercentWidth(props.height),
      borderRadius: getPercentWidth(props.width) / 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.primary,
      borderColor: Colors.darkgrey,
      borderWidth: 3,
    },
    img: {
      width: getPercentWidth(props.width),
      height: getPercentWidth(props.height),
      borderRadius: 360,
    },
  });
  const [initials, setInitials] = useState('--');
  const [vidOn, setVidon] = useState(false);

  const names = props.text.split(' ');
  useEffect(() => {
    if (names.length > 1) {
      setInitials(
        names[0].substring(0, 1).toUpperCase() +
          names[1].substring(0, 1).toUpperCase(),
      );
    } else {
      setInitials(names[0].substring(0, 2).toUpperCase());
    }
  }, []);
  const switchView = () => {
    if (vidOn) {
    } else {
    }
    setVidon(prev => !prev);
  };
  //console.log(props.remoteStream);
  return (
    <Pressable onPress={switchView}>
      {vidOn ? (
        <UserCam
          uid={props.uid}
          access={props.access}
          text={props.text}
          localStream={
            props.access.move.includes(props.uid)
              ? props.localStream
              : props.remoteStream[props.access.move[0]]
          }
        />
      ) : (
        <>
          <View style={styles.container}>
            <RNText
              style={{
                height: 25,
                textAlignVertical: 'center',
                textAlign: 'center',
                fontSize: 20,
                color: 'white',
                fontWeight: '700',
              }}>
              {initials}
            </RNText>
          </View>
          <Text size={'small'} style={{alignSelf: 'center'}} numLines={3}>
            {props.access.move.includes(props.uid) ? 'Me' : props.text}
          </Text>
        </>
      )}
    </Pressable>
  );
};

export default UserComponent;
