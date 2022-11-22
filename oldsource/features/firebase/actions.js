import firestore from '@react-native-firebase/firestore';

export const db = firestore();

//const uid = auth().currentUser.uid
const uid = 'testID';

export const updateComponent = async ({data, id}) => {
  const channelDoc = db.collection('Channels').doc(uid);
  const component = channelDoc.collection('Components').doc(id);

  await component.update({...data});
};

export const createComponent = async ({data, id}) => {
  const channelDoc = db.collection('Channels').doc(uid);
  const component = channelDoc.collection('Components').doc(id);

  await component.set({...data});
};

export const useComponents = () => {
  const channelDoc = db.collection('Channels').doc(uid);
  const component = channelDoc.collection('Components').doc(id);

  component.onSnapshot(snapshot => {
    const data = snapshot.docs;
  });
};

export const signalServer = () => {
  db.collection('Channels').add({
    yes: 'ok',
  });
};
