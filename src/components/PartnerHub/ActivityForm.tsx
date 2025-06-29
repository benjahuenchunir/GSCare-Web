import { ChangeEvent, FormEvent, useState, useEffect, useRef } from "react";
import ModalConfirmarPublicacion from "../Servicios/Resenas/ModalConfirmarPublicacion";

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
  imagenFile?: File | null; // NUEVO
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
  imagenFile, // NUEVO
}: ActivityFormProps) {
  const [sinLimiteCapacidad, setSinLimiteCapacidad] = useState(false);
  const categorias = ["Salud", "Recreación", "Tecnología", "Cultura", "Deportes", "otros"];
  const [categoriaOtra, setCategoriaOtra] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

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
    setSinLimiteCapacidad(
      actividad.capacidad_total === 999999 ||
      actividad.capacidad_total === null ||
      actividad.capacidad_total === undefined
    );
  }, [actividad.capacidad_total]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  // NUEVO: tipo de imagen (archivo o url)
  const [tipoImagen, setTipoImagen] = useState<'archivo' | 'url'>(
    actividad.imagen && actividad.imagen.startsWith('http') ? 'url' : 'archivo'
  );
  // NUEVO: Vista previa de imagen seleccionada
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    if (tipoImagen === 'archivo' && imagenFile) {
      const url = URL.createObjectURL(imagenFile);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (tipoImagen === 'url' && actividad.imagen) {
      setPreviewUrl(actividad.imagen);
      return undefined;
    } else {
      setPreviewUrl(null);
      return undefined;
    }
  }, [imagenFile, actividad.imagen, tipoImagen]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-md p-6 space-y-6 max-h-[90vh] overflow-y-auto relative">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          aria-label="Cerrar"
        >
          &times;
        </button>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#00495C]">Crear Actividad</h2>
        </div>

        <div className="bg-[#E0F2F1] rounded-xl px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="text-[#00495C] text-sm sm:text-base">
            <strong>¿Tu actividad dura más de un día?</strong><br />
            Puedes repetirla en varios días o semanas.
          </div>
          <button
            type="button"
            onClick={onSwitchToRecurrente}
            className="bg-[#009982] hover:bg-[#007b6d] text-white font-semibold px-6 py-2 rounded-lg text-sm transition"
          >
            Repetir actividad →
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <form
            ref={formRef}
            onSubmit={handleFormSubmit}
            className="flex flex-col space-y-5 min-w-0"
          >
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Imagen (opcional)</label>
              {/* NUEVO: Selector de tipo de imagen */}
              <div className="flex gap-4 mb-2">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="tipoImagen"
                    value="archivo"
                    checked={tipoImagen === "archivo"}
                    onChange={() => setTipoImagen("archivo")}
                  />
                  Archivo
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="tipoImagen"
                    value="url"
                    checked={tipoImagen === "url"}
                    onChange={() => setTipoImagen("url")}
                  />
                  URL
                </label>
              </div>
              {tipoImagen === "archivo" ? (
                <input
                  type="file"
                  name="imagen"
                  accept="image/*"
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              ) : (
                <input
                  type="text"
                  name="imagen"
                  value={actividad.imagen || ""}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              )}
              {/* Vista previa */}
              {previewUrl && (
                <div className="mt-2">
                  <img src={previewUrl} alt="Vista previa" className="max-h-40 rounded-lg" />
                </div>
              )}
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
                      onChange({ target: { name: "capacidad_total", value: 999999 } } as any);
                    } else {
                      onChange({ target: { name: "capacidad_total", value: "" } } as any);
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
                className={`w-full border rounded-lg px-3 py-2 ${sinLimiteCapacidad ? "bg-gray-100 text-gray-400" : ""}`}
                placeholder={sinLimiteCapacidad ? "Sin límite" : "Ej: 20"}
                disabled={sinLimiteCapacidad}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                type="button"
                onClick={onCancel}
                className="bg-[#FF4D4F] hover:bg-[#d32f2f] text-white px-6 py-3 rounded-lg font-semibold text-lg transition"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#009982] hover:bg-[#007b6d] text-white rounded-lg font-semibold text-lg transition px-6 py-3"
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear Actividad"}
              </button>
            </div>
          </form>

          {/* Vista previa siempre visible */}
          <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl shadow-inner p-6 space-y-4">
            <h2 className="text-xl font-bold text-[#00495C] mb-4 text-center">Vista previa de la actividad</h2>

            <div className="flex flex-col-reverse md:flex-row items-stretch gap-6">
              <div className="flex-1 flex flex-col justify-start text-center md:text-left pt-4">
                <h1 className="font-poppins font-bold text-[1.8em] text-[#006881] leading-snug mb-4">
                  {actividad.nombre || <span className="text-gray-400">[Nombre de la actividad]</span>}
                </h1>
                <p className="text-gray-700 leading-relaxed">
                  {actividad.descripcion || <span className="text-gray-400">[Descripción]</span>}
                </p>
              </div>
              {actividad.imagen && (
                <div className="flex-1 flex justify-center">
                  <img
                    src={previewUrl || undefined}
                    alt={`Imagen de ${actividad.nombre}`}
                    className="self-center max-h-[250px] w-auto rounded-xl object-contain"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold text-[#00495C] mb-2">Modalidad</h3>
                {actividad.modalidad === "presencial" ? (
                  <>
                    <p><strong>Lugar:</strong> {actividad.lugar || <span className="text-gray-400">[Lugar]</span>}</p>
                    <p><strong>Comuna:</strong> {actividad.comuna || <span className="text-gray-400">[Comuna]</span>}</p>
                  </>
                ) : (
                  <p><strong>Link:</strong> <span className="text-blue-700 break-all">{generarLinkSimulado(actividad.nombre || "actividad")}</span></p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold text-[#00495C] mb-2">Fechas and Horarios</h3>
                {actividad.fecha ? (
                  <p>{formatearFecha(actividad.fecha)} — {actividad.hora_inicio?.slice(0, 5)} a {actividad.hora_final?.slice(0, 5)}</p>
                ) : (
                  <span className="text-gray-400">[Fecha y horario]</span>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="bg-gray-100 rounded-md px-3 py-1 text-sm text-gray-800 font-medium">
                  Categoría: {actividad.categoria === "otros" ? categoriaOtra || "[Otra]" : actividad.categoria || "[Categoría]"}
                </div>
                <div className="bg-gray-100 rounded-md px-3 py-1 text-sm text-gray-800 font-medium">
                  Capacidad: {sinLimiteCapacidad || actividad.capacidad_total === 999999
                    ? "Sin límite"
                    : actividad.capacidad_total || "[Capacidad]"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ModalConfirmarPublicacion
          open={showConfirmModal}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setShowConfirmModal(false);
            onSubmit(new Event("submit") as any);
          }}
          titulo="¿Confirmar publicación de actividad?"
          mensaje="Estás a punto de publicar tu actividad, que será revisado por nuestros administradores. Esta acción será visible para otros usuarios y no podrá ser editada."
        />
      </div>
    </div>
  );
}

