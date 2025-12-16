import * as React from "react";
import type { SVGProps } from "react";
const SvgUsers = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 22 18"
    {...props}
  >
    <path
      stroke="#3A3A3A"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20.5 17c0-1.858-1.762-3.438-4.222-4.024M14.167 17c0-2.356-2.836-4.267-6.334-4.267S1.5 14.643 1.5 17m12.667-7.467c2.332 0 4.222-1.91 4.222-4.266C18.389 2.91 16.499 1 14.167 1M7.833 9.533c-2.332 0-4.222-1.91-4.222-4.266C3.611 2.91 5.501 1 7.833 1s4.223 1.91 4.223 4.267c0 2.356-1.89 4.266-4.223 4.266"
    />
  </svg>
);
export default SvgUsers;
