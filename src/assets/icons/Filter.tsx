import * as React from "react";
import type { SVGProps } from "react";
const SvgFilter = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 14"
    {...props}
  >
    <path
      stroke="#375FFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 10h7M1 10h2m0 0a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0m15-6h1M1 4h7m6.5 2.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5"
    />
  </svg>
);
export default SvgFilter;
