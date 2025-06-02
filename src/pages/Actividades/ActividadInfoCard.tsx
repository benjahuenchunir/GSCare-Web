interface ActividadInfoCardProps {
  nombre: string;
  descripcion: string;
  imagen?: string | null;
}

export default function ActividadInfoCard({ nombre, descripcion, imagen }: ActividadInfoCardProps) {
  return (
    <div className="flex flex-col-reverse md:flex-row items-stretch gap-8 p-6 bg-white rounded-2xl shadow-md mb-8">
      <div className="flex-1 flex flex-col justify-start text-center md:text-left pt-6">
        <h1
          className="font-poppins font-bold text-[2em] text-cyan-900 mb-8 leading-snug"
          style={{ color: "#006881" }}
        >
          {nombre}
        </h1>
        <p
          className="font-poppins font-normal text-[1em] text-gray-700 leading-relaxed"
          style={{ color: "#4B5563" }}
        >
          {descripcion}
        </p>
      </div>
      {imagen && (
        <div className="flex-1 flex justify-center h-full">
          <img
            src={imagen}
            alt={`Imagen de ${nombre}`}
            className="self-center max-h-[300px] w-auto rounded-xl object-contain"
          />
        </div>
      )}
    </div>
  );
}
