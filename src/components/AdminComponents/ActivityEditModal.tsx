import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { updateActividadSerie } from "../../services/adminService";

interface Actividad {
  id: number;
  nombre: string;
  modalidad: string;
  categoria: string;
  comuna: string;
  link: string;
  capacidad_total: number | null;
  status: string;
  lugar: string;
  descripcion: string;
  imagen: string;
  id_actividad_base: number;
}

export default function ActivityEditModal({
  actividad,
  onClose,
  onUpdate,
}: {
  actividad: Actividad;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const { getAccessTokenSilently } = useAuth0();
  const [form, setForm] = useState<Actividad>(actividad);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(actividad);
  }, [actividad]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newForm = { ...form, [name]: value };

    // Limpiar datos si cambia modalidad
    if (name === "modalidad") {
      if (value === "presencial") {
        newForm.link = "";
      } else if (value === "online") {
        newForm.lugar = "";
        newForm.comuna = "";
      }
    }

    setForm(newForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getAccessTokenSilently();
      const updateData = {
        nombre: form.nombre,
        modalidad: form.modalidad,
        categoria: form.categoria,
        comuna: form.comuna,
        link: form.link,
        capacidad_total: form.capacidad_total
          ? Number(form.capacidad_total)
          : null,
        lugar: form.lugar,
        descripcion: form.descripcion,
        imagen: form.imagen,
      };
      await updateActividadSerie(
        form.id_actividad_base || form.id,
        updateData,
        token
      );
      onUpdate(); // recargar la lista
      onClose();
    } catch (err) {
      alert("Error al actualizar la actividad");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Editar actividad: <span className="text-primary1">{form.nombre}</span></h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Imagen y vista previa */}
          {form.imagen && /^https?:\/\/.+\..+/.test(form.imagen) && (
            <div className="col-span-full text-center">
              <img
                src={form.imagen}
                alt="Vista previa"
                className="max-h-40 mx-auto rounded border"
              />
              <p className="text-xs text-gray-500 mt-1">Vista previa de imagen</p>
            </div>
          )}

          <label className="block col-span-full">
            URL de imagen
            <input
              name="imagen"
              value={form.imagen}
              onChange={handleChange}
              className="w-full border px-3 py-2 mt-1 rounded"
            />
          </label>

          <label className="block">
            Nombre
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border px-3 py-2 mt-1 rounded"
            />
          </label>

          <label className="block">
            Categoría
            <input
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="w-full border px-3 py-2 mt-1 rounded"
            />
          </label>

          <label className="block col-span-full">
            Descripción
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full border px-3 py-2 mt-1 rounded"
              rows={3}
            />
          </label>

          <label className="block">
            Modalidad
            <select
              name="modalidad"
              value={form.modalidad}
              onChange={handleChange}
              className="w-full border px-3 py-2 mt-1 rounded bg-white"
            >
              <option value="presencial">Presencial</option>
              <option value="online">En línea</option>
            </select>
          </label>

          {form.modalidad === "presencial" && (
            <>
              <label className="block">
                Lugar
                <input
                  name="lugar"
                  value={form.lugar}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 mt-1 rounded"
                />
              </label>
              <label className="block">
                Comuna
                <input
                  name="comuna"
                  value={form.comuna}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 mt-1 rounded"
                />
              </label>
            </>
          )}

          {form.modalidad === "online" && (
            <label className="block col-span-full">
              Enlace (Zoom, Meet, etc.)
              <input
                name="link"
                value={form.link}
                onChange={handleChange}
                className="w-full border px-3 py-2 mt-1 rounded"
              />
            </label>
          )}

          <label className="block">
            Capacidad total
            <input
              name="capacidad_total"
              type="number"
              value={form.capacidad_total ?? ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 mt-1 rounded"
              placeholder="Ej: 30"
            />
          </label>

          <div className="col-span-full flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary1 text-white hover:bg-primary2 rounded"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
