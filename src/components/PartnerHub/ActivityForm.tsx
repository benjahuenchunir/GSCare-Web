import { ChangeEvent, FormEvent, useState, useEffect } from "react";
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
  capacidad_total: number;
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
  const [showPreview, setShowPreview] = useState(false);
  const [sinLimiteCapacidad, setSinLimiteCapacidad] = useState(false);
  const categorias = ["Salud", "Recreación", "Tecnología", "Cultura", "Deportes", "otros"];
  const [categoriaOtra, setCategoriaOtra] = useState("");

  const generarLinkSimulado = (nombre: string) => {
    const random = "XXXXXXX";
    const slug = nombre.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
    return `https://meet.jit.si/${slug}-${random}`;
  };

  const handleCategoriaChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "categoria" && value !== "otros") {
      setCategoriaOtra("");
    }
    onChange(e);
  };

  // Bloquear scroll del fondo cuando el modal está abierto
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  // --- Vista previa similar a activityPage ---
  const formatearFecha = (fecha: string) => {
    if (!fecha) return "";
    const [a, m, d] = fecha.split("-");
    const meses = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    return `${parseInt(d)} de ${meses[parseInt(m) - 1]} de ${a}`;
  };

  useEffect(() => {
    // Si la capacidad es 999999, marcar el checkbox
    setSinLimiteCapacidad(
      actividad.capacidad_total === 999999 ||
      actividad.capacidad_total === null ||
      actividad.capacidad_total === undefined
    );
  }, [actividad.capacidad_total]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-md p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#00495C]">Crear Actividad</h2>
          <button
            type="button"
            onClick={onSwitchToRecurrente}
            className="text-[#7E22CE] hover:underline text-sm font-medium"
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" /> Repetir
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Formulario */}
          <form
            onSubmit={onSubmit}
            className="flex-1 space-y-5 min-w-0"
            style={{ minWidth: 0 }}
          >
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={actividad.nombre}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Título de la actividad"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
                <select
                  name="categoria"
                  value={actividad.categoria || ""}
                  onChange={handleCategoriaChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                  ))}
                </select>
                {actividad.categoria === "otros" && (
                  <input
                    type="text"
                    name="categoria"
                    value={categoriaOtra}
                    onChange={(e) => {
                      setCategoriaOtra(e.target.value);
                      onChange(e);
                    }}
                    className="w-full mt-2 border rounded-lg px-3 py-2"
                    placeholder="Ej: Manualidades"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={actividad.descripcion}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Breve descripción de la actividad"
                  rows={3}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Imagen (opcional)</label>
              <input
                type="url"
                name="imagen"
                value={actividad.imagen || ""}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Modalidad</label>
                <select
                  name="modalidad"
                  value={actividad.modalidad}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="presencial">Presencial</option>
                  <option value="online">Online</option>
                </select>
              </div>

              {actividad.modalidad === "presencial" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Lugar</label>
                    <input
                      type="text"
                      name="lugar"
                      value={actividad.lugar || ""}
                      onChange={onChange}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="Ej: Centro"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Comuna</label>
                    <input
                      type="text"
                      name="comuna"
                      value={actividad.comuna || ""}
                      onChange={onChange}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="Ej: San Joaquín"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  value={actividad.fecha}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Hora inicio</label>
                <input
                  type="time"
                  name="hora_inicio"
                  value={actividad.hora_inicio}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Hora final</label>
                <input
                  type="time"
                  name="hora_final"
                  value={actividad.hora_final}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Capacidad total</label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="sinLimite"
                  checked={sinLimiteCapacidad}
                  onChange={() => {
                    const nuevoSinLimite = !sinLimiteCapacidad;
                    setSinLimiteCapacidad(nuevoSinLimite);
                    if (nuevoSinLimite) {
                      // Si está activado, enviar 999999
                      onChange({
                        target: { name: "capacidad_total", value: 999999 },
                      } as any);
                    } else {
                      // Si se desactiva, poner vacío
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
                  // Si el usuario borra el valor, enviar 999999
                  onChange({
                    target: {
                      name: "capacidad_total",
                      value: e.target.value === "" ? 999999 : Number(e.target.value)
                    }
                  } as any);
                }}
                className={`w-full border rounded-lg px-3 py-2 ${sinLimiteCapacidad ? "bg-gray-100 text-gray-400" : ""}`}
                placeholder={sinLimiteCapacidad ? "Sin límite" : "Ej: 20"}
                disabled={sinLimiteCapacidad}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                type="button"
                onClick={onCancel}
                className="bg-[#FF4D4F] hover:bg-[#d32f2f] text-white px-8 py-3 rounded-lg font-semibold text-lg transition w-48 h-16 flex items-center justify-center"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => setShowPreview((v) => !v)}
                className={`rounded-lg font-semibold text-lg transition w-48 h-16 flex items-center justify-center
                  ${showPreview
                    ? "bg-[#141A2A] text-white"
                    : "bg-[#141A2A] text-white"}
                  hover:bg-[#232b3e]`}
              >
                {showPreview ? "Ocultar vista previa" : "Vista previa"}
              </button>
              <button
                type="submit"
                className="bg-[#009982] hover:bg-[#007b6d] text-white rounded-lg font-semibold text-lg transition w-48 h-16 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear Actividad"}
              </button>
            </div>
          </form>

          {/* Vista previa */}
          {showPreview && (
            <div className="flex-1 min-w-0 max-w-lg">
              {/* Simula la vista de activityPage */}
              <div className="flex flex-col-reverse md:flex-row items-stretch gap-8 p-6 bg-white rounded-2xl shadow mb-8">
                <div className="flex-1 flex flex-col justify-start text-center md:text-left pt-6">
                  <h1
                    className="font-poppins font-bold text-[2em] text-cyan-900 mb-8 leading-snug"
                    style={{ color: "#006881" }}
                  >
                    {actividad.nombre || <span className="text-gray-400">[Nombre de la actividad]</span>}
                  </h1>
                  <p
                    className="font-poppins font-normal text-[1em] text-gray-700 leading-relaxed"
                    style={{ color: "#4B5563" }}
                  >
                    {actividad.descripcion || <span className="text-gray-400">[Descripción]</span>}
                  </p>
                </div>
                {actividad.imagen && (
                  <div className="flex-1 flex justify-center h-full">
                    <img
                      src={actividad.imagen}
                      alt={`Imagen de ${actividad.nombre}`}
                      className="self-center max-h-[300px] w-auto rounded-xl object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Modalidad */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="font-bold text-[1.2em] text-[#00495C] mb-4">
                    Modalidad
                  </h2>
                  {actividad.modalidad === "presencial" ? (
                    <div className="grid grid-cols-1 gap-4 text-gray-800">
                      <div>
                        <h3 className="font-semibold">Lugar</h3>
                        <p>{actividad.lugar || <span className="text-gray-400">[Lugar]</span>}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Comuna</h3>
                        <p>{actividad.comuna || <span className="text-gray-400">[Comuna]</span>}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-800">
                      <h3 className="font-semibold">Link de acceso</h3>
                      <span className="text-blue-700 break-all">
                        {generarLinkSimulado(actividad.nombre || "actividad")}
                      </span>
                    </div>
                  )}
                </div>
                {/* Fechas y horarios */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="font-bold text-[1.2em] text-[#00495C] mb-4">
                    Fechas y Horarios
                  </h2>
                  <ul className="list-disc list-inside text-gray-800 space-y-1">
                    <li>
                      {actividad.fecha
                        ? `${formatearFecha(actividad.fecha)} — ${actividad.hora_inicio?.slice(0, 5)} a ${actividad.hora_final?.slice(0, 5)}`
                        : <span className="text-gray-400">[Fecha y horario]</span>
                      }
                    </li>
                  </ul>
                </div>
              </div>

              {/* Categoría y capacidad */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-800 font-semibold">
                  Categoría:{" "}
                  {actividad.categoria === "otros"
                    ? categoriaOtra || <span className="text-gray-400">[Otra]</span>
                    : actividad.categoria || <span className="text-gray-400">[Categoría]</span>
                  }
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-800 font-semibold">
                  Capacidad:{" "}
                  {sinLimiteCapacidad || actividad.capacidad_total === 999999
                    ? "Sin límite"
                    : actividad.capacidad_total || <span className="text-gray-400">[Capacidad]</span>
                  }
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

