import React from "react";
import { CalendarDays, Clock } from "lucide-react"; // Asegúrate de tener lucide-react instalado
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
    <div className="fixed inset-0 bg-black bg-opacity-40 items-center justify-center flex">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-[#009982]">
        <h2 className="text-[2em]  font-bold text-[#009982] mb-6 text-center leading-relaxed">
          ¿Confirmar suscripción?
        </h2>

        {/* Sección destacada de fecha y hora */}
        <div className="bg-[#F5F5F5] rounded-xl p-4 mb-6 border-l-4 border-[#009982]">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="w-5 h-5 text-[#009982]" />
            <p className="text-[#009982] text-lg font-semibold">{bloque.dia}</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#292929]" />
            <p className="text-[#292929] text-lg font-semibold">
              {bloque.inicio} - {bloque.fin}
            </p>
          </div>
        </div>

        <p className="text-gray-700 mb-6 text-center">
          ¿Estás seguro de que deseas suscribirte a este servicio?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 "
          >
            No, cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#009982] text-white rounded hover:bg-[#007f6e] "
          >
            Sí, suscribirme
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmarCita;
