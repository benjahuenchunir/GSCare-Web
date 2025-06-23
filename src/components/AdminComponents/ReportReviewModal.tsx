import React from "react";
import { X } from "lucide-react";
import ConfirmDeleteContentModal from './ConfirmDeleteContentModal';
import ConfirmActionModal from './ConfirmActionModal';

type Props = {
  reporte: any;
  onClose: () => void;
  onResolve: (estado: "revisado" | "descartado", eliminar: boolean) => void;
};

export default function ReporteModal({ reporte, onClose, onResolve }: Props) {

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    onResolve("revisado", true);
  };

  const handleConservarClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    setShowConfirmModal(false);
    onResolve("descartado", false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">Revisión de Reporte</h2>

          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="font-semibold">Tipo:</span> {reporte.tipo_contenido === "comentario" ? "Comentario en foro" : "Reseña de servicio"}</p>
            <p><span className="font-semibold">Reportado por:</span> {reporte.Usuario?.nombre || "Desconocido"}</p>
            <p><span className="font-semibold">Razón:</span> {reporte.razon}</p>
            <p><span className="font-semibold">Fecha:</span> {new Date(reporte.createdAt).toLocaleString("es-CL")}</p>
            {/* Mostrar contenido reportado */}
            {reporte.tipo_contenido === "comentario" && reporte.Comentario && (
              <div className="bg-gray-50 border rounded p-3 mt-3">
                <span className="font-semibold">Comentario reportado:</span>
                <div className="mt-2 text-gray-800 whitespace-pre-line">{reporte.Comentario.contenido}</div>
              </div>
            )}
            {reporte.tipo_contenido === "rating" && reporte.Rating && (
              <div className="bg-gray-50 border rounded p-3 mt-3">
                <span className="font-semibold">Reseña reportada:</span>
                <div className="mt-2 text-gray-800 whitespace-pre-line">{reporte.Rating.review}</div>
                <div className="mt-2 text-yellow-600 font-semibold">Calificación: {reporte.Rating.rating} / 5</div>
              </div>
            )}
            {/* Link directo al servicio */}
            {reporte.id_servicio && (
              <div className="mt-4 text-center">
                <a
                  href={`/servicios/${reporte.id_servicio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-[#009982] text-white rounded-lg font-semibold hover:bg-[#007f6d] transition"
                >
                  Ver servicio relacionado
                </a>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-md text-sm bg-gray-100 hover:bg-gray-200 text-gray-800"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 rounded-md text-sm bg-green-600 hover:bg-green-700 text-white"
              onClick={handleConservarClick}
            >
              Conservar
            </button>
            <button
              className="px-4 py-2 rounded-md text-sm bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteClick}
            >
              Eliminar contenido
            </button>
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
        message="¿Está seguro de confirmar esta acción?"
      />
    </>
  );
}
