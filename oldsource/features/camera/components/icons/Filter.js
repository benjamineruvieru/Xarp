import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const FilterSvg = (props) => (
  <Svg
    width={28}
    height={28}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M14 .667a13.333 13.333 0 1 0 0 26.666A13.333 13.333 0 0 0 14 .667Zm-1.333 23.906a10.667 10.667 0 0 1 0-21.146v21.146Zm2.666 0V3.427a10.667 10.667 0 0 1 0 21.146Z"
      fill="#FFEDFF"
    />
  </Svg>
);

export default FilterSvg;
