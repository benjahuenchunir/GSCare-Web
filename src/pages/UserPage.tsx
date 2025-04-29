import React, { useEffect, useState } from "react";
import { useAuth0 }           from "@auth0/auth0-react";
import { getUserByEmail, User } from "../services/userService";
import QuickAccessButton from "../common/QuickAccessButton";
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
  const { user, isAuthenticated, logout } = useAuth0();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Datos hardcodeados para consejos del día
  const consejos = [
    { text: 'Bebe agua cada 2 horas para mantenerte hidratado 💧' },
    { text: 'Camina al menos 20 minutos hoy para mantener tu salud activa 🚶‍♂️' },
    { text: 'Comparte una llamada con un ser querido para fortalecer tus lazos 📞' },
    { text: 'Recuerda tomar tus medicamentos a tiempo 💊' },
    { text: 'Dedica tiempo a tus pasatiempos favoritos para relajarte 🎨' },
    { text: 'Haz una lista de cosas que te hacen feliz y revísala hoy 😊' },
    { text: 'Practica la gratitud escribiendo 3 cosas por las que estás agradecido 🙏' },
    { text: 'Escucha música que te haga sentir bien y disfruta del momento 🎶' }
  ];

  // un par de actividades extra
  const upcomingActivities = [
    { title: 'Yoga',             time: '10:00 AM – 11:00 AM', location: 'Centro comunitario – Sala 2B', tag: 'Hoy' },
    { title: 'Pilates',          time: '11:30 AM – 12:30 PM', location: 'Gimnasio local – Sala 1',      tag: 'Mañana' },
    { title: 'Taller de lectura',time: '2:00 PM – 3:00 PM',   location: 'Biblioteca – Sala de Lectura', tag: 'En 2 días'  },
    { title: 'Manualidades',     time: '4:00 PM – 5:00 PM',   location: 'Centro comunitario – Aula 3',  tag: 'En 3 días' }
  ];

  const activeServices = [
      { name: 'Monitoreo de Salud',    desc: 'Reporte de chequeos diarios' },
      { name: 'Actividades grupales',  desc: 'Reuniones sociales semanales' },
      { name: 'Cuidado del hogar',     desc: 'Visitas dos veces por semana' }
  ];

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      getUserByEmail(user.email)
        .then(existing => setProfile(existing))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, user]);

  if (loading) return <p className="text-center mt-10">Cargando perfil…</p>;

  const userName = profile?.nombre || "Usuario";

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full px-6 py-8 space-y-8">
        {/* Saludo */}
        <h1 className="text-4xl font-bold text-primary">Hola, {userName}!</h1>
        <button
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          className="mt-2 px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>

        {/* Botones rápidos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickAccessButton icon={<CalendarIcon className="w-8 h-8 text-primary" />} label="Mi agenda" />
          <QuickAccessButton icon={<HandshakeIcon className="w-8 h-8 text-secondary" />} label="Mis servicios" />
          <QuickAccessButton icon={<HeadsetIcon className="w-8 h-8 text-accent3" />} label="Soporte" />
          <QuickAccessButton icon={<UserIcon className="w-8 h-8 text-accent2" />} label="Mi perfil" />
        </div>

        {/* 🚩 Grid Actividades / Consejos */}
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

          {/* ⬇️ Consejos para hoy */}
          <div className="space-y-4">
            <SectionTitle title="Consejos para hoy" />
            <div className="bg-white p-4 rounded-lg h-80 overflow-y-auto flex flex-col justify-start space-y-3">
              {consejos.length === 0 ? (
                <EmptyState mensaje="No hay consejos por el momento." />
              ) : (
                consejos.map((c, i) => (
                  <div
                    key={i}
                    className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3"
                  >
                    <p className="text-base font-medium text-gray-900">{c.text}</p>
                  </div>
                ))
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

export default UserPage;
