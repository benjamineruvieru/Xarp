import * as React from "react";
import Svg, { Path } from "react-native-svg";

const CommentSvg = (props) => (
  <Svg
    width={27}
    height={28}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M13.5.667A13.333 13.333 0 0 0 .167 14a13.186 13.186 0 0 0 3.013 8.44L.513 25.106a1.333 1.333 0 0 0-.28 1.454 1.333 1.333 0 0 0 1.267.773h12a13.333 13.333 0 0 0 0-26.666Zm0 24H4.713l1.24-1.24a1.333 1.333 0 0 0 0-1.88 10.667 10.667 0 1 1 7.547 3.12Z"
      fill="#FFEDFF"
    />
  </Svg>
);

export default CommentSvg;
