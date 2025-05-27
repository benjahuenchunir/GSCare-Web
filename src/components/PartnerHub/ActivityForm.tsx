import React, { ChangeEvent, FormEvent } from "react";

export interface ActividadForm {
  nombre: string;
  descripcion: string;
  lugar: string;
  comuna: string;
  fecha: string;
  hora_inicio: string;
  hora_final: string;
}

interface Props {
  actividad: ActividadForm;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  error: string;
  success: string;
  onCancel: () => void;
}

export default function ActivityForm({
  actividad,
  onChange,
  onSubmit,
  loading,
  error,
  success,
  onCancel,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-2 text-lg max-h-[70vh] w-full"
  >
    <h2 className="text-2xl font-bold mb-2">Crear Actividad</h2>
    <label className="text-left font-semibold" htmlFor="nombre_actividad">
      Nombre de la actividad
    </label>
    <input
      id="nombre_actividad"
      name="nombre"
      value={actividad.nombre}
      onChange={onChange}
      placeholder="Ingrese el nombre de la actividad"
      className="border p-2 rounded"
    />
    <label className="text-left font-semibold" htmlFor="descripcion_actividad">
      Descripción de la actividad
    </label>
    <textarea
      id="descripcion_actividad"
      name="descripcion"
      value={actividad.descripcion}
      onChange={onChange}
      placeholder="Ingrese la descripción de la actividad"
      className="border p-2 rounded"
      rows={2}
    />
    <div className="flex gap-2">
      <div className="flex-1 flex flex-col">
        <label className="text-left font-semibold" htmlFor="lugar_actividad">
          Lugar
        </label>
        <input
          id="lugar_actividad"
          name="lugar"
          value={actividad.lugar}
          onChange={onChange}
          placeholder="Ingrese el lugar de la actividad"
          className="border p-2 rounded"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <label className="text-left font-semibold" htmlFor="comuna_actividad">
          Comuna
        </label>
        <input
          id="comuna_actividad"
          name="comuna"
          value={actividad.comuna}
          onChange={onChange}
          placeholder="Ingrese la comuna de la actividad"
          className="border p-2 rounded"
        />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="flex-1 flex flex-col">
        <label className="text-left font-semibold" htmlFor="fecha_actividad">
          Fecha
        </label>
        <input
          id="fecha_actividad"
          type="date"
          name="fecha"
          value={actividad.fecha}
          onChange={onChange}
          className="border p-2 rounded"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <label className="text-left font-semibold" htmlFor="hora_inicio_actividad">
          Hora Inicio
        </label>
        <input
          id="hora_inicio_actividad"
          type="time"
          name="hora_inicio"
          value={actividad.hora_inicio}
          onChange={onChange}
          className="border p-2 rounded"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <label className="text-left font-semibold" htmlFor="hora_final_actividad">
          Hora Final
        </label>
        <input
          id="hora_final_actividad"
          type="time"
          name="hora_final"
          value={actividad.hora_final}
          onChange={onChange}
          className="border p-2 rounded"
        />
      </div>
    </div>
    {error && <div className="text-red-500 mt-2">{error}</div>}
    {success && <div className="text-green-600 mt-2">{success}</div>}
    <div className="flex gap-2 mt-2">
      <button
        type="submit"
        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? "Creando..." : "Crear"}
      </button>
      <button
        type="button"
        className="flex-1 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
        onClick={onCancel}
      >
        Volver
      </button>
    </div>
    </form>
  );
}
