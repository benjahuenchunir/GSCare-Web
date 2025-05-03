import SignupButton from "../SignupButton";
import Logo from "../../assets/imgs/logo.svg";

export default function Hero() {
  return (
    <section className="flex flex-row justify-center items-center w-full min-h-screen bg-gray-200 font-[Poppins]">
      <div className="w-[45%] h-screen flex flex-col justify-center gap-7 items-start">
        <header className="flex flex-col items-start gap-7">
          <h1 className="text-left text-[#006881] font-bold text-7xl w-[83%] m-0">
            Mejorando la Calidad de Vida de Nuestros Mayores
          </h1>
          <p className="text-left text-[#4B5563] text-2xl w-[65%] m-0">
            Brindamos compañía, apoyo y cuidado personalizado para adultos mayores, permitiéndoles mantener su independencia y bienestar.
          </p>
        </header>

        <div className="flex flex-row justify-start items-center gap-7 w-full">
          <a
            href="#services"
            className="text-xl px-10 py-5 rounded-lg border-none cursor-pointer transition-colors duration-300 bg-[#FFC600] text-gray-900 hover:bg-yellow-300"
          >
            Explorar Servicios
          </a>
          <SignupButton />
        </div>
      </div>

      <figure className="w-[35%] h-screen flex justify-start items-center m-0">
        <img src={Logo} alt="Logo GSCare" className="w-full" />
      </figure>
    </section>
  );
}

