import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}

interface ThreadCommentsProps {
  threadId: string;
}

export const ThreadComments: React.FC<ThreadCommentsProps> = ({ threadId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth0();

  useEffect(() => {
    const q = query(
      collection(db, "threadComments"),
      where("threadId", "==", threadId)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const comments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Comment[];
        comments.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        setComments(comments);
      },
      (error) => {
        console.error("Error en suscripción a comentarios:", error);
      }
    );

    return () => unsubscribe();
  }, [threadId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "threadComments"), {
        threadId,
        content: newComment.trim(),
        createdAt: serverTimestamp(),
        createdBy: user.email,
      });
      setNewComment("");
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800">Comentarios</h4>
            <p className="text-sm text-gray-600">
              {comments.length} comentarios
            </p>
          </div>
          {comments.length > 0 && (
            <div className="text-sm text-gray-500">
              Último comentario:{" "}
              {comments[comments.length - 1]?.createdAt.toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Lista de comentarios */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="font-medium">No hay comentarios aún</p>
            <p className="text-sm">¡Sé el primero en comentar!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`bg-white border border-gray-200 rounded-lg p-4 ${
                comment.createdBy === user?.email
                  ? "border-l-4 border-l-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {comment.createdBy.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {comment.createdBy}
                    </span>
                    {comment.createdBy === user?.email && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        Tú
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {comment.createdAt.toLocaleDateString()} a las{" "}
                      {comment.createdAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-gray-800 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulario para agregar comentario */}
      {user?.email && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h5 className="font-medium text-gray-800 mb-3">Agregar comentario</h5>
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe tu comentario aquí..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009982] focus:border-transparent resize-none"
              rows={3}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {newComment.length}/500 caracteres
              </span>
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="bg-[#009982] text-white px-6 py-2 rounded-lg hover:bg-[#007a6b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    <span>Enviar comentario</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {!user?.email && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-800">
            <strong>Inicia sesión</strong> para poder comentar en este hilo.
          </p>
        </div>
      )}
    </div>
  );
};
