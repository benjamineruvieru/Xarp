import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../constants/Variables';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const getPercentHeight = percent => {
  return (percent / 100) * SCREEN_HEIGHT;
};
export const getPercentWidth = percent => {
  return (percent / 100) * SCREEN_WIDTH;
};

export const spawn = () => {
  const x = Math.floor(Math.random() * (250 - 50 + 1) + 20);
  const y = Math.floor(Math.random() * (400 - 300 - 70 + 1) + 70);
  return {x, y};
};

export const writeUsername = username => {
  firestore()
    .collection('Usernames')
    .doc(username)
    .set({
      username: username,
    })
    .then(() => {
      //console.log('User added!');
    })
    .catch(error => {
      //console.log(error);
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
