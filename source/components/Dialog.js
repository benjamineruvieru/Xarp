import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';
import Text from './Text';

const Dialog = props => {
  const {color = Colors.white} = props;
  return (
    <Modal
      useNativeDriver={true}
      visible={props.open}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        props.closeModal();
      }}>
      <Pressable
        onPress={props.closeModal}
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {props.children}
        {/* <View
          style={{
            backgroundColor: color,
            width: '85%',
            height: '55%',
            borderRadius: 20,
            zIndex: 10,
            padding: 10,
            ...props.style,
          }}>
          
        </View> */}
      </Pressable>
    </Modal>
  );
};

export const PopDialog = ({title, message, onPress, closeModal, open}) => {
  const styles = StyleSheet.create({
    button: {
      backgroundColor: 'red',
      alignItems: 'center',
      borderRadius: 10,
      marginBottom: 10,
      height: 40,
      justifyContent: 'center',
      flex: 1,
    },
  });
  return (
    <Dialog open={open} closeModal={closeModal}>
      <View
        style={{
          backgroundColor: Colors.bgLighter,
          width: '85%',
          borderRadius: 20,
          zIndex: 10,
        }}>
        <View
          style={{
            backgroundColor: Colors.primary,
            height: '30%',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>{title}</Text>
        </View>
        <View style={{padding: 10, flex: 1}}>
          <View
            style={{
              flex: 1,

              justifyContent: 'center',
            }}>
            <Text style={{textAlign: 'center'}}>{message}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{...styles.button, backgroundColor: 'transparent'}}
              onPress={closeModal}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onPress}>
              <Text>End Space</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Dialog>
  );
};
