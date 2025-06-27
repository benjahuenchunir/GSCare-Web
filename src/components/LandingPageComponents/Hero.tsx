import SignupButton from "../SignupButton";
import { useEffect, useState } from "react"
import { getConfig, Config } from "../../firebase/configService"

export default function Hero() {
  const [config, setConfig] = useState<Config | null>(null)

  useEffect(() => {
    getConfig().then((data) => {
      if (data) {
        setConfig({
          contactPhone: data.contactPhone ?? '',
          contactEmail: data.contactEmail ?? '',
          address: data.address ?? '',
          landingTitle: data.landingTitle ?? '',
          landingSubtitle: data.landingSubtitle ?? '',
          landingImage: data.landingImage ?? '',
          socialLinks: data.socialLinks ?? {},
        })
      }
    })
  }, [])

  const backgroundUrl = config?.landingImage || "https://www.aplaceformom.com/images/1147028"
  
  return (
    <section className="flex flex-col lg:flex-row w-full min-h-screen font-[Poppins]">
      {/* Columna izquierda */}
      <div className="w-full lg:w-1/2 bg-gray-200 flex flex-col justify-center pl-20 pr-6 py-10">
        <h1 className="text-[#006881] font-bold text-[3.5em]  leading-tight">
          {config?.landingTitle || "Mejorando la Calidad de Vida de Nuestros Mayores"}
        </h1>
        <p className="text-[#4B5563] text-[2em] leading-snug mt-4">
          {config?.landingSubtitle || "Brindamos compañía, apoyo y cuidado personalizado para adultos mayores, permitiéndoles mantener su independencia y bienestar."}
        </p>
        <div className="flex flex-col sm:flex-row text-[1.1em] gap-4 mt-6">
          <a
            href="#services"
            className="px-10 py-5 bg-a7 text-[1em] text-white font-semibold rounded-lg hover:bg-a7/80 transition flex justify-center items-center"
          >
            Explorar Servicios
          </a>
          <SignupButton />
        </div>
      </div>

      {/* Columna imagen con degradado que inicia a la mitad */}
      <div
        className="w-full lg:w-1/2 relative bg-cover bg-center"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(220, 13%, 91%) 0%, rgba(229, 231, 235, 0.31) 25%, rgba(0, 0, 0, 0) 50%, rgba(215, 215, 215, 0) 50%),
            url('${backgroundUrl}')
          `
        }}
      />
    </section>
  );
}
