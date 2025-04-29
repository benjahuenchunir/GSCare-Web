import React from "react";

interface Beneficio {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string; // Nombre del ícono recibido
}

interface BeneficiosBoxProps {
  beneficios: Beneficio[];
}

const BeneficiosBox: React.FC<BeneficiosBoxProps> = ({ beneficios }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#00495C]">Beneficios del servicio</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {beneficios.map((beneficio) => {
          const fileName = beneficio.icono.replace(/\s+/g, '-') + '.svg'; // Reemplaza espacios por guiones
          
          return (
                <div key={beneficio.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10">
                    <img
                    src={`/assets/${fileName}`}
                    alt={beneficio.nombre}
                    className="w-10 h-10 object-contain"
                    />
                </div>
                <div className="flex flex-col justify-center text-left">
                    <h3 className="text-lg font-semibold text-[#00495C]">{beneficio.nombre}</h3>
                    <p className="text-gray-600">{beneficio.descripcion}</p>
                </div>
                </div>
          );
        })}
      </div>
    </div>
  );
};

export default BeneficiosBox;
