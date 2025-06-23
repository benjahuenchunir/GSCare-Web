import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

interface EmptyStateProps {
  filterType: "all" | "participating" | "not-participating";
  isAuthenticated: boolean;
  hasSearchTerm: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  filterType,
  isAuthenticated,
  hasSearchTerm,
}) => {
  const getMessage = () => {
    if (hasSearchTerm) {
      return "No se encontraron hilos con los términos de búsqueda";
    }
    if (filterType !== "all") {
      return "No se encontraron hilos con el filtro aplicado";
    }
    return "No hay hilos de discusión";
  };

  return (
    <div className="text-center py-12 text-gray-500">
      <FontAwesomeIcon
        icon={faComments}
        className="w-16 h-16 mx-auto mb-4 text-gray-300"
      />
      <p className="text-lg font-medium">{getMessage()}</p>
      {isAuthenticated && filterType === "all" && !hasSearchTerm && (
        <p className="mt-2">¡Sé el primero en crear un hilo!</p>
      )}
    </div>
  );
};

export default EmptyState;
