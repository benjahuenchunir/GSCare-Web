"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useParams } from "react-router-dom"
import axios from "axios"

interface Bloque {
  id: number
  start: string
  end: string
  disponible: boolean
}

interface Props {
  onContinue: (bloque: {
    id: number
    inicio: string
    fin: string
    fecha: Date
  }) => void
  onClose: () => void
}

export default function BloqueSelectorAutosuficiente({ onContinue, onClose }: Props) {
  const referenceDate = new Date()
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedBloque, setSelectedBloque] = useState<Bloque | null>(null)

  const { id } = useParams<{ id: string }>()
  const [bloques, setBloques] = useState<Bloque[]>([])
  const [loading, setLoading] = useState(true)

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  useEffect(() => {
    if (!id) return
    setLoading(true)
    axios.get(`${import.meta.env.VITE_API_URL}/servicios/${id}/bloques`)
      .then(res => {
        const parsed = res.data.map((b: any) => {
          const disponible = b?.extendedProps?.disponible ?? true
          return {
            id: b.id,
            start: b.start,
            end: b.end,
            disponible,
          }
        })
        setBloques(parsed)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const days = useMemo(() => {
    const start = new Date(referenceDate)
    start.setDate(start.getDate() + currentWeekOffset * 7)
    return Array.from({ length: 14 }).map((_, i) => {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      return {
        key: d.toISOString().split("T")[0],
        date: d,
        day: dayNames[d.getDay()],
        num: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
      }
    })
  }, [currentWeekOffset])

  const groupedBloques = useMemo(() => {
    const map: Record<string, Bloque[]> = {}
    bloques.forEach((b) => {
      const date = new Date(b.start).toISOString().split("T")[0]
      if (!map[date]) map[date] = []
      map[date].push(b)
    })
    return map
  }, [bloques])

  const currentMonth = days.length > 0 ? monthNames[days[0].month] : "Mes"

  const handleInscription = () => {
    if (!selectedBloque) return
    const fecha = new Date(selectedBloque.start)
    onContinue({
      id: selectedBloque.id,
      inicio: selectedBloque.start,
      fin: selectedBloque.end,
      fecha,
    })
  }

  if (loading) return <div className="p-6">Cargando horarios...</div>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Botón cerrar */}
      <div className="flex justify-end mb-4">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-2 rounded-full transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Encabezado y pasos */}
      <div className="mb-8">
        <h1 className="text-xl font-medium text-gray-800 mb-6">Selecciona fecha y hora de tu servicio</h1>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-medium">1</div>
            <span className="ml-3 text-blue-500 font-medium">Fecha y hora</span>
          </div>
          <div className="flex-1 mx-4 h-px bg-gray-200" />
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-500 rounded-full text-sm font-medium">3</div>
            <span className="ml-3 text-gray-500">Datos de contacto</span>
          </div>
        </div>
      </div>

      {/* Calendario */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button onClick={() => setCurrentWeekOffset(o => o - 1)} className="p-1 hover:bg-gray-200 rounded transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-medium text-blue-500 mx-4">{currentMonth}</h2>
          </div>
          <div className="flex items-center">
            <button className="text-sm text-gray-600 hover:text-gray-800 mr-4">Otras fechas disponibles</button>
            <button onClick={() => setCurrentWeekOffset(o => o + 1)} className="p-1 hover:bg-gray-200 rounded transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center mb-8">
          <button onClick={() => setCurrentWeekOffset(o => o - 1)} className="p-1 hover:bg-gray-200 rounded mr-4 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex space-x-2 overflow-x-auto">
            {days.map((d) => {
              const bloquesDelDia = groupedBloques[d.key] || []
              const isAvailable = bloquesDelDia.some(b => b.disponible)
              const isSelected = selectedDate === d.key
              return (
                <button
                  key={d.key}
                  onClick={() => {
                    if (isAvailable) {
                      setSelectedDate(d.key)
                      setSelectedBloque(null)
                    }
                  }}
                  disabled={!isAvailable}
                  className={`flex flex-col items-center p-3 rounded-lg min-w-[60px] transition-colors border 
                    ${isAvailable
                      ? isSelected
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    }`}
                >
                  <span className="text-xs font-medium mb-1">{d.day}</span>
                  <span className="text-sm font-bold">{d.num.toString().padStart(2, "0")}</span>
                </button>
              )
            })}
          </div>
          <button onClick={() => setCurrentWeekOffset(o => o + 1)} className="p-1 hover:bg-gray-200 rounded ml-4 transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {selectedDate ? (
          <div className="space-y-6">
            {(groupedBloques[selectedDate] || []).length > 0 ? (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Horarios disponibles</h3>
                <div className="flex flex-wrap gap-2">
                  {groupedBloques[selectedDate].map((bloque) => {
                    const horaInicio = new Date(bloque.start).toTimeString().slice(0, 5)
                    const horaFin = new Date(bloque.end).toTimeString().slice(0, 5)
                    const label = `${horaInicio} - ${horaFin}`
                    const isSelected = selectedBloque?.id === bloque.id
                    return (
                      <button
                        key={bloque.id}
                        onClick={() => bloque.disponible && setSelectedBloque(bloque)}
                        disabled={!bloque.disponible}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors
                          ${!bloque.disponible
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : isSelected
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay horarios disponibles para este día</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Selecciona una fecha para ver los horarios disponibles</p>
          </div>
        )}

        {selectedBloque && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleInscription}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Inscribir cita
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
