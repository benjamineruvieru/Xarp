import {StyleSheet, Image, TextInput, Button, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import Text from '../../../components/Text';
import Dragable from './Dragable';
import ImageComponent from './chatcomponents/Image';
import FileComponent from './chatcomponents/File';
import UserComponent from './chatcomponents/User';
import MusicComponent from './chatcomponents/Music';
import UserVideo from './chatcomponents/UserVideo';

//const uid = auth().currentUser.uid
const uid = 'testID';

let newdata = [
  {
    id: 'music01',
    component: 'music',
    text: 'Heart Break Dua Lipa ft Dababy',
    height: 20,
    width: 20,
    access: {
      move: 'all',
      notvisible: [],
    },
    position: {
      x: 70,
      y: 250,
    },
  },
  {
    id: 'file01',

    component: 'file',
    text: 'Doc.txt',
    height: 15,
    width: 15,
    access: {
      move: 'all',
      notvisible: [],
    },
    position: {
      x: 40,
      y: 850,
    },
  },
  // {
  //   id: 'uservideo01',

  //   component: 'uservideo',
  //   text: 'User1',
  //   height: 200,
  //   width: 200,
  //   access: {
  //     move: 'all',
  //     notvisible: [],
  //   },
  //   position: {
  //     x: 40,
  //     y: 250,
  //   },
  // },
];

let dataTp = [
  {
    component: 'user',
    text: 'Anita',
    height: 15,
    width: 15,
    access: {
      move: 'ben',
      notvisible: [],
    },
    position: {
      x: 400,
      y: 177,
    },
  },
  {
    component: 'image',
    text: 'Yeah',
    height: 20,
    width: 20,
    access: {
      move: 'all',
      notvisible: [],
      shouldScale: true,
    },
    position: {
      x: 0,
      y: 150,
    },
  },
  {
    component: 'music',
    text: 'Heart Break Dua Lipa ft Dababy',
    height: 20,
    width: 20,
    access: {
      move: 'all',
      notvisible: [],
    },
    position: {
      x: 70,
      y: 250,
    },
  },
  {
    component: 'file',
    text: 'Doc.txt',
    height: 15,
    width: 15,
    access: {
      move: 'all',
      notvisible: [],
    },
    position: {
      x: 40,
      y: 850,
    },
  },
  {
    component: 'user',
    text: 'Ben Dev',
    height: 15,
    width: 15,
    access: {
      move: 'Ben',
      notvisible: [],
    },
    position: {
      x: 40,
      y: 150,
    },
  },
];

const componentmap = {
  image: ImageComponent,
  file: FileComponent,
  user: UserComponent,
  music: MusicComponent,
  uservideo: UserVideo,
};

const RenderItems = ({
  component,
  scale,
  text,
  height,
  width,
  access,
  position,
  fun,
  id,
  uid,
  remoteStream,
  localStream,
}) => {
  const Comp = componentmap[component];
  return (
    <Dragable
      height={height}
      width={width}
      scale={scale}
      access={access}
      position={position}
      fun={fun}
      uid={uid}
      id={id}>
      <Comp
        height={height}
        width={width}
        text={text}
        remoteStream={remoteStream}
        localStream={localStream}
        uid={uid}
        access={access}
      />
      {component !== 'user' && (
        <Text size={'small'} style={{alignSelf: 'center'}} numLines={3}>
          {text}
        </Text>
      )}
    </Dragable>
  );
};

// file01: {
//   x: 40,
//   y: 250,
// },
// music01: {
//   x: 80,
//   y: 550,
// },

const Components = ({scale, socket, remoteStream, data, uid, localStream}) => {
  // useEffect(() => {
  //   const component = firestore()
  //     .collection('Channels')
  //     .doc(uid)
  //     .collection('Components');

  //   component.onSnapshot(snapshot => {
  //     snapshot.docChanges().forEach(change => {
  //       if (change.type === 'added') {
  //         const d = change.doc.data();
  //         let tmp = data;

  //         tmp.push(d);
  //         setData([...tmp]);
  //       }
  //     });
  //   });
  // }, []);

  return (
    <>
      {data.length > 0 &&
        data.map((data, i) => {
          return (
            <RenderItems
              id={data.id}
              scale={scale}
              key={i + data.component}
              component={data.component}
              text={data.text}
              height={data.height}
              width={data.width}
              access={data.access}
              position={data.position}
              fun={() => {}}
              remoteStream={remoteStream}
              uid={uid}
              localStream={localStream}
            />
          );
        })}
    </>
  );
};

export default Components;

const styles = StyleSheet.create({
  infotext: {
    alignSelf: 'center',
  },
});
