import * as React from "react";
import type { SVGProps } from "react";
const SvgOpenDropdown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 10 6"
    {...props}
  >
    <path
      stroke="#FFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 1 5 5 1 1"
    />
  </svg>
);
export default SvgOpenDropdown;
