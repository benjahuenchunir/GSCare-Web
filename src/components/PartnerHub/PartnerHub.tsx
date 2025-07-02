import { useAuth0 } from "@auth0/auth0-react";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import ActivityForm, { ActividadForm } from "./ActivityForm";
import RecurrentActivityForm, {
  RecurrentActivityForm as RecurrentActivityFormType,
} from "./RecurrentActivityForm";
import ProductForm, { ProductoForm } from "./ProductForm";

const initialActividad: ActividadForm = {
  nombre: "",
  descripcion: "",
  modalidad: "presencial",
  lugar: "",
  comuna: "",
  fecha: "",
  hora_inicio: "",
  hora_final: "",
  capacidad_total: 999999, 
};

const initialRecurrentActividad: RecurrentActivityFormType = {
  nombre: "",
  descripcion: "",
  modalidad: "presencial",
  lugar: "",
  comuna: "",
  fecha: "",
  fecha_termino: "",
  semanas_recurrencia: 2, 
  horarios_por_dia: Array(7).fill([]),
  dias_seleccionados: Array(7).fill(false),
  capacidad_total: 999999, // <--- cambiado de null a 999999
};

const initialProducto: ProductoForm = {
  nombre: "",
  descripcion: "",
  categoria: "",
  marca: "",
  nombre_del_vendedor: "",
  link_al_producto: "",
  imagen: "",
};

const calcularLunes = (fechaInput: string) => {
  const fecha = new Date(fechaInput + "T00:00:00");
  const diaSemana = fecha.getDay();
  const diasHastaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
  fecha.setDate(fecha.getDate() + diasHastaLunes);
  return fecha.toISOString().split("T")[0];
};

type Props = {
  view: "main" | "actividad" | "actividad_recurrente" | "producto" | "servicio";
  setView: (v: "main" | "actividad" | "actividad_recurrente" | "producto" | "servicio" | null) => void;
  inline?: boolean;
  onActivityCreated?: () => void;
};

export default function PartnerHub({ view, setView, onActivityCreated }: Props) {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [actividad, setActividad] = useState(initialActividad);
  const [actividadRecurrente, setActividadRecurrente] = useState(initialRecurrentActividad);
  const [producto, setProducto] = useState(initialProducto);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // NUEVO: Estado para archivo de imagen
  const [actividadImagen, setActividadImagen] = useState<File | null>(null);
  const [actividadRecImagen, setActividadRecImagen] = useState<File | null>(null);

  if (!isAuthenticated) return null;

  const handleActividadChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setActividadImagen(file);
      if (file) {
        // Si se selecciona un archivo, limpiar la URL de texto
        setActividad((prev) => ({ ...prev, imagen: "" }));
      }
    } else {
      setActividad((prev) => ({ ...prev, [name]: value }));
      if (name === "imagen") {
        // Si se escribe en la URL, limpiar el archivo
        setActividadImagen(null);
      }
    }
  };

  const handleProductoChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProducto((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleActividadRecurrenteChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | { target: { name: string; value: any; type?: string } }
  ) => {
    const { name, value, type } = e.target as any;

    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setActividadRecImagen(file);
      if (file) {
        setActividadRecurrente((prev) => ({ ...prev, imagen: "" }));
      }
    } else {
      setActividadRecurrente((prev) => ({ ...prev, [name]: value }));
      if (name === "imagen") {
        setActividadRecImagen(null);
      }
    }
  };

  const handleActividadSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const required: (keyof ActividadForm)[] = ["nombre", "descripcion", "modalidad", "fecha", "hora_inicio", "hora_final"];
    if (actividad.modalidad === "presencial") {
      required.push("lugar", "comuna");
    }
    const missing = required.filter((f) => !actividad[f]);

    if (missing.length > 0) {
      setError("Faltan campos: " + missing.join(", "));
      setLoading(false);
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const userPartner = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios/email/${user?.email}`);

      // --- NUEVO: Usar FormData para enviar imagen y campos ---
      const formData = new FormData();
      const actividadData: any = {
        ...actividad,
        capacidad_total: Number(actividad.capacidad_total) || 999999,
        id_creador_del_evento: userPartner.data.id,
      };

      if (actividadImagen) {
        formData.append("imagen", actividadImagen);
        delete actividadData.imagen; // Si hay archivo, no enviar la URL
      } else if (!actividadData.imagen) {
        // Si no hay archivo Y no hay URL, eliminar el campo
        delete actividadData.imagen;
      }

      Object.entries(actividadData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as string);
        }
      });

      await axios.post(
        `${import.meta.env.VITE_API_URL}/actividades`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccess("¡Actividad creada!");
      setActividad(initialActividad);
      setActividadImagen(null);
      if (onActivityCreated) onActivityCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleActividadRecurrenteSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const required: (keyof RecurrentActivityFormType)[] = [
      "nombre", "descripcion", "modalidad", "fecha", "fecha_termino", "semanas_recurrencia", "horarios_por_dia", "dias_seleccionados"
    ];

    const missing = required.filter((f) => {
      if (f === "horarios_por_dia") {
        return !actividadRecurrente.dias_seleccionados.some((s, i) =>
          s && actividadRecurrente.horarios_por_dia[i]?.length === 2 && actividadRecurrente.horarios_por_dia[i].every(h => h)
        );
      }
      if (f === "dias_seleccionados") {
        return !actividadRecurrente.dias_seleccionados.some(s => s);
      }
      return !actividadRecurrente[f];
    });

    if (missing.length > 0) {
      setError("Faltan campos: " + missing.join(", "));
      setLoading(false);
      return;
    }

    // Validación: fecha de término debe ser igual o posterior a la de inicio
    const fechaInicio = new Date(actividadRecurrente.fecha);
    const fechaTermino = new Date(actividadRecurrente.fecha_termino);

    if (fechaTermino < fechaInicio) {
      setError("La fecha de término debe ser posterior o igual a la de inicio.");
      setLoading(false);
      return;
    }

    // semanas_recurrencia debe ser >= 1
    if (!actividadRecurrente.semanas_recurrencia || actividadRecurrente.semanas_recurrencia < 1) {
      setError("El intervalo de semanas de recurrencia debe ser al menos 1.");
      setLoading(false);
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const userPartner = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios/email/${user?.email}`);
      const monday = calcularLunes(actividadRecurrente.fecha);

      // --- NUEVO: Usar FormData para bulk, incluyendo imagen si existe ---
      const formData = new FormData();
      const bulkData: any = {
        ...actividadRecurrente,
        capacidad_total: Number(actividadRecurrente.capacidad_total) || 999999,
        monday,
        id_creador_del_evento: userPartner.data.id,
      };

      if (actividadRecImagen) {
        formData.append("imagen", actividadRecImagen);
        delete bulkData.imagen; // Si hay archivo, no enviar la URL
      } else if (!bulkData.imagen) {
        // Si no hay archivo Y no hay URL, eliminar el campo
        delete bulkData.imagen;
      }

      Object.entries(bulkData).forEach(([key, value]) => {
        // Para arreglos/objetos, serializar a JSON
        if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });

      await axios.post(
        `${import.meta.env.VITE_API_URL}/actividades/bulk`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccess("¡Actividad recurrente creada!");
      setActividadRecurrente(initialRecurrentActividad);
      setActividadRecImagen(null);
      if (onActivityCreated) onActivityCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // Handler para el formulario de producto
  const handleProductoSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const required: (keyof ProductoForm)[] = [
      "nombre", "descripcion", "categoria", "marca", "nombre_del_vendedor", "link_al_producto"
    ];
    const missing = required.filter((f) => !producto[f]);

    if (missing.length > 0) {
      setError("Faltan campos: " + missing.join(", "));
      setLoading(false);
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const userPartner = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios/email/${user?.email}`);

      const payload = {
        ...producto,
        id_creador_del_producto: userPartner.data.id,
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/productos`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("¡Producto sugerido con éxito! Será revisado por un administrador.");
      setProducto(initialProducto);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // Render dinámico de formularios
  if (view === "actividad") {
    return (
      <ActivityForm
        actividad={actividad}
        onChange={handleActividadChange}
        onSubmit={handleActividadSubmit}
        loading={loading}
        error={error}
        success={success}
        onCancel={() => setView(null)}
        onSwitchToRecurrente={() => setView("actividad_recurrente")}
        imagenFile={actividadImagen}
      />
    );
  }

  if (view === "actividad_recurrente") {
    return (
      <RecurrentActivityForm
        actividad={actividadRecurrente}
        onChange={handleActividadRecurrenteChange}
        onSubmit={handleActividadRecurrenteSubmit}
        loading={loading}
        error={error}
        success={success}
        onCancel={() => setView(null)}
        onSwitchToUnique={() => setView("actividad")}
        imagenFile={actividadRecImagen}
      />
    );
  }

  if (view === "producto") {
    return (
      <ProductForm
        producto={producto}
        onChange={handleProductoChange}
        onSubmit={handleProductoSubmit}
        loading={loading}
        error={error}
        success={success}
        onCancel={() => setView(null)}
      />
    );
  }

  if (view === "servicio") {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Ofrecer Servicio</h2>
        <p>Próximamente podrás ofrecer servicios desde esta plataforma.</p>
        <button
          type="button"
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => setView(null)}
        >
          Volver
        </button>
      </div>
    );
  }

  return null;
}
