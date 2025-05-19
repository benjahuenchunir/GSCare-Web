interface DisponibilidadBoxProps {
    dias_disponibles: number[];
    hora_inicio: string;
    hora_termino: string;
  }
  
  const diasSemana = [
    "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
  ];
  
  export default function DisponibilidadBox({ dias_disponibles, hora_inicio, hora_termino }: DisponibilidadBoxProps) {
    const diasTexto = dias_disponibles.map((dia) => diasSemana[dia]).join(', ');
  
    return (
      <div className="p-6 bg-white rounded-2xl shadow-md mb-8">
        <h2 className="text-[1.2em] font-bold mb-6 text-left" style={{ color: "#006881" }}>
          Disponibilidad del servicio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-[#F9FAFB] p-4 rounded-xl">
            <h3 className="text-[1.1em] font-bold mb-2 text-left" style={{ color: "#009982" }}>
              Días disponibles
            </h3>
            <p className="text-gray-700 text-left">{diasTexto}</p>
          </div>
  
          <div className="bg-[#F9FAFB] p-4 rounded-xl">
            <h3 className="text-[1.1em] font-bold mb-2 text-left" style={{ color: "#009982" }}>
              Horario
            </h3>
            <p className="text-gray-700 text-left">{hora_inicio.slice(0,5)} - {hora_termino.slice(0,5)}</p>
          </div>
  
        </div>
      </div>
    );
  }
  