import {StyleSheet, View} from 'react-native';
import React from 'react';
import Text from '../../components/Text';
import ProfilePic from '../../components/ProfilePic';
import Icons, {IconsType} from '../../components/Icons';

const users = [{name: 'Ben Dev'}, {name: 'John Doe'}];

const Participants = () => {
  return users.map(data => (
    <View style={styles.view}>
      <View style={styles.viewinner}>
        <ProfilePic />
        <Text style={styles.text}>{data.name}</Text>
      </View>
      <Icons type={IconsType.FontAwesome} name={'microphone'} color={'white'} />
    </View>
  ));
};

export default Participants;

const styles = StyleSheet.create({
  view: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  viewinner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 15,
  },
});
