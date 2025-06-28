import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Info, Contact, Clock, Home, Award } from "lucide-react";

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
  semanas_recurrencia: 1, // Este campo parece no usarse, pero lo mantengo por si acaso
  correo_proveedor: "",
};

export default function CreateServiceForm({ onSuccess }: Props) {
  const { getAccessTokenSilently } = useAuth0();
  const [nuevoServicio, setNuevoServicio] = useState(initialServiceState);
  const [beneficiosDisponibles, setBeneficiosDisponibles] = useState<Beneficio[]>([]);
  const [selectedBeneficios, setSelectedBeneficios] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

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

  const normalizarHora = (hora: string) => {
    return hora.length === 5 ? `${hora}:00` : hora;
  };

  const validateFields = () => {
    const errs: Record<string, string> = {};
    if (!nuevoServicio.nombre.trim()) errs.nombre = "El nombre es obligatorio";
    if (!nuevoServicio.descripcion.trim()) errs.descripcion = "La descripción es obligatoria";
    if (!nuevoServicio.prestador_del_servicio.trim()) errs.prestador_del_servicio = "El proveedor es obligatorio";
    if (!nuevoServicio.direccion_principal_del_prestador.trim()) errs.direccion_principal_del_prestador = "La dirección es obligatoria";
    if (!/^\+56\d{9}$/.test(nuevoServicio.telefono_de_contacto)) errs.telefono_de_contacto = "Formato: +569XXXXXXXX";
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(nuevoServicio.email_de_contacto)) errs.email_de_contacto = "Debe ser un email válido";
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(nuevoServicio.correo_proveedor)) errs.correo_proveedor = "Debe ser un email válido para el proveedor";
    if (!nuevoServicio.hora_inicio) errs.hora_inicio = "La hora de inicio es obligatoria";
    if (!nuevoServicio.hora_termino) errs.hora_termino = "La hora de término es obligatoria";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCrearServicio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !validateFields()) return;
    setSubmitting(true);

    try {
      const token = await getAccessTokenSilently();
      const servicioPayload = {
        ...nuevoServicio,
        dias_disponibles: "0,1,2,3,4,5,6", // Asumimos todos los días por defecto
        hora_inicio: normalizarHora(nuevoServicio.hora_inicio),
        hora_termino: normalizarHora(nuevoServicio.hora_termino),
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/servicios`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(servicioPayload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: "Error desconocido" }));
        throw new Error(errData.message || "Error al crear el servicio");
      }
      const servicioCreado = await res.json();

      for (const id_beneficio of selectedBeneficios) {
        await fetch(`${import.meta.env.VITE_API_URL}/beneficios/asociar`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id_servicio: servicioCreado.id, id_beneficio }),
        });
      }

      alert("Servicio creado con éxito.");
      setNuevoServicio(initialServiceState);
      setSelectedBeneficios([]);
      onSuccess?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Ocurrió un error inesperado.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setNuevoServicio(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const renderInput = (name: keyof typeof initialServiceState, label: string, placeholder: string, type = "text") => (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input
        type={type}
        name={name}
        value={nuevoServicio[name] as string}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none ${errors[name] ? "border-red-500" : "border-gray-300"}`}
      />
      {errors[name] && <span className="text-red-600 text-xs mt-1">{errors[name]}</span>}
    </label>
  );

  return (
    <div className="mt-12">
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Crear Nuevo Servicio</h2>
        <form onSubmit={handleCrearServicio} className="space-y-6">
          
          <Section title="Información Principal" icon={<Info />}>
            <div className="grid md:grid-cols-2 gap-4">
              {renderInput("nombre", "Nombre del servicio", "Ej: Kinesiología a domicilio")}
              {renderInput("prestador_del_servicio", "Nombre del prestador", "Ej: Juan Pérez")}
              <label className="block md:col-span-2">
                <span className="block text-sm font-medium text-gray-700 mb-1">Descripción</span>
                <textarea
                  name="descripcion"
                  value={nuevoServicio.descripcion}
                  onChange={handleInputChange}
                  placeholder="Ej: Sesiones de kinesiología para adultos mayores"
                  rows={3}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none ${errors.descripcion ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.descripcion && <span className="text-red-600 text-xs mt-1">{errors.descripcion}</span>}
              </label>
              {renderInput("imagen", "URL de Imagen", "https://ejemplo.com/imagen.jpg")}
            </div>
          </Section>

          <Section title="Detalles de Contacto y Ubicación" icon={<Contact />}>
            <div className="grid md:grid-cols-2 gap-4">
              {renderInput("correo_proveedor", "Email del Usuario Proveedor", "proveedor@email.com", "email")}
              {renderInput("email_de_contacto", "Email de Contacto Público", "contacto@servicio.com", "email")}
              {renderInput("telefono_de_contacto", "Teléfono de Contacto", "+56912345678")}
              {renderInput("direccion_principal_del_prestador", "Dirección Principal", "Av. Siempre Viva 123, Santiago")}
            </div>
          </Section>

          <Section title="Horarios y Domicilio" icon={<Clock />}>
            <div className="grid md:grid-cols-2 gap-4">
              {renderInput("hora_inicio", "Hora de inicio de atención", "", "time")}
              {renderInput("hora_termino", "Hora de término de atención", "", "time")}
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="hace_domicilio" checked={nuevoServicio.hace_domicilio} onChange={handleInputChange} />
                <span>¿Ofrece atención a domicilio?</span>
              </label>
              {nuevoServicio.hace_domicilio && (
                <div className="mt-2">
                  {renderInput("comunas_a_las_que_hace_domicilio", "Comunas de atención (separadas por coma)", "Santiago, Providencia")}
                </div>
              )}
            </div>
          </Section>

          <Section title="Beneficios Asociados" icon={<Award />}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {beneficiosDisponibles.map((b) => (
                <label key={b.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={selectedBeneficios.includes(b.id)} onChange={() => toggleBeneficio(b.id)} />
                  <span>{b.nombre}</span>
                </label>
              ))}
            </div>
          </Section>

          <div className="flex justify-end border-t pt-6 mt-6">
            <button
              type="submit"
              className="bg-primary1 text-white py-2 px-6 rounded-lg font-semibold hover:bg-primary2 transition disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? "Creando..." : "Crear Servicio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="border-t border-gray-200 pt-6 first-of-type:border-t-0 first-of-type:pt-0">
      <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2 mb-4">{icon} {title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}