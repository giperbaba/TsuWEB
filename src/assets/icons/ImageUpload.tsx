import * as React from "react";
import type { SVGProps } from "react";
const SvgImageUpload = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 31 31"
    {...props}
  >
    <path
      stroke="#666"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M19.316 8.632h.015M15.5 28.474H5.579A4.58 4.58 0 0 1 1 23.894V5.58A4.58 4.58 0 0 1 5.579 1h18.316a4.58 4.58 0 0 1 4.579 4.579V15.5M1 20.842l7.632-7.631c1.416-1.364 3.162-1.364 4.579 0l5.342 5.342m-.764-.764 1.527-1.526c1.036-.997 2.248-1.265 3.38-.803M25.42 30v-9.158m0 0L30 25.422m-4.579-4.58-4.579 4.58"
    />
  </svg>
);
export default SvgImageUpload;
