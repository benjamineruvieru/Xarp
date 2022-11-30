import {MMKV} from 'react-native-mmkv';

const storage = new MMKV();

export const setItem = (key, value, shouldStringify) => {
  const mainvalue = shouldStringify ? JSON.stringify(value) : value;

  storage.set(key, mainvalue);
};

export const getItem = (key, shouldParse) => {
  const value = storage.getString(key);
  if (value) {
    return shouldParse ? JSON.parse(value) : value;
  } else {
    return shouldParse ? [] : null;
  }
};

export const deleteItem = key => {
  storage.delete(key);
};

export const addValueListener = callBack => {
  const listener = storage.addOnValueChangedListener(key => {
    const newValue = getItem(key, true);
    if (newValue) {
      callBack({value: newValue, key});
    }
  });

  return {listener};
};

export const saveIce = (key, ice) => {
  const prevIce = getItem(key, true);
  setItem(key, [...prevIce, ice], true);
};
