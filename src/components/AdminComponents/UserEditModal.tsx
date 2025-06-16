import { useEffect, useState } from "react";
import regionesData from "../../assets/data/comunas-regiones.json";
import { useAuth0 } from "@auth0/auth0-react";
import { updateUserProfile, User } from "../../services/userService";

interface Props {
  user: User;
  onClose: () => void;
  onUpdate: () => void;
  allUsers: User[];
}

export default function UserEditModal({ user, onClose, onUpdate, allUsers }: Props) {
  const { getAccessTokenSilently } = useAuth0();

  const [form, setForm] = useState({ ...user });
  const [communes, setCommunes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const regionList = regionesData.regions.map(r => r.name);

  useEffect(() => {
    const selected = regionesData.regions.find(r => r.name === form.region_de_residencia);
    setCommunes(selected ? selected.communes.map(c => c.name) : []);
  }, [form.region_de_residencia]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (
        form.rol !== "administrador" &&
        user.rol === "administrador" &&
        allUsers.filter(u => u.rol === "administrador").length === 1
      ) {
        alert("No puedes cambiar el rol del único administrador del sistema.");
        return;
      }

      const token = await getAccessTokenSilently();
      await updateUserProfile(form, token);

      onUpdate(); // recargar lista
      onClose();  // cerrar modal
    } catch (err) {
      alert("Error al actualizar usuario.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    setForm({ ...user });

    if (user.region_de_residencia) {
      const region = regionesData.regions.find(r => r.name === user.region_de_residencia);
      const comunaList = region ? region.communes.map(c => c.name) : [];
      setCommunes(comunaList);
    } else {
      setCommunes([]);
    }
  }, [user]);


  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
        <h2 className="text-xl font-bold mb-4">Editar usuario</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            Nombre
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </label>

          <label className="block">
            Fecha de nacimiento
            <input
              type="date"
              name="fecha_de_nacimiento"
              value={form.fecha_de_nacimiento}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </label>

          <label className="block">
            Región
            <select
              name="region_de_residencia"
              value={form.region_de_residencia}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1 bg-white"
            >
              <option value="">Selecciona una región</option>
              {regionList.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </label>

          <label className="block">
            Comuna
            <select
              name="comuna_de_residencia"
              value={form.comuna_de_residencia}
              onChange={handleChange}
              disabled={!form.region_de_residencia}
              className="w-full border rounded px-3 py-2 mt-1 bg-white"
            >
              <option value="">Selecciona una comuna</option>
              {communes.map(comuna => (
                <option key={comuna} value={comuna}>{comuna}</option>
              ))}
            </select>
          </label>

          <label className="block">
            Rol
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1 bg-white"
            >
              <option value="gratis">General</option>
              <option value="socio">Socio</option>
              <option value="administrador">Administrador</option>
            </select>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded bg-primary1 text-white hover:bg-primary2"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
