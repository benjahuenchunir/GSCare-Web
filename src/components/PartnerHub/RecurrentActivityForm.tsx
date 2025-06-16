import React, { ChangeEvent, FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export interface RecurrentActivityForm {
  nombre: string;
  descripcion: string;
  modalidad: string;
  lugar?: string;
  comuna?: string;
  fecha: string;
  fecha_termino: string;
  // hora_inicio y hora_final no están en initialRecurrentActividad en PartnerHub.tsx,
  // pero sí en la interfaz aquí. Asumo que deben estar.
  hora_inicio?: string; 
  hora_final?: string;
  imagen?: string;
  categoria?: string;
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
    index: number, // 0 para inicio, 1 para fin
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    const nuevosHorarios = actividad.horarios_por_dia.map((horariosDia, i) =>
      i === dia ? [...(horariosDia || ["", ""])] : (horariosDia || ["", ""])
    );
    if (!nuevosHorarios[dia]) nuevosHorarios[dia] = ["", ""]; // Asegurar que el array exista
    nuevosHorarios[dia][index] = value;
    onChange({
      target: { name: "horarios_por_dia", value: nuevosHorarios },
    } as any);
  };

  const handleDiaSeleccionado = (dia: number, checked: boolean) => {
    const seleccionados = actividad.dias_seleccionados
      ? [...actividad.dias_seleccionados]
      : new Array(7).fill(false);
    seleccionados[dia] = checked;

    // Si se deselecciona un día, limpiar sus horarios
    const nuevosHorarios = [...actividad.horarios_por_dia];
    if (!checked) {
      nuevosHorarios[dia] = ["", ""];
    }
    
    onChange({ target: { name: "dias_seleccionados", value: seleccionados } } as any);
    onChange({ target: { name: "horarios_por_dia", value: nuevosHorarios } } as any);
  };


  return (
    <div className="max-w-screen-2xl mx-auto p-4"> {/* Cambiado de max-w-7xl a max-w-screen-2xl */}
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-center flex-1">
          Crear actividad que se repite
        </h2>
        <button
          type="button"
          onClick={onSwitchToUnique}
          className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
          <span className="underline">Volver</span>
        </button>
      </div>

      <div className="h-[75vh] overflow-y-auto pr-2">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Grid general de dos columnas en pantallas grandes */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* -------------------------- Información básica -------------------------- */}
            <section className="bg-white lg:col-span-2 rounded shadow p-4">
              <h3 className="text-xl font-semibold mb-3">Información básica</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={actividad.nombre}
                      onChange={onChange}
                      className="w-full p-2 border rounded"
                      placeholder="Título de la actividad"
                      maxLength={255}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Categoría</label>
                    <input
                      type="text"
                      name="categoria"
                      value={actividad.categoria || ""}
                      onChange={onChange}
                      className="w-full p-2 border rounded"
                      placeholder="Ej: Lectura, Deportes..."
                      maxLength={255}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={actividad.descripcion}
                    onChange={onChange}
                    className="w-full p-2 border rounded"
                    rows={3}
                    placeholder="Breve descripción de la actividad"
                    maxLength={255}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Imagen (opcional)</label>
                  <input
                    type="text"
                    name="imagen"
                    value={actividad.imagen || ""}
                    onChange={onChange}
                    className="w-full p-2 border rounded"
                    placeholder="URL de la imagen"
                    maxLength={255}
                  />
                </div>
              </div>
            </section>

            {/* -------------------------- Logística y ubicación -------------------------- */}
            <section className="bg-white rounded shadow p-4">
              <h3 className="text-xl font-semibold mb-3">Logística y ubicación</h3>
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Modalidad</label>
                  <select
                    name="modalidad"
                    value={actividad.modalidad}
                    onChange={onChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="presencial">Presencial</option>
                    <option value="online">En línea</option>
                    <option value="hibrido">Híbrido</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Lugar</label>
                  <input
                    type="text"
                    name="lugar"
                    value={actividad.lugar || ""}
                    onChange={onChange}
                    className="w-full p-2 border rounded"
                    placeholder="Ej: Centro comunitario / PUC..."
                    maxLength={255}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Comuna</label>
                  <input
                    type="text"
                    name="comuna"
                    value={actividad.comuna || ""}
                    onChange={onChange}
                    className="w-full p-2 border rounded"
                    placeholder="Ej: San Joaquín"
                    maxLength={255}
                  />
                </div>
              </div>
            </section>

            {/* -------------------------- Frecuencia de repetición -------------------------- */}
            <section className="bg-white rounded shadow p-4">
              <h3 className="text-xl font-semibold mb-3">Frecuencia de repetición</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">
                    ¿Cada cuántas semanas?
                  </label>
                  <input
                    type="number"
                    name="semanas_recurrencia"
                    value={actividad.semanas_recurrencia}
                    onChange={onChange}
                    className="w-full p-2 border rounded"
                    min={1} // Cambiado de 1 a 2
                    placeholder="Ej: 1, 2, 3..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1 font-medium">Fecha de partida</label>
                  <input
                    type="date"
                    name="fecha"
                    value={actividad.fecha}
                    onChange={onChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="sm:col-span-2"> {/* Nuevo campo Fecha de Término */}
                  <label className="block mb-1 font-medium">Fecha de término</label>
                  <input
                    type="date"
                    name="fecha_termino"
                    value={actividad.fecha_termino}
                    onChange={onChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* -------------------------- Selección de días y horarios -------------------------- */}
          <section className="bg-white rounded shadow p-4">
            <h3 className="text-xl font-semibold mb-3 text-center">
              Elige los días de la semana y sus horarios
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {diasSemana.map((dia, index) => (
                <div key={dia} className="flex flex-col border rounded p-3">
                  <label className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={actividad.dias_seleccionados?.[index] || false}
                      onChange={(e) =>
                        handleDiaSeleccionado(index, e.target.checked)
                      }
                      className="mr-2"
                    />
                    <span className="font-medium">{dia}</span>
                  </label>

                  {actividad.dias_seleccionados?.[index] && (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium">
                          Hora inicio
                        </label>
                        <input
                          type="time"
                          value={actividad.horarios_por_dia[index]?.[0] || ""}
                          onChange={(e) => handleHorarioChange(index, 0, e)}
                          className="w-full p-1 border rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Hora fin</label>
                        <input
                          type="time"
                          value={actividad.horarios_por_dia[index]?.[1] || ""}
                          onChange={(e) => handleHorarioChange(index, 1, e)}
                          className="w-full p-1 border rounded text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Mensajes de error / éxito */}
          {error && (
            <p className="text-red-600 bg-red-100 p-2 rounded">{error}</p>
          )}
          {success && (
            <p className="text-green-600 bg-green-100 p-2 rounded">{success}</p>
          )}

          {/* Botones finales */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Actividad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
