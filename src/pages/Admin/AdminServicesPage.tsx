import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getAdminServicios, getBeneficios, createBeneficio, deleteBeneficio } from "../../services/adminService";
import ServiceEditModal from "../../components/AdminComponents/ServiceEditModal";
import ServiceBenefitsModal from "../../components/AdminComponents/ServiceBenefitsModal";
import ServiceBlocksModal from "../../components/AdminComponents/ServiceBlocksModal";
import ServiceReviewsModal from "../../components/AdminComponents/ServiceReviewsModal";
import { Pencil, Trash } from "lucide-react";

export interface Servicio {
  id: number;
  id_servicio_base: number;
  nombre: string;
  descripcion: string;
  prestador_del_servicio: string;
  direccion_principal_del_prestador: string;
  hace_domicilio: boolean;
  comunas_a_las_que_hace_domicilio: string;
  dias_disponibles: number[];
  hora_inicio: string;
  hora_termino: string;
  telefono_de_contacto: string;
  email_de_contacto: string;
  imagen: string;
  createdAt: string;
  updatedAt: string;
  id_usuario_creador: number;
}

export interface Beneficio {
  id: number;
  nombre: string;
  descripcion: string;
}

export default function AdminServicesPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [allServicios, setAllServicios] = useState<Servicio[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [editingService, setEditingService] = useState<Servicio | null>(null);
  const [viewingBenefits, setViewingBenefits] = useState<Servicio | null>(null);
  const [viewingBlocks, setViewingBlocks] = useState<Servicio | null>(null);
  const [viewingReviews, setViewingReviews] = useState<Servicio | null>(null);

  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [newBeneficioName, setNewBeneficioName] = useState("");
  const [newBeneficioDesc, setNewBeneficioDesc] = useState("");

  // Filtros
  const [searchNombre, setSearchNombre] = useState("");
  const [searchPrestador, setSearchPrestador] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const fetchServicios = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const data = await getAdminServicios({ token, limit: 1000 });
      setAllServicios(data.servicios);
      setServicios(data.servicios);
    } catch (err) {
      setError("Error al cargar los servicios");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBeneficios = async () => {
    try {
      const token = await getAccessTokenSilently();
      const data = await getBeneficios(token);
      setBeneficios(data);
    } catch (err) {
      console.error("Error al cargar beneficios", err);
    }
  };

  useEffect(() => {
    fetchServicios();
    fetchAllBeneficios();
  }, []);

  useEffect(() => {
    let temp = [...allServicios];

    if (searchNombre.trim()) {
      temp = temp.filter(s => s.nombre.toLowerCase().includes(searchNombre.toLowerCase()));
    }
    if (searchPrestador.trim()) {
      temp = temp.filter(s => s.prestador_del_servicio.toLowerCase().includes(searchPrestador.toLowerCase()));
    }
    if (searchEmail.trim()) {
      temp = temp.filter(s => s.email_de_contacto.toLowerCase().includes(searchEmail.toLowerCase()));
    }

    setServicios(temp);
    setPage(1); // Reset page on filter change
  }, [searchNombre, searchPrestador, searchEmail, allServicios]);

  const handleCreateBeneficio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBeneficioName.trim()) return;
    try {
      const token = await getAccessTokenSilently();
      await createBeneficio({ nombre: newBeneficioName, descripcion: newBeneficioDesc }, token);
      setNewBeneficioName("");
      setNewBeneficioDesc("");
      await fetchAllBeneficios();
    } catch (err) {
      alert("Error al crear beneficio");
      console.error(err);
    }
  };

  const handleDeleteBeneficio = async (id: number) => {
    if (!window.confirm("¿Eliminar este beneficio? Esto lo desvinculará de todos los servicios.")) return;
    try {
      const token = await getAccessTokenSilently();
      await deleteBeneficio(id, token);
      await fetchAllBeneficios();
    } catch (err) {
      alert("Error al eliminar beneficio");
      console.error(err);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!window.confirm("¿Eliminar este servicio? Esta acción es irreversible y eliminará todos sus datos asociados (bloques, citas, reseñas).")) return;
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/servicios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar el servicio");
      await fetchServicios();
    } catch (err) {
      alert("Error al eliminar el servicio");
      console.error(err);
    }
  };

  const paginatedServicios = servicios.slice((page - 1) * limit, page * limit);
  const total = servicios.length;

  if (loading) return <p className="p-6 text-center">Cargando servicios…</p>;
  if (error) return <p className="p-6 text-red-600 text-center">{error}</p>;

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Servicios</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchNombre}
          onChange={e => setSearchNombre(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Buscar por prestador"
          value={searchPrestador}
          onChange={e => setSearchPrestador(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Buscar por email"
          value={searchEmail}
          onChange={e => setSearchEmail(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm">Servicios por página:</label>
        <select
          value={limit}
          onChange={e => {
            setPage(1);
            setLimit(Number(e.target.value));
          }}
          className="border rounded px-3 py-1 bg-white"
        >
          {[10, 25, 50, 100].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white rounded-xl shadow-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Prestador</th>
              <th className="px-4 py-2 text-left">Teléfono</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedServicios.map(s => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{s.nombre}</td>
                <td className="px-4 py-2">{s.prestador_del_servicio}</td>
                <td className="px-4 py-2">{s.telefono_de_contacto}</td>
                <td className="px-4 py-2">{s.email_de_contacto}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-3 items-center">
                    <button onClick={() => setViewingBenefits(s)} className="text-green-600 hover:text-green-800 font-semibold text-xs">Beneficios</button>
                    <button onClick={() => setViewingBlocks(s)} className="text-purple-600 hover:text-purple-800 font-semibold text-xs">Bloques</button>
                    <button onClick={() => setViewingReviews(s)} className="text-orange-600 hover:text-orange-800 font-semibold text-xs">Reseñas</button>
                    <button onClick={() => setEditingService(s)} className="text-blue-600 hover:text-blue-800" title="Editar">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteService(s.id)} className="text-red-600 hover:text-red-800" title="Eliminar">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {servicios.length === 0 && !loading && (
          <p className="text-center text-sm text-gray-500 mt-4">No hay servicios que coincidan con los filtros.</p>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center text-sm">
        <span>
          Mostrando {(page - 1) * limit + 1}–{Math.min(page * limit, total)} de {total} servicios
        </span>
        <div className="space-x-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Anterior</button>
          <button disabled={page * limit >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Siguiente</button>
        </div>
      </div>

      {editingService && <ServiceEditModal servicio={editingService} onClose={() => setEditingService(null)} onUpdate={fetchServicios} />}
      {viewingBenefits && <ServiceBenefitsModal servicio={viewingBenefits} onClose={() => setViewingBenefits(null)} />}
      {viewingBlocks && <ServiceBlocksModal servicio={viewingBlocks} onClose={() => setViewingBlocks(null)} />}
      {viewingReviews && <ServiceReviewsModal servicio={viewingReviews} onClose={() => setViewingReviews(null)} />}

      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Gestión de Beneficios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Crear nuevo beneficio</h3>
            <form onSubmit={handleCreateBeneficio} className="bg-white p-4 rounded-lg shadow-sm space-y-3">
              <input type="text" placeholder="Nombre del beneficio" value={newBeneficioName} onChange={e => setNewBeneficioName(e.target.value)} className="w-full border rounded px-3 py-2" required />
              <textarea placeholder="Descripción (opcional)" value={newBeneficioDesc} onChange={e => setNewBeneficioDesc(e.target.value)} className="w-full border rounded px-3 py-2" rows={2} />
              <button type="submit" className="w-full bg-primary1 text-white py-2 rounded hover:bg-primary2">Crear Beneficio</button>
            </form>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Beneficios existentes</h3>
            <ul className="bg-white p-4 rounded-lg shadow-sm space-y-2 max-h-96 overflow-y-auto">
              {beneficios.map(b => (
                <li key={b.id} className="flex justify-between items-center text-sm p-1 hover:bg-gray-50 rounded">
                  <span className="font-medium">{b.nombre}</span>
                  <button onClick={() => handleDeleteBeneficio(b.id)} className="text-red-500 hover:text-red-700 font-semibold">Eliminar</button>
                </li>
              ))}
              {beneficios.length === 0 && <p className="text-gray-500 text-sm">No hay beneficios creados.</p>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}