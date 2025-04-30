import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Foundation from 'react-native-vector-icons/Foundation';
import {TouchableOpacity} from 'react-native';

export const IconsType = {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Feather,
  FontAwesome,
  FontAwesome5,
  AntDesign,
  Entypo,
  SimpleLineIcons,
  Octicons,
  Foundation,
};

const Icons = ({type, name, color, size = 20, style, fun}) => {
  const fontSize = 23;
  const Tag = type;
  return (
    <>
      {type && name && (
        <TouchableOpacity style={{zIndex: 10}} disabled={!fun} onPress={fun}>
          <Tag
            name={name}
            size={size || fontSize}
            color={color}
            style={style}
          />
        </TouchableOpacity>
      )}
    </>
  );
};

export default Icons;
