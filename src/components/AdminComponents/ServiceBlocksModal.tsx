// src/components/AdminComponents/ServiceBlocksModal.tsx
import { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import {
  getBloquesForServicio,
  createBloque,
  updateBloque,
  deleteBloque,
  deleteCitaById,
  getCitaByBloque,
  getUserById,
} from "../../services/adminService"
import { Servicio } from "../../pages/Admin/AdminServicesPage"
import { Edit, Trash, UserX, PlusCircle } from "lucide-react"

interface Cita {
  id: number
  id_bloque: number
  id_usuario: number
  Usuario?: { email: string }
}
interface Bloque {
  id: number
  fecha: string          // "YYYY-MM-DD"
  hora_inicio: string    // "HH:MM"
  hora_termino: string   // "HH:MM"
  disponibilidad: boolean
  // ya no esperamos `citas` desde el backend
  citas?: Cita[]
}
interface Props {
  servicio: Servicio
  onClose: () => void
}

// Helper para inputs
const toInputDate = (fecha: string) => fecha.split("T")[0]

export default function ServiceBlocksModal({ servicio, onClose }: Props) {
  const { getAccessTokenSilently } = useAuth0()
  const [bloques, setBloques] = useState<Bloque[]>([])
  const [loading, setLoading] = useState(true)

  const [newBlockForm, setNewBlockForm] = useState({
    fecha: new Date().toISOString().split("T")[0],
    hora_inicio: "09:00",
    hora_termino: "10:00",
  })
  const [isCreating, setIsCreating] = useState(false)
  const [creationError, setCreationError] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ fecha: "", hora_inicio: "", hora_termino: "" })

  // 1) Trae bloques + para cada ocupado busca su cita y luego el email
  const fetchBloquesYUsuarios = async () => {
    setLoading(true)
    try {
      const token = await getAccessTokenSilently()
      const raw: Bloque[] = await getBloquesForServicio(servicio.id, token)

      const enhanced = await Promise.all(
        raw.map(async b => {
          if (!b.disponibilidad) {
            try {
              // trae la cita para este bloque
              const cita = await getCitaByBloque(b.id, token)
              // trae email del usuario
              const usr = await getUserById(cita[0].id_usuario, token)
              return {
                ...b,
                citas: [{ ...cita, Usuario: { email: usr.email } }],
              }
            } catch {
              return b
            }
          }
          return b
        })
      )

      // Orden cronológico por fecha+hora de inicio
      enhanced.sort((a, b) => {
        const da = new Date(`${a.fecha}T${a.hora_inicio}`).getTime()
        const db = new Date(`${b.fecha}T${b.hora_inicio}`).getTime()
        return da - db
      })
      setBloques(enhanced)
    } catch (err) {
      console.error("Error al cargar bloques y usuarios:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBloquesYUsuarios()
  }, [servicio])

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setCreationError(null);
    try {
      const token = await getAccessTokenSilently()
      await createBloque(servicio.id, newBlockForm, token)
      await fetchBloquesYUsuarios()
    } catch (err: any) {
      setCreationError(err.message);
    } finally {
      setIsCreating(false)
    }
  }
  const handleUpdateBlock = async (bloqueId: number) => {
    try {
      const token = await getAccessTokenSilently()
      await updateBloque(servicio.id, bloqueId, editForm, token)
      await fetchBloquesYUsuarios()
      setEditingBlockId(null)
    } catch {
      alert("Error al actualizar el bloque.")
    }
  }
  const handleDeleteBlock = async (bloqueId: number) => {
    if (!confirm("¿Eliminar este bloque horario?")) return
    try {
      const token = await getAccessTokenSilently()
      await deleteBloque(servicio.id, bloqueId, token)
      setBloques(bs => bs.filter(b => b.id !== bloqueId))
    } catch {
      alert("Error al eliminar el bloque.")
    }
  }
  const handleDeleteCita = async (citaId: number) => {
    if (!confirm("¿Cancelar esta cita?")) return
    try {
      const token = await getAccessTokenSilently()
      await deleteCitaById(citaId, token)
      await fetchBloquesYUsuarios()
    } catch {
      alert("Error al cancelar la cita.")
    }
  }

  // Agrupa por fecha
  const groupedByDate = bloques.reduce((acc, b) => {
    const key = new Date(`${b.fecha}T00:00:00`)
      .toLocaleDateString("es-CL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    ;(acc[key] ||= []).push(b)
    return acc
  }, {} as Record<string, Bloque[]>)

  const renderBlock = (b: Bloque) => {
    if (editingBlockId === b.id) {
      return (
        <div key={b.id} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
          <input
            type="date"
            value={editForm.fecha}
            onChange={e => setEditForm(f => ({ ...f, fecha: e.target.value }))}
            className="border rounded px-2 py-1 text-sm"
          />
          <input
            type="time"
            value={editForm.hora_inicio}
            onChange={e => setEditForm(f => ({ ...f, hora_inicio: e.target.value }))}
            className="border rounded px-2 py-1 text-sm"
          />
          <input
            type="time"
            value={editForm.hora_termino}
            onChange={e => setEditForm(f => ({ ...f, hora_termino: e.target.value }))}
            className="border rounded px-2 py-1 text-sm"
          />
          <div className="ml-auto flex gap-2">
            <button onClick={() => handleUpdateBlock(b.id)} className="text-green-600">Guardar</button>
            <button onClick={() => setEditingBlockId(null)} className="text-gray-500">Cancelar</button>
          </div>
        </div>
      )
    }

    return (
      <div key={b.id} className="flex justify-between items-center p-2 border-b">
        <div className="flex-1">
          <p className="font-mono">
            {b.hora_inicio.slice(0, 5)}–{b.hora_termino.slice(0, 5)}
          </p>
          {b.disponibilidad ? (
            <span className="text-xs text-green-600">Disponible</span>
          ) : (
            <span className="text-xs text-orange-400">
              Ocupado por: {b.citas?.[0]?.Usuario?.email ?? "Desconocido"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {b.disponibilidad ? (
            <button
              onClick={() => {
                setEditingBlockId(b.id)
                setEditForm({
                  fecha: toInputDate(b.fecha),
                  hora_inicio: b.hora_inicio,
                  hora_termino: b.hora_termino,
                })
              }}
              className="text-blue-600"
              title="Editar bloque"
            >
              <Edit size={16} />
            </button>
          ) : (
            b.citas?.[0]?.id && (
              <button
                onClick={() => handleDeleteCita(b.citas![0].id)}
                className="text-yellow-600"
                title="Cancelar cita"
              >
                <UserX size={16} />
              </button>
            )
          )}
          <button
            onClick={() => handleDeleteBlock(b.id)}
            className="text-red-600"
            title="Eliminar bloque"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl shadow-lg max-h-[90vh] flex flex-col">
        <h2 className="text-xl font-bold mb-4">
          Gestionar Bloques Horarios para: {servicio.nombre}
        </h2>
        {/* form crear */}
        <form onSubmit={handleCreateBlock} className="bg-gray-50 p-4 rounded-lg mb-6 flex flex-col gap-4">
          <div>
            <h3 className="w-full font-semibold">Crear Nuevo Bloque</h3>
            {servicio.hora_inicio && servicio.hora_termino && (
              <p className="text-sm text-gray-600">
                Horario de atención del servicio: {servicio.hora_inicio.slice(0, 5)} - {servicio.hora_termino.slice(0, 5)}
              </p>
            )}
          </div>
          <div className="flex gap-4 flex-wrap items-start">
            <div>
              <label className="text-xs font-medium">Fecha</label>
              <input
                type="date"
                value={newBlockForm.fecha}
                onChange={e => setNewBlockForm(f => ({ ...f, fecha: e.target.value }))}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium">Hora Inicio</label>
              <input
                type="time"
                value={newBlockForm.hora_inicio}
                onChange={e => setNewBlockForm(f => ({ ...f, hora_inicio: e.target.value }))}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium">Hora Término</label>
              <input
                type="time"
                value={newBlockForm.hora_termino}
                onChange={e => setNewBlockForm(f => ({ ...f, hora_termino: e.target.value }))}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="bg-primary1 text-white px-4 py-2 rounded flex items-center gap-2 self-end"
            >
              <PlusCircle size={18} />
              {isCreating ? "Creando..." : "Crear"}
            </button>
          </div>
          {creationError && (
            <div className="w-full text-red-600 text-sm mt-2 bg-red-100 p-2 rounded border border-red-200">
              {creationError}
            </div>
          )}
        </form>
        {/* lista agrupada */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p>Cargando…</p>
          ) : (
            Object.entries(groupedByDate).map(([fecha, lista]) => (
              <div key={fecha} className="space-y-2">
                <h3 className="sticky top-0 bg-gray-100 p-2 rounded capitalize">
                  {fecha}
                </h3>
                <div className="pl-2">{lista.map(renderBlock)}</div>
              </div>
            ))
          )}
        </div>
        {/* cerrar */}
        <div className="mt-4 border-t pt-4 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
