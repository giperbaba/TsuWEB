import * as React from "react";
import type { SVGProps } from "react";
const SvgEditService = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 18 18"
    {...props}
  >
    <path
      stroke="#3A3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M1 17h16M1 17v-4l8-8M1 17h4l8-8M9 5l2.869-2.869.001-.001c.395-.395.593-.593.821-.667a1 1 0 0 1 .618 0c.228.074.426.272.82.666l1.74 1.74c.396.396.594.594.668.822a1 1 0 0 1 0 .618c-.074.228-.272.426-.667.822h-.001L13 9.001M9 5l4 4"
    />
  </svg>
);
export default SvgEditService;
