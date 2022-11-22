import {
  BackHandler,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import RNFS from 'react-native-fs';
import Text from '../../../components/Text';
import Icons, {IconsType} from '../../../components/Icons';
import Colors from '../../../constants/Colors';
import {FlashList} from '@shopify/flash-list';
import {spawn} from '../../../../source/utilis/Functions';
import {createComponent} from '../../firebase/actions';

const RoundButton = props => {
  const styles = StyleSheet.create({
    button: {
      width: 50,
      height: 50,
      backgroundColor: props.color,
      borderRadius: 360,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  return <View style={styles.button}>{props.children}</View>;
};

const Item = ({name, isFile, path}) => {
  return (
    <View style={{marginLeft: 10}}>
      <Text numLines={2}>{name}</Text>
      {name === '--' ? (
        <Text numLines={1} color={Colors.primary}>
          {path}
        </Text>
      ) : (
        <Text color={Colors.primary}>{isFile ? 'File' : 'Folder'}</Text>
      )}
    </View>
  );
};

const LocalDirectory = () => {
  const [files, setFiles] = useState([]);
  const flatRef = useRef(null);
  const [prevFold, setprevFold] = useState(
    Platform.OS === 'ios'
      ? RNFS.MainBundlePath
      : RNFS.ExternalStorageDirectoryPath,
  );
  const [currFold, setCurrFold] = useState(
    Platform.OS === 'ios'
      ? RNFS.MainBundlePath
      : RNFS.ExternalStorageDirectoryPath,
  );

  const uploadFile = (name, path) => {
    const loc = spawn();
    createComponent({
      data: {
        component: 'image',
        text: name,
        height: 15,
        width: 15,
        access: {
          move: 'all',
          notvisible: [],
          shouldScale: true,
        },
        position: {
          x: loc.x,
          y: loc.y,
        },
        id: 'image01',
        uri: '',
      },
      id: 'image01',
    });
  };
  const getFileContent = async path => {
    let tmpfiles = [];
    let tmpfold = [];

    let reader = await RNFS.readDir(path);
    let i = 0;
    const len = reader.length;

    while (i < len) {
      if (reader[i].isDirectory()) {
        tmpfold.push(reader[i]);
      } else {
        tmpfiles.push(reader[i]);
      }
      i++;
    }
    tmpfold = tmpfold.sort((a, b) => a.name.localeCompare(b.name));
    tmpfiles = tmpfiles.sort((a, b) => a.name.localeCompare(b.name));

    let prevfolder;
    let comList = [...tmpfold, ...tmpfiles];

    if (RNFS.ExternalStorageDirectoryPath) {
      if (path !== RNFS.ExternalStorageDirectoryPath) {
        setprevFold(() => path.substring(0, path.lastIndexOf('/')));
        setCurrFold(() => path);
        prevfolder = {
          name: '--',
          path: path.substring(0, path.lastIndexOf('/')),
          isFile: () => false,
          isDirectory: () => true,
        };
        comList.unshift(prevfolder);
      }
    } else {
      if (path !== RNFS.MainBundlePath) {
        setprevFold(() => path.substring(0, path.lastIndexOf('/')));
        setCurrFold(() => path);

        prevfolder = {
          name: '--',
          path: path.substring(0, path.lastIndexOf('/')),
          isFile: () => false,
          isDirectory: () => true,
        };
        comList.unshift(prevfolder);
      }
    }
    setFiles(() => comList);
  };

  const RenderItem = ({item}) => {
    const navigateFolder = () => {
      if (item.isDirectory()) {
        getFileContent(item.path);
      } else {
        uploadFile(item.name, item.path);
      }
    };
    return (
      <TouchableOpacity onPress={navigateFolder} style={styles.folderrow}>
        {item.isFile() ? (
          <RoundButton>
            <Icons
              type={IconsType.FontAwesome}
              name={'file-text-o'}
              color={Colors.white}
              size={35}
            />
          </RoundButton>
        ) : (
          <RoundButton color={Colors.grey}>
            <Icons
              type={IconsType.Ionicons}
              name={'folder-open'}
              color={Colors.white}
              size={25}
            />
          </RoundButton>
        )}
        <Item name={item.name} isFile={item.isFile()} path={item.path} />
      </TouchableOpacity>
    );
  };

  const [refreshing, setRefreshing] = useState(false);

  const Refresh = () => {
    setRefreshing(true);
    getFileContent(currFold);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    getFileContent(
      Platform.OS === 'ios'
        ? RNFS.MainBundlePath
        : RNFS.ExternalStorageDirectoryPath,
    );
  }, []);

  useEffect(() => {
    const backAction = () => {
      // getFileContent(prevFold);
      flatRef.current.scrollToIndex({index: 0, animated: true});

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <FlashList
      ref={flatRef}
      extraData={files}
      estimatedItemSize={20}
      data={files}
      renderItem={RenderItem}
      keyExtractor={item => item.name}
      onRefresh={Refresh}
      refreshing={refreshing}
    />
  );
};

export default LocalDirectory;

const styles = StyleSheet.create({
  folderrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});
