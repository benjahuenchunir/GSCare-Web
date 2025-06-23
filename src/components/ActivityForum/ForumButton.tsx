import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

interface ForumButtonProps {
  threadCount: number;
  onClick: () => void;
}

const ForumButton: React.FC<ForumButtonProps> = ({ threadCount, onClick }) => {
  return (
    <div className="mt-6">
      <button
        onClick={onClick}
        className="w-full bg-gradient-to-r from-[#009982] to-[#007a6b] text-white py-4 px-6 rounded-lg hover:from-[#007a6b] hover:to-[#005a4f] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <div className="flex items-center justify-center space-x-3">
          <FontAwesomeIcon icon={faComments} className="w-6 h-6" />
          <span className="text-lg font-semibold">
            Ver Foro de Discusión ({threadCount} hilos)
          </span>
        </div>
      </button>
    </div>
  );
};

export default ForumButton;
