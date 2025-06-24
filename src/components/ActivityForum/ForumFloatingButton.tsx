import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

interface ForumFloatingButtonProps {
  activityId: number;
}

const ForumFloatingButton: React.FC<ForumFloatingButtonProps> = ({
  activityId,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/actividades/${activityId}/foro`);
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-[#009982] text-white p-4 rounded-full shadow-lg hover:bg-[#007a6b] transition-all duration-300 z-40 hover:scale-110"
      aria-label="Abrir foro de actividades"
    >
      <FontAwesomeIcon icon={faComments} className="w-6 h-6" />
    </button>
  );
};

export default ForumFloatingButton;
