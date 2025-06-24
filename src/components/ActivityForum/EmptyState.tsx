import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

interface EmptyStateProps {
  filterType: string;
  isAuthenticated: boolean;
  hasSearchTerm: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  filterType,
  isAuthenticated,
  hasSearchTerm,
}) => {
  let message = "No hay hilos disponibles.";
  if (hasSearchTerm) {
    message = "No se encontraron hilos que coincidan con la búsqueda.";
  } else if (filterType === "participating") {
    message = "Aún no participas en ningún hilo.";
  } else if (filterType === "not-participating") {
    message = "¡Ya participas en todos los hilos!";
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
      <FontAwesomeIcon
        icon={faCircleInfo}
        className="w-16 h-16 mb-4 text-blue-300"
      />
      <p className="text-lg font-semibold mb-2">{message}</p>
      {isAuthenticated && !hasSearchTerm && filterType === "all" && (
        <p className="text-sm text-gray-400">
          ¡Sé el primero en crear un hilo de discusión!
        </p>
      )}
    </div>
  );
};

export default EmptyState;
