import React from "react";

interface ForumStatsProps {
  totalThreads: number;
  participatingThreads: number;
  filteredThreads: number;
  hasSearchTerm: boolean;
}

const ForumStats: React.FC<ForumStatsProps> = ({
  totalThreads,
  participatingThreads,
  filteredThreads,
  hasSearchTerm,
}) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600">{totalThreads}</div>
          <div className="text-sm text-blue-700">Total de hilos</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">
            {participatingThreads}
          </div>
          <div className="text-sm text-green-700">
            Hilos en los que participas
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">
            {filteredThreads}
          </div>
          <div className="text-sm text-purple-700">
            {hasSearchTerm ? "Hilos encontrados" : "Hilos mostrados"}
          </div>
        </div>
      </div>
      {hasSearchTerm && (
        <div className="mt-3 text-center">
          <div className="text-sm text-gray-600">
            Mostrando resultados de búsqueda
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumStats;
