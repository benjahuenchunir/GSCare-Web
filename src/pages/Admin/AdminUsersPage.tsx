import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getAllAdminUsers } from "../../services/adminService";
import { deleteUserById, User } from "../../services/userService";
import regionesData from "../../assets/data/comunas-regiones.json";
import { Filter, Trash, Pencil } from "lucide-react";
import UserEditModal from "../../components/AdminComponents/UserEditModal";

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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Gestión de Usuarios</h1>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5" />
          Filtros
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Buscar por email"
            value={searchEmail}
            onChange={e => setSearchEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none"
          />
          <select
            value={rolFilter}
            onChange={e => setRolFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none bg-white"
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
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none bg-white"
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
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none bg-white"
          >
            <option value="">Todas las comunas</option>
            {comunaList.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
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
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-left table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Email</th>
              <th className="p-3">Región / Comuna</th>
              <th className="p-3">Fecha de Nacimiento</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{u.nombre}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.region_de_residencia} / {u.comuna_de_residencia}</td>
                <td className="p-3">{new Date(u.fecha_de_nacimiento).toLocaleDateString("es-CL")}</td>
                <td className="p-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    u.rol === "socio"
                      ? "bg-yellow-100 text-yellow-800"
                      : u.rol === "administrador"
                      ? "bg-purple-100 text-purple-800"
                      : u.rol === "proveedor"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {u.rol.charAt(0).toUpperCase() + u.rol.slice(1)}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => setSelectedUser(u)} className="text-blue-600 hover:text-blue-800" title="Editar">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(u)} className="text-red-600 hover:text-red-800" title="Eliminar">
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {paginatedUsers.length === 0 && (
          <p className="text-center p-4 text-gray-500">No se encontraron usuarios con los filtros aplicados.</p>
        )}
      </div>

      {/* Paginación */}
      {filtered.length > usersPerPage && (
        <div className="mt-4 flex justify-center items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {currentPage} de {Math.ceil(filtered.length / usersPerPage)}
          </span>
          <button
            disabled={endIndex >= filtered.length}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          allUsers={users}
          onClose={() => setSelectedUser(null)}
          onUpdate={() => {
            setSelectedUser(null);
            // Re-fetch users to get updated data
            setLoading(true);
            const fetchUsers = async () => {
              try {
                const token = await getAccessTokenSilently();
                const data = await getAllAdminUsers(token);
                setUsers(data);
              } catch (err) {
                console.error(err);
                setError("Error al recargar los usuarios.");
              } finally {
                setLoading(false);
              }
            };
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}
