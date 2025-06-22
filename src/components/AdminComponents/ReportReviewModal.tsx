import { X } from "lucide-react";

interface ReportReviewModalProps {
  report: any;
  onClose: () => void;
  onAccept: () => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function ReportReviewModal({
  report,
  onClose,
  onAccept,
  onDelete,
}: ReportReviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-2 text-gray-900">Revisión de Reporte</h2>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-semibold">Tipo de contenido:</span> {report.tipo_contenido}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-semibold">Razón del reporte:</span> {report.razon}
        </p>
        {report.descripcion && (
          <p className="text-sm text-gray-600 mb-3">
            <span className="font-semibold">Descripción:</span> {report.descripcion}
          </p>
        )}

        {report.tipo_contenido === "comentario" && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Comentario reportado:</h3>
            <p className="text-sm text-gray-700 bg-gray-100 rounded p-2">{report.comentarioTexto || "No disponible"}</p>
          </div>
        )}

        {report.tipo_contenido === "rating" && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Reseña reportada:</h3>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Valoración:</span> {report.ratingValor ?? "N/A"}
            </p>
            <p className="text-sm text-gray-700 mt-1 bg-gray-100 rounded p-2">
              {report.ratingComentario || "Sin comentario"}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onAccept}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Conservar contenido
          </button>
          <button
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Eliminar contenido
          </button>
        </div>
      </div>
    </div>
  );
}
