import React from "react";

interface Props {
  telefono: string;
  email: string;
  direccion: string;
  isSubscribed: boolean;
  loading: boolean;
  onSubscribe: () => void;
  onUnsubscribe: () => void;
}

const AgendarBox: React.FC<Props> = ({
  telefono,
  email,
  direccion,
  isSubscribed,
  loading,
  onSubscribe,
  onUnsubscribe
}) => (
  <div className="bg-[#36A2A1] shadow-inner rounded-lg p-6 border border-blue-200">
    <h2 className="text-2xl font-bold mb-4 text-white">¿Quieres agendar?</h2>

    {/* Datos de contacto */}
    <div className={`space-y-3 ${isSubscribed ? "text-gray-700" : "text-white"}`}>
      <p><strong>Teléfono:</strong> {telefono}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Dirección:</strong> {direccion}</p>
    </div>

    {/* Botones */}
    {loading ? (
      <button disabled className="mt-4 px-5 py-2 bg-gray-400 text-white rounded-full">
        Cargando…
      </button>
    ) : isSubscribed ? (
      <button
        onClick={onUnsubscribe}
        className="mt-4 px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Cancelar suscripción
      </button>
    ) : (
      <button
        onClick={onSubscribe}
        className="mt-4 px-5 py-2 bg-white text-[#00495C] rounded-full border border-[#00495C] hover:bg-gray-100"
      >
        Suscribirme
      </button>
    )}
  </div>
);

export default AgendarBox;
