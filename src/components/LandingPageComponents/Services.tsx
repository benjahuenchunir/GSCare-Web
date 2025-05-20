// src/components/Services.jsx
import Heart from "../../assets/icons/heart.svg";
import Care from "../../assets/icons/care.svg";
import House from "../../assets/icons/house.svg";
import Procedure from "../../assets/icons/procedures.svg";

export default function Services() {
  return (
    <section id="services" className="w-full bg-white text-gray-600 font-[Poppins] py-16 px-6">
      <h2 className="text-center text-[2.5em] font-bold text-[#006881] mb-12">
        Nuestros servicios
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-screen-lg mx-auto">
        {/* Tarjeta 1 */}
        <div className="bg-gray-200 p-6 flex flex-col justify-between rounded-lg">
          <div className="flex items-start mb-4">
            <h3 className="flex-1 text-[1.5em] leading-snug font-bold text-[#006881]">
              Compañía para Esparcimiento
            </h3>
            <img src={Heart} alt="Heart" className="w-12 h-12" />
          </div>
          <p className="text-[1em] mb-4">
            Acompañamiento en actividades recreativas y sociales para mantener una vida activa
          </p>
          <div className="text-right">
            <a href="#" className="px-4 py-2 text-[1em] border-2 border-[#006881] text-[#006881] rounded-lg hover:bg-[#006881] hover:text-white transition">
              Saber más
            </a>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="bg-gray-200 p-6 flex flex-col justify-between rounded-lg">
          <div className="flex items-start mb-4">
            <h3 className="flex-1 text-[1.5em] leading-snug font-bold text-[#006881]">
              Gestión del Cuidado
            </h3>
            <img src={Care} alt="Care" className="w-12 h-12" />
          </div>
          <p className="text-[1em] mb-4">
            Coordinación de cuidados médicos y seguimiento personalizado de la salud.
          </p>
          <div className="text-right">
            <a href="#" className="px-4 py-2 text-[1em] border-2 border-[#006881] text-[#006881] rounded-lg hover:bg-[#006881] hover:text-white transition">
              Saber más
            </a>
          </div>
        </div>

        {/* Tarjeta 3 */}
        <div className="bg-gray-200 p-6 flex flex-col justify-between rounded-lg">
          <div className="flex items-start mb-4">
            <h3 className="flex-1 text-[1.5em] leading-snug font-bold text-[#006881]">
              Compañía para Trámites
            </h3>
            <img src={Procedure} alt="Procedure" className="w-12 h-12" />
          </div>
          <p className="text-[1em] mb-4">
            Acompañamiento en gestiones administrativas y acompañamiento a citas importantes
          </p>
          <div className="text-right">
            <a href="#" className="px-4 py-2 text-[1em] border-2 border-[#006881] text-[#006881] rounded-lg hover:bg-[#006881] hover:text-white transition">
              Saber más
            </a>
          </div>
        </div>

        {/* Tarjeta 4 */}
        <div className="bg-gray-200 p-6 flex flex-col justify-between rounded-lg">
          <div className="flex items-start mb-4">
            <h3 className="flex-1 text-[1.5em] leading-snug font-bold text-[#006881]">
              Mantención del Hogar
            </h3>
            <img src={House} alt="House" className="w-12 h-12" />
          </div>
          <p className="text-[1em] mb-4">
            Apoyo en el mantenimiento y cuidado del hogar para un ambiente seguro.
          </p>
          <div className="text-right">
            <a href="#" className="px-4 py-2 text-[1em] border-2 border-[#006881] text-[#006881] rounded-lg hover:bg-[#006881] hover:text-white transition">
              Saber más
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
