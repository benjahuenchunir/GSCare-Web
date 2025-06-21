import React from "react";
import { Dialog } from "@headlessui/react";
import { CheckCircle } from "lucide-react";

interface ModalConfirmarPublicacionProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ModalConfirmarPublicacion: React.FC<ModalConfirmarPublicacionProps> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
        <div className="bg-white rounded-xl max-w-md mx-auto p-6 z-50 shadow-xl relative">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-[#009982]" />
            <Dialog.Title className="text-lg font-bold text-gray-800">¿Confirmar publicación?</Dialog.Title>
          </div>

          <Dialog.Description className="text-gray-600 mb-6">
            Estás a punto de publicar tu reseña. Esta acción será visible para otros usuarios y no podrá ser editada luego sin volver a confirmarla.
          </Dialog.Description>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-md bg-[#009982] text-white hover:bg-[#007f6d] transition"
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalConfirmarPublicacion;
