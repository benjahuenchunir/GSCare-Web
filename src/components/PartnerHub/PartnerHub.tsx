import { useAuth0 } from "@auth0/auth0-react";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
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
};

const initialRecurrentActividad: RecurrentActivityFormType = {
  nombre: "",
  descripcion: "",
  modalidad: "presencial",
  lugar: "",
  comuna: "",
  fecha: "",
  fecha_termino: "", // Nuevo campo inicializado
  semanas_recurrencia: 2,
  horarios_por_dia: Array(7).fill([]),
  dias_seleccionados: Array(7).fill(false),
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
  const diaSemana = fecha.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
  const diasHastaLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
  fecha.setDate(fecha.getDate() + diasHastaLunes);
  return fecha.toISOString().split("T")[0];
};


export default function PartnerHub() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [expanded, setExpanded] = useState(false);
  const [modalView, setModalView] = useState<
    "main" | "actividad" | "actividad_recurrente" | "producto" | "servicio"
  >("main");
  const [actividad, setActividad] = useState<ActividadForm>(initialActividad);
  const [actividadRecurrente, setActividadRecurrente] =
    useState<RecurrentActivityFormType>(initialRecurrentActividad);
  const [producto, setProducto] = useState<ProductoForm>(initialProducto);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isAuthenticated) return null;

  const handleActividadChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setActividad((prev) => ({ ...prev, [name]: value }));
  };

  const handleActividadRecurrenteChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | { target: { name: string; value: any } }
  ) => {
    const { name, value } = e.target;
    setActividadRecurrente((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductoChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProducto((prev) => ({ ...prev, [name]: value }));
  };

  const handleActividadSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const required: (keyof ActividadForm)[] = [
      "nombre",
      "descripcion",
      "modalidad",
      "fecha",
      "hora_inicio",
      "hora_final",
    ];

    const missing = required.filter((f) => !actividad[f]);
    const token = await getAccessTokenSilently();

    if (missing.length > 0) {
      setError("Faltan campos obligatorios: " + missing.join(", "));
      setLoading(false);
      return;
    }

    try {
      const userPartner = await axios.get(
        `${import.meta.env.VITE_API_URL}/usuarios/email/${user?.email}`
      );

      console.log("Se enviará al backend:" , {
        ...actividad,
        id_creador_del_evento: userPartner.data.id,
      })

      await axios.post(
        `${import.meta.env.VITE_API_URL}/actividades`,
        {
          ...actividad,
          id_creador_del_evento: userPartner.data.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("¡Actividad creada exitosamente!");
      setActividad(initialActividad);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || "Error desconocido");
      } else {
        setError(err instanceof Error ? err.message : "Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleActividadRecurrenteSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    console.log("Datos de actividad recurrente:", actividadRecurrente);

    const required: (keyof RecurrentActivityFormType)[] = [
      "nombre",
      "descripcion",
      "modalidad",
      "fecha",
      "fecha_termino", // Añadido a requeridos
      "semanas_recurrencia",
      "horarios_por_dia",
      "dias_seleccionados",
    ];

    const missing = required.filter((f) => {
      if (f === "horarios_por_dia") {
        const diaSeleccionadoConHorario = actividadRecurrente.dias_seleccionados.some(
          (seleccionado, diaIndex) =>
            seleccionado &&
            actividadRecurrente.horarios_por_dia[diaIndex]?.length === 2 &&
            actividadRecurrente.horarios_por_dia[diaIndex].every((h) => h)
        );
        return !diaSeleccionadoConHorario;
      }
      if (f === "dias_seleccionados") {
        return !actividadRecurrente.dias_seleccionados.some((s) => s);
      }
      return !actividadRecurrente[f];
    });

    if (missing.length > 0) {
      setError(
        "Faltan campos obligatorios o no hay días/horarios seleccionados: " +
          missing.join(", ")
      );
      setLoading(false);
      return;
    }

    // Validación de fecha de término posterior a fecha de inicio
    if (
      new Date(actividadRecurrente.fecha_termino) <=
      new Date(actividadRecurrente.fecha)
    ) {
      setError("La fecha de término debe ser posterior a la fecha de partida.");
      setLoading(false);
      return;
    }

    const token = await getAccessTokenSilently();

    try {
      const userPartner = await axios.get(
        `${import.meta.env.VITE_API_URL}/usuarios/email/${user?.email}`
      );
      const monday = calcularLunes(actividadRecurrente.fecha);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/actividades/bulk`,
        {
          ...actividadRecurrente, // fecha_termino ya está aquí
          monday: monday,
          id_creador_del_evento: userPartner.data.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("¡Actividad recurrente creada exitosamente!");
      setActividadRecurrente(initialRecurrentActividad);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || "Error desconocido");
      } else {
        setError(err instanceof Error ? err.message : "Error desconocido");
      }
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
      "nombre",
      "descripcion",
      "categoria",
      "marca",
      "nombre_del_vendedor",
      "link_al_producto",
    ];

    const missing = required.filter((f) => !producto[f]);

    if (missing.length > 0) {
      setError("Faltan campos obligatorios: " + missing.join(", "));
      setLoading(false);
      return;
    }

    if (!/^https?:\/\/.+\..+/.test(producto.link_al_producto)) {
      setError("URL del producto inválida");
      setLoading(false);
      return;
    }

    if (producto.imagen && !/^https?:\/\/.+\..+/.test(producto.imagen)) {
      setError("URL de imagen inválida");
      setLoading(false);
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      await axios.post(`${import.meta.env.VITE_API_URL}/productos`, producto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("¡Producto creado exitosamente!");
      setProducto(initialProducto);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  let modalContent = null;
  if (modalView === "main") {
    modalContent = (
      <>
        <h2 className="text-4xl font-bold text-primary mb-6">Panel de socio</h2>
        <div className="flex flex-col gap-4 text-2xl">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => setModalView("actividad")}
          >
            Crear Actividad
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            onClick={() => setModalView("producto")}
          >
            Agregar Producto
          </button>
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
            onClick={() => setModalView("servicio")}
          >
            Ofrecer Servicio
          </button>
        </div>
      </>
    );
  } else if (modalView === "actividad") {
    modalContent = (
      <ActivityForm
        actividad={actividad}
        onChange={handleActividadChange}
        onSubmit={handleActividadSubmit}
        loading={loading}
        error={error}
        success={success}
        onCancel={() => {
          setModalView("main");
          setError("");
          setSuccess("");
        }}
        onSwitchToRecurrente={() => setModalView("actividad_recurrente")}
      />
    );
  } else if (modalView === "actividad_recurrente") {
    modalContent = (
      <RecurrentActivityForm
        actividad={actividadRecurrente}
        onChange={handleActividadRecurrenteChange}
        onSubmit={handleActividadRecurrenteSubmit}
        loading={loading}
        error={error}
        success={success}
        onCancel={() => {
          setModalView("main");
          setError("");
          setSuccess("");
        }}
        onSwitchToUnique={() => setModalView("actividad")}
      />
    );
  } else if (modalView === "producto") {
    modalContent = (
      <ProductForm
        producto={producto}
        onChange={handleProductoChange}
        onSubmit={handleProductoSubmit}
        loading={loading}
        error={error}
        success={success}
        onCancel={() => {
          setModalView("main");
          setError("");
          setSuccess("");
        }}
      />
    );
  } else if (modalView === "servicio") {
    modalContent = (
      <div className="flex flex-col gap-4 text-lg items-center">
        <h2 className="text-2xl font-bold mb-2">Ofrecer Servicio</h2>
        <p>Próximamente podrás ofrecer servicios desde esta plataforma.</p>
        <button
          type="button"
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
          onClick={() => setModalView("main")}
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setExpanded(true);
            setModalView("main");
            setError("");
            setSuccess("");
          }}
          className={`bg-[#009982] hover:bg-[#007766] text-white p-4 rounded-l-full shadow-lg transition-all font-bold text-lg flex items-center h-[56px] ${
            expanded ? "rounded-r-none" : "rounded-full"
          }`}
          title="Panel de socio"
        >
          Socio
        </button>

        <div
          className={`flex items-center gap-2 transition-all duration-300 ease-in-out overflow-hidden h-[56px] ${
            expanded ? "w-auto opacity-100" : "w-0 opacity-0"
          }`}
        >
          <button
            className="bg-purple-400 text-white text-lg font-bold px-4 py-2 rounded hover:bg-purple-500 transition flex items-center gap-2 whitespace-nowrap h-full"
            onClick={() => setModalView("actividad")}
          >
            Añadir Actividad
          </button>
          <button
            className="bg-orange-400 text-white text-lg font-bold px-4 py-2 rounded hover:bg-orange-500 transition flex items-center gap-2 whitespace-nowrap h-full"
            onClick={() => setModalView("producto")}
          >
            Añadir Producto
          </button>
          {/* <button
            className="bg-purple-500 text-white text-lg font-bold px-4 py-2 rounded hover:bg-purple-600 transition flex items-center gap-2 whitespace-nowrap h-full"
            onClick={() => setModalView("servicio")}
          >
            Añadir Servicio
          </button> */}
          <button
            onClick={() => setExpanded(false)}
            className="bg-red-500 text-white px-4 py-2 rounded-r-full hover:bg-red-600 transition h-full flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {modalView !== "main" && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            {modalContent}
          </div>
        </div>
      )}
    </div>
  );
}
