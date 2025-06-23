import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getBeneficiosForServicio, getBeneficios, addBeneficioToServicio, removeBeneficioFromServicio } from "../../services/adminService";
import { Servicio, Beneficio } from "../../pages/Admin/AdminServicesPage";

interface Props {
  servicio: Servicio;
  onClose: () => void;
}

export default function ServiceBenefitsModal({ servicio, onClose }: Props) {
  const { getAccessTokenSilently } = useAuth0();
  const [serviceBeneficios, setServiceBeneficios] = useState<Beneficio[]>([]);
  const [allBeneficios, setAllBeneficios] = useState<Beneficio[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBeneficios = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const [sBeneficios, aBeneficios] = await Promise.all([
        getBeneficiosForServicio(servicio.id, token),
        getBeneficios(token)
      ]);
      setServiceBeneficios(sBeneficios);
      setAllBeneficios(aBeneficios);
    } catch (err) {
      console.error("Error fetching benefits", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeneficios();
  }, [servicio]);

  const handleAddBeneficio = async (beneficioId: number) => {
    try {
      const token = await getAccessTokenSilently();
      await addBeneficioToServicio(servicio.id, beneficioId, token);
      
      // Actualización local para evitar recargar todo el modal
      const beneficioAgregado = allBeneficios.find(b => b.id === beneficioId);
      if (beneficioAgregado) {
        setServiceBeneficios(prev => [...prev, beneficioAgregado].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      }
    } catch (err) {
      alert("Error al agregar beneficio");
    }
  };

  const handleRemoveBeneficio = async (beneficioId: number) => {
    try {
      const token = await getAccessTokenSilently();
      await removeBeneficioFromServicio(servicio.id, beneficioId, token);
      // Actualización local
      setServiceBeneficios(prev => prev.filter(b => b.id !== beneficioId));
    } catch (err) {
      alert("Error al quitar beneficio");
    }
  };

  const availableBeneficios = allBeneficios.filter(
    (ab) => !serviceBeneficios.some((sb) => sb.id === ab.id)
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Beneficios para: {servicio.nombre}</h2>
        {loading ? <p>Cargando...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 border-b pb-1">Beneficios Asociados</h3>
              <ul className="space-y-1 max-h-64 overflow-y-auto">
                {serviceBeneficios.map(b => (
                  <li key={b.id} className="flex justify-between items-center p-1 hover:bg-gray-50 rounded">
                    {b.nombre}
                    <button onClick={() => handleRemoveBeneficio(b.id)} className="text-red-500 font-semibold text-sm">Quitar</button>
                  </li>
                ))}
                {serviceBeneficios.length === 0 && <p className="text-sm text-gray-500">Sin beneficios.</p>}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 border-b pb-1">Agregar Beneficio</h3>
              <ul className="space-y-1 max-h-64 overflow-y-auto">
                {availableBeneficios.map(b => (
                  <li key={b.id} className="flex justify-between items-center p-1 hover:bg-gray-50 rounded">
                    {b.nombre}
                    <button onClick={() => handleAddBeneficio(b.id)} className="text-green-500 font-semibold text-sm">Agregar</button>
                  </li>
                ))}
                {availableBeneficios.length === 0 && <p className="text-sm text-gray-500">No hay más beneficios para agregar.</p>}
              </ul>
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
