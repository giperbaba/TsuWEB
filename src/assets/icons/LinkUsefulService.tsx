import * as React from "react";
import type { SVGProps } from "react";
const SvgLinkUsefulService = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <path
      stroke="#F9F9F9"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M1 11 11 1m0 0H3m8 0v8"
    />
  </svg>
);
export default SvgLinkUsefulService;
