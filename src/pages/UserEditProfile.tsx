// src/pages/EditProfilePage.tsx
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { getUserByEmail, updateUserProfile } from "../services/userService";
import regionesData from "../assets/data/comunas-regiones.json";

export default function EditProfilePage() {
  const { user } = useAuth0();
  const navigate = useNavigate();

  // Internamente, guardas lo que no es editable por el usuario
  const [userId, setUserId] = useState<number | null>(null);
  const [userRol, setUserRol] = useState<string>("gratis");

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    fecha_de_nacimiento: "",
    region_de_residencia: "",
    comuna_de_residencia: "",
    direccion_particular: ""
  });

  const [communeList, setCommuneList] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const regionList = regionesData.regions.map(region => region.name);

  useEffect(() => {
    if (user?.email) {
      getUserByEmail(user.email!).then(data => {
        setForm({
          nombre: data.nombre || "",
          email: data.email,
          fecha_de_nacimiento: data.fecha_de_nacimiento || "",
          region_de_residencia: data.region_de_residencia || "",
          comuna_de_residencia: data.comuna_de_residencia || "",
          direccion_particular: data.direccion_particular || ""
        });
        setUserId(data.id);
        setUserRol(data.rol);
      });
    }
  }, [user]);

  useEffect(() => {
    const selectedRegion = regionesData.regions.find(
      r => r.name === form.region_de_residencia
    );
    setCommuneList(selectedRegion ? selectedRegion.communes.map(c => c.name) : []);
  }, [form.region_de_residencia]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!form.fecha_de_nacimiento) newErrors.fecha_de_nacimiento = "Fecha de nacimiento es obligatoria.";
    if (!form.region_de_residencia) newErrors.region_de_residencia = "Debes seleccionar una región.";
    if (!form.comuna_de_residencia) newErrors.comuna_de_residencia = "Debes seleccionar una comuna.";
    if (!form.direccion_particular) newErrors.direccion_particular = "Debes ingresar tu dirección particular.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (userId !== null) {
        await updateUserProfile({
          id: userId,
          rol: userRol,
          ...form
        });
        navigate("/user", { replace: true });
      } else {
        throw new Error("ID de usuario no definido");
      }
    } catch {
      setErrors({ general: "Error al guardar los cambios. Intenta más tarde." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow max-w-md w-full space-y-4"
      >
        <h2 className="text-2xl font-bold mb-6">Editar perfil</h2>

        {errors["general"] && <p className="text-red-600 mb-4">{errors["general"]}</p>}

        <label className="block">
          Nombre completo *
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {errors["nombre"] && <p className="text-sm text-red-600 mt-1">{errors["nombre"]}</p>}
        </label>

        <label className="block">
          Fecha de nacimiento *
          <input
            type="date"
            name="fecha_de_nacimiento"
            value={form.fecha_de_nacimiento}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {errors["fecha_de_nacimiento"] && (
            <p className="text-sm text-red-600 mt-1">{errors["fecha_de_nacimiento"]}</p>
          )}
        </label>

        <label className="block">
          Región *
          <select
            name="region_de_residencia"
            value={form.region_de_residencia}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2 bg-white"
          >
            <option value="">Selecciona una región</option>
            {regionList.map(regionName => (
              <option key={regionName} value={regionName}>
                {regionName}
              </option>
            ))}
          </select>
          {errors["region_de_residencia"] && (
            <p className="text-sm text-red-600 mt-1">{errors["region_de_residencia"]}</p>
          )}
        </label>

        <label className="block">
          Comuna *
          <select
            name="comuna_de_residencia"
            value={form.comuna_de_residencia}
            onChange={handleChange}
            disabled={communeList.length === 0}
            className="mt-1 w-full border rounded px-3 py-2 bg-white disabled:bg-gray-100"
          >
            <option value="">
              {communeList.length ? "Selecciona una comuna" : "Primero selecciona una región"}
            </option>
            {communeList.map(comuna => (
              <option key={comuna} value={comuna}>
                {comuna}
              </option>
            ))}
          </select>
          {errors["comuna_de_residencia"] && (
            <p className="text-sm text-red-600 mt-1">{errors["comuna_de_residencia"]}</p>
          )}
        </label>

        <label className="block">
          Dirección particular *
          <input
            name="direccion_particular"
            value={form.direccion_particular}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {errors["direccion_particular"] && (
            <p className="text-sm text-red-600 mt-1">{errors["direccion_particular"]}</p>
          )}
        </label>

        <button
          type="submit"
          className="w-full mt-6 px-6 py-3 bg-primary1 text-white font-semibold rounded-lg hover:bg-primary2 transition"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
