import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface CreateThreadButtonProps {
  onCreateClick: () => void;
}

const CreateThreadButton: React.FC<CreateThreadButtonProps> = ({
  onCreateClick,
}) => {
  return (
    <div className="mb-6">
      <button
        onClick={onCreateClick}
        className="bg-[#009982] text-white px-6 py-3 rounded-lg hover:bg-[#007a6b] transition-colors font-semibold flex items-center space-x-2"
      >
        <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
        <span>Crear Nuevo Hilo</span>
      </button>
    </div>
  );
};

export default CreateThreadButton;
