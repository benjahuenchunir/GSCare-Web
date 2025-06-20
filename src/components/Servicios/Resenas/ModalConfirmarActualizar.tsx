import React from "react";
import { Calendar } from "lucide-react";

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ModalConfirmarActualizar: React.FC<Props> = ({ open, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 text-center">
        <h2 className="text-[!1.5em] font-bold text-[#009982] mb-4">¿Confirmar actualización?</h2>

        <div className="bg-gray-100 rounded-md p-4 flex items-center justify-center gap-3 text-[#009982] font-medium mb-4">
          <Calendar size={20} />
          Reseña actualizada
        </div>

        <p className="text-[1em] text-gray-600 mb-6">
          ¿Estás seguro de que deseas guardar los cambios en tu reseña?
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="bg-gray-100 text-gray-800 font-medium px-4 py-2 rounded-md hover:bg-gray-200"
          >
            No, cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#009982] text-white font-medium px-4 py-2 rounded-md hover:bg-[#007f6d]"
          >
            Sí, actualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmarActualizar;
