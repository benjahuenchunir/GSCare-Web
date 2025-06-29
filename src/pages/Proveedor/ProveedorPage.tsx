import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { UserContext } from "../../context/UserContext";
import { fetchServicios, Servicio } from "../../services/serviceService";
import {
  getBloquesForServicio,
  createBloque,
  updateBloque,
  deleteBloque,
  deleteCitaById,
  getCitaByBloque,
  getUserById,
  updateServicio,
} from "../../services/adminService";
import { Loader2, Edit, Trash, UserX, PlusCircle } from "lucide-react";
import UserIcon from '../../assets/Person.svg?react';
import QuickAccessButton from "../../common/QuickAccessButton";

interface Cita {
  id: number;
  id_bloque: number;
  id_usuario: number;
  Usuario?: { email: string };
}
interface Bloque {
  id: number;
  fecha: string;
  hora_inicio: string;
  hora_termino: string;
  disponibilidad: boolean;
  citas?: Cita[];
}

const toInputDate = (fecha: string) => fecha.split("T")[0];
const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default function ProveedorPage() {
  const { profile, loading: loadingProfile } = useContext(UserContext);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  // Estado general
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null);
  const [loadingServicios, setLoadingServicios] = useState(true);
  const [managementView, setManagementView] = useState<'blocks' | 'details'>('blocks');

  // Estado para bloques
  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [loadingBloques, setLoadingBloques] = useState(false);
  const [newBlockForm, setNewBlockForm] = useState({ fecha: new Date().toISOString().split("T")[0], hora_inicio: "09:00", hora_termino: "10:00" });
  const [isCreating, setIsCreating] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<number | null>(null);
  const [editBlockForm, setEditBlockForm] = useState({ fecha: "", hora_inicio: "", hora_termino: "" });
  const [editBlockError, setEditBlockError] = useState<string | null>(null);

  // Estado para editar servicio
  const [editServiceForm, setEditServiceForm] = useState<Servicio | null>(null);
  const [isSavingService, setIsSavingService] = useState(false);

  const fetchAndSetServicios = () => {
    if (!profile?.id) return;
    setLoadingServicios(true);
    fetchServicios()
      .then((all) => {
        const propios = all.filter((s) => s.id_usuario_creador === profile.id);
        setServicios(propios);
      })
      .finally(() => setLoadingServicios(false));
  };
  useEffect(() => {
    fetchAndSetServicios();
  }, [profile]);

  const fetchBloquesYUsuarios = async (servicioId: number) => {
    setLoadingBloques(true);
    try {
      const token = await getAccessTokenSilently();
      const raw: Bloque[] = await getBloquesForServicio(servicioId, token);
      const enhanced = await Promise.all(
        raw.map(async b => {
          if (!b.disponibilidad) {
            try {
              const cita = await getCitaByBloque(b.id, token);
              const usr = await getUserById(cita[0].id_usuario, token);
              return { ...b, citas: [{ ...cita, Usuario: { email: usr.email } }] };
            } catch { return b; }
          }
          return b;
        })
      );
      enhanced.sort((a, b) => new Date(`${a.fecha}T${a.hora_inicio}`).getTime() - new Date(`${b.fecha}T${b.hora_inicio}`).getTime());
      setBloques(enhanced);
    } catch (err) {
      console.error("Error al cargar bloques:", err);
    } finally {
      setLoadingBloques(false);
    }
  };

  useEffect(() => {
    if (servicioSeleccionado) {
      fetchBloquesYUsuarios(servicioSeleccionado.id);
      const dias = typeof servicioSeleccionado.dias_disponibles === 'string'
        ? servicioSeleccionado.dias_disponibles.split(',').map(Number)
        : servicioSeleccionado.dias_disponibles || [];
      setEditServiceForm({ ...servicioSeleccionado, dias_disponibles: dias as any });
      setManagementView('blocks');
    } else {
      setBloques([]);
      setEditServiceForm(null);
    }
  }, [servicioSeleccionado]);

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!servicioSeleccionado) return;
    setIsCreating(true);
    setCreationError(null);
    try {
      const token = await getAccessTokenSilently();
      await createBloque(servicioSeleccionado.id, newBlockForm, token);
      await fetchBloquesYUsuarios(servicioSeleccionado.id);
    } catch (err: any) {
      setCreationError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateBlock = async (bloqueId: number) => {
    if (!servicioSeleccionado) return;
    setEditBlockError(null);
    try {
      const token = await getAccessTokenSilently();
      await updateBloque(servicioSeleccionado.id, bloqueId, editBlockForm, token);
      await fetchBloquesYUsuarios(servicioSeleccionado.id);
      setEditingBlockId(null);
    } catch (err: any) {
      setEditBlockError(err.message);
    }
  };

  const handleDeleteBlock = async (bloqueId: number) => {
    if (!servicioSeleccionado || !window.confirm("¿Eliminar este bloque horario?")) return;
    try {
      const token = await getAccessTokenSilently();
      await deleteBloque(servicioSeleccionado.id, bloqueId, token);
      setBloques(bs => bs.filter(b => b.id !== bloqueId));
    } catch { alert("Error al eliminar el bloque."); }
  };

  const handleDeleteCita = async (citaId: number) => {
    if (!servicioSeleccionado || !window.confirm("¿Cancelar esta cita?")) return;
    try {
      const token = await getAccessTokenSilently();
      await deleteCitaById(citaId, token);
      await fetchBloquesYUsuarios(servicioSeleccionado.id);
    } catch { alert("Error al cancelar la cita."); }
  };

  const handleServiceFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editServiceForm) return;
    const { name, value, type } = e.target;
    const { checked } = e.target as HTMLInputElement;
    setEditServiceForm(prev => ({ ...prev!, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleDiasChange = (dia: number) => {
    if (!editServiceForm) return;
    setEditServiceForm(prev => {
      const dias = Array.isArray(prev!.dias_disponibles)
        ? prev!.dias_disponibles
        : (typeof prev!.dias_disponibles === 'string' ? prev!.dias_disponibles.split(',').map(Number) : []);
      if (dias.includes(dia)) {
        return { ...prev!, dias_disponibles: dias.filter(d => d !== dia) as any };
      } else {
        return { ...prev!, dias_disponibles: [...dias, dia].sort() as any };
      }
    });
  };

  const handleServiceUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editServiceForm) return;
    setIsSavingService(true);
    try {
      const token = await getAccessTokenSilently();
      const { id, ...data } = editServiceForm;
      const dataToUpdate = {
        ...data,
        dias_disponibles: Array.isArray(data.dias_disponibles) ? data.dias_disponibles.join(',') : data.dias_disponibles,
      };
      await updateServicio(id, dataToUpdate, token);
      fetchAndSetServicios();
      alert("Servicio actualizado con éxito");
    } catch (err) {
      alert("Error al actualizar el servicio");
    } finally {
      setIsSavingService(false);
    }
  };

  const groupedByDate = bloques.reduce((acc, b) => {
    const key = new Date(`${b.fecha}T00:00:00`).toLocaleDateString("es-CL", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    (acc[key] ||= []).push(b);
    return acc;
  }, {} as Record<string, Bloque[]>);

  const userName = profile?.nombre || "Proveedor";

  if (loadingProfile || loadingServicios) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-8 pb-12 bg-gray-100 font-sans">
      <div className="w-full px-6 py-8 space-y-8">
        <div className="flex justify-center mb-6">
          <h1 className="text-[2.5em] font-bold text-primary">Hola, {userName}!</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto mb-12">
          <div className="sm:col-start-2">
            <QuickAccessButton icon={<UserIcon className="w-8 h-8 text-accent2" />} label="Mi perfil" onClick={() => navigate("/edit-profile")} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-1/3 bg-white shadow rounded-xl p-4 self-start">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Mis servicios</h2>
          {servicios.length === 0 ? (
            <p className="text-sm text-gray-500">Aún no has registrado servicios.</p>
          ) : (
            <ul className="space-y-2">
              {servicios.map((servicio) => (
                <li key={servicio.id} className={`p-3 rounded cursor-pointer border ${servicioSeleccionado?.id === servicio.id ? "bg-primary1 text-white border-primary1" : "bg-gray-50 hover:bg-gray-100 border-gray-300"}`} onClick={() => setServicioSeleccionado(servicio)}>
                  <h3 className="text-md font-medium">{servicio.nombre}</h3>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className="flex-1 bg-white shadow rounded-xl p-4 min-h-[400px]">
          {servicioSeleccionado ? (
            <div>
              <div className="border-b mb-4">
                <nav className="flex gap-4">
                  <button onClick={() => setManagementView('blocks')} className={`py-2 px-4 font-semibold ${managementView === 'blocks' ? 'border-b-2 border-primary1 text-primary1' : 'text-gray-500'}`}>Gestionar Horarios</button>
                  <button onClick={() => setManagementView('details')} className={`py-2 px-4 font-semibold ${managementView === 'details' ? 'border-b-2 border-primary1 text-primary1' : 'text-gray-500'}`}>Editar Detalles</button>
                </nav>
              </div>

              {managementView === 'blocks' && (
                <div>
                  <form onSubmit={handleCreateBlock} className="bg-gray-50 p-4 rounded-lg mb-6 flex flex-col gap-4">
                    <h3 className="w-full font-semibold">Crear Nuevo Bloque</h3>
                    <div className="flex gap-4 flex-wrap items-end">
                      <div><label className="text-xs font-medium">Fecha</label><input type="date" value={newBlockForm.fecha} onChange={e => setNewBlockForm(f => ({ ...f, fecha: e.target.value }))} className="border rounded px-3 py-2 w-full" required /></div>
                      <div><label className="text-xs font-medium">Hora Inicio</label><input type="time" value={newBlockForm.hora_inicio} onChange={e => setNewBlockForm(f => ({ ...f, hora_inicio: e.target.value }))} className="border rounded px-3 py-2 w-full" required /></div>
                      <div><label className="text-xs font-medium">Hora Término</label><input type="time" value={newBlockForm.hora_termino} onChange={e => setNewBlockForm(f => ({ ...f, hora_termino: e.target.value }))} className="border rounded px-3 py-2 w-full" required /></div>
                      <button type="submit" disabled={isCreating} className="bg-primary1 text-white px-4 py-2 rounded flex items-center gap-2"><PlusCircle size={18} />{isCreating ? "Creando..." : "Crear"}</button>
                    </div>
                    {creationError && <div className="w-full text-red-600 text-sm mt-2 bg-red-100 p-2 rounded border border-red-200">{creationError}</div>}
                  </form>
                  <div className="max-h-[50vh] overflow-y-auto">
                    {loadingBloques ? <p>Cargando horarios...</p> : Object.entries(groupedByDate).map(([fecha, lista]) => (
                      <div key={fecha} className="space-y-2 mb-4"><h3 className="sticky top-0 bg-gray-100 p-2 rounded capitalize font-semibold">{fecha}</h3><div className="pl-2">{lista.map(b => editingBlockId === b.id ? (<div key={b.id} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg"><div className="flex-grow space-y-2"><div className="flex items-center gap-2"><input type="date" value={editBlockForm.fecha} onChange={e => setEditBlockForm(f => ({ ...f, fecha: e.target.value }))} className="border rounded px-2 py-1 text-sm w-full" /><input type="time" value={editBlockForm.hora_inicio} onChange={e => setEditBlockForm(f => ({ ...f, hora_inicio: e.target.value }))} className="border rounded px-2 py-1 text-sm w-full" /><input type="time" value={editBlockForm.hora_termino} onChange={e => setEditBlockForm(f => ({ ...f, hora_termino: e.target.value }))} className="border rounded px-2 py-1 text-sm w-full" /></div>{editBlockError && (<div className="w-full text-red-600 text-xs bg-red-100 p-2 rounded border border-red-200">{editBlockError}</div>)}</div><div className="ml-auto flex flex-col gap-2"><button onClick={() => handleUpdateBlock(b.id)} className="text-green-600 text-sm">Guardar</button><button onClick={() => { setEditingBlockId(null); setEditBlockError(null); }} className="text-gray-500 text-sm">Cancelar</button></div></div>) : (<div key={b.id} className="flex justify-between items-center p-2 border-b"><div className="flex-1"><p className="font-mono">{b.hora_inicio.slice(0, 5)}–{b.hora_termino.slice(0, 5)}</p>{b.disponibilidad ? <span className="text-xs text-green-600">Disponible</span> : <span className="text-xs text-orange-400">Ocupado por: {b.citas?.[0]?.Usuario?.email ?? "Desconocido"}</span>}</div><div className="flex items-center gap-3">{b.disponibilidad ? <button onClick={() => { setEditingBlockId(b.id); setEditBlockForm({ fecha: toInputDate(b.fecha), hora_inicio: b.hora_inicio, hora_termino: b.hora_termino }); setEditBlockError(null); }} className="text-blue-600" title="Editar bloque"><Edit size={16} /></button> : (b.citas?.[0]?.id && <button onClick={() => handleDeleteCita(b.citas![0].id)} className="text-yellow-600" title="Cancelar cita"><UserX size={16} /></button>)}<button onClick={() => handleDeleteBlock(b.id)} className="text-red-600" title="Eliminar bloque"><Trash size={16} /></button></div></div>))}</div></div>
                    ))}
                  </div>
                </div>
              )}

              {managementView === 'details' && editServiceForm && (
                <form onSubmit={handleServiceUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                  {/* Vista previa de imagen */}
                  {editServiceForm.imagen && /^https?:\/\/.+\..+/.test(editServiceForm.imagen) && (
                    <div className="col-span-full text-center">
                      <img
                        src={editServiceForm.imagen}
                        alt="Vista previa del servicio"
                        className="max-h-40 mx-auto rounded-md border"
                      />
                      <p className="text-xs text-gray-500 mt-1">Vista previa de la imagen</p>
                    </div>
                  )}
                  <label className="block col-span-full">URL de imagen<input name="imagen" value={editServiceForm.imagen} onChange={handleServiceFormChange} className="w-full border px-3 py-2 mt-1 rounded" /></label>
                  <label className="block">Nombre<input name="nombre" value={editServiceForm.nombre} onChange={handleServiceFormChange} className="w-full border px-3 py-2 mt-1 rounded" /></label>
                  <label className="block">Prestador<input name="prestador_del_servicio" value={editServiceForm.prestador_del_servicio} onChange={handleServiceFormChange} className="w-full border px-3 py-2 mt-1 rounded" /></label>
                  <label className="block col-span-full">Descripción<textarea name="descripcion" value={editServiceForm.descripcion} onChange={handleServiceFormChange} className="w-full border px-3 py-2 mt-1 rounded" rows={3} /></label>
                  <label className="block">Dirección<input name="direccion_principal_del_prestador" value={editServiceForm.direccion_principal_del_prestador} onChange={handleServiceFormChange} className="w-full border px-3 py-2 mt-1 rounded" /></label>
                  <label className="block">Teléfono<input name="telefono_de_contacto" value={editServiceForm.telefono_de_contacto} onChange={handleServiceFormChange} className="w-full border px-3 py-2 mt-1 rounded" /></label>
                  <label className="block">Email<input name="email_de_contacto" value={editServiceForm.email_de_contacto} onChange={handleServiceFormChange} className="w-full border px-3 py-2 mt-1 rounded" /></label>
                  <div className="col-span-full grid grid-cols-2 gap-4">
                    <label className="block">Horario atención (inicio)<input type="time" name="hora_inicio" value={editServiceForm.hora_inicio?.slice(0, 5) || ''} onChange={handleServiceFormChange} className="w-full border px-3 py-2 mt-1 rounded" /></label>
                    <label className="block">Horario atención (fin)<input type="time" name="hora_termino" value={editServiceForm.hora_termino?.slice(0, 5) || ''} onChange={handleServiceFormChange} className="w-full border px-3 py-2 mt-1 rounded" /></label>
                  </div>
                  <div className="col-span-full">
                    <span className="block text-sm font-medium text-gray-700 mb-2">Días de atención</span>
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                      {diasSemana.map((nombre, index) => (
                        <button
                          type="button"
                          key={index}
                          onClick={() => handleDiasChange(index)}
                          className={`p-2 text-sm rounded-lg border-2 ${(editServiceForm.dias_disponibles as unknown as number[] || []).includes(index) ? 'bg-primary1 text-white border-primary1' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                          {nombre.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-full flex items-center gap-4">
                    <label className="flex items-center gap-2"><input type="checkbox" name="hace_domicilio" checked={editServiceForm.hace_domicilio} onChange={handleServiceFormChange} /><span>Hace domicilio</span></label>
                    {editServiceForm.hace_domicilio && (<label className="block flex-1">Comunas<input name="comunas_a_las_que_hace_domicilio" value={editServiceForm.comunas_a_las_que_hace_domicilio} onChange={handleServiceFormChange} className="w-full border px-3 py-2 mt-1 rounded" /></label>)}
                  </div>
                  <div className="col-span-full flex justify-end gap-3 pt-4">
                    <button type="submit" disabled={isSavingService} className="px-4 py-2 bg-primary1 text-white hover:bg-primary1/80 rounded">{isSavingService ? "Guardando..." : "Guardar cambios"}</button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              Selecciona un servicio para gestionar sus horarios y detalles.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
