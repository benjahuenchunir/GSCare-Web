import React, { useContext } from "react";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import { UserContext } from "../../context/UserContext";

interface Props {
  nombre: string;
  review: string;
  rating: number;
  createdAt: string;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
}

const ReviewCard: React.FC<Props> = ({
  nombre,
  review,
  rating,
  createdAt,
  isOwner,
  onEdit,
  onDelete,
  onReport
}) => {
  const { profile } = useContext(UserContext);

  const calcularTiempo = (createdAt: string) => {
    const fechaCreacion = new Date(createdAt);
    const ahora = new Date();
    const diferenciaMs = ahora.getTime() - fechaCreacion.getTime();

    const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
    const meses = Math.floor(dias / 30);
    const años = Math.floor(meses / 12);

    if (años >= 1) return `hace ${años} año${años > 1 ? "s" : ""}`;
    if (meses >= 1) return `hace ${meses} mes${meses > 1 ? "es" : ""}`;
    if (dias >= 1) return `hace ${dias} día${dias > 1 ? "s" : ""}`;
    return "Hoy";
  };

  const renderStars = () => (
    <div className="flex items-center gap-1 text-yellow-500 text-[1.2rem]">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
      <span className="text-gray-500 text-[1em]">({rating}/5)</span>
    </div>
  );

  return (
    <div className="border border-gray-200 rounded-xl p-4 flex flex-col shadow-sm bg-white">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white  font-bold">
          {nombre.charAt(0)}
        </div>

        <div className="flex-1">
          {isOwner ? (
            <>
              {/* Nombre y botones */}
              <div className="flex justify-between items-start mt-1">
                <p className="font-semibold text-gray-900 text-[1em]">{nombre}</p>
                <div className="flex space-x-3">
                  <button onClick={onEdit} title="Editar" className="text-gray-500 hover:text-gray-700">
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button onClick={onDelete} title="Eliminar" className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Estrellas arriba */}
              {renderStars()}
              {/* Texto */}
              <p className="text-gray-800 mt-2 leading-relaxed text-[1em]">{review}</p>

              {/* Pie de reseña */}
              <div className="flex justify-between items-center mt-3">
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {calcularTiempo(createdAt)}
                </span>
                <span className="text-blue-600 text-[1em] font-medium cursor-pointer hover:underline">
                  Tu reseña
                </span>
              </div>
            </>
          ) : (
            <>
              {/* Nombre + botón reportar */}
              <div className="flex justify-between items-start">
                <p className="font-semibold text-gray-900 text-[1em]">{nombre}</p>
                {profile?.rol === "socio" && (
                  <button
                    onClick={onReport}
                    title="Reportar reseña"
                    className="border border-red-400 text-red-500 hover:bg-red-50 font-medium px-3 py-1 rounded-full text-[1em] flex items-center gap-1"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Reportar
                  </button>
                )}
              </div>

              {/* Estrellas */}
              <div className="mt-1">{renderStars()}</div>

              {/* Texto */}
              <p className="text-gray-800 mt-2 leading-relaxed text-[1em]">{review}</p>

              {/* Fecha */}
              <div className="flex justify-end mt-3">
                <span className="text-gray-400 text-[0.8em]">{calcularTiempo(createdAt)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
