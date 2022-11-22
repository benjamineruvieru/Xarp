import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SendSvg = (props) => (
  <Svg
    width={27}
    height={28}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M24.62 10.427 5.953 1.093a4 4 0 0 0-5.44 5.2l3.2 7.16a1.414 1.414 0 0 1 0 1.094l-3.2 7.16a4 4 0 0 0 3.654 5.626 4.187 4.187 0 0 0 1.8-.426l18.666-9.334a4 4 0 0 0 0-7.146h-.013Zm-1.187 4.76L4.767 24.52a1.334 1.334 0 0 1-1.8-1.733l3.186-7.16c.042-.096.077-.194.107-.294h9.187a1.333 1.333 0 1 0 0-2.666H6.26c-.03-.1-.065-.198-.107-.294l-3.186-7.16a1.333 1.333 0 0 1 1.8-1.733l18.666 9.333a1.333 1.333 0 0 1 0 2.374Z"
      fill="#FFEDFF"
    />
  </Svg>
);

export default SendSvg;
