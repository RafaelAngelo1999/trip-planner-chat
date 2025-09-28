import React from "react";

export function TripIAIcon({
  width = 32,
  height = 32,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient
          id="tripGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop
            offset="0%"
            stopColor="#3B82F6"
          />
          <stop
            offset="50%"
            stopColor="#8B5CF6"
          />
          <stop
            offset="100%"
            stopColor="#06B6D4"
          />
        </linearGradient>
      </defs>

      {/* Planeta/Globe base */}
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="url(#tripGradient)"
        opacity="0.1"
      />
      <circle
        cx="16"
        cy="16"
        r="12"
        fill="none"
        stroke="url(#tripGradient)"
        strokeWidth="2"
      />

      {/* Linhas de latitude/longitude */}
      <path
        d="M4 16 C8 12, 12 12, 16 16 C20 20, 24 20, 28 16"
        stroke="url(#tripGradient)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M4 16 C8 20, 12 20, 16 16 C20 12, 24 12, 28 16"
        stroke="url(#tripGradient)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      <line
        x1="16"
        y1="4"
        x2="16"
        y2="28"
        stroke="url(#tripGradient)"
        strokeWidth="1.5"
        opacity="0.6"
      />

      {/* Avião/Travel icon no centro */}
      <g transform="translate(10, 12)">
        <path
          d="M2 4 L6 2 L10 6 L12 4 L8 8 L12 12 L6 10 L2 8 Z"
          fill="url(#tripGradient)"
          transform="rotate(45 6 6)"
        />
      </g>

      {/* Pontos de destino */}
      <circle
        cx="8"
        cy="8"
        r="1.5"
        fill="#3B82F6"
      />
      <circle
        cx="24"
        cy="12"
        r="1.5"
        fill="#8B5CF6"
      />
      <circle
        cx="20"
        cy="24"
        r="1.5"
        fill="#06B6D4"
      />
    </svg>
  );
}
