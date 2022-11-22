import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from '../../components/Text';
import Colors from '../../constants/Colors';
import Icons, {IconsType} from '../../components/Icons';

const Settings = () => {
  return (
    <View>
      <View style={styles.viewbutton}>
        <TouchableOpacity style={styles.button}>
          <Icons
            type={IconsType.Octicons}
            name={'stop'}
            color={'white'}
            style={{marginRight: 5}}
          />
          <Text>End Meeting</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonp}>
          <Icons
            type={IconsType.MaterialCommunityIcons}
            name={'location-exit'}
            color={'white'}
            style={{marginRight: 5}}
          />
          <Text>Leave Meeting</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonp: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewbutton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
});
