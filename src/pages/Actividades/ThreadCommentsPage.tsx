import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ForumProvider } from "../../components/ActivityForum/ForumContext";
import { ThreadComments } from "../../components/ActivityForum/ThreadComments";

const ThreadCommentsPage: React.FC = () => {
  const { activityId, threadId } = useParams<{
    activityId: string;
    threadId: string;
  }>();
  const navigate = useNavigate();

  if (!activityId || !threadId) {
    return <div className="p-4">ID de actividad o hilo no válido</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b pt-16 md:pt-8 lg:pt-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Volver"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-[#00495C]">
                Comentarios del hilo
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor de comentarios más ancho */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <ForumProvider activityId={parseInt(activityId)}>
            <ThreadComments threadId={threadId} />
          </ForumProvider>
        </div>
      </div>
    </div>
  );
};

export default ThreadCommentsPage;
