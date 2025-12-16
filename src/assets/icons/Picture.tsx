import * as React from "react";
import type { SVGProps } from "react";
const SvgPicture = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 31 31"
    {...props}
  >
    <path
      stroke="#3A3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20.333 9.056h.017M1 21.944l8.056-8.055c1.495-1.439 3.338-1.439 4.833 0l8.055 8.055m-3.222-3.222 1.611-1.61c1.495-1.44 3.339-1.44 4.834 0L30 21.943M1 5.834A4.833 4.833 0 0 1 5.833 1h19.334A4.833 4.833 0 0 1 30 5.833v19.334A4.833 4.833 0 0 1 25.167 30H5.833A4.833 4.833 0 0 1 1 25.167z"
    />
  </svg>
);
export default SvgPicture;
