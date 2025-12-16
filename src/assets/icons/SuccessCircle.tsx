import * as React from "react";
import type { SVGProps } from "react";
const SvgSuccessCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="#39882C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m15 10-4 4-2-2m3 9a9 9 0 1 1 0-18 9 9 0 0 1 0 18"
    />
  </svg>
);
export default SvgSuccessCircle;
