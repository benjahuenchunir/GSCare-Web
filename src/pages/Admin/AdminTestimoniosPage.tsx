import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTestimoniosPendientes,
  getTestimoniosAprobados,
  aprobarTestimonio,
  eliminarTestimonio,
  Testimonio,
} from "../../firebase/testimoniosService";
import { getAllPlans, updatePlan, PlanData } from "../../firebase/plansService";
import { Check, Trash, Pencil, MessageSquareQuote, BadgeCheck, BadgeDollarSign, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function AdminPlanesTestimoniosPage() {
  const navigate = useNavigate();
  const [pendientes, setPendientes] = useState<Testimonio[]>([]);
  const [aprobados, setAprobados] = useState<Testimonio[]>([]);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [savingPlans, setSavingPlans] = useState<Record<string, boolean>>({});

  const fetchTestimonios = async () => {
    setLoading(true);
    try {
      const [pendientesData, aprobadosData, plansData] = await Promise.all([
        getTestimoniosPendientes(),
        getTestimoniosAprobados(),
        getAllPlans(),
      ]);
      setPendientes(pendientesData);
      setAprobados(aprobadosData);
      setPlans(plansData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("No se pudieron cargar los datos de la página.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonios();
  }, []);

  const handleAprobar = async (id: string) => {
    await aprobarTestimonio(id);
    fetchTestimonios();
  };

  const handleEliminar = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este testimonio? Esta acción es irreversible.")) {
      await eliminarTestimonio(id);
      fetchTestimonios();
    }
  };

  const updatePlanField = (index: number, field: keyof Omit<PlanData, "id" | "features">, value: string) => {
    setPlans((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateFeature = (planIdx: number, featureIdx: number, value: string) => {
    setPlans((prev) =>
      prev.map((plan, pIdx) => {
        if (pIdx === planIdx) {
          const newFeatures = [...plan.features];
          newFeatures[featureIdx] = value;
          return { ...plan, features: newFeatures };
        }
        return plan;
      })
    );
  };

  const moveFeature = (planIdx: number, featureIdx: number, direction: "up" | "down") => {
    setPlans((prev) =>
      prev.map((plan, pIdx) => {
        if (pIdx === planIdx) {
          const newFeatures = [...plan.features];
          const newIndex = direction === "up" ? featureIdx - 1 : featureIdx + 1;
          if (newIndex >= 0 && newIndex < newFeatures.length) {
            const temp = newFeatures[featureIdx];
            newFeatures[featureIdx] = newFeatures[newIndex];
            newFeatures[newIndex] = temp;
          }
          return { ...plan, features: newFeatures };
        }
        return plan;
      })
    );
  };

  const addFeature = (planIdx: number) => {
    setPlans((prev) =>
      prev.map((plan, pIdx) => {
        if (pIdx === planIdx) {
          return { ...plan, features: [...plan.features, ""] };
        }
        return plan;
      })
    );
  };

  const removeFeature = (planIdx: number, featureIdx: number) => {
    setPlans((prev) =>
      prev.map((plan, pIdx) => {
        if (pIdx === planIdx) {
          const newFeatures = plan.features.filter((_, fIdx) => fIdx !== featureIdx);
          return { ...plan, features: newFeatures };
        }
        return plan;
      })
    );
  };

  const savePlan = async (index: number) => {
    const plan = plans[index];
    setSavingPlans(prev => ({ ...prev, [plan.id]: true }));
    try {
      await updatePlan(plan.id, {
        title: plan.title,
        price: plan.price,
        currency: plan.currency,
        features: plan.features.filter(f => f.trim() !== ""),
      });
      alert(`Plan "${plan.title}" actualizado correctamente.`);
    } catch (error) {
      console.error("Error al guardar el plan:", error);
      alert("No se pudo guardar el plan.");
    } finally {
      setSavingPlans(prev => ({ ...prev, [plan.id]: false }));
    }
  };

  const TestimonioCard = ({ t, isPending }: { t: Testimonio; isPending?: boolean }) => (
    <li className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <p className="font-semibold text-gray-800">{t.nombre}</p>
      <p className="text-sm text-gray-600 mt-1 italic">"{t.contenido}"</p>
      <div className="flex gap-2 mt-3">
        {isPending && (
          <button onClick={() => handleAprobar(t.id!)} className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200">
            <Check size={14} /> Aprobar
          </button>
        )}
        <button onClick={() => handleEliminar(t.id!)} className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">
          <Trash size={14} /> Eliminar
        </button>
      </div>
    </li>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Planes y Testimonios</h1>
        <button
          onClick={() => navigate("/pricing")}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
        >
          <ExternalLink size={18} />
          Ver Página de Precios
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="space-y-12">
          {/* Sección de Planes */}
          <section className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BadgeDollarSign className="w-6 h-6" />
              Planes y Beneficios
            </h2>
            <div className="space-y-6">
              {plans.map((plan, idx) => (
                <div key={plan.id} className="bg-gray-50 p-5 rounded-lg border border-gray-200 space-y-4">
                  <h3 className="font-semibold text-md text-gray-700 flex items-center gap-2">
                    <Pencil className="w-4 h-4" /> {plan.title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input label="Título" value={plan.title} onChange={(v) => updatePlanField(idx, "title", v)} />
                    <Input label="Precio" value={plan.price} onChange={(v) => updatePlanField(idx, "price", v)} />
                    <Input label="Moneda" value={plan.currency} onChange={(v) => updatePlanField(idx, "currency", v)} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Beneficios</label>
                    <div className="space-y-2">
                      {plan.features.map((f, i) => (
                        <div key={`${plan.id}-feature-${i}`} className="flex items-center gap-2">
                          <input
                            value={f}
                            onChange={(e) => updateFeature(idx, i, e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982] focus:outline-none"
                            placeholder={`Beneficio ${i + 1}`}
                          />
                          <div className="flex items-center gap-1">
                            <button onClick={() => moveFeature(idx, i, "up")} disabled={i === 0} className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-transparent">
                              <ArrowUp size={16} />
                            </button>
                            <button onClick={() => moveFeature(idx, i, "down")} disabled={i === plan.features.length - 1} className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-transparent">
                              <ArrowDown size={16} />
                            </button>
                            <button onClick={() => removeFeature(idx, i)} className="p-1 rounded-md text-red-500 hover:bg-red-100">
                              <Trash size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => addFeature(idx)} className="text-sm text-blue-600 hover:underline mt-2">
                        + Agregar beneficio
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => savePlan(idx)}
                    disabled={savingPlans[plan.id]}
                    className="bg-[#009982] hover:bg-[#007c6b] text-white px-4 py-2 rounded text-sm mt-2 disabled:bg-gray-400"
                  >
                    {savingPlans[plan.id] ? "Guardando..." : "Guardar cambios del plan"}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Sección de Testimonios */}
          <section className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gestión de Testimonios</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Testimonios Pendientes */}
              <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <MessageSquareQuote className="w-5 h-5" />
                  Pendientes de Revisión ({pendientes.length})
                </h3>
                {pendientes.length > 0 ? (
                  <ul className="space-y-4">
                    {pendientes.map((t) => <TestimonioCard key={t.id} t={t} isPending />)}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No hay testimonios pendientes.</p>
                )}
              </section>

              {/* Testimonios Aprobados */}
              <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5" />
                  Aprobados y Visibles ({aprobados.length})
                </h3>
                {aprobados.length > 0 ? (
                  <ul className="space-y-4">
                    {aprobados.map((t) => <TestimonioCard key={t.id} t={t} />)}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No hay testimonios aprobados.</p>
                )}
              </section>
            </div>
          </section>
        </div>
      )}

    </div>
  );
}