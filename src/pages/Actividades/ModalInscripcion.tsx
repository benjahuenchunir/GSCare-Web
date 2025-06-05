import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface ActividadSimplificada {
  nombre: string;
  lugar: string;
  fecha: string;
  hora_inicio?: string;
  hora_final?: string;
  modalidad: "presencial" | "online";
  link?: string | null;
  comuna?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  actividades: ActividadSimplificada[]; // ahora puede haber varias
  yaInscrito: boolean;
}

const ModalInscripcion: React.FC<Props> = ({ visible, onClose, actividades, yaInscrito }) => {
  if (!visible || actividades.length === 0) return null;

  const actividad = actividades[0]; // usamos la primera para título, modalidad, etc.
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
            <div className="text-left mt-4">
              <p className="font-semibold mb-2">Sesiones inscritas:</p>
              <ul className="list-disc list-inside text-gray-700 text-sm">
                {actividades.map((a, i) => (
                  <li key={i}>
                    {new Date(a.fecha).toLocaleDateString()} — {a.hora_inicio?.slice(0, 5)} a {a.hora_final?.slice(0, 5)}
                  </li>
                ))}
              </ul>
            </div>
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
            <div className="text-left mt-4">
              <p className="font-semibold mb-2">Sesiones:</p>
              <ul className="list-disc list-inside text-gray-700 text-sm">
                {actividades.map((a, i) => (
                  <li key={i}>
                    {new Date(a.fecha).toLocaleDateString()} — {a.hora_inicio?.slice(0, 5)} a {a.hora_final?.slice(0, 5)}
                  </li>
                ))}
              </ul>
            </div>
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
