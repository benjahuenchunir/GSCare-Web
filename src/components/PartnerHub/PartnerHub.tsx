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
};

export default function PartnerHub({ view, setView }: Props) {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [actividad, setActividad] = useState(initialActividad);
  const [actividadRecurrente, setActividadRecurrente] = useState(initialRecurrentActividad);
  const [producto, setProducto] = useState(initialProducto);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isAuthenticated) return null;

  const handleActividadChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setActividad((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleProductoChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setProducto((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleActividadRecurrenteChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | { target: { name: string; value: any } }
  ) => setActividadRecurrente((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleActividadSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const required: (keyof ActividadForm)[] = ["nombre", "descripcion", "modalidad", "fecha", "hora_inicio", "hora_final"];
    const missing = required.filter((f) => !actividad[f]);

    if (missing.length > 0) {
      setError("Faltan campos: " + missing.join(", "));
      setLoading(false);
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const userPartner = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios/email/${user?.email}`);
      // --- Ajuste aquí: si capacidad_total es "" o undefined, enviar 999999 ---
      const actividadData = {
        ...actividad,
        capacidad_total:
          actividad.capacidad_total === null ||
          actividad.capacidad_total === undefined
            ? 999999
            : actividad.capacidad_total,
        id_creador_del_evento: userPartner.data.id,
      };
      await axios.post(
        `${import.meta.env.VITE_API_URL}/actividades`,
        actividadData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("¡Actividad creada!");
      setActividad(initialActividad);
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

    if (new Date(actividadRecurrente.fecha_termino) <= new Date(actividadRecurrente.fecha)) {
      setError("La fecha de término debe ser posterior.");
      setLoading(false);
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const userPartner = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios/email/${user?.email}`);
      const monday = calcularLunes(actividadRecurrente.fecha);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/actividades/bulk`,
        { ...actividadRecurrente, monday, id_creador_del_evento: userPartner.data.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("¡Actividad recurrente creada!");
      setActividadRecurrente(initialRecurrentActividad);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

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

    if (!/^https?:\/\/.+\..+/.test(producto.link_al_producto)) {
      setError("URL inválida");
      setLoading(false);
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      await axios.post(`${import.meta.env.VITE_API_URL}/productos`, producto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("¡Producto creado!");
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
