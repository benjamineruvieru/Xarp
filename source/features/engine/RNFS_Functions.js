import RNFS from 'react-native-fs';

const writeFileStream = ({content, path}) => {
  return RNFS.write(path, content, -1, 'base64');
};

const readFileStream = ({position = 0, path}) => {
  RNFS.read(path, 16000, position, 'base64').then(async base64 => {
    if (base64) {
      await writeFileStream(base64);
      readFileStream((position += 16000));
    } else {
      console.log('finished');
    }
  });
};

export const sendFile = () => {};
