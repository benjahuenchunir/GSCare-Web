import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import ActivityForum from "./ActivityForum";

interface ForumFloatingButtonProps {
  activityId: number;
}

const ForumFloatingButton: React.FC<ForumFloatingButtonProps> = ({
  activityId,
}) => {
  console.log("ForumFloatingButton render");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#009982] text-white p-4 rounded-full shadow-lg hover:bg-[#007a6b] transition-all duration-300 z-40 hover:scale-110"
        aria-label="Abrir foro de actividades"
      >
        <FontAwesomeIcon icon={faComments} className="w-6 h-6" />
      </button>

      {/* Modal del foro */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-[#00495C]">
                Foro de Discusión
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
              <ActivityForum activityId={activityId} embedded={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForumFloatingButton;
