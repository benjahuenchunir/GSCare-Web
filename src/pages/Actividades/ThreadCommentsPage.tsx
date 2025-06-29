import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ForumProvider } from "../../components/ActivityForum/ForumContext";
import { ThreadComments } from "../../components/ActivityForum/ThreadComments";
import ModalReportarReseña from "../../components/Servicios/Resenas/ModalReportarReseña"; // Reutiliza el modal
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { UserContext } from "../../context/UserContext";

const ThreadCommentsPage: React.FC = () => {
  const { activityId, threadId } = useParams<{
    activityId: string;
    threadId: string;
  }>();
  const navigate = useNavigate();
  const [commentToReport, setCommentToReport] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();
  const { profile } = useContext(UserContext)!;

  if (!activityId || !threadId) {
    return <div className="p-4">ID de actividad o hilo no válido</div>;
  }

  const handleReportComment = async (razon: string) => {
    if (!commentToReport) return;

    if (profile?.rol === 'gratis') {
      alert("Los usuarios con plan gratuito no pueden reportar comentarios.");
      setCommentToReport(null);
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      // Buscamos el comentario en la Firebase
      const docRef = doc(db, "threadComments", commentToReport);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Comentario no encontrado en Firebase");
      }

      const commentData = docSnap.data();
      const contenido = commentData?.content || "";

      await axios.post(
        `${import.meta.env.VITE_API_URL}/reportes_contenido`,
        {
          tipo_contenido: "comentario",
          id_contenido: commentToReport,
          razon: razon,
          descripcion: contenido
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Comentario reportado con éxito. Gracias por tu colaboración.");
    } catch (error) {
      console.error("Error al reportar comentario:", error);
      alert("Hubo un error al enviar el reporte.");
    } finally {
      setCommentToReport(null);
    }
  };

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
            <ThreadComments 
              threadId={threadId} 
              onReportComment={setCommentToReport} // Pasas la función para abrir el modal
            />
          </ForumProvider>
        </div>
      </div>
      <ModalReportarReseña
        open={!!commentToReport}
        onClose={() => setCommentToReport(null)}
        onSubmit={handleReportComment}
        contentType="Comentario"
      />
    </div>
  );
};

export default ThreadCommentsPage;
