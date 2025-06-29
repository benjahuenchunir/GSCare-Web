import React from "react";
import { ForumProvider, useForumContext } from "./ForumContext";
import ForumButton from "./ForumButton";
import ForumModal from "./ForumModal";
import ForumContent from "./ForumContent";
import { ThreadComments } from "./ThreadComments";

interface ActivityForumProps {
  activityId: number;
  embedded?: boolean;
}

// Componente principal del foro
const ActivityForum: React.FC<ActivityForumProps> = ({
  activityId,
  embedded = false,
}) => {
  const { threads, selectedThread, closeThread } = useForumContext();

  return (
    <>
      {/* Botón principal para abrir el foro - solo si no está embebido */}
      {!embedded && (
        <ForumButton threadCount={threads.length} activityId={activityId} />
      )}

      {/* Contenido del foro - siempre renderizado */}
      {embedded && <ForumContent activityId={activityId} />}

      {/* Modal para ver comentarios de un hilo específico */}
      <ForumModal
        isOpen={!!selectedThread}
        onClose={closeThread}
        title={selectedThread?.title}
      >
        <div className="p-6">
          {selectedThread && (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#00495C] mb-2">
                  {selectedThread.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedThread.description}
                </p>
                <div className="text-sm text-gray-500">
                  Creado por {selectedThread.createdBy} •{" "}
                  {selectedThread.createdAt.toLocaleDateString()}
                </div>
              </div>

              <ThreadComments
                threadId={selectedThread.id}
                onReportComment={(commentId) => {
                  console.log("Comentario reportado:", commentId);
                }}
              />

            </>
          )}
        </div>
      </ForumModal>
    </>
  );
};

// Componente wrapper que incluye el provider
const ActivityForumWithProvider: React.FC<ActivityForumProps> = (props) => {
  return (
    <ForumProvider activityId={props.activityId}>
      <ActivityForum {...props} />
    </ForumProvider>
  );
};

export default ActivityForumWithProvider;
