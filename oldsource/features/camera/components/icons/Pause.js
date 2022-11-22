import * as React from "react";
import Svg, {
  G,
  Path,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
} from "react-native-svg";

const SvgComponent = (props) => (
  <Svg
    width={23}
    height={23}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        d="M0 3.367C0 1.734 1.716.41 3.833.41s3.834 1.324 3.834 2.957v16.265c0 1.633-1.717 2.957-3.834 2.957S0 21.265 0 19.632V3.367Z"
        fill="#F94A40"
      />
      <Path
        d="M0 3.367C0 1.734 1.716.41 3.833.41s3.834 1.324 3.834 2.957v16.265c0 1.633-1.717 2.957-3.834 2.957S0 21.265 0 19.632V3.367Z"
        fill="url(#b)"
      />
      <Path
        d="M15.334 3.367c0-1.633 1.716-2.957 3.833-2.957s3.834 1.324 3.834 2.957v16.265c0 1.633-1.717 2.957-3.834 2.957s-3.833-1.324-3.833-2.957V3.367Z"
        fill="#F94A40"
      />
      <Path
        d="M15.334 3.367c0-1.633 1.716-2.957 3.833-2.957s3.834 1.324 3.834 2.957v16.265c0 1.633-1.717 2.957-3.834 2.957s-3.833-1.324-3.833-2.957V3.367Z"
        fill="url(#c)"
      />
    </G>
    <Defs>
      <LinearGradient
        id="b"
        x1={0}
        y1={24.437}
        x2={9.162}
        y2={1.857}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#F94A3F" />
        <Stop offset={1} stopColor="#E4317D" />
      </LinearGradient>
      <LinearGradient
        id="c"
        x1={0.001}
        y1={24.437}
        x2={9.163}
        y2={1.857}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#F94A3F" />
        <Stop offset={1} stopColor="#E4317D" />
      </LinearGradient>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h23v23H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default SvgComponent;
