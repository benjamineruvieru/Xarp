import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SoundSvg = (props) => (
  <Svg
    width={28}
    height={28}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M26.867.987A1.334 1.334 0 0 0 25.8.68L8.467 3.347a1.333 1.333 0 0 0-1.134 1.32v13.8a4.6 4.6 0 0 0-2-.467A4.667 4.667 0 1 0 10 22.666V12.48l14.667-2.254V15.8a4.6 4.6 0 0 0-2-.467A4.667 4.667 0 1 0 27.333 20V2a1.334 1.334 0 0 0-.466-1.013ZM5.333 24.667a2 2 0 1 1 0-4.001 2 2 0 0 1 0 4ZM22.667 22a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm2-14.48L10 9.773v-4L24.667 3.56v3.96Z"
      fill="#FFEDFF"
    />
  </Svg>
);

export default SoundSvg;
