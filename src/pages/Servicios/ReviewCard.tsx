import React from "react";
import { Pencil, Trash2 } from "lucide-react"; // Asegúrate de tener lucide-react instalado

interface Props {
  nombre: string;
  review: string;
  rating: number;
  createdAt: string;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ReviewCard: React.FC<Props> = ({ nombre, review, rating, createdAt, isOwner, onEdit, onDelete }) => {
  const calcularTiempo = (createdAt: string) => {
    const fechaCreacion = new Date(createdAt);
    const ahora = new Date();
    const diferenciaMs = ahora.getTime() - fechaCreacion.getTime();
  
    const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
    const meses = Math.floor(dias / 30);
    const años = Math.floor(meses / 12);
  
    if (años >= 1) {
      return `hace ${años} año${años > 1 ? "s" : ""}`;
    } else if (meses >= 1) {
      return `hace ${meses} mes${meses > 1 ? "es" : ""}`;
    } else if (dias >= 1) {
      return `hace ${dias} día${dias > 1 ? "s" : ""}`;
    } else {
      return "Hoy";
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between h-full shadow-sm">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white text-[1.1em] font-bold">
          {nombre.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-gray-800">{nombre}</span>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1 text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < rating ? "★" : "☆"}</span>
                ))}
              </div>
              {isOwner && (
                <div className="flex items-center space-x-2 ml-2">
                  <button onClick={onEdit} title="Editar" className="text-gray-500 hover:text-gray-700">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={onDelete} title="Eliminar" className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-600 text-left">{review}</p>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <p className="text-gray-400 text-[1em]">{calcularTiempo(createdAt)}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
