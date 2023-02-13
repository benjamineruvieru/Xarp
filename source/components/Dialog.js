import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Colors from '../constants/Colors';
import {setItem} from '../utilis/storage';
import Text from './Text';

const Dialog = props => {
  return (
    <Modal
      useNativeDriver={true}
      visible={props.open}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        props.closeModal();
      }}>
      <Pressable onPress={props.closeModal} style={styles.background}>
        {props.children}
      </Pressable>
    </Modal>
  );
};

export const PopDialog = ({title, message, onPress, closeModal, open}) => {
  return (
    <Dialog open={open} closeModal={closeModal}>
      <View style={styles.dialog_background}>
        <View style={styles.title}>
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

export const CustomDialog = ({
  title,
  message,
  onPress,
  closeModal,
  open,
  button,
}) => {
  return (
    <Dialog open={open} closeModal={closeModal}>
      <View style={styles.dialog_background}>
        <View style={styles.title}>
          <Text size={'title'}>{title}</Text>
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
              <Text>{button}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Dialog>
  );
};

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
  background: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog_background: {
    backgroundColor: Colors.bgLighter,
    width: '85%',
    borderRadius: 20,
    zIndex: 10,
  },
  title: {
    backgroundColor: Colors.primary,
    height: '30%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
