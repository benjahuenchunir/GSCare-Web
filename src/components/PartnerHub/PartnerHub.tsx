import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import ActivityForm, { ActividadForm } from "./ActivityForm";
import ProductForm, { ProductoForm } from "./ProductForm";

const initialActividad: ActividadForm = {
  nombre: "",
  descripcion: "",
  lugar: "",
  comuna: "",
  fecha: "",
  hora: "",
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

export default function PartnerHub() {
  const { isAuthenticated, user } = useAuth0();
  const [open, setOpen] = useState(false);
  const [modalView, setModalView] = useState<
    "main" | "actividad" | "producto" | "servicio"
  >("main");
  const [actividad, setActividad] = useState<ActividadForm>(initialActividad);
  const [producto, setProducto] = useState<ProductoForm>(initialProducto);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isAuthenticated) return null;

  const handleActividadChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setActividad((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductoChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      "lugar",
      "comuna",
      "fecha",
      "hora",
    ];

    const missing = required.filter((f) => !actividad[f]);

    if (missing.length > 0) {
      setError("Faltan campos obligatorios: " + missing.join(", "));
      setLoading(false);
      return;
    }

    try {
      const userPartner = await axios.get(
        `${import.meta.env.VITE_API_URL}/usuarios/email/${user?.email}`
      );
      await axios.post(`${import.meta.env.VITE_API_URL}/actividades`, {
        ...actividad,
        id_creador_del_evento: userPartner.data.id,
      });
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
      await axios.post(`${import.meta.env.VITE_API_URL}/productos`, producto);
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
    <>
      <div className="fixed bottom-4 left-4 z-50 flex flex-row gap-2">
        <button
          onClick={() => {
            setOpen(true);
            setModalView("main");
            setError("");
            setSuccess("");
          }}
          className="bg-[#009982] hover:bg-[#007766] text-white p-4 rounded-full shadow-lg transition-all font-bold text-lg"
          title="Panel de socio"
        >
          Panel de socio
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-[45vw] w-full text-center">
            {modalContent}
            <button
              className="mt-8 text-4xl bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full"
              onClick={() => {
                setOpen(false);
                setModalView("main");
                setError("");
                setSuccess("");
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
