import type { SVGProps } from "react";
const SvgMenuSmall = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.1em"
    height="1em"
    fill="none"
    viewBox="0 0 25 15"
    {...props}
  >
    <path
      stroke="#3A3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1.625 13.54h21.75M1.625 7.5h21.75M1.625 1.457h21.75"
    />
  </svg>
);
export default SvgMenuSmall;
