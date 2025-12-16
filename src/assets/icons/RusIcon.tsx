import * as React from "react";
import type { SVGProps } from "react";
const SvgRusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 34 20"
    {...props}
  >
    <g clipPath="url(#rus_icon_svg__a)">
      <mask
        id="rus_icon_svg__b"
        width={34}
        height={20}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <path fill="#fff" d="M33.22.29h-33v19h33z" />
      </mask>
      <g mask="url(#rus_icon_svg__b)">
        <path fill="#F4F4F4" d="M33.22.29h-33v6.337h33z" />
      </g>
      <mask
        id="rus_icon_svg__c"
        width={34}
        height={20}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <path fill="#fff" d="M33.22.29h-33v19h33z" />
      </mask>
      <g mask="url(#rus_icon_svg__c)">
        <path fill="#323E95" d="M33.22 6.627h-33v6.336h33z" />
      </g>
      <mask
        id="rus_icon_svg__d"
        width={34}
        height={20}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <path fill="#fff" d="M33.22.29h-33v19h33z" />
      </mask>
      <g mask="url(#rus_icon_svg__d)">
        <path fill="#D8001E" d="M33.22 12.953h-33v6.337h33z" />
      </g>
    </g>
    <path
      stroke="#3A3A3A"
      strokeOpacity={0.17}
      strokeWidth={0.5}
      d="M.47.54h32.5v18.5H.47z"
    />
    <defs>
      <clipPath id="rus_icon_svg__a">
        <path fill="#fff" d="M.22.29h33v19h-33z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgRusIcon;
