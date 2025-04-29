// src/common/EmptyState.tsx
import React from "react";

interface EmptyStateProps {
  mensaje: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ mensaje }) => (
  <div className="w-full py-12 flex flex-col items-center justify-center text-center text-gray-500">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12 mb-4 text-gray-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6m-3-8v4m0-4a2 2 0 100-4 2 2 0 000 4z"
      />
    </svg>
    <p className="text-lg">{mensaje}</p>
  </div>
);

export default EmptyState;
