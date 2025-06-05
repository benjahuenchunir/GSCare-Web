import React from 'react';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
}

const ModalConfirmacion: React.FC<Props> = ({
  visible,
  onClose,
  onConfirm,
  titulo,
  mensaje,
  textoConfirmar = "Sí, cancelar",
  textoCancelar = "No, mantener"
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-center">
        <h2 className="text-[1.5em] font-bold text-red-600 mb-4">{titulo}</h2>
        <p className="text-gray-700 mb-6">{mensaje}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            {textoCancelar}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;
