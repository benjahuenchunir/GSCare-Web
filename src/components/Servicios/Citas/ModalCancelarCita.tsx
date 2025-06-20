import React, { useState } from "react";
import { BloqueHorario } from "./SelectorDeBloque";

interface ModalCancelarCitaProps {
  citas: { id: number; bloque: BloqueHorario }[];
  onCancelCita: (citaId: number) => void;
  onClose: () => void;
}

const ModalCancelarCita: React.FC<ModalCancelarCitaProps> = ({ citas, onCancelCita, onClose }) => {
  const [selectedCitaId, setSelectedCitaId] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md space-y-4">
        <h2 className="text-[1.5em] font-bold text-red-600">Cancelar una cita</h2>
        <p className="text-gray-700">Selecciona el bloque horario que deseas cancelar:</p>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {citas.map(({ id, bloque }) => (
            <div key={id} className="flex justify-between items-center border p-2 rounded">
              <div>
                <p className="font-semibold">{bloque.dia}</p>
                <p>{bloque.inicio} - {bloque.fin}</p>
              </div>
              <button
                onClick={() => setSelectedCitaId(id)}
                className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
              >
                Cancelar
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cerrar</button>
        </div>

        {/* Confirmación secundaria */}
        {selectedCitaId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
              <h3 className="text-lg font-semibold text-red-600 mb-2">¿Cancelar esta cita?</h3>
              <p className="text-sm text-gray-700 mb-4">Esta acción no se puede deshacer.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedCitaId(null)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  No
                </button>
                <button
                  onClick={() => {
                    onCancelCita(selectedCitaId);
                    setSelectedCitaId(null);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Sí, cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalCancelarCita;
