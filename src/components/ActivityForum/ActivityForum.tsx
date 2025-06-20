import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Thread,
  subscribeToThreads,
  createThread,
  joinThread,
} from "../../firebase/activityThreads";
import CreateThreadForm from "./CreateThreadForm";
import { ThreadComments } from "./ThreadComments";

interface ActivityForumProps {
  activityId: number;
}

const ActivityForum: React.FC<ActivityForumProps> = ({ activityId }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    const unsubscribe = subscribeToThreads(activityId, (updatedThreads) => {
      setThreads(updatedThreads);
    });

    return () => unsubscribe();
  }, [activityId]);

  const handleCreateThread = async (title: string, description: string) => {
    if (!user?.email) return;
    try {
      await createThread(activityId, title, description, user.email);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error al crear hilo:", error);
    }
  };

  const handleJoinThread = async (threadId: string) => {
    if (!user?.email) return;
    try {
      await joinThread(threadId, user.email);
    } catch (error) {
      console.error("Error al unirse al hilo:", error);
    }
  };

  const isMemberOfThread = (thread: Thread) => {
    return user?.email && thread.members.includes(user.email);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#00495C]">Foro de Discusión</h2>
        {isAuthenticated && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#009982] text-white px-4 py-2 rounded-lg hover:bg-[#007a6b] transition-colors"
          >
            Crear Nuevo Hilo
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <CreateThreadForm
            onSubmit={handleCreateThread}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      <div className="space-y-4">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-[#00495C]">
                  {thread.title}
                </h3>
                <p className="text-gray-600 mt-1">{thread.description}</p>
                <div className="text-sm text-gray-500 mt-2">
                  Creado por {thread.createdBy} •{" "}
                  {thread.createdAt.toLocaleDateString()}
                </div>
              </div>
              {isAuthenticated && !isMemberOfThread(thread) && (
                <button
                  onClick={() => handleJoinThread(thread.id)}
                  className="bg-[#009982] text-white px-3 py-1 rounded hover:bg-[#007a6b] transition-colors"
                >
                  Unirse
                </button>
              )}
            </div>

            {isMemberOfThread(thread) && (
              <div className="mt-4">
                <ThreadComments threadId={thread.id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityForum;
