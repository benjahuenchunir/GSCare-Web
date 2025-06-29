interface DisponibilidadBoxProps {
    dias_disponibles: number[];
    hora_inicio: string;
    hora_termino: string;
  }
  
  const diasSemana = [
    "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
  ];
  
  export default function DisponibilidadBox({ dias_disponibles, hora_inicio, hora_termino }: DisponibilidadBoxProps) {
  
    return (
      <div className="p-6 bg-white rounded-2xl shadow-md mb-8">
        <h2 className="text-[1.2em] font-bold mb-6 text-left" style={{ color: "#006881" }}>
          Disponibilidad del servicio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#F9FAFB] p-4 rounded-xl">
            <h3 className="text-[1.1em] font-bold mb-2 text-left" style={{ color: "#009982" }}>
              Días de atención:
            </h3>
            <div className="grid grid-cols-7 gap-2 text-[1em]">
              {diasSemana.map((dia, index) => {
                const activo = dias_disponibles.includes(index);
                return (
                  <div
                    key={dia}
                    className={`py-2 px-3 text-center rounded-md border font-medium
                      ${activo 
                        ? 'bg-[#E0F5F5] text-[#009982] border-[#009982]'
                        : 'bg-[#F5F5F5] text-gray-400 border-[#E0E0E0]'
                      }`}
                  >
                    {dia.slice(0, 3)}
                  </div>
                );
              })}
            </div>


          </div>
  
          <div className="bg-[#F9FAFB] p-4 rounded-xl">
            <h3 className="text-[1.1em] font-bold mb-2 text-left" style={{ color: "#009982" }}>
              Horario de atención:
            </h3>
            <p className="text-gray-700 text-left">{hora_inicio.slice(0,5)} - {hora_termino.slice(0,5)}</p>
          </div>
        </div>
      </div>
    );
  }
