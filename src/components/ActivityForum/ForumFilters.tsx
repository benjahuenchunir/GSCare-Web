import React from "react";

interface ForumFiltersProps {
  filterType: "all" | "participating" | "not-participating";
  onFilterChange: (
    filter: "all" | "participating" | "not-participating"
  ) => void;
}

const ForumFilters: React.FC<ForumFiltersProps> = ({
  filterType,
  onFilterChange,
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterType === "all"
              ? "bg-[#009982] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Todos los hilos
        </button>
        <button
          onClick={() => onFilterChange("participating")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterType === "participating"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          En los que participo
        </button>
        <button
          onClick={() => onFilterChange("not-participating")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterType === "not-participating"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          En los que no participo
        </button>
      </div>
    </div>
  );
};

export default ForumFilters;
