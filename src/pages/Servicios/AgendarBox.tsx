import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  telefono: string;
  email: string;
  direccion: string;
  isAuthenticated: boolean;
}

const AgendarBox: React.FC<Props> = ({ telefono, email, direccion, isAuthenticated }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#009982] shadow-inner rounded-lg p-6 border border-blue-200">
      <h2 className="text-2xl font-bold mb-4 text-white">¿Quieres agendar?</h2>

      {isAuthenticated ? (
        <div className="space-y-3 text-gray-700">
          <p><strong>Teléfono:</strong> {telefono}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Dirección:</strong> {direccion}</p>
          <button
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => alert("Aquí podrías abrir un modal de reserva o redirigir a otra página")}
          >
            Agenda tu visita
          </button>
        </div>
      ) : (
        <div className="space-y-3 text-white">
          <p>Únete a nuestra comunidad para poder disfrutar de estos beneficios.</p>
          <button
            className="mt-6 px-5 py-2 bg-white text-[#009982] rounded-full border border-[#009982]"
            onClick={() => navigate("/login")}
          >
            Agenda tu visita
          </button>
        </div>
      )}
    </div>
  );
};

export default AgendarBox;
