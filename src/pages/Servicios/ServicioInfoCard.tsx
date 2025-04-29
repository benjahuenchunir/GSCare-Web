interface ServicioInfoCardProps {
  nombre: string;
  descripcion: string;
  imagen: string;
}

export default function ServicioInfoCard({ nombre, descripcion, imagen }: ServicioInfoCardProps) {
  return (
    <div className="flex flex-col-reverse md:flex-row items-stretch gap-8 p-6 bg-white rounded-2xl shadow-md mb-8">
      <div className="flex-1 flex flex-col justify-start text-center md:text-left pt-6">
        <h1
          className="font-poppins font-bold text-2xl md:text-5xl text-cyan-900 mb-8"
          style={{ color: "#006881" }}
        >
          {nombre}
        </h1>
        <p
          className="font-poppins font-normal text-base md:text-lg text-gray-700 leading-relaxed"
          style={{ color: "#4B5563" }}
        >
          {descripcion}
        </p>
      </div>
      <div className="flex-1 flex justify-center h-full">
        <img
          src={imagen}
          alt={nombre}
          className="self-center max-h-[300px] w-auto rounded-xl object-contain"
        />
      </div>
    </div>
  );
}
