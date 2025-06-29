import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ModalConfirmarPublicacion from "../Servicios/Resenas/ModalConfirmarPublicacion";

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
  imagenFile?: File | null; // NUEVO
}

export default function RecurrentActivityForm({
  actividad,
  onChange,
  onSubmit,
  loading,
  error,
  success,
  onCancel,
  onSwitchToUnique,
  imagenFile, // NUEVO
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

  // NUEVO: categorías y lógica para "otros"
  const categorias = ["Salud", "Recreación", "Tecnología", "Cultura", "Deportes", "otros"];
  const [categoriaOtra, setCategoriaOtra] = useState(
    actividad.categoria && !categorias.map(c => c.toLowerCase()).includes((actividad.categoria || "").toLowerCase())
      ? actividad.categoria
      : ""
  );

  const handleCategoriaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (value !== "otros") {
      setCategoriaOtra("");
    }
    onChange({ target: { name, value } } as any);
  };

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

  // NUEVO: Estado para mostrar el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // NUEVO: Handler para submit que muestra el modal
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  // NUEVO: Confirmar publicación
  const handleConfirmPublicar = () => {
    setShowConfirmModal(false);
    // Llama al onSubmit real
    onSubmit(new Event("submit") as any);
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
      return () => URL.revokeObjectURL(url);
    } else if (tipoImagen === 'url' && actividad.imagen) {
      setPreviewUrl(actividad.imagen);
      return undefined;
    } else {
      setPreviewUrl(null);
      return undefined;
    }
  }, [imagenFile, actividad.imagen, tipoImagen]);

  // --- Vista previa helpers ---
  const formatearFecha = (fecha: string) => {
    if (!fecha) return "";
    const [a, m, d] = fecha.split("-");
    const meses = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    return `${parseInt(d)} de ${meses[parseInt(m) - 1]} de ${a}`;
  };

  // Generar lista de fechas y horarios seleccionados
  const fechasHorarios = diasSemana
    .map((dia, idx) => {
      if (actividad.dias_seleccionados?.[idx] && actividad.horarios_por_dia?.[idx]?.[0] && actividad.horarios_por_dia?.[idx]?.[1]) {
        return {
          dia,
          hora_inicio: actividad.horarios_por_dia[idx][0],
          hora_final: actividad.horarios_por_dia[idx][1],
        };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-md p-6 space-y-6 max-h-[90vh] overflow-y-auto relative">
        <div className="flex justify-between items-center mb-4 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#009982]">Crear Actividad Recurrente</h2>
          <button
            onClick={onSwitchToUnique}
            className="flex items-center text-[#006E5E] hover:underline text-base md:text-lg font-medium"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Volver
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-8 min-h-0 flex-1">
          {/* Formulario */}
          <form onSubmit={handleFormSubmit} className="space-y-4 md:space-y-8 min-w-0 flex-1 overflow-y-auto max-h-[65vh] pr-1">
            {/* INFORMACIÓN BÁSICA */}
            <section className="bg-white p-4 md:p-6 rounded-xl shadow border border-gray-200">
              <h3 className="text-xl md:text-2xl font-semibold text-[#009982] mb-2 md:mb-4">Información básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                  <select
                    name="categoria"
                    value={
                      actividad.categoria === "otros" || (actividad.categoria && !categorias.map(c => c.toLowerCase()).includes(actividad.categoria.toLowerCase()))
                        ? "otros"
                        : actividad.categoria || ""
                    }
                    onChange={handleCategoriaChange}
                    className="w-full border rounded-xl py-3 px-4 text-lg focus:ring-2 focus:ring-[#62CBC9] outline-none"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                    ))}
                  </select>
                  {(actividad.categoria === "otros" || (actividad.categoria && !categorias.map(c => c.toLowerCase()).includes(actividad.categoria.toLowerCase()))) && (
                    <input
                      type="text"
                      name="categoria_otra"
                      value={categoriaOtra}
                      onChange={e => {
                        setCategoriaOtra(e.target.value);
                        onChange({ target: { name: "categoria", value: e.target.value } } as any);
                      }}
                      className="w-full mt-2 border rounded-xl py-3 px-4 text-lg"
                      placeholder="Ej: Manualidades"
                    />
                  )}
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
                      className="w-full border rounded-xl py-3 px-4 text-lg focus:ring-2 focus:ring-[#62CBC9] outline-none"
                    />
                  ) : (
                    <input
                      type="text"
                      name="imagen"
                      value={actividad.imagen || ""}
                      onChange={onChange}
                      className="w-full border rounded-xl py-3 px-4 text-lg"
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
              </div>
            </section>

            {/* LOGÍSTICA */}
            <section className="bg-white p-4 md:p-6 rounded-xl shadow border border-gray-200">
              <h3 className="text-xl md:text-2xl font-semibold text-[#009982] mb-2 md:mb-4">Logística y ubicación</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
            <section className="bg-white p-4 md:p-6 rounded-xl shadow border border-gray-200">
              <h3 className="text-xl md:text-2xl font-semibold text-[#009982] mb-2 md:mb-4">Frecuencia de repetición</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-lg font-medium mb-1">
                    ¿Cada cuántas semanas se repite?
                  </label>
                  <input
                    type="number"
                    name="semanas_recurrencia"
                    min={1}
                    value={actividad.semanas_recurrencia}
                    onChange={onChange}
                    className="w-full border rounded-xl py-3 px-4 text-lg focus:ring-2 focus:ring-[#62CBC9] outline-none"
                    placeholder="Ej: 2 para cada 2 semanas"
                  />
                  <span className="text-[1.2em] text-gray-800">
                    Ejemplo: 1 = todas las semanas, 2 = cada dos semanas, etc.
                  </span>
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
                />
              </div>
              </div>
            </section>

            {/* DÍAS Y HORARIOS */}
            <section className="bg-white p-4 md:p-6 rounded-xl shadow border border-gray-200">
              <h3 className="text-xl md:text-2xl font-semibold text-[#009982] mb-4 text-center">Selecciona los días y horarios</h3>
              <div className="flex flex-wrap gap-3 md:gap-6 justify-center">
              {diasSemana.map((dia, index) => (
                <div key={dia} className="border p-4 rounded-xl flex flex-col items-center min-w-[180px]">
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
                  <div className="flex gap-2 items-end w-full">
                  <div className="flex flex-col flex-1">
                    <label className="text-sm mb-1">Inicio</label>
                    <input
                    type="time"
                    value={actividad.horarios_por_dia[index]?.[0] || ""}
                    onChange={(e) => handleHorarioChange(index, 0, e)}
                    className="border rounded-lg py-2 px-3 text-sm w-full"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="text-sm mb-1">Fin</label>
                    <input
                    type="time"
                    value={actividad.horarios_por_dia[index]?.[1] || ""}
                    onChange={(e) => handleHorarioChange(index, 1, e)}
                    className="border rounded-lg py-2 px-3 text-sm w-full"
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
            <div className="flex justify-end gap-2 md:gap-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="bg-[#FF8D6B] hover:bg-[#CD4422] text-white font-semibold py-3 px-6 rounded-xl text-lg transition w-48 h-16 flex items-center justify-center"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#009982] hover:bg-[#006E5E] text-white font-semibold py-3 px-6 rounded-xl text-lg transition w-48 h-16 flex items-center justify-center"
              >
                {loading ? "Creando..." : "Crear Actividad"}
              </button>
            </div>
          </form>

          {/* Vista previa */}
          <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl shadow-inner p-4 md:p-6 space-y-3 md:space-y-4 flex-1 min-w-0 overflow-y-auto max-h-[65vh]">
            <h2 className="text-lg md:text-xl font-bold text-[#00495C] mb-2 md:mb-4 text-center">Vista previa de la actividad</h2>
            <div className="flex flex-col-reverse md:flex-row items-stretch gap-4 md:gap-6">
              <div className="flex-1 flex flex-col justify-start text-center md:text-left pt-2 md:pt-4">
                <h1 className="font-poppins font-bold text-[1.2em] md:text-[1.8em] text-[#006881] leading-snug mb-2 md:mb-4">
                  {actividad.nombre || <span className="text-gray-400">[Nombre de la actividad]</span>}
                </h1>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  {actividad.descripcion || <span className="text-gray-400">[Descripción]</span>}
                </p>
              </div>
              {actividad.imagen && (
                <div className="flex-1 flex justify-center">
                  <img
                    src={previewUrl || undefined}
                    alt={`Imagen de ${actividad.nombre}`}
                    className="self-center max-h-[120px] md:max-h-[200px] w-auto rounded-xl object-contain"
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2 md:gap-4">
              <div className="bg-white rounded-lg shadow p-2 md:p-4">
                <h3 className="font-bold text-[#00495C] mb-1 md:mb-2">Modalidad</h3>
                {actividad.modalidad === "presencial" ? (
                  <>
                    <p className="text-sm md:text-base"><strong>Lugar:</strong> {actividad.lugar || <span className="text-gray-400">[Lugar]</span>}</p>
                    <p className="text-sm md:text-base"><strong>Comuna:</strong> {actividad.comuna || <span className="text-gray-400">[Comuna]</span>}</p>
                  </>
                ) : (
                  <p className="text-sm md:text-base"><strong>Link:</strong> <span className="text-blue-700 break-all">[Será generado automáticamente]</span></p>
                )}
              </div>
              <div className="bg-white rounded-lg shadow p-2 md:p-4">
                <h3 className="font-bold text-[#00495C] mb-1 md:mb-2">Fechas and Horarios</h3>
                {actividad.fecha && actividad.fecha_termino ? (
                  <p className="text-sm md:text-base">
                    <span className="font-semibold">Desde:</span> {formatearFecha(actividad.fecha)}<br />
                    <span className="font-semibold">Hasta:</span> {formatearFecha(actividad.fecha_termino)}
                  </p>
                ) : (
                  <span className="text-gray-400 text-sm">[Rango de fechas]</span>
                )}
                <ul className="mt-1 md:mt-2 list-disc list-inside text-gray-700 text-sm md:text-base">
                  {fechasHorarios.length > 0 ? fechasHorarios.map((fh: any, idx: number) => (
                    <li key={idx}>
                      {fh.dia}: {fh.hora_inicio} a {fh.hora_final}
                    </li>
                  )) : (
                    <li className="text-gray-400">[Selecciona días y horarios]</li>
                  )}
                </ul>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <div className="bg-gray-100 rounded-md px-2 md:px-3 py-1 text-xs md:text-sm text-gray-800 font-medium">
                  Categoría: {actividad.categoria || "[Categoría]"}
                </div>
                <div className="bg-gray-100 rounded-md px-2 md:px-3 py-1 text-xs md:text-sm text-gray-800 font-medium">
                  Capacidad: {sinLimiteCapacidad || actividad.capacidad_total === 999999
                    ? "Sin límite"
                    : actividad.capacidad_total || "[Capacidad]"}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* NUEVO: Modal de confirmación */}
        <ModalConfirmarPublicacion
          open={showConfirmModal}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmPublicar}
          titulo="¿Confirmar publicación de actividad?"
          mensaje="Estás a punto de publicar tu actividad, que será revisado por nuestras administradoras. Esta acción será visible para otros usuarios y no podrá ser editada."
        />
      </div>
    </div>
  );
}
