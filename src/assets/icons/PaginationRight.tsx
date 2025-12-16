import * as React from "react";
import type { SVGProps } from "react";
const SvgPaginationRight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 9 17"
    {...props}
  >
    <path
      stroke="#3A3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m1 1.5 7 7-7 7"
    />
  </svg>
);
export default SvgPaginationRight;
