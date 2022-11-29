import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../constants/Variables';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const getPercentHeight = percent => {
  return (percent / 100) * SCREEN_HEIGHT;
};
export const getPercentWidth = percent => {
  return (percent / 100) * SCREEN_WIDTH;
};

export const writeUsername = username => {
  firestore().collection('Usernames').doc(username).set({
    username: username,
  });
};

export const userNameExists = async username => {
  const user = await firestore().collection('Usernames').doc(username).get();
  return user.exists;
};

export const UploadPhoto = async (
  filepath,
  callBack,
  username = Math.random().toString(),
) => {
  const reference = storage().ref(`/profilepic/${username}/profile.png`);
  const task = reference.putFile(filepath);

  task.then(async () => {
    const url = await storage()
      .ref(`/profilepic/${username}/profile.png`)
      .getDownloadURL();
    callBack(url);
  });
};

export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const seperateExt = name => {
  if (name.includes('.')) {
    const data = name.split('.');
    let ext = '.' + data.pop();
    let filename = data.join('.');
    return {
      filename,
      ext,
    };
  }
};

export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
