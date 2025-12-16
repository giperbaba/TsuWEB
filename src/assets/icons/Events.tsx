import * as React from "react";
import type { SVGProps } from "react";
const SvgEvents = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 21 21"
    {...props}
  >
    <path
      stroke="#3A3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m10.166 15.92-3-1.5m0 0-6 3v-13l6-3m0 13v-13m0 0 6 3m0 0 6-3v7.5m-6-4.5v5.5m4 5.5v.01m2.121 2.111a3 3 0 1 0-4.242 0q.627.628 2.121 1.879 1.577-1.335 2.121-1.879"
    />
  </svg>
);
export default SvgEvents;
