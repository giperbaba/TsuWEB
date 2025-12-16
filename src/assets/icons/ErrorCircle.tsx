import * as React from "react";
import type { SVGProps } from "react";
const SvgErrorCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      stroke="#FF5757"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m7 7 3 3m0 0 3 3m-3-3-3 3m3-3 3-3m-3 12a9 9 0 1 1 0-18 9 9 0 0 1 0 18"
    />
  </svg>
);
export default SvgErrorCircle;
