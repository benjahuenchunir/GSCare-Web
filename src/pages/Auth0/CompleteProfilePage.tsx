// src/pages/CompleteProfilePage.tsx

import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../services/userService";
import regionesData from "../../assets/data/comunas-regiones.json"; // Tu JSON

export default function CompleteProfilePage() {
  const { user } = useAuth0();
  const navigate = useNavigate();

  const { reloadProfile } = useContext(UserContext);

  const [form, setForm] = useState({
    nombre: "",
    email: user?.email || "",
    fecha_de_nacimiento: "",
    region_de_residencia: "",
    comuna_de_residencia: ""
  });

  const [communeList, setCommuneList] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const regionList = regionesData.regions.map(region => region.name);

  useEffect(() => {
    if (form.region_de_residencia) {
      const selectedRegion = regionesData.regions.find(
        r => r.name === form.region_de_residencia
      );
      setCommuneList(
        selectedRegion ? selectedRegion.communes.map(c => c.name) : []
      );
    } else {
      setCommuneList([]);
    }
  }, [form.region_de_residencia]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: "" })); // Limpia error específico al escribir
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!form.fecha_de_nacimiento) newErrors.fecha_de_nacimiento = "Fecha de nacimiento es obligatoria.";
    if (!form.region_de_residencia) newErrors.region_de_residencia = "Debes seleccionar una región.";
    if (!form.comuna_de_residencia) newErrors.comuna_de_residencia = "Debes seleccionar una comuna.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createUser(form);
      await reloadProfile();
      navigate("/user", { replace: true });
    } catch {
      setErrors({ general: "Error al crear el usuario. Intenta más tarde." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow max-w-md w-full space-y-4"
      >
        <h2 className="text-[1.8em] font-bold mb-6">Completa tu perfil</h2>

        {/* Error general */}
        {errors["general"] && (
          <p className="text-red-600 mb-4">{errors["general"]}</p>
        )}

        {/* Nombre (opcional) */}
        <label className="block">
          Nombre completo (opcional)
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="Ej: Ana Pérez"
          />
        </label>

        {/* Fecha de nacimiento */}
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
            <p className="text-[1em] text-red-600 mt-1">{errors["fecha_de_nacimiento"]}</p>
          )}
        </label>

        {/* Región */}
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
            <p className="text-[1em] text-red-600 mt-1">{errors["region_de_residencia"]}</p>
          )}
        </label>

        {/* Comuna */}
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
              {communeList.length
                ? "Selecciona una comuna"
                : "Primero selecciona una región"}
            </option>
            {communeList.map(comuna => (
              <option key={comuna} value={comuna}>
                {comuna}
              </option>
            ))}
          </select>
          {errors["comuna_de_residencia"] && (
            <p className="text-[1em] text-red-600 mt-1">{errors["comuna_de_residencia"]}</p>
          )}
        </label>

        {/* Botón submit */}
        <button
          type="submit"
          className="w-full mt-6 px-6 py-3 bg-primary1 text-white font-semibold rounded-lg hover:bg-primary2 transition"
        >
          Guardar y continuar
        </button>
      </form>
    </div>
  );
}
