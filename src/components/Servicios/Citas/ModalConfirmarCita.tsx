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
  // Formatear la fecha si está disponible
  let fechaCompleta = "";
  // 1. Si bloque.fecha existe y es Date, úsala
  if ((bloque as any).fecha instanceof Date) {
    const date = (bloque as any).fecha;
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    fechaCompleta = `${dias[date.getDay()]} ${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}`;
  } else if ((bloque as any).fecha && typeof (bloque as any).fecha === "string") {
    // 2. Si bloque.fecha es string tipo "YYYY-MM-DD"
    const [a, m, d] = ((bloque as any).fecha as string).split("-");
    if (a && m && d) {
      const date = new Date(Number(a), Number(m) - 1, Number(d));
      const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
      fechaCompleta = `${dias[date.getDay()]} ${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}`;
    }
  } else if (bloque.dia && bloque.inicio) {
    // 3. Si solo hay día y hora, muestra el día textual
    fechaCompleta = bloque.dia;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 items-center justify-center flex">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-[#009982]">
        <h2 className="text-[2em]  font-bold text-[#009982] mb-6 text-center leading-relaxed">
          ¿Confirmar suscripción?
        </h2>

        {/* Sección destacada de fecha y hora */}
    

        <p className="text-gray-700 mb-6 text-center">
          ¿Estás seguro de que deseas suscribirte a este servicio?
        </p>
        {/* Mensaje destacado para servicios a domicilio */}
        <div className="mb-6 p-3 rounded-lg bg-[#FFF0F6] border border-[#CD3272] flex items-center justify-center">
          <span className="text-[#CD3272] font-semibold">
            Si deseas servicio a domicilio, recuerda coordinarlo directamente con el encargado.
          </span>
        </div>
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
