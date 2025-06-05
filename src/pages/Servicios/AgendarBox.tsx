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
  <div className="bg-[#36A2A1] text-white rounded-lg p-8 text-center flex flex-col items-center gap-4">
    <h3 className="text-[1.5em] font-bold">¿Quieres agendar?</h3>

    {!isSubscribed && (
      <p className="max-w-lg text-white">
        Únete a este servicio para recibir sus beneficios directamente en tu perfil.
      </p>
    )}

    <div className="bg-white text-[#00495C] rounded-md p-4 w-full max-w-md text-left space-y-2">
      <p><strong>Teléfono:</strong> {telefono}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Dirección:</strong> {direccion}</p>
    </div>

    {loading ? (
      <button disabled className="mt-4 px-6 py-2 bg-gray-400 text-white rounded-lg">
        Cargando…
      </button>
    ) : isSubscribed ? (
      <div className="flex flex-col items-center gap-3">
        <div className="py-2 px-6 bg-white text-[#009982] rounded-lg font-semibold border border-white">
          Ya estás suscrito 😊
        </div>
        <p className="text-white text-[1em] max-w-md">
          ¿Quieres cancelar tu suscripción? Puedes hacerlo presionando el botón de abajo.
        </p>
        <button
          onClick={onUnsubscribe}
          className="py-2 px-6 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 border border-red-300"
        >
          Cancelar suscripción
        </button>

        {/* 👉 Nuevo botón para agendar otra hora */}
        <button
          onClick={onSubscribe}
          className="mt-2 px-6 py-2 bg-white text-[#00495C] rounded-lg font-semibold hover:bg-gray-100"
        >
          Agendar otra hora
        </button>
      </div>
    ) : (
      <button
        onClick={onSubscribe}
        className="mt-4 px-6 py-2 bg-white text-[#00495C] rounded-lg font-semibold hover:bg-gray-100"
      >
        Suscribirme
      </button>
    )}
  </div>
);

export default AgendarBox;
