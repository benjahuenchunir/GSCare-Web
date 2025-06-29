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
import leoProfanity from "leo-profanity";
import spanishBadWords from "../../utils/spanishBadWords";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { AlertTriangle } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  createdById: string;
}

interface ThreadCommentsProps {
  threadId: string;
  onReportComment: (commentId: string) => void;
}

// Inicializar el filtro solo una vez
if (!leoProfanity.getDictionary().length) {
  leoProfanity.loadDictionary("es");
  leoProfanity.add(spanishBadWords);
}

export const ThreadComments: React.FC<ThreadCommentsProps> = ({ threadId, onReportComment }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 15;
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
        setCurrentPage(1); // Resetear a la primera página si cambian los comentarios
      },
      (error) => {
        console.error("Error en suscripción a comentarios:", error);
      }
    );

    return () => unsubscribe();
  }, [threadId]);

  // Paginación
  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () =>
    setCurrentPage((p) => Math.min(totalPages, p + 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "threadComments"), {
        threadId,
        content: newComment.trim(),
        createdAt: serverTimestamp(),
        createdBy: user.name || user.nickname || user.email,
        createdById: user.sub || user.email,
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

      {/* Lista de comentarios paginada */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {comments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
            <FontAwesomeIcon
              icon={faCommentDots}
              className="w-16 h-16 mb-4 text-blue-300"
            />
            <p className="text-lg font-semibold mb-2">
              Aún no hay comentarios en este hilo.
            </p>
            <p className="text-sm text-gray-400">¡Sé el primero en comentar!</p>
          </div>
        )}
        {currentComments.length > 0 &&
          currentComments.map((comment) => (
            <div
              key={comment.id}
              className={`bg-white border border-gray-200 rounded-lg p-4 ${
                comment.createdById === (user?.sub || user?.email)
                  ? "border-l-4 border-l-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between space-x-3">
                <div className="flex items-start space-x-3 flex-grow">
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
                      {comment.createdById === (user?.sub || user?.email) && (
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
                {/* Botón de Reporte */}
                {user?.email && comment.createdById !== (user?.sub || user?.email) && (
                  <button
                    onClick={() => onReportComment(comment.id)}
                    title="Reportar comentario"
                    className="border border-red-400 text-red-500 hover:bg-red-50 font-medium px-3 py-1 rounded-full text-sm flex items-center gap-1 flex-shrink-0"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Reportar
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Paginación de comentarios */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-gray-700 font-medium">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

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
