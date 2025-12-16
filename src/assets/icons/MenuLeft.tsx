import * as React from "react";
import type { SVGProps } from "react";
const SvgMenuLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 26 26"
    {...props}
  >
    <rect width={26} height={26} fill="#375FFF" rx={13} />
    <path
      stroke="#F9F9F9"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m15 8-5 5 5 5"
    />
  </svg>
);
export default SvgMenuLeft;
