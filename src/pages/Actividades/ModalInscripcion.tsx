import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface Props {
  visible: boolean;
  onClose: () => void;
  actividad: {
    nombre: string;
    lugar: string;
    fecha: string;
    hora_inicio?: string;
    hora_final?: string;
    modalidad: "presencial" | "online";
    link?: string | null;
    comuna?: string;
  };
  yaInscrito: boolean;
}

const ModalInscripcion: React.FC<Props> = ({ visible, onClose, actividad, yaInscrito }) => {
  if (!visible) return null;

  const horario = `${actividad.hora_inicio?.slice(0, 5) ?? "?"} - ${actividad.hora_final?.slice(0, 5) ?? "?"}`;
  const esOnline = actividad.modalidad === "online";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        {!yaInscrito ? (
          <>
            <FaCheckCircle className="text-green-500 text-[3em] mx-auto mb-4" />
            <h2 className="text-[1em] font-bold text-[#00495C] mb-4">¡Te has inscrito exitosamente!</h2>
            <p className="mb-2"><strong>Actividad:</strong> {actividad.nombre}</p>
            <p className="mb-2"><strong>Modalidad:</strong> {esOnline ? "Online" : "Presencial"}</p>
            {esOnline ? (
              <p className="mb-2"><strong>Link:</strong>{" "}
                <a
                  href={actividad.link ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {actividad.link ?? "No disponible"}
                </a>
              </p>
            ) : (
              <>
                <p className="mb-2"><strong>Ubicación:</strong> {actividad.lugar}</p>
                {actividad.comuna && (
                  <p className="mb-2"><strong>Comuna:</strong> {actividad.comuna}</p>
                )}
              </>
            )}
            <p className="mb-2"><strong>Fecha:</strong> {new Date(actividad.fecha).toLocaleDateString()}</p>
            <p className="mb-4"><strong>Horario:</strong> {horario}</p>
          </>
        ) : (
          <>
            <h2 className="text-[1.5em] font-bold text-[#00495C] mb-4">Ya estás inscrito</h2>
            <p><strong>Actividad:</strong> {actividad.nombre}</p>
            <p><strong>Modalidad:</strong> {esOnline ? "Online" : "Presencial"}</p>
            {esOnline ? (
              <p><strong>Link:</strong>{" "}
                <a
                  href={actividad.link ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {actividad.link ?? "No disponible"}
                </a>
              </p>
            ) : (
              <>
                <p><strong>Ubicación:</strong> {actividad.lugar}</p>
                {actividad.comuna && (
                  <p><strong>Comuna:</strong> {actividad.comuna}</p>
                )}
              </>
            )}
            <p><strong>Fecha:</strong> {new Date(actividad.fecha).toLocaleDateString()}</p>
            <p><strong>Horario:</strong> {horario}</p>
            <p className="text-[1em] mt-4 text-gray-600">
              Si deseas cancelar tu inscripción, puedes hacerlo desde el botón en la página.
            </p>
          </>
        )}

        <button
          className="mt-6 bg-[#009982] text-white py-2 px-4 rounded hover:bg-[#007c6c] w-full"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalInscripcion;
