import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export interface RecurrentActivityForm {
  nombre: string;
  descripcion: string;
  modalidad: string;
  lugar?: string;
  comuna?: string;
  fecha: string;
  hora_inicio?: string;
  hora_final?: string;
  imagen?: string;
  categoria?: string;
  capacidad_total: number;
  // --- Recurrente ---
  fecha_termino: string;
  semanas_recurrencia: number;
  dias_seleccionados: boolean[];
  horarios_por_dia: string[][];
}

interface RecurrentActivityFormProps {
  actividad: RecurrentActivityForm;
  onChange: (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | { target: { name: string; value: any } }
  ) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  loading: boolean;
  error: string;
  success: string;
  onSwitchToUnique: () => void;
}

export default function RecurrentActivityForm({
  actividad,
  onChange,
  onSubmit,
  onCancel,
  loading,
  error,
  success,
  onSwitchToUnique,
}: RecurrentActivityFormProps) {
  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const handleHorarioChange = (
    dia: number,
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    const nuevosHorarios = actividad.horarios_por_dia.map((horariosDia, i) =>
      i === dia ? [...(horariosDia || ["", ""])] : (horariosDia || ["", ""])
    );
    nuevosHorarios[dia][index] = value;
    onChange({
      target: { name: "horarios_por_dia", value: nuevosHorarios },
    } as any);
  };

  const handleDiaSeleccionado = (dia: number, checked: boolean) => {
    const seleccionados = [...actividad.dias_seleccionados];
    seleccionados[dia] = checked;
    const nuevosHorarios = [...actividad.horarios_por_dia];
    if (!checked) nuevosHorarios[dia] = ["", ""];
    onChange({ target: { name: "dias_seleccionados", value: seleccionados } } as any);
    onChange({ target: { name: "horarios_por_dia", value: nuevosHorarios } } as any);
  };

  // --- NUEVO: Manejo de "sin límite" de capacidad ---
  const [sinLimiteCapacidad, setSinLimiteCapacidad] = useState(
    actividad.capacidad_total === 999999 ||
    actividad.capacidad_total === null ||
    actividad.capacidad_total === undefined
  );

  useEffect(() => {
    setSinLimiteCapacidad(
      actividad.capacidad_total === 999999 ||
      actividad.capacidad_total === null ||
      actividad.capacidad_total === undefined
    );
  }, [actividad.capacidad_total]);

  // --- NUEVO: Validación visual de rango de fechas según semanas de recurrencia ---
  const [rangoTermino, setRangoTermino] = useState<{min: string, max: string} | null>(null);

  useEffect(() => {
    // Solo si hay fecha y semanas_recurrencia
    if (actividad.fecha && actividad.semanas_recurrencia) {
      const fechaInicio = new Date(actividad.fecha);
      const semanas = Number(actividad.semanas_recurrencia);
      const diaInicio = fechaInicio.getDay(); // 0=domingo, 1=lunes, ..., 6=sábado
      // El último día de la última semana es: fechaInicio + (semanas-1)*7 + (6-diaInicio) días
      const diasHastaUltimo = (semanas - 1) * 7 + (6 - diaInicio);
      const fechaUltimoDia = new Date(fechaInicio);
      fechaUltimoDia.setDate(fechaInicio.getDate() + diasHastaUltimo);
      const fechaUltimoStr = fechaUltimoDia.toISOString().split("T")[0];
      setRangoTermino({
        min: fechaUltimoStr,
        max: fechaUltimoStr,
      });
    } else {
      setRangoTermino(null);
    }
  }, [actividad.fecha, actividad.semanas_recurrencia]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-md p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#009982]">Crear Actividad Recurrente</h2>
          <button
            onClick={onSwitchToUnique}
            className="flex items-center text-[#006E5E] hover:underline text-lg font-medium"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Volver
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          {/* INFORMACIÓN BÁSICA */}
          <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h3 className="text-2xl font-semibold text-[#009982] mb-4">Información básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium mb-1">Nombre</label>
                <input
                  name="nombre"
                  value={actividad.nombre}
                  onChange={onChange}
                  placeholder="Ej: Clase de yoga"
                  className="w-full border rounded-xl py-3 px-4 text-lg focus:ring-2 focus:ring-[#62CBC9] outline-none"
                  maxLength={255}
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-1">Categoría</label>
                <input
                  name="categoria"
                  value={actividad.categoria || ""}
                  onChange={onChange}
                  placeholder="Ej: Recreación"
                  className="w-full border rounded-xl py-3 px-4 text-lg focus:ring-2 focus:ring-[#62CBC9] outline-none"
                  maxLength={255}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-lg font-medium mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={actividad.descripcion}
                  onChange={onChange}
                  placeholder="Describe brevemente la actividad"
                  className="w-full border rounded-xl py-3 px-4 text-lg focus:ring-2 focus:ring-[#62CBC9] outline-none"
                  rows={4}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-lg font-medium mb-1">Imagen (opcional)</label>
                <input
                  name="imagen"
                  value={actividad.imagen || ""}
                  onChange={onChange}
                  placeholder="URL de imagen"
                  className="w-full border rounded-xl py-3 px-4 text-lg focus:ring-2 focus:ring-[#62CBC9] outline-none"
                />
              </div>
            </div>
          </section>

          {/* LOGÍSTICA */}
          <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h3 className="text-2xl font-semibold text-[#009982] mb-4">Logística y ubicación</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-lg font-medium mb-1">Modalidad</label>
                <select
                  name="modalidad"
                  value={actividad.modalidad}
                  onChange={onChange}
                  className="w-full border rounded-xl py-3 px-4 text-lg focus:ring-2 focus:ring-[#62CBC9] outline-none"
                >
                  <option value="presencial">Presencial</option>
                  <option value="online">Online</option>
                </select>
              </div>
              {/* Solo mostrar lugar y comuna si es presencial */}
              {actividad.modalidad === "presencial" && (
                <>
                  <div>
                    <label className="block text-lg font-medium mb-1">Lugar</label>
                    <input
                      name="lugar"
                      value={actividad.lugar || ""}
                      onChange={onChange}
                      placeholder="Ej: Centro comunitario"
                      className="w-full border rounded-xl py-3 px-4 text-lg focus:ring-2 focus:ring-[#62CBC9] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium mb-1">Comuna</label>
                    <input
                      name="comuna"
                      value={actividad.comuna || ""}
                      onChange={onChange}
                      placeholder="Ej: La Reina"
                      className="w-full border rounded-xl py-3 px-4 text-lg focus:ring-2 focus:ring-[#62CBC9] outline-none"
                    />
                  </div>
                </>
              )}
            </div>
            {/* Capacidad total */}
            <div className="mt-6">
              <label className="block text-lg font-medium mb-1">Capacidad total</label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="sinLimite"
                  checked={sinLimiteCapacidad}
                  onChange={() => {
                    const nuevoSinLimite = !sinLimiteCapacidad;
                    setSinLimiteCapacidad(nuevoSinLimite);
                    if (nuevoSinLimite) {
                      onChange({
                        target: { name: "capacidad_total", value: 999999 },
                      } as any);
                    } else {
                      onChange({
                        target: { name: "capacidad_total", value: "" },
                      } as any);
                    }
                  }}
                />
                <label htmlFor="sinLimite" className="text-sm">Sin límite de capacidad</label>
              </div>
              <input
                type="number"
                name="capacidad_total"
                value={sinLimiteCapacidad ? "" : (actividad.capacidad_total === 999999 ? "" : actividad.capacidad_total ?? "")}
                onChange={e => {
                  onChange({
                    target: {
                      name: "capacidad_total",
                      value: e.target.value === "" ? 999999 : Number(e.target.value)
                    }
                  } as any);
                }}
                className={`w-full border rounded-xl py-3 px-4 text-lg ${sinLimiteCapacidad ? "bg-gray-100 text-gray-400" : ""}`}
                placeholder={sinLimiteCapacidad ? "Sin límite" : "Ej: 30"}
                min={1}
                disabled={sinLimiteCapacidad}
              />
            </div>
          </section>

          {/* REPETICIÓN */}
          <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h3 className="text-2xl font-semibold text-[#009982] mb-4">Frecuencia de repetición</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-lg font-medium mb-1">¿Cada cuántas semanas?</label>
                <input
                  type="number"
                  name="semanas_recurrencia"
                  min={1}
                  value={actividad.semanas_recurrencia}
                  onChange={onChange}
                  className="w-full border rounded-xl py-3 px-4 text-lg focus:ring-2 focus:ring-[#62CBC9] outline-none"
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-1">Fecha de inicio</label>
                <input
                  type="date"
                  name="fecha"
                  value={actividad.fecha}
                  onChange={onChange}
                  className="w-full border rounded-xl py-3 px-4 text-lg focus:ring-2 focus:ring-[#62CBC9] outline-none"
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-1">Fecha de término</label>
                <input
                  type="date"
                  name="fecha_termino"
                  value={actividad.fecha_termino}
                  onChange={onChange}
                  className="w-full border rounded-xl py-3 px-4 text-lg focus:ring-2 focus:ring-[#62CBC9] outline-none"
                  min={rangoTermino?.min}
                  max={rangoTermino?.max}
                />
                {rangoTermino && (
                  <p className="text-xs text-gray-500 mt-1">
                    Debe ser exactamente <b>{rangoTermino.min}</b> (último día de la última semana de recurrencia).
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* DÍAS Y HORARIOS */}
          <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h3 className="text-2xl font-semibold text-[#009982] mb-6 text-center">Selecciona los días y horarios</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {diasSemana.map((dia, index) => (
                <div key={dia} className="border p-4 rounded-xl">
                  <label className="flex items-center mb-3 gap-3">
                    <input
                      type="checkbox"
                      checked={actividad.dias_seleccionados?.[index] || false}
                      onChange={(e) => handleDiaSeleccionado(index, e.target.checked)}
                      className="accent-[#009982] w-5 h-5"
                    />
                    <span className="text-lg font-medium">{dia}</span>
                  </label>
                  {actividad.dias_seleccionados?.[index] && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm mb-1">Hora inicio</label>
                        <input
                          type="time"
                          value={actividad.horarios_por_dia[index]?.[0] || ""}
                          onChange={(e) => handleHorarioChange(index, 0, e)}
                          className="w-full border rounded-lg py-2 px-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Hora fin</label>
                        <input
                          type="time"
                          value={actividad.horarios_por_dia[index]?.[1] || ""}
                          onChange={(e) => handleHorarioChange(index, 1, e)}
                          className="w-full border rounded-lg py-2 px-3 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* MENSAJES */}
          {error && <p className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>}
          {success && <p className="text-green-600 bg-green-100 p-4 rounded-lg">{success}</p>}

          {/* BOTONES */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="bg-[#FF8D6B] hover:bg-[#CD4422] text-white font-semibold py-3 px-6 rounded-xl text-lg transition w-48 h-16 flex items-center justify-center"
            >
              Cancelar
            </button>
            {/* Si tienes un botón de vista previa aquí, agrégalo igual que en ActivityForm */}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#009982] hover:bg-[#006E5E] text-white font-semibold py-3 px-6 rounded-xl text-lg transition w-48 h-16 flex items-center justify-center"
            >
              {loading ? "Creando..." : "Crear Actividad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
