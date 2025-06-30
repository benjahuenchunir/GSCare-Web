import React, { useEffect, useState } from "react";
import { Thread, subscribeToThreads } from "../../firebase/activityThreads";
import { useAuth0 } from "@auth0/auth0-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCalendarAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

interface ThreadListProps {
  activityId: number;
  onThreadSelect: (thread: Thread) => void;
}

const ThreadList: React.FC<ThreadListProps> = ({
  activityId,
  onThreadSelect,
}) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth0();

  useEffect(() => {
    const unsubscribe = subscribeToThreads(activityId, (updatedThreads) => {
      setThreads(updatedThreads);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activityId]);

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#009982]"></div>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <p className="text-center text-gray-600 my-8">
        No hay hilos de discusión aún.
      </p>
    );
  }

  // Ordenar hilos: primero los que no son miembros, luego los que son miembros
  const notMember = threads.filter(
    (thread) => !thread.members.includes(user?.sub || "")
  );
  const member = threads.filter((thread) =>
    thread.members.includes(user?.sub || "")
  );
  const orderedThreads = [...notMember, ...member];

  return (
    <div className="space-y-4">
      {orderedThreads.map((thread) => (
        <div
          key={thread.id}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold mb-2">{thread.title}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} />
                  Por: {thread.createdBy}
                </p>
                <p className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  {format(thread.createdAt, "PPP", { locale: es })}
                </p>
              </div>
            </div>
            {!thread.members.includes(user?.sub || "") && (
              <button
                onClick={() => onThreadSelect(thread)}
                className="bg-[#009982] text-white px-4 py-2 rounded-lg hover:bg-[#006E5E] transition flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faUserPlus} />
                Unirse
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreadList;
