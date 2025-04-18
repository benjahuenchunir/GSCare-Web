import React from "react";

interface Props {
  nombre: string;
  descripcion: string;
  imagen: string;
}

const ServicioInfoCard: React.FC<Props> = ({ nombre, descripcion, imagen }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start">
    <div className="flex-1 md:mr-6">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "#006881" }}>{nombre}</h1>
      <p className="text-gray-700 mb-4">{descripcion}</p>
    </div>
    <div className="w-full md:w-72 mt-6 md:mt-0">
      <img
        src={imagen || "https://via.placeholder.com/300x200?text=Servicio"}
        alt={nombre}
        className="w-full h-auto rounded-md object-cover shadow-md"
      />
    </div>
  </div>
);

export default ServicioInfoCard;
