import * as React from "react";
import Svg, { Path } from "react-native-svg";

const TextSvg = (props) => (
  <Svg
    width={16}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M14.667 0H1.333a1.333 1.333 0 0 0 0 2.667h5.334v12a1.333 1.333 0 0 0 2.666 0v-12h5.334a1.333 1.333 0 0 0 0-2.667Z"
      fill="#FFEDFF"
    />
  </Svg>
);

export default TextSvg;
