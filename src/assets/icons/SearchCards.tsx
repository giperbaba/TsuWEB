import type { SVGProps } from "react";
interface SearchCardsProps extends SVGProps<SVGSVGElement> {
  active?: boolean;
}

const SvgSearchCards = ({ active, ...props }: SearchCardsProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="none"
        viewBox="0 0 16 16"
        {...props}
    >
      <path
          stroke={active ? "#375FFF" : "#3A3A3A"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 14a1 1 0 1 0 2 0 1 1 0 0 0-2 0M7 14a1 1 0 1 0 2 0 1 1 0 0 0-2 0M1 14a1 1 0 1 0 2 0 1 1 0 0 0-2 0M13 8a1 1 0 1 0 2 0 1 1 0 0 0-2 0M7 8a1 1 0 1 0 2 0 1 1 0 0 0-2 0M1 8a1 1 0 1 0 2 0 1 1 0 0 0-2 0M13 2a1 1 0 1 0 2 0 1 1 0 0 0-2 0M7 2a1 1 0 1 0 2 0 1 1 0 0 0-2 0M1 2a1 1 0 1 0 2 0 1 1 0 0 0-2 0"
      />
    </svg>
);
export default SvgSearchCards;