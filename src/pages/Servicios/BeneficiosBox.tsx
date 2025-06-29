import React from "react";
import { CheckCircle2 } from "lucide-react";

interface Beneficio {
  id: number;
  nombre: string;
  descripcion: string;
}

interface BeneficiosBoxProps {
  beneficios: Beneficio[];
}

const BeneficiosBox: React.FC<BeneficiosBoxProps> = ({ beneficios }) => {
  if (!beneficios || beneficios.length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-[1.2em] font-bold text-[#00495C] mb-4">
        Beneficios Exclusivos para Socios
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {beneficios.map((b) => (
          <div key={b.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 pt-1">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{b.nombre}</h3>
              <p className="text-gray-600 text-sm">{b.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BeneficiosBox;
