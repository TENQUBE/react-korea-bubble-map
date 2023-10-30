import React from "react";

interface IProps {
  isActive?: boolean;
}

const MinusIcon = ({ isActive = false }: IProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M18 13H6c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1s-.45 1-1 1z"
          fill={isActive ? "#070707" : "#d1d1d1"}
        />
      </g>
    </svg>
  );
};

export default MinusIcon;
