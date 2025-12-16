import type { SVGProps } from "react";
interface SearchListProps extends SVGProps<SVGSVGElement> {
  active?: boolean;
}

const SvgSearchList = ({ active, ...props }: SearchListProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="none"
        viewBox="0 0 16 12"
        {...props}
    >
      <path
          stroke={active ? "#375FFF" : "#3A3A3A"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M1 11h14M1 6h14M1 1h14"
      />
    </svg>
);
export default SvgSearchList;