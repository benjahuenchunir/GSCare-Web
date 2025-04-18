import React from "react";

interface Props {
  nombre: string;
  review: string;
  rating: number;
}

const ReviewCard: React.FC<Props> = ({ nombre, review, rating }) => (
  <div className="border border-gray-200 rounded-xl p-4 flex items-start space-x-4 shadow-sm">
    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white text-lg font-bold">
      {nombre.charAt(0)}
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-gray-800">{nombre}</span>
        <div className="flex space-x-1 text-yellow-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>{i < rating ? "★" : "☆"}</span>
          ))}
        </div>
      </div>
      <p className="text-gray-600 text-left">{review}</p> {/* Alinea el texto a la izquierda */}
    </div>
  </div>
);

export default ReviewCard;
