"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useParams } from 'react-router-dom';

export default function Component() {
  // Fecha de referencia inicial (puedes cambiar esta fecha)
  const referenceDate = new Date(2024, 5, 4) // 4 de Junio 2024 (mes 5 = Junio)

  const [currentWeekOffset, setCurrentWeekOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Obtener el ID de la URL (si es necesario)
  const params = useParams();
  const id = params?.id;
  console.log("Component params:", id);

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  // Generar las fechas dinámicamente basándose en la fecha de referencia y el offset
  const days = useMemo(() => {
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() + currentWeekOffset * 7)

    const generatedDays = []
    for (let i = 0; i < 14; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)

      generatedDays.push({
        day: dayNames[currentDate.getDay()],
        date: currentDate.getDate(),
        fullDate: new Date(currentDate),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        dayOfWeek: currentDate.getDay(),
      })
    }

    return generatedDays
  }, [currentWeekOffset, referenceDate])

  // Función para obtener horarios disponibles según el día seleccionado
  const getAvailableSlots = (selectedDate: number | null) => {
    if (!selectedDate) return { morning: [], afternoon: [] }

    const selectedDay = days.find((day) => day.date === selectedDate)
    if (!selectedDay) return { morning: [], afternoon: [] }

    const dayOfWeek = selectedDay.dayOfWeek // 0 = Domingo, 1 = Lunes, etc.

    // Definir horarios según el día de la semana
    switch (dayOfWeek) {
      case 0: // Domingo
        return {
          morning: [],
          afternoon: ["2:00 pm", "3:00 pm", "4:00 pm"],
        }
      case 1: // Lunes
        return {
          morning: ["9:00 am", "10:00 am", "11:00 am"],
          afternoon: ["1:00 pm", "2:00 pm", "3:00 pm", "4:00 pm"],
        }
      case 2: // Martes
        return {
          morning: ["9:30 am", "10:30 am", "11:30 am"],
          afternoon: ["1:30 pm", "2:30 pm", "3:30 pm"],
        }
      case 3: // Miércoles
        return {
          morning: ["9:00 am", "10:00 am", "11:00 am", "12:00 pm"],
          afternoon: ["2:00 pm", "3:00 pm", "4:00 pm", "5:00 pm"],
        }
      case 4: // Jueves
        return {
          morning: ["8:30 am", "9:30 am", "10:30 am", "11:30 am"],
          afternoon: ["1:00 pm", "2:00 pm", "3:00 pm"],
        }
      case 5: // Viernes
        return {
          morning: ["9:00 am", "10:00 am", "11:00 am"],
          afternoon: ["1:00 pm", "2:00 pm", "3:00 pm", "4:00 pm", "5:00 pm"],
        }
      case 6: // Sábado
        return {
          morning: ["10:00 am", "11:00 am"],
          afternoon: ["2:00 pm", "3:00 pm"],
        }
      default:
        return { morning: [], afternoon: [] }
    }
  }

  // Obtener horarios disponibles para el día seleccionado
  const availableSlots = getAvailableSlots(selectedDate)

  // Obtener el mes principal mostrado (del primer día)
  const currentMonth = days.length > 0 ? monthNames[days[0].month] : "Junio"

  const handlePrevWeek = () => {
    setCurrentWeekOffset((prev) => prev - 1)
    setSelectedDate(null) // Reset selection when changing weeks
    setSelectedTime(null)
  }

  const handleNextWeek = () => {
    setCurrentWeekOffset((prev) => prev + 1)
    setSelectedDate(null) // Reset selection when changing weeks
    setSelectedTime(null)
  }

  const handleDateSelect = (date: number) => {
    setSelectedDate(date)
    setSelectedTime(null) // Reset time when changing date
  }

  const handleInscription = () => {
    const selectedDay = days.find((day) => day.date === selectedDate)
    if (selectedDay && selectedTime) {
      const monthName = monthNames[selectedDay.month]
      const dayName = selectedDay.day
      alert(
        `Cita inscrita para el ${dayName} ${selectedDate} de ${monthName} ${selectedDay.year} a las ${selectedTime}`,
      )
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-xl font-medium text-gray-800 mb-6">Selecciona fecha y hora de tu servicio</h1>

        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-medium">
              1
            </div>
            <span className="ml-3 text-blue-500 font-medium">Fecha y hora</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        {/* Month Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button onClick={handlePrevWeek} className="p-1 hover:bg-gray-200 rounded transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-medium text-blue-500 mx-4">{currentMonth}</h2>
          </div>

          <div className="flex items-center">
            <button className="text-sm text-gray-600 hover:text-gray-800 mr-4">Otras fechas disponibles</button>
            <button onClick={handleNextWeek} className="p-1 hover:bg-gray-200 rounded transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="flex items-center mb-8">
          <button onClick={handlePrevWeek} className="p-1 hover:bg-gray-200 rounded mr-4 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex space-x-2 overflow-x-auto">
            {days.map((day, index) => (
              <button
                key={`${day.date}-${day.month}-${index}`}
                onClick={() => handleDateSelect(day.date)}
                className={`flex flex-col items-center p-3 rounded-lg min-w-[60px] transition-colors ${
                  selectedDate === day.date ? "bg-blue-500 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-xs font-medium mb-1">{day.day}</span>
                <span className="text-sm font-bold">{day.date.toString().padStart(2, "0")}</span>
              </button>
            ))}
          </div>

          <button onClick={handleNextWeek} className="p-1 hover:bg-gray-200 rounded ml-4 transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Time Slots */}
        {selectedDate ? (
          <div className="space-y-6">
            {/* Morning */}
            {availableSlots.morning.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Mañana</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSlots.morning.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedTime === time
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Afternoon */}
            {availableSlots.afternoon.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Tarde</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSlots.afternoon.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedTime === time
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No slots available */}
            {availableSlots.morning.length === 0 && availableSlots.afternoon.length === 0 && (
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

        {/* Inscribir Button */}
        {selectedDate && selectedTime && (
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
