import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getAllAdminUsers } from "../../services/adminService";
import { Pencil, Trash } from "lucide-react";
import regionesData from "../../assets/data/comunas-regiones.json";
import UserEditModal from "../../components/AdminComponents/UserEditModal";
import { User, deleteUserById } from "../../services/userService";

export default function AdminUsersPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(50);

  // Filtros
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [rolFilter, setRolFilter] = useState("todos");
  const [regionFilter, setRegionFilter] = useState("");
  const [comunaFilter, setComunaFilter] = useState("");

  const regionList = regionesData.regions.map(r => r.name);
  const comunaList = regionFilter
    ? regionesData.regions.find(r => r.name === regionFilter)?.communes.map(c => c.name) || []
    : [];

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await getAccessTokenSilently();
        const data = await getAllAdminUsers(token);
        setUsers(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los usuarios.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    let temp = [...users];
    if (searchName.trim()) {
      temp = temp.filter(u => u.nombre.toLowerCase().includes(searchName.toLowerCase()));
    }
    if (searchEmail.trim()) {
      temp = temp.filter(u => u.email.toLowerCase().includes(searchEmail.toLowerCase()));
    }
    if (rolFilter !== "todos") {
      temp = temp.filter(u => u.rol === rolFilter);
    }
    if (regionFilter) {
      temp = temp.filter(u => u.region_de_residencia === regionFilter);
    }
    if (comunaFilter) {
      temp = temp.filter(u => u.comuna_de_residencia === comunaFilter);
    }
    setFiltered(temp);
    setCurrentPage(1); // Reiniciar a primera página si se aplican filtros
  }, [searchName, searchEmail, rolFilter, regionFilter, comunaFilter, users]);

  const handleDelete = async (u: User) => {
    const confirm = window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${u.nombre}?`);
    if (!confirm) return;

    const totalAdmins = users.filter(user => user.rol === "administrador").length;

    if (u.rol === "administrador" && totalAdmins === 1) {
      alert("No puedes eliminar al único administrador del sistema.");
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      await deleteUserById(u.id, token);
      const updated = users.filter(user => user.id !== u.id);
      setUsers(updated);
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al eliminar el usuario.");
    }
  };


  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = filtered.slice(startIndex, endIndex);

  if (loading) return <p className="p-6 text-center">Cargando usuarios…</p>;
  if (error) return <p className="p-6 text-red-600 text-center">{error}</p>;

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Usuarios</h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Buscar por email"
          value={searchEmail}
          onChange={e => setSearchEmail(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select
          value={rolFilter}
          onChange={e => setRolFilter(e.target.value)}
          className="border rounded px-3 py-2 bg-white"
        >
          <option value="todos">Todos los roles</option>
          <option value="gratis">General</option>
          <option value="socio">Socio</option>
          <option value="proveedor">Proveedor</option>
          <option value="administrador">Administrador</option>
        </select>
        <select
          value={regionFilter}
          onChange={e => {
            setRegionFilter(e.target.value);
            setComunaFilter(""); // Resetear comuna al cambiar región
          }}
          className="border rounded px-3 py-2 bg-white"
        >
          <option value="">Todas las regiones</option>
          {regionList.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={comunaFilter}
          onChange={e => setComunaFilter(e.target.value)}
          disabled={!regionFilter}
          className="border rounded px-3 py-2 bg-white"
        >
          <option value="">Todas las comunas</option>
          {comunaList.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Selector de cantidad */}
      <div className="mb-4 text-sm text-gray-700 flex items-center gap-3">
        <label>Usuarios por página:</label>
        <select
          value={usersPerPage}
          onChange={e => {
            setUsersPerPage(parseInt(e.target.value));
            setCurrentPage(1); // reiniciar al cambiar el límite
          }}
          className="border rounded px-2 py-1"
        >
          {[10, 25, 50, 100].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] bg-white rounded-xl shadow-sm text-sm w-full">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="text-left">Email</th>
              <th className="text-left">Región / Comuna</th>
              <th className="text-left">Fecha de Nacimiento</th>
              <th className="text-left">Rol</th>
              <th className="text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.region_de_residencia} / {u.comuna_de_residencia}</td>
                <td>{new Date(u.fecha_de_nacimiento).toLocaleDateString("es-CL")}</td>
                <td>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    u.rol === "socio"
                      ? "bg-yellow-600/20 text-yellow-700"
                      : u.rol === "administrador"
                      ? "bg-purple-200 text-purple-700"
                      : u.rol === "proveedor"
                      ? "bg-green-200 text-green-800"
                      : "bg-[#009982]/10 text-[#006881]"
                  }`}>
                    {u.rol === "socio" ? "Socio" : u.rol === "administrador" ? "Administrador" : u.rol === "proveedor" ? "Proveedor" : "General"}
                  </span>
                </td>
                <td className="space-x-2">
                  <button
                    onClick={() => setSelectedUser(u)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar"
                  >
                    <Pencil className="inline w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(u)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <Trash className="inline w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Sin resultados */}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-500 mt-4">No hay usuarios que coincidan con los filtros.</p>
        )}

        {/* Paginación */}
        {filtered.length > usersPerPage && (
          <div className="mt-4 flex justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700 px-2 pt-1">
              Página {currentPage} de {Math.ceil(filtered.length / usersPerPage)}
            </span>
            <button
              disabled={endIndex >= filtered.length}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Modal */}
        {selectedUser && (
          <UserEditModal
            user={selectedUser}
            allUsers={users}
            onClose={() => setSelectedUser(null)}
            onUpdate={async () => {
              const token = await getAccessTokenSilently();
              const data = await getAllAdminUsers(token);
              setUsers(data);
            }}
          />
        )}
      </div>
    </div>
  );
}
