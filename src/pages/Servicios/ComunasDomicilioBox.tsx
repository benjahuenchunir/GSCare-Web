import React from "react";
import { MapPin, ArrowDown } from "lucide-react";

interface Props {
  comunas: string[];
}

const ComunasDomicilioBox: React.FC<Props> = ({ comunas }) => (
  <div className="p-6 bg-white rounded-2xl shadow-md mb-8">
    <h2 className="text-[1.2em] font-bold mb-6 text-left" style={{ color: "#006881" }}>
      Comunas donde hace a domicilio
    </h2>
    <div className="flex items-start gap-3">
      <MapPin className="w-7 h-7 text-[#CD3272]" />
      <ul className="flex flex-wrap gap-2 text-[1em] text-gray-800 font-medium">
        {comunas.map((comuna) => (
          <li
            key={comuna}
            className="bg-[#F9FAFB] px-3 py-1 rounded-full border border-gray-200"
          >
            {comuna}
          </li>
        ))}
      </ul>
    </div>
    {/* Mensaje llamativo de contacto */}
    <div className="mt-6 p-4 rounded-xl border border-[#CD3272] bg-[#FFF0F6] flex items-center gap-3 shadow-sm">
      <span className="font-semibold text-[#CD3272] text-[1.05em]">
        ¿Quieres servicio a domicilio?
      </span>
      <span className="ml-2 text-[#006881] font-medium flex items-center gap-2">
        ¡Contáctate con el encargado del servicio para coordinar!
        <button
          aria-label="Ir a agendar"
          onClick={() => {
            const el = document.getElementById("agendar-box");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          className="ml-1 p-1 rounded-full hover:bg-[#CD3272]/10 transition"
          type="button"
        >
          <ArrowDown className="w-6 h-6 text-[#CD3272]" />
        </button>
      </span>
    </div>
  </div>
);

export default ComunasDomicilioBox;
