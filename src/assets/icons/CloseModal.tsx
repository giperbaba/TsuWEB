import * as React from "react";
import type { SVGProps } from "react";
const SvgCloseModal = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 14 14"
    {...props}
  >
    <path
      stroke="#3A3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13 13 7 7m0 0L1 1m6 6 6-6M7 7l-6 6"
    />
  </svg>
);
export default SvgCloseModal;
