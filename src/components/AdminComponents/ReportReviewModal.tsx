import  { useState } from "react";
import {
  X,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Star,
  Clock,
  User,
} from "lucide-react";
import ConfirmDeleteContentModal from "./ConfirmDeleteContentModal";
import ConfirmActionModal from "./ConfirmActionModal";

type Props = {
  reporte: any;
  onClose: () => void;
  onResolve: (estado: "revisado" | "descartado", eliminar: boolean) => void;
};

export default function ReporteModal({ reporte, onClose, onResolve }: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeleteClick = () => setShowDeleteModal(true);
  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    onResolve("revisado", true);
  };

  const handleConservarClick = () => setShowConfirmModal(true);
  const handleConfirmAction = () => {
    setShowConfirmModal(false);
    onResolve("revisado", false);
  };

  const getRazonColor = (razon: string) => {
    const map: Record<string, string> = {
      "Contenido ofensivo o inapropiado": "bg-red-100 text-red-800",
      "Spam o publicidad": "bg-orange-100 text-orange-800",
      "Falsa reseña o engañosa": "bg-purple-100 text-purple-800",
      "Información personal": "bg-blue-100 text-blue-800",
    };
    return map[razon] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl relative border border-gray-200 font-poppins max-h-[90vh] overflow-y-auto">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Reporte #{reporte.id}</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {new Date(reporte.createdAt).toLocaleDateString("es-CL")}
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded ${getRazonColor(
                reporte.razon
              )}`}
            >
              {reporte.razon}
            </span>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3 mb-4">
            <User className="w-4 h-4 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {reporte.Usuario?.nombre || "Usuario desconocido"}
              </p>
              <p className="text-xs text-gray-500">Reportó este contenido</p>
            </div>
            <div className="text-right text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(reporte.createdAt).toLocaleString("es-CL", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {reporte.descripcion_adicional && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800 italic">
                "{reporte.descripcion_adicional}"
              </p>
            </div>
          )}

          {reporte.tipo_contenido === "comentario" && reporte.Comentario && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-4">
              <p className="font-semibold mb-1 text-sm">Comentario reportado:</p>
              <p className="text-gray-800 whitespace-pre-line text-sm">
                {reporte.Comentario.contenido}
              </p>
            </div>
          )}

          {reporte.tipo_contenido === "rating" && reporte.Rating && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-4">
              <p className="font-semibold mb-1 text-sm">Reseña reportada:</p>
              <p className="text-gray-800 whitespace-pre-line text-sm">
                {reporte.Rating.review}
              </p>
              <div className="mt-2 text-[#FFC600] font-semibold flex items-center gap-1 text-sm">
                <Star size={16} /> Calificación: {reporte.Rating.rating} / 5
              </div>
            </div>
          )}

          {reporte.id_servicio && (
            <div className="mt-4 text-center">
              <a
                href={`/servicios/${reporte.id_servicio}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#009982] text-white rounded-xl font-semibold hover:bg-[#007f6d] transition text-sm"
              >
                <Eye size={18} /> Ver servicio relacionado
              </a>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm bg-gray-100 hover:bg-gray-200 text-gray-800"
              onClick={onClose}
            >
              <XCircle size={18} /> Cancelar
            </button>
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm bg-[#009982] hover:bg-[#007f6d] text-white shadow"
              onClick={handleConservarClick}
            >
              <CheckCircle2 size={18} /> Conservar
            </button>
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm bg-[#FF4006] hover:bg-[#cd3513] text-white shadow"
              onClick={handleDeleteClick}
            >
              <Trash2 size={18} /> Eliminar contenido
            </button>
          </div>

          <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded text-center text-xs text-blue-700">
            <strong>Conservar:</strong> marca como revisado sin acción •{" "}
            <strong>Eliminar:</strong> remueve el contenido permanentemente
          </div>
        </div>
      </div>

      <ConfirmDeleteContentModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />

      <ConfirmActionModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAction}
        message="¿Está seguro de conservar este contenido?"
      />
    </>
  );
}
