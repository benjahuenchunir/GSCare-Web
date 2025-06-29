import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getResenasForServicio, deleteResena } from "../../services/adminService";
import { Servicio } from "../../pages/Admin/AdminServicesPage";
import { Trash } from "lucide-react";

interface Resena {
  id: number;
  rating: number;
  review: string;
  Usuario: { nombre: string };
  createdAt: string;
}

interface Props {
  servicio: Servicio;
  onClose: () => void;
}

export default function ServiceReviewsModal({ servicio, onClose }: Props) {
  const { getAccessTokenSilently } = useAuth0();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResenas = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const data = await getResenasForServicio(servicio.id, token);
      setResenas(data);
    } catch (err) {
      console.error("Error fetching reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResenas();
  }, [servicio]);

  const handleDeleteResena = async (resenaId: number) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta reseña?")) return;
    try {
      const token = await getAccessTokenSilently();
      await deleteResena(resenaId, token);
      setResenas(prev => prev.filter(r => r.id !== resenaId));
    } catch (err) {
      alert("Error al eliminar la reseña.");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg flex flex-col max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4 flex-shrink-0">Reseñas para: {servicio.nombre}</h2>
        
        <div className="flex-grow overflow-y-auto pr-2">
          {loading ? <p>Cargando...</p> : (
            <div className="space-y-4">
              {resenas.map(r => (
                <div key={r.id} className="border-b pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{r.Usuario.nombre}</p>
                      <p className="text-yellow-500 text-lg">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteResena(r.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Eliminar reseña"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString('es-CL')}</p>
                  <p className="mt-2 text-gray-700">{r.review}</p>
                </div>
              ))}
              {resenas.length === 0 && <p>No hay reseñas para este servicio.</p>}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end flex-shrink-0 border-t pt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
