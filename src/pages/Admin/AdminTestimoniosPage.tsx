import { useEffect, useState } from "react";
import {
  getTestimoniosPendientes,
  getTestimoniosAprobados,
  aprobarTestimonio,
  eliminarTestimonio,
  updateTestimonio,
  Testimonio,
} from "../../firebase/testimoniosService";
import { getAllPlans, updatePlan, PlanData } from "../../firebase/plansService";
import { Check, Trash, Pencil, MessageSquareQuote, BadgeCheck, BadgeDollarSign, ArrowUp, ArrowDown } from "lucide-react";

// Modal de Edición
const EditTestimonioModal = ({
  testimonio,
  onClose,
  onSave,
}: {
  testimonio: Testimonio;
  onClose: () => void;
  onSave: () => void;
}) => {
  const [nombre, setNombre] = useState(testimonio.nombre);
  const [contenido, setContenido] = useState(testimonio.contenido);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateTestimonio(testimonio.id!, { nombre, contenido });
      onSave();
    } catch (error) {
      console.error("Error al guardar testimonio:", error);
      alert("No se pudo guardar el testimonio.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Editar Testimonio</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Nombre del autor"
          />
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            rows={5}
            className="w-full border rounded px-3 py-2"
            placeholder="Contenido del testimonio"
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded bg-[#009982] text-white hover:bg-[#007c6b]">
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminPlanesTestimoniosPage() {
  const [pendientes, setPendientes] = useState<Testimonio[]>([]);
  const [aprobados, setAprobados] = useState<Testimonio[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonio, setEditingTestimonio] = useState<Testimonio | null>(null);
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

  const handleEdit = (testimonio: Testimonio) => {
    setEditingTestimonio(testimonio);
  };

  const handleSaveEdit = () => {
    setEditingTestimonio(null);
    fetchTestimonios();
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
        <button onClick={() => handleEdit(t)} className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">
          <Pencil size={14} /> Editar
        </button>
        <button onClick={() => handleEliminar(t.id!)} className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">
          <Trash size={14} /> Eliminar
        </button>
      </div>
    </li>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Planes y Testimonios</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="space-y-12">
          {/* Sección de Planes */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <BadgeDollarSign className="w-6 h-6" />
              Planes y Beneficios
            </h2>
            <div className="space-y-6">
              {plans.map((plan, idx) => (
                <div key={plan.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-4">
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
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#009982]"
                            placeholder={`Beneficio ${i + 1}`}
                          />
                          <div className="flex items-center gap-1">
                            <button onClick={() => moveFeature(idx, i, "up")} disabled={i === 0} className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent">
                              <ArrowUp size={16} />
                            </button>
                            <button onClick={() => moveFeature(idx, i, "down")} disabled={i === plan.features.length - 1} className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent">
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
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Gestión de Testimonios</h2>
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

      {editingTestimonio && (
        <EditTestimonioModal
          testimonio={editingTestimonio}
          onClose={() => setEditingTestimonio(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

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
