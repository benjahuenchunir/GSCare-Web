import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {
  onSuccess: () => void;
}

interface Beneficio {
  id: number;
  nombre: string;
}

const initialServiceState = {
  nombre: "",
  descripcion: "",
  prestador_del_servicio: "",
  direccion_principal_del_prestador: "",
  telefono_de_contacto: "",
  email_de_contacto: "",
  hora_inicio: "",
  hora_termino: "",
  hace_domicilio: false,
  comunas_a_las_que_hace_domicilio: "",
  imagen: "",
  semanas_recurrencia: 1,
  correo_proveedor: "",
};

type Bloque = {
  fecha: string;
  hora_inicio: string;
  hora_termino: string;
  repetir: boolean;
  semanas_recurrencia: number;
};

export default function CreateServiceForm({ onSuccess }: Props) {
  const { getAccessTokenSilently } = useAuth0();
  const [nuevoServicio, setNuevoServicio] = useState(initialServiceState);
  const [bloques, setBloques] = useState<Bloque[]>([
    { fecha: "", hora_inicio: "", hora_termino: "", repetir: false, semanas_recurrencia: 1 }
  ]);
  const [beneficiosDisponibles, setBeneficiosDisponibles] = useState<Beneficio[]>([]);
  const [selectedBeneficios, setSelectedBeneficios] = useState<number[]>([]);
  const [errors, setErrors] = useState<{
    nombre?: string;
    descripcion?: string;
    prestador?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    correo_proveedor?: string;
    comunas?: string;
    imagen?: string;
    hora_inicio?: string;
    hora_termino?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false); // Nuevo estado para evitar doble submit

  useEffect(() => {
    const fetchBeneficios = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/beneficios`);
        const data = await res.json();
        setBeneficiosDisponibles(data);
      } catch (error) {
        console.error("Error al cargar beneficios:", error);
      }
    };
    fetchBeneficios();
  }, []);

  const toggleBeneficio = (id: number) => {
    setSelectedBeneficios(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const handleBloqueChange = (index: number, field: keyof Bloque, value: string | number | boolean) => {
    const nuevos = [...bloques];
    nuevos[index] = { ...nuevos[index], [field]: value };
    setBloques(nuevos);
  };

  const agregarBloque = () => {
    setBloques([...bloques, { fecha: "", hora_inicio: "", hora_termino: "", repetir: false, semanas_recurrencia: 1 }]);
  };

  const eliminarBloque = (index: number) => {
    setBloques(bloques.filter((_, i) => i !== index));
  };

  const normalizarHora = (hora: string) => {
    return hora.length === 5 ? `${hora}:00` : hora;
  };

  const obtenerDiasDisponibles = (bloques: Bloque[]) => {
    const dias = new Set<number>();
    bloques.forEach(b => {
      const fecha = new Date(b.fecha);
      const diaSemana = fecha.getUTCDay();
      dias.add(diaSemana);
    });
    return Array.from(dias).sort().join(",");
  };

  const expandirBloquesConRepeticion = (bloques: Bloque[]) => {
    const resultado: { fecha: string; hora_inicio: string; hora_termino: string }[] = [];
    bloques.forEach(b => {
      const fechaBase = new Date(b.fecha);
      const repeticiones = b.repetir ? b.semanas_recurrencia : 1;
      for (let i = 0; i < repeticiones; i++) {
        const fechaNueva = new Date(fechaBase);
        fechaNueva.setDate(fechaBase.getDate() + i * 7);
        const fechaStr = fechaNueva.toISOString().split("T")[0];
        resultado.push({ fecha: fechaStr, hora_inicio: normalizarHora(b.hora_inicio), hora_termino: normalizarHora(b.hora_termino) });
      }
    });
    return resultado;
  };

  // Validación visual para todos los campos
  const validateFields = () => {
    const errs: typeof errors = {};
    if (!nuevoServicio.nombre.trim()) errs.nombre = "El nombre es obligatorio";
    if (!nuevoServicio.descripcion.trim()) errs.descripcion = "La descripción es obligatoria";
    if (!nuevoServicio.prestador_del_servicio.trim()) errs.prestador = "El proveedor es obligatorio";
    if (!nuevoServicio.direccion_principal_del_prestador.trim()) errs.direccion = "La dirección es obligatoria";
    if (
      !nuevoServicio.telefono_de_contacto.trim() ||
      !/^\+56\d{9}$/.test(nuevoServicio.telefono_de_contacto)
    ) {
      errs.telefono = "Formato: +569XXXXXXXX";
    }
    if (
      !nuevoServicio.email_de_contacto.trim() ||
      !/^[^@]+@[^@]+\.[^@]+$/.test(nuevoServicio.email_de_contacto)
    ) {
      errs.email = "Debe ser un email válido";
    }
    if (
      !nuevoServicio.correo_proveedor.trim() ||
      !/^[^@]+@[^@]+\.[^@]+$/.test(nuevoServicio.correo_proveedor)
    ) {
      errs.correo_proveedor = "Debe ser un email válido";
    }
    // comunas e imagen pueden ser opcionales, pero puedes validar formato si quieres
    if (
      nuevoServicio.imagen &&
      !/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(nuevoServicio.imagen)
    ) {
      errs.imagen = "Debe ser una URL de imagen válida (jpg, png, webp, gif)";
    }
    if (!nuevoServicio.hora_inicio) errs.hora_inicio = "La hora de inicio es obligatoria";
    if (!nuevoServicio.hora_termino) errs.hora_termino = "La hora de término es obligatoria";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCrearServicio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // <-- Bloquea doble submit
    if (!validateFields()) return;
    setSubmitting(true);
    try {
      const token = await getAccessTokenSilently();
      const bloquesValidos = bloques.filter(b => b.fecha && b.hora_inicio && b.hora_termino && b.hora_inicio < b.hora_termino);
      const dias_disponibles = obtenerDiasDisponibles(bloquesValidos);
      const servicioPayload = {
        ...nuevoServicio,
        dias_disponibles,
        hora_inicio: normalizarHora(nuevoServicio.hora_inicio),
        hora_termino: normalizarHora(nuevoServicio.hora_termino),
      };

      // 1. Crear el servicio
      const res = await fetch(`${import.meta.env.VITE_API_URL}/servicios`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(servicioPayload),
      });

      if (!res.ok) {
        let msg = "Error al crear el servicio";
        try {
          const err = await res.json();
          msg = err.message || msg;
        } catch {}
        throw new Error(msg);
      }
      const servicioCreado = await res.json();

      // 2. Crear bloques (solo si hay bloques)
      const bloquesExpandido = expandirBloquesConRepeticion(bloquesValidos);
      if (bloquesExpandido.length > 0) {
        const bloquesRes = await fetch(`${import.meta.env.VITE_API_URL}/servicios/${servicioCreado.id}/bloques/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ bloques: bloquesExpandido }),
        });
        if (!bloquesRes.ok) {
          let msg = "Error al crear bloques";
          try {
            const err = await bloquesRes.json();
            msg = err.message || msg;
          } catch {}
          throw new Error(msg);
        }
      }

      // 3. Asociar beneficios (solo si hay seleccionados)
      for (const id_beneficio of selectedBeneficios) {
        const beneficiosRes = await fetch(`${import.meta.env.VITE_API_URL}/beneficios/asociar`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id_servicio: servicioCreado.id, id_beneficio }),
        });
        if (!beneficiosRes.ok) {
          let msg = "Error al asociar un beneficio";
          try {
            const err = await beneficiosRes.json();
            msg = err.message || msg;
          } catch {}
          throw new Error(msg);
        }
      }

      // 4. Solo si todo fue exitoso, limpiar formulario y llamar onSuccess
      setNuevoServicio(initialServiceState);
      setBloques([{ fecha: "", hora_inicio: "", hora_termino: "", repetir: false, semanas_recurrencia: 1 }]);
      setSelectedBeneficios([]);
      onSuccess && onSuccess();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al crear el servicio");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 space-y-6">
        <h3 className="text-lg font-semibold mb-2">Crear nuevo servicio</h3>
      <form onSubmit={handleCrearServicio} className="bg-white p-8 rounded-2xl shadow-xl space-y-8 text-lg">

        <section className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block font-medium mb-1">Nombre del servicio</span>
              <input
                className={`w-full border border-gray-300 p-2 rounded-lg ${errors.nombre ? "border-red-500" : ""}`}
                value={nuevoServicio.nombre}
                onChange={e => setNuevoServicio({ ...nuevoServicio, nombre: e.target.value })}
                required
                placeholder="Ej: Kinesiología a domicilio"
              />
              {errors.nombre && <span className="text-red-600 text-sm">{errors.nombre}</span>}
            </label>
            <label className="block">
              <span className="block font-medium mb-1">Descripción</span>
              <textarea
                className={`w-full border border-gray-300 p-2 rounded-lg ${errors.descripcion ? "border-red-500" : ""}`}
                value={nuevoServicio.descripcion}
                onChange={e => setNuevoServicio({ ...nuevoServicio, descripcion: e.target.value })}
                required
                placeholder="Ej: Sesiones de kinesiología para adultos mayores"
              />
              {errors.descripcion && <span className="text-red-600 text-sm">{errors.descripcion}</span>}
            </label>
            <label className="block">
              <span className="block font-medium mb-1">Proveedor</span>
              <input
                className={`w-full border border-gray-300 p-2 rounded-lg ${errors.prestador ? "border-red-500" : ""}`}
                value={nuevoServicio.prestador_del_servicio}
                onChange={e => setNuevoServicio({ ...nuevoServicio, prestador_del_servicio: e.target.value })}
                required
                placeholder="Ej: Juan Pérez"
              />
              {errors.prestador && <span className="text-red-600 text-sm">{errors.prestador}</span>}
            </label>
            <label className="block">
              <span className="block font-medium mb-1">Dirección</span>
              <input
                className={`w-full border border-gray-300 p-2 rounded-lg ${errors.direccion ? "border-red-500" : ""}`}
                value={nuevoServicio.direccion_principal_del_prestador}
                onChange={e => setNuevoServicio({ ...nuevoServicio, direccion_principal_del_prestador: e.target.value })}
                required
                placeholder="Ej: Av. Siempre Viva 123, Santiago"
              />
              {errors.direccion && <span className="text-red-600 text-sm">{errors.direccion}</span>}
            </label>
            <label className="block">
              <span className="block font-medium mb-1">Teléfono</span>
              <input
                className={`w-full border border-gray-300 p-2 rounded-lg ${errors.telefono ? "border-red-500" : ""}`}
                value={nuevoServicio.telefono_de_contacto}
                onChange={e => setNuevoServicio({ ...nuevoServicio, telefono_de_contacto: e.target.value })}
                required
                placeholder="Ej: +56912345678"
                maxLength={12}
              />
              {errors.telefono && (
                <span className="text-red-600 text-sm">{errors.telefono}</span>
              )}
            </label>
            <label className="block">
              <span className="block font-medium mb-1">Email de contacto</span>
              <input
                className={`w-full border border-gray-300 p-2 rounded-lg ${errors.email ? "border-red-500" : ""}`}
                type="email"
                value={nuevoServicio.email_de_contacto}
                onChange={e => setNuevoServicio({ ...nuevoServicio, email_de_contacto: e.target.value })}
                required
                placeholder="Ej: ejemplo@correo.com"
              />
              {errors.email && (
                <span className="text-red-600 text-sm">{errors.email}</span>
              )}
            </label>
            <label className="block">
              <span className="block font-medium mb-1">Correo del usuario proveedor</span>
              <input
                className={`w-full border border-gray-300 p-2 rounded-lg ${errors.correo_proveedor ? "border-red-500" : ""}`}
                type="email"
                value={nuevoServicio.correo_proveedor}
                onChange={e => setNuevoServicio({ ...nuevoServicio, correo_proveedor: e.target.value })}
                required
                placeholder="Ej: proveedor@correo.com"
              />
              {errors.correo_proveedor && (
                <span className="text-red-600 text-sm">{errors.correo_proveedor}</span>
              )}
            </label>
            <label className="block">
              <span className="block font-medium mb-1">Comunas a las que hace domicilio (si aplica)</span>
              <input
                className="w-full border border-gray-300 p-2 rounded-lg"
                value={nuevoServicio.comunas_a_las_que_hace_domicilio}
                onChange={e => setNuevoServicio({ ...nuevoServicio, comunas_a_las_que_hace_domicilio: e.target.value })}
                placeholder="Ej: Santiago, Providencia"
              />
            </label>
            <label className="block">
              <span className="block font-medium mb-1">Imagen (URL)</span>
              <input
                className={`w-full border border-gray-300 p-2 rounded-lg ${errors.imagen ? "border-red-500" : ""}`}
                value={nuevoServicio.imagen}
                onChange={e => setNuevoServicio({ ...nuevoServicio, imagen: e.target.value })}
                placeholder="Ej: https://miweb.com/imagen.jpg"
              />
              {errors.imagen && <span className="text-red-600 text-sm">{errors.imagen}</span>}
            </label>
          </div>
        </section>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={nuevoServicio.hace_domicilio} onChange={e => setNuevoServicio({ ...nuevoServicio, hace_domicilio: e.target.checked })} />
          <span>¿Este servicio ofrece atención a domicilio?</span>
        </label>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Horario del servicio</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block font-medium mb-1">Hora de inicio</span>
              <input
                type="time"
                className={`w-full border border-gray-300 p-2 rounded-lg ${errors.hora_inicio ? "border-red-500" : ""}`}
                value={nuevoServicio.hora_inicio}
                onChange={e => setNuevoServicio({ ...nuevoServicio, hora_inicio: e.target.value })}
                required
                placeholder="Ej: 09:00"
              />
              {errors.hora_inicio && <span className="text-red-600 text-sm">{errors.hora_inicio}</span>}
            </label>
            <label className="block">
              <span className="block font-medium mb-1">Hora de término</span>
              <input
                type="time"
                className={`w-full border border-gray-300 p-2 rounded-lg ${errors.hora_termino ? "border-red-500" : ""}`}
                value={nuevoServicio.hora_termino}
                onChange={e => setNuevoServicio({ ...nuevoServicio, hora_termino: e.target.value })}
                required
                placeholder="Ej: 18:00"
              />
              {errors.hora_termino && <span className="text-red-600 text-sm">{errors.hora_termino}</span>}
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Beneficios asociados</h3>
          <div className="grid grid-cols-2 gap-4">
            {beneficiosDisponibles.map((beneficio) => (
              <label key={beneficio.id} className="flex items-center gap-2">
                <input type="checkbox" checked={selectedBeneficios.includes(beneficio.id)} onChange={() => toggleBeneficio(beneficio.id)} />
                <span>{beneficio.nombre}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Bloques de horario</h3>
          {bloques.map((bloque, i) => (
            <div key={i} className="space-y-2 border p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-2">
                <input type="date" className="border p-2 rounded" value={bloque.fecha} onChange={e => handleBloqueChange(i, "fecha", e.target.value)} required />
                <input type="time" className="border p-2 rounded" value={bloque.hora_inicio} onChange={e => handleBloqueChange(i, "hora_inicio", e.target.value)} required />
                <input type="time" className="border p-2 rounded" value={bloque.hora_termino} onChange={e => handleBloqueChange(i, "hora_termino", e.target.value)} required />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={bloque.repetir} onChange={e => handleBloqueChange(i, "repetir", e.target.checked)} />
                <span>¿Repetir semanalmente?</span>
              </label>
              {bloque.repetir && (
                <div>
                  <label className="text-sm text-gray-600">¿Cuántas semanas?</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={bloque.semanas_recurrencia}
                    onChange={e => handleBloqueChange(i, "semanas_recurrencia", Number(e.target.value))}
                    className="border p-2 rounded w-24"
                  />
                </div>
              )}
              {i > 0 && (
                <button type="button" onClick={() => eliminarBloque(i)} className="text-sm text-red-600">Eliminar bloque</button>
              )}
            </div>
          ))}
          <button type="button" onClick={agregarBloque} className="text-blue-600 hover:underline text-sm">+ Agregar otro bloque</button>
        </section>

        <button
          type="submit"
          className="w-full bg-primary1 text-white py-3 rounded-lg text-xl font-semibold hover:bg-primary2 transition disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Creando..." : "Crear Servicio"}
        </button>
      </form>
    </div>
  );
}
