import React from 'react'
import QuickAccessButton from '../common/QuickAccessButton'
import SectionTitle      from '../common/SectionTitle'
import InfoCard          from '../common/InfoCard'
import EmptyState        from '../common/EmptyState'

// Ejemplo de import de SVG (requiere vite-plugin-svgr)
import ClockIcon    from '../assets/Clock2.svg?react'
import LocationIcon from '../assets/Location.svg?react'
import CalendarIcon from '../assets/Calendar2.svg?react'
import HandshakeIcon from '../assets/Heart2.svg?react'
import HeadsetIcon from '../assets/Support.svg?react'
import UserIcon from '../assets/Person.svg?react'

const UserPage: React.FC = () => {
  const userName = 'María'

  // un par de actividades extra
  const upcomingActivities = [
    { title: 'Yoga',             time: '10:00 AM – 11:00 AM', location: 'Centro comunitario – Sala 2B', tag: 'Hoy' },
    { title: 'Pilates',          time: '11:30 AM – 12:30 PM', location: 'Gimnasio local – Sala 1',      tag: 'Mañana' },
    { title: 'Taller de lectura',time: '2:00 PM – 3:00 PM',   location: 'Biblioteca – Sala de Lectura', tag: 'En 2 días'  },
    { title: 'Manualidades',     time: '4:00 PM – 5:00 PM',   location: 'Centro comunitario – Aula 3',  tag: 'En 3 días' }
  ]

  const notifications = [
    { msg: 'Nuevo taller de bienestar la próxima semana', when: 'Hace 2 horas' },
    { msg: 'Recuerda tu cronograma de remedios',           when: 'Hace 1 día'    },
    { msg: 'Visita médica agendada para el viernes',       when: 'Hace 3 días'   }
  ]

  const activeServices = [
      { name: 'Monitoreo de Salud',    desc: 'Reporte de chequeos diarios' },
      { name: 'Actividades grupales',  desc: 'Reuniones sociales semanales' },
      { name: 'Cuidado del hogar',     desc: 'Visitas dos veces por semana' }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full px-6 py-8 space-y-8">
        {/* Saludo */}
        <h1 className="text-4xl font-bold text-primary">Hola, {userName}!</h1>

        {/* Botones rápidos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickAccessButton icon={<CalendarIcon className="w-8 h-8 text-primary" />} label="Mi agenda" />
          <QuickAccessButton icon={<HandshakeIcon className="w-8 h-8 text-secondary" />} label="Mis servicios" />
          <QuickAccessButton icon={<HeadsetIcon className="w-8 h-8 text-accent3" />} label="Soporte" />
          <QuickAccessButton icon={<UserIcon className="w-8 h-8 text-accent2" />} label="Mi perfil" />
        </div>

        {/* 🚩 Grid Actividades / Notificaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">

          {/* ➡️ Actividades como columna vertical */}
          <div className="space-y-4">
            <SectionTitle title="Siguientes Actividades" />
            <div className="bg-white p-4 rounded-lg h-80 overflow-y-auto space-y-4">
              {upcomingActivities.length === 0 ? (
                <EmptyState mensaje="No tienes actividades agendadas por ahora." />
              ) : (
                upcomingActivities.map((a, i) => (
                    <div
                      key={i}
                      className="w-full bg-[#e7f5f3] px-5 py-4 rounded-lg flex justify-between items-center shadow-sm"
                    >
                      {/* Parte izquierda */}
                      <div className="flex flex-col gap-2">
                        <h4 className="text-xl font-bold text-black text-left">{a.title}</h4>
                        <div className="flex items-center text-lg text-gray-800 gap-2">
                          <ClockIcon className="w-6 h-6 text-black fill-current" />
                          <span>{a.time}</span>
                        </div>
                        <div className="flex items-center text-lg text-gray-800 gap-2">
                          <LocationIcon className="w-6 h-6 text-black fill-current" />
                          <span>{a.location}</span>
                        </div>
                      </div>
  
                      {/* Parte derecha: Fecha en recuadro */}
                      <div className="flex flex-col items-end text-sm">
                        <span className="mt-1 px-4 py-1 bg-[#62CBC9] text-black font-semibold rounded-md">
                          {a.tag}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>


          {/* ⬇️ Notificaciones vertical scroll */}
          <div className="space-y-4">
            <SectionTitle title="Notificaciones" />
            <div className="bg-white p-4 rounded-lg h-80 overflow-y-auto space-y-3">
            {notifications.length === 0 ? (
              <EmptyState mensaje="No tienes notificaciones nuevas." />
            ) : (
              (notifications.map((n, i) => (
                  <div
                    key={i}
                    className="bg-yellow-50 border border-[#D6A500] rounded-lg px-4 py-3"
                  >
                    <h4 className="text-base md:text-lg font-semibold text-gray-900 text-center">
                      {n.msg}
                    </h4>
                    <p className="mt-1 text-sm text-gray-700 text-center">{n.when}</p>
                  </div>
                )))
            )}
            </div>
          </div>


        </div>


        {/* Servicios activos */}
        <div className="space-y-4">
          <SectionTitle title="Tus servicios activos" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeServices.map((s, i) => (
              <InfoCard
                key={i}
                title={s.name}
                content={<p className="text-sm text-gray-700">{s.desc}</p>}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPage
