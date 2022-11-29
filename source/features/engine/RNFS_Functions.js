import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import {formatBytes, seperateExt} from '../../utilis/Functions';
import {PermissionsAndroid} from 'react-native';
const confirmSpace = async fileSize => {
  const space = await RNFS.getFSInfo();
  if (space.freeSpace > fileSize) {
    return Promise.resolve(true);
  } else {
    return Promise.resolve(false);
  }
};

const checkIfExist = async ({name, ext, pos = 0, callBack}) => {
  let path;
  let checkname = name;
  if (pos > 0) {
    checkname = name + '(' + pos + ')';
  }
  if (Platform.OS === 'android') {
    path =
      RNFS.ExternalStorageDirectoryPath +
      '/Xarp Spaces/Received Files/' +
      checkname +
      ext;
  } else {
    path = RNFS.DocumentDirectoryPath + '/Received Files/' + checkname + ext;
  }

  const exist = await RNFS.exists(path);
  if (exist) {
    checkIfExist({
      name,
      ext,
      pos: pos + 1,
      callBack,
    });
  } else {
    if (pos === 0) {
      return callBack(name + ext);
    } else {
      return callBack(name + '(' + pos + ')' + ext);
    }
  }
};

const initFileTransfer = ({path, size, sendMessage, name}) => {
  const message = {
    action: 'initFileTransfer',
    message: {
      name,
      size,
      path,
    },
  };
  sendMessage(message);
};

const getDetails = async ({name, size, sendMessage, path}) => {
  const spaceAvaliable = await confirmSpace(size);
  const {filename, ext} = seperateExt(name);

  const callBack = name => {
    let receiverPath;
    if (Platform.OS === 'android') {
      receiverPath =
        RNFS.ExternalStorageDirectoryPath +
        '/Xarp Spaces/Received Files/' +
        name;
    } else {
      receiverPath = RNFS.DocumentDirectoryPath + '/Received Files/' + name;
    }
    const msg = {
      message: name,
      user: 'other',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      type: 'media',
      extra: {
        filesize: formatBytes(size),
        progress: 0,
        senderPath: path,
        receiverPath: receiverPath,
      },
    };

    sendMessage({message: msg, action: 'message'});

    const message = {
      action: 'startTransfer',
      message: {filename: name, path, position: 0, size},
    };
    sendMessage(message);
  };

  if (spaceAvaliable) {
    checkIfExist({name: filename, ext, callBack});
  } else {
    const message = {
      action: 'errorTransfer',
      message: 'No space on receiving device',
    };
    sendMessage(message);
  }
};

const readFileStream = ({
  position = 0,
  path,
  name,
  sendMessage,
  size,
  dispatch,
}) => {
  try {
    RNFS.read(path, 150000, position, 'base64').then(async base64 => {
      if (base64) {
        const message = {
          action: 'chunk',
          message: {base64, name, position, path, size},
        };
        sendMessage(message);
        dispatch({
          type: 'updateProgress',
          name,
          position,
          size,
        });
      }
    });
  } catch (err) {
    console.error('Read Err', err);
  }
};

const writeFileStream = ({base64, name}) => {
  let path;
  if (Platform.OS === 'android') {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    path =
      RNFS.ExternalStorageDirectoryPath + '/Xarp Spaces/Received Files/' + name;
  } else {
    path = RNFS.DocumentDirectoryPath + '/Received Files/' + name;
  }
  return RNFS.write(path, base64, -1, 'base64');
};

const RNFS_Functions = {
  initFileTransfer,
  getDetails,
  readFileStream,
  writeFileStream,
};

export default RNFS_Functions;
