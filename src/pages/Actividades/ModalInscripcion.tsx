import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface Props {
  visible: boolean;
  onClose: () => void;
  actividad: {
    nombre: string;
    lugar: string;
    fecha: string;
    hora: string;
  };
  yaInscrito: boolean;
}

const ModalInscripcion: React.FC<Props> = ({ visible, onClose, actividad, yaInscrito }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        {!yaInscrito ? (
          <>
            <FaCheckCircle className="text-green-500 text-[3em] mx-auto mb-4" />
            <h2 className="text-[1em] font-bold text-[#00495C] mb-4">¡Te has inscrito exitosamente!</h2>
            <p className="mb-2"><strong>Actividad:</strong> {actividad.nombre}</p>
            <p className="mb-2"><strong>Ubicación:</strong> {actividad.lugar}</p>
            <p className="mb-2"><strong>Fecha:</strong> {new Date(actividad.fecha).toLocaleDateString()}</p>
            <p className="mb-4"><strong>Hora:</strong> {actividad.hora.slice(0, 5)}</p>
          </>
        ) : (
          <>
            <h2 className="text-[1.5em] font-bold text-[#00495C] mb-4">Ya estás inscrito</h2>
            <p><strong>Actividad:</strong> {actividad.nombre}</p>
            <p><strong>Ubicación:</strong> {actividad.lugar}</p>
            <p><strong>Fecha:</strong> {new Date(actividad.fecha).toLocaleDateString()}</p>
            <p><strong>Hora:</strong> {actividad.hora.slice(0, 5)}</p>
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
