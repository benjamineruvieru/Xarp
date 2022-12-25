import {useNavigation} from '@react-navigation/native';
import React, {useState, useCallback} from 'react';
import DocumentPicker from 'react-native-document-picker';
import SendSvg from '../../../assets/svg/send.svg';
import Icons, {IconsType} from '../../../components/Icons';
import RNFS from 'react-native-fs';
import RNConvertPhAsset from 'react-native-convert-ph-asset';
import RNFS_Functions from '../../engine/RNFS_Functions';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import Colors from '../../../constants/Colors';
import {getItem} from '../../../utilis/storage';

const openGallery = ({navigation, sendMessage}) => {
  navigation.navigate('Gallery', {
    allowMultiple: true,
    imageOnly: false,
  });
  DeviceEventEmitter.addListener('receiveMedia', eventData => {
    eventData.media.map(response => {
      if (Platform.OS === 'ios') {
        if (response.node.type.includes('video')) {
          RNConvertPhAsset.convertVideoFromUrl({
            url: response.node.image.uri,
            convertTo: 'mov',
            quality: 'high',
          }).then(res => {
            RNFS.stat(res.path).then(data => {
              RNFS_Functions.initFileTransfer({
                path: data.path,
                size: data.size,
                sendMessage,
                name: response.node.image.filename,
              });
            });
          });
        } else {
          const getAssetFileAbsolutePath = async assetPath => {
            const dest = `${RNFS.TemporaryDirectoryPath}${Math.random()
              .toString(36)
              .substring(7)}.jpg`;

            try {
              let absolutePath = await RNFS.copyAssetsFileIOS(
                assetPath,
                dest,
                0,
                0,
              );
              return absolutePath;
            } catch (err) {
              return null;
            }
          };
          getAssetFileAbsolutePath(response.node.image.uri).then(path => {
            RNFS_Functions.initFileTransfer({
              path,
              size: response.node.image.fileSize,
              sendMessage,
              name: response.node.image.filename,
            });
          });

          // } else {
          // CameraRoll.iosGetImageDataById(response.node.image.id, false).then(
          //   res => {
          //     RNFS_Functions.initFileTransfer({
          //       path: res.node.image.filepath,
          //       size: res.node.image.fileSize,
          //       sendMessage,
          //       name: res.node.image.filename,
          //     });
          //   },
          // );
        }
      } else {
        // RNFS.stat(response.uri).then(res => {
        RNFS_Functions.initFileTransfer({
          path: response.node.image.uri,
          size: response.node.image.fileSize,
          sendMessage,
          name: response.node.image.filename,
        });
        // });
      }
    });
    DeviceEventEmitter.removeAllListeners('receiveMedia');
  });
};

export const ChatBottom = ({sendMessage}) => {
  const navigation = useNavigation();
  const [message, setMessage] = useState();
  const username = getItem('username');

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pickMultiple({
        presentationStyle: 'formSheet',
        copyTo: 'cachesDirectory',
      });
      response.map(response => {
        const names = response.fileCopyUri.split('/');
        names.pop();
        names.push(response.name);
        const path = names.join('/');
        RNFS_Functions.initFileTransfer({
          path: path,
          size: response.size,
          sendMessage,
          name: response.name,
        });
      });
    } catch (err) {}
  }, []);

  const validateSend = () => {
    if (message) {
      const msg = {
        message,
        user: username,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        type: 'message',
      };
      sendMessage({message: msg, action: 'message'});
      setMessage();
    }
  };

  return (
    <View style={styles.messageview}>
      <View style={styles.inputview}>
        <Icons
          type={IconsType.Entypo}
          name={'attachment'}
          color={Colors.faintgrey}
          size={18}
          style={{marginRight: 10}}
          fun={handleDocumentSelection}
        />
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Message"
          placeholderTextColor={Colors.faintgrey}
          style={styles.messageinput}
        />
        <Icons
          type={IconsType.Octicons}
          name={'image'}
          size={18}
          color={Colors.faintgrey}
          fun={() => openGallery({navigation, sendMessage})}
        />
      </View>
      <TouchableOpacity onPress={validateSend} style={styles.sendbutton}>
        <SendSvg height={22} width={22} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  messageview: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  sendbutton: {
    backgroundColor: Colors.primary,
    height: 50,
    width: 50,
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageinput: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    color: 'white',
    marginRight: 5,
  },
  inputview: {
    flex: 1,
    backgroundColor: Colors.bgLighter,
    height: 50,
    borderRadius: 360,
    marginRight: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
