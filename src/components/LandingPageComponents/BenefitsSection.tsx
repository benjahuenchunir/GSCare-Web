// src/components/LandingPageComponents/BenefitsBlocks.tsx
import {
  FaStethoscope,
  FaHandsHelping,
  FaGift,
  FaGamepad,
  FaUserFriends,
  FaLock,
} from "react-icons/fa";
import SignupButton from "../SignupButton";

export default function BenefitsBlocks() {
  const benefits = [
    {
      strong: "Conoce una gran variedad de servicios",
      rest: "ofrecidos por profesionales expertos en salud, bienestar y acompañamiento.",
      icon: <FaStethoscope />,
    },
    {
      strong: "Participa en actividades de recreación",
      rest: "pensadas para adultos mayores, como clubs, talleres, clases y más.",
      icon: <FaHandsHelping />,
    },
    {
      strong: "Explora productos seleccionados",
      rest: "para mejorar tu comodidad y calidad de vida.",
      icon: <FaGift />,
    },
    {
      strong: "Accede a juegos en línea",
      rest: "diseñados para entretenerte y estimular tu mente.",
      icon: <FaGamepad />,
    },
    {
      strong: "Conéctate con una comunidad",
      rest: "que comparte tus intereses y experiencias.",
      icon: <FaUserFriends />,
    },
    {
      strong: "Navega con tranquilidad",
      rest: "tus datos estarán protegidos y seguros.",
      icon: <FaLock />,
    },
  ];

  return (
    <section className="w-full bg-[#F5F5F5] py-16 px-6 font-[Poppins]">
      <div className="max-w-screen-lg mx-auto text-center">
        <h2 className="text-[2.5em] font-bold text-[#006881] mb-12 leading-snug">
          Únete a nuestra comunidad y accede a todos los beneficios
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {benefits.map(({ strong, rest, icon }, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg border-l-8 border-r-2 border-b-2 border-t-2 border-[#009982] flex items-start space-x-4 shadow-md"
            >
              <div className="text-[#009982] text-2xl mt-1">{icon}</div>
              <p className="text-[1.1em]">
                <span className="font-semibold text-gray-800">{strong}</span>{" "}
                <span className="text-gray-600">{rest}</span>
              </p>
            </div>

            // <div
            //   key={index}
            //   className="bg-white p-6 rounded-xl border-[1.5px] border-[#20AF94] flex items-start space-x-4"
            // >
            //   <div className="text-[#009982] text-2xl mt-1">{icon}</div>
            //   <p className="text-[1.1em]">
            //     <span className="font-semibold text-gray-800">{strong}</span>{" "}
            //     <span className="text-gray-600">{rest}</span>
            //   </p>
            // </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <SignupButton />
        </div>
      </div>
    </section>
  );
}
