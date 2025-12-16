import type { SVGProps } from "react";
const SvgMenuRefs = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="2em"
    height="2em"
    fill="none"
    viewBox="0 0 45 44"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M24.571 10v5.333c0 .354.136.693.377.943s.568.39.91.39H31M24.571 10h-9c-.682 0-1.336.281-1.818.781A2.72 2.72 0 0 0 13 12.667v18.666c0 .708.27 1.386.753 1.886.482.5 1.136.781 1.818.781H28.43c.682 0 1.336-.281 1.818-.781S31 32.041 31 31.333V16.667M24.571 10 31 16.667m-10.286 8H22V30h1.286M22 20.667h.013"
    />
  </svg>
);
export default SvgMenuRefs;
