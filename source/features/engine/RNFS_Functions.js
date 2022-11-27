import {Platform} from 'react-native';
import RNFS from 'react-native-fs';

export const writeFileStream = ({base64, name}) => {
  let path;
  if (Platform.OS === 'android') {
    path =
      RNFS.ExternalStorageDirectoryPath + '/Xarp Spaces/Received Files/' + name;
  } else {
    path = RNFS.DocumentDirectoryPath + '/' + name;
  }

  return RNFS.write(path, base64, -1, 'base64');
};

export const readFileStream = ({
  position = 0,
  path,
  name,
  sendMessage,
  size,
  dispatch,
}) => {
  console.log(path);
  try {
    RNFS.read(path, 150000, position, 'base64').then(async base64 => {
      if (base64) {
        dispatch({
          type: 'updateProgress',
          name,
          position,
          size,
        });

        const message = {
          action: 'chunk',
          message: {base64, name, position, path, size},
        };
        sendMessage(message);
      } else {
        console.log('finished');
      }
    });
  } catch (err) {
    console.error('Read Err', err);
  }
};

export const confirmSpace = async fileSize => {
  const space = await RNFS.getFSInfo();
  if (space.freeSpace > fileSize) {
    return Promise.resolve(true);
  } else {
    return Promise.resolve(false);
  }
};

export const checkIfExist = async ({name, ext, pos = 0, callBack}) => {
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
    path = RNFS.DocumentDirectoryPath + '/' + checkname + ext;
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

const seperateExt = name => {
  if (name.includes('.')) {
    const data = name.split('.');
    let ext = '.' + data.pop();
    let filename = data.join('.');
    console.log(ext);
    console.log(filename);
    return {
      filename,
      ext,
    };
  }
};

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const initTransfer = async ({name, size, sendMessage, path}) => {
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
      receiverPath = RNFS.DocumentDirectoryPath + '/' + name;
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

export const sendFile = ({path, size, sendMessage, name}) => {
  const message = {
    action: 'initTransfer',
    message: {
      name,
      size,
      path,
    },
  };
  sendMessage(message);
};
