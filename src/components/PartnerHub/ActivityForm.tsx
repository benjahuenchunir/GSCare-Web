import React, { ChangeEvent, FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

export interface ActividadForm {
  nombre: string;
  descripcion: string;
  modalidad: string;
  lugar?: string;
  comuna?: string;
  fecha: string;
  hora_inicio: string;
  hora_final: string;
  imagen?: string;
  categoria?: string;
}

interface ActivityFormProps {
  actividad: ActividadForm;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  loading: boolean;
  error: string;
  success: string;
  onSwitchToRecurrente: () => void;
}

export default function ActivityForm({
  actividad,
  onChange,
  onSubmit,
  onCancel,
  loading,
  error,
  success,
  onSwitchToRecurrente,
}: ActivityFormProps) {
  return (
    <div className="flex flex-col gap-3 text-base w-full p-3 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex-1 text-center">
          Crear Actividad
        </h2>
        <button
          type="button"
          onClick={onSwitchToRecurrente}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition"
          title="Cambiar a actividad recurrente"
        >
          <FontAwesomeIcon icon={faCalendarAlt} className="w-5 h-5" />
          <span>Repetir</span>
        </button>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 font-bold text-left">
              Nombre de la actividad
            </label>
            <input
              type="text"
              name="nombre"
              value={actividad.nombre}
              onChange={onChange}
              className="w-full p-2 border rounded"
              placeholder="Nombre de la actividad"
              maxLength={255}
            />
          </div>
          <div>
            <label className="block mb-1 font-bold text-left">Categoría</label>
            <input
              type="text"
              name="categoria"
              value={actividad.categoria || ""}
              onChange={onChange}
              className="w-full p-2 border rounded"
              placeholder="Categoría"
              maxLength={255}
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-bold text-left">Descripción</label>
          <textarea
            name="descripcion"
            value={actividad.descripcion}
            onChange={onChange}
            className="w-full p-2 border rounded"
            rows={2}
            placeholder="Descripción de la actividad"
            maxLength={255}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block mb-1 font-bold text-left">Modalidad</label>
            <select
              name="modalidad"
              value={actividad.modalidad}
              onChange={onChange}
              className="w-full p-2 border rounded"
            >
              <option value="presencial">Presencial</option>
              <option value="online">Online</option>
              <option value="hibrido">Híbrido</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-bold text-left">Lugar</label>
            <input
              type="text"
              name="lugar"
              value={actividad.lugar || ""}
              onChange={onChange}
              className="w-full p-2 border rounded"
              placeholder="Lugar"
              maxLength={255}
            />
          </div>
          <div>
            <label className="block mb-1 font-bold text-left">Comuna</label>
            <input
              type="text"
              name="comuna"
              value={actividad.comuna || ""}
              onChange={onChange}
              className="w-full p-2 border rounded"
              placeholder="Comuna"
              maxLength={255}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block mb-1 font-bold text-left">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={actividad.fecha}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-bold text-left">
              Hora inicio
            </label>
            <input
              type="time"
              name="hora_inicio"
              value={actividad.hora_inicio}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-bold text-left">Hora final</label>
            <input
              type="time"
              name="hora_final"
              value={actividad.hora_final}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-bold text-left">
            URL de imagen (opcional)
          </label>
          <input
            type="url"
            name="imagen"
            value={actividad.imagen || ""}
            onChange={onChange}
            className="w-full p-2 border rounded"
            placeholder="https://ejemplo.com/imagen.jpg"
            maxLength={255}
          />
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}

        <div className="flex justify-between mt-4">
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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear Actividad"}
          </button>
        </div>
      </form>
    </div>
  );
}
