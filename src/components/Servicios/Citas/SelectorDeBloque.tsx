import React from "react";

export interface BloqueHorario {
  id: number;
  dia: string;
  inicio: string;
  fin: string;
  disponible: boolean;
}

interface SelectorDeBloqueProps {
  bloques: BloqueHorario[];
  onSelect: (bloque: BloqueHorario) => void;
  selectedId?: number | null;
}

const SelectorDeBloque: React.FC<SelectorDeBloqueProps> = ({ bloques, onSelect, selectedId }) => {
  const grouped = bloques.reduce((acc: Record<string, BloqueHorario[]>, bloque) => {
    if (!acc[bloque.dia]) acc[bloque.dia] = [];
    acc[bloque.dia].push(bloque);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([dia, bloquesDia]) => (
        <div key={dia}>
          <h3 className="text-lg font-semibold text-[#00495C] mb-2 capitalize">{dia}</h3>
          <div className="flex flex-wrap gap-4">
            {bloquesDia.map((b) => (
              <button
                key={b.id}
                onClick={() => onSelect(b)}
                disabled={!b.disponible}
                className={`
                  rounded-xl px-4 py-2 border shadow-md transition duration-200 ease-in-out
                  ${!b.disponible
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : selectedId === b.id
                      ? "bg-[#009982] text-white border-[#009982]"
                      : "bg-white text-[#00495C] hover:border-[#009982] hover:text-[#009982]"
                  }
                `}
              >
                {b.inicio} - {b.fin}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectorDeBloque;
