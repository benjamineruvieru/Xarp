import * as React from "react";
import Svg, { Path } from "react-native-svg";

const StickerSvg = (props) => (
  <Svg
    width={28}
    height={28}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M10 10a1.333 1.333 0 1 0 0 2.667A1.333 1.333 0 0 0 10 10Zm8 5.333a6.666 6.666 0 0 0-5.827 3.427 1.334 1.334 0 0 0 .494 1.813c.199.113.424.173.653.174a1.333 1.333 0 0 0 1.16-.68A4 4 0 0 1 18 18a1.333 1.333 0 1 0 0-2.667ZM18 10a1.334 1.334 0 1 0 0 2.667A1.334 1.334 0 0 0 18 10ZM14 .667a13.333 13.333 0 1 0 0 26.666A13.333 13.333 0 0 0 14 .667Zm0 24a10.666 10.666 0 1 1 0-21.333 10.666 10.666 0 0 1 0 21.332Z"
      fill="#FFEDFF"
    />
  </Svg>
);

export default StickerSvg;
