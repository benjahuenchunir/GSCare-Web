// src/components/LandingPageComponents/Hero.jsx
import SignupButton from "../SignupButton";
import Logo from "../../assets/imgs/logo.svg";

export default function Hero() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-center w-full min-h-screen bg-gray-200 font-[Poppins] px-6 py-10">
      {/* Texto */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center gap-6 mb-10 lg:mb-0">
        <h1 className="text-[#006881] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight">
          Mejorando la Calidad de Vida de Nuestros Mayores
        </h1>
        <p className="text-[#4B5563] text-base sm:text-lg md:text-xl lg:text-2xl">
          Brindamos compañía, apoyo y cuidado personalizado para adultos mayores, permitiéndoles mantener su independencia y bienestar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <a
            href="#services"
            className="inline-block text-lg sm:text-xl px-6 py-3 rounded-lg bg-[#FFC600] text-gray-900 hover:bg-yellow-300 transition"
          >
            Explorar Servicios
          </a>
          <SignupButton />
        </div>
      </div>
      {/* Imagen */}
      <figure className="w-full lg:w-2/5 flex justify-center">
        <img src={Logo} alt="Logo GSCare" className="w-3/4 sm:w-2/3 lg:w-full" />
      </figure>
    </section>
  );
}
