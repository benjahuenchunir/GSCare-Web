import React from "react";
import SelectorDeBloque, { BloqueHorario } from "./SelectorDeBloque";

interface ModalSelectorDeBloqueProps {
  bloques: BloqueHorario[];
  selectedId: number | null;
  onSelect: (bloque: BloqueHorario) => void;
  onClose: () => void;
  onContinue: () => void;
}

const ModalSelectorDeBloque: React.FC<ModalSelectorDeBloqueProps> = ({
  bloques,
  selectedId,
  onSelect,
  onClose,
  onContinue,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-[1.5em] font-bold text-[#00495C] mb-4">Selecciona un horario</h2>
        <SelectorDeBloque bloques={bloques} selectedId={selectedId} onSelect={onSelect} />
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            disabled={!selectedId}
            onClick={onContinue}
            className={`px-4 py-2 rounded text-white ${
              !selectedId ? "bg-gray-400 cursor-not-allowed" : "bg-[#009982] hover:bg-[#007f6e]"
            }`}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSelectorDeBloque;
