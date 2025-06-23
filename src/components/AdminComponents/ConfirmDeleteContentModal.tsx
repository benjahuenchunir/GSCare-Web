import React from 'react';
import { X } from "lucide-react";

interface ConfirmDeleteContentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteContentModal: React.FC<ConfirmDeleteContentModalProps> = ({ open, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-[1.2em] font-semibold text-red-600 mb-2">¿Eliminar contenido reportado?</h2>
        <p className="text-[1em] text-gray-600 mb-6">Esta acción eliminará permanentemente el contenido reportado. ¿Desea continuar?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-md hover:bg-gray-200"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#FF8D6B] text-white font-medium px-4 py-2 rounded-md hover:bg-[#FF4006]"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteContentModal;
