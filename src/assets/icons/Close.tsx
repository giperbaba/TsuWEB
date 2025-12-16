import type { SVGProps } from "react";

interface SvgCloseProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string;
}

const SvgClose = ({ strokeColor = "#3A3A3A", ...props }: SvgCloseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="none"
        viewBox="0 0 24 24"
        {...props}
    >
      <path
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m18 18-6-6m0 0L6 6m6 6 6-6m-6 6-6 6"
      />
    </svg>
);

export default SvgClose;