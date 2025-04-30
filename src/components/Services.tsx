import Heart from "../assets/icons/heart.svg";
import Care from "../assets/icons/care.svg";
import House from "../assets/icons/house.svg";
import Procedure from "../assets/icons/procedures.svg";

export default function Services() {
  return (
    <section id="services" className="w-full min-h-screen flex flex-col items-center justify-center bg-white text-gray-600 font-[Poppins]">
      <h2 className="text-[3rem] font-bold text-[#006881] w-full text-center m-0">Nuestros servicios</h2>

      <section className="grid grid-cols-2 grid-rows-2 w-[90%] h-[70vh] justify-items-center items-center gap-4">
        {/* Tarjeta 1 */}
        <div className="w-[95%] h-[90%] bg-gray-200 flex flex-col items-center justify-center gap-[15px] rounded-lg">
          <div className="w-full h-20 flex flex-row justify-around items-start">
            <h3 className="w-[65%] text-left text-[2rem] font-bold text-[#006881] m-0">
							Compañía para Esparcimiento
						</h3>
            <figure className="w-[20%] h-full flex justify-end items-start m-0">
              <img src={Heart} alt="Heart" className="h-[100%]" />
            </figure>
          </div>

          <div className="w-[92%] h-24 m-0">
            <p className="w-[70%] text-left text-[1.3rem] m-0">
              Acompañamiento en actividades recreativas y sociales para mantener una vida activa
            </p>
          </div>

          <div className="w-[90%] flex justify-end items-center">
            <a href="" className="px-5 py-2 text-xl border-2 border-[#006881] text-[#006881] rounded-lg">
              Saber más
            </a>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="w-[95%] h-[90%] bg-gray-200 flex flex-col items-center justify-center gap-[15px] rounded-lg">
          <div className="w-full h-20 flex flex-row justify-around items-start">
            <h3 className="w-[65%] text-left text-[2rem] font-bold text-[#006881] m-0">Gestión del Cuidado</h3>
            <figure className="w-[20%] h-full flex justify-end items-start m-0">
              <img src={Care} alt="Care" className="w-[60%]" />
            </figure>
          </div>

          <div className="w-[92%] h-24 m-0">
            <p className="w-[70%] text-left text-[1.3rem] m-0">
              Coordinación de cuidados médicos y seguimiento personalizado de la salud.
            </p>
          </div>

          <div className="w-[90%] flex justify-end items-center">
            <a href="" className="px-5 py-2 text-xl border-2 border-[#006881] text-[#006881] rounded-lg">
              Saber más
            </a>
          </div>
        </div>

        {/* Tarjeta 3 */}
        <div className="w-[95%] h-[90%] bg-gray-200 flex flex-col items-center justify-center gap-[15px] rounded-lg">
          <div className="w-full h-20 flex flex-row justify-around items-start">
            <h3 className="w-[65%] text-left text-[2rem] font-bold text-[#006881] m-0">Compañía para Trámites</h3>
            <figure className="w-[20%] h-full flex justify-end items-start m-0">
              <img src={Procedure} alt="Procedure" className="w-[60%]" />
            </figure>
          </div>

          <div className="w-[92%] h-24 m-0">
            <p className="w-[70%] text-left text-[1.3rem] m-0">
              Acompañamiento en gestiones administrativas y acompañamiento a citas importantes
            </p>
          </div>

          <div className="w-[90%] flex justify-end items-center">
            <a href="" className="px-5 py-2 text-xl border-2 border-[#006881] text-[#006881] rounded-lg">
              Saber más
            </a>
          </div>
        </div>

        {/* Tarjeta 4 */}
        <div className="w-[95%] h-[90%] bg-gray-200 flex flex-col items-center justify-center gap-[15px] rounded-lg">
          <div className="w-full h-20 flex flex-row justify-around items-start">
            <h3 className="w-[65%] text-left text-[2rem] font-bold text-[#006881] m-0">Mantención del Hogar</h3>
            <figure className="w-[20%] h-full flex justify-end items-start m-0">
              <img src={House} alt="House" className="w-[60%]" />
            </figure>
          </div>

          <div className="w-[92%] h-24 m-0">
            <p className="w-[70%] text-left text-[1.3rem] m-0">
              Apoyo en el mantenimiento y cuidado del hogar para un ambiente seguro.
            </p>
          </div>

          <div className="w-[90%] flex justify-end items-center">
            <a href="" className="px-5 py-2 text-xl border-2 border-[#006881] text-[#006881] rounded-lg">
              Saber más
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}
