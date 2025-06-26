import React from "react";
import { useNavigate } from "react-router-dom";
import { Thread } from "../../firebase/activityThreads";

interface ThreadCardProps {
  thread: Thread;
  isMember: boolean;
  isAuthenticated: boolean;
  onJoinThread: (threadId: string) => void;
  activityId: number;
}

const ThreadCard: React.FC<ThreadCardProps> = ({
  thread,
  isMember,
  isAuthenticated,
  onJoinThread,
  activityId,
}) => {
  const navigate = useNavigate();

  const handleViewComments = () => {
    navigate(`/actividades/${activityId}/foro/${thread.id}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#00495C] mb-2">
            {thread.title}
          </h3>
          <p className="text-gray-600 mb-3 line-clamp-2">
            {thread.description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Creado por {thread.createdBy}</span>
              <span>•</span>
              <span>{thread.createdAt.toLocaleDateString()}</span>
              <span>•</span>
              <span>{thread.members.length} participantes</span>
            </div>
            <div className="flex items-center space-x-2">
              {isMember && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Participando
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2 ml-4">
          {isAuthenticated && !isMember && (
            <button
              onClick={() => onJoinThread(thread.id)}
              className="bg-[#009982] text-white px-4 py-2 rounded hover:bg-[#007a6b] transition-colors text-sm font-medium"
            >
              Unirse
            </button>
          )}
          <button
            onClick={handleViewComments}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Ver Comentarios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreadCard;
