import React from "react";
import { BloqueHorario } from "./SelectorDeBloque";

interface ModalConfirmarCitaProps {
  bloque: BloqueHorario;
  onCancel: () => void;
  onConfirm: () => void;
}

const ModalConfirmarCita: React.FC<ModalConfirmarCitaProps> = ({
  bloque,
  onCancel,
  onConfirm
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-[1.5em] font-bold text-[#009982] mb-4">¿Confirmar suscripción?</h2>
        <p className="text-gray-700 mb-4">
          📅 <strong>{bloque.dia}</strong> de <strong>{bloque.inicio}</strong> a <strong>{bloque.fin}</strong>
        </p>
        <p className="text-gray-700 mb-6">¿Estás seguro de que deseas suscribirte a este servicio?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            No, cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#009982] text-white rounded hover:bg-[#007f6e]"
          >
            Sí, suscribirme
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmarCita;
