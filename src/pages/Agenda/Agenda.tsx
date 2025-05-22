import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserByEmail } from '../../services/userService';
import { AnimatePresence, motion } from 'framer-motion';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { locale: es }),
  getDay,
  locales: { es },
});

const mensajes = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay eventos en este rango.',
  showMore: (total: number) => `+ Ver más (${total})`,
};

type Evento = {
  title: string;
  start: Date;
  end: Date;
  tipo: 'servicio' | 'actividad';
  descripcion?: string;
  lugar?: string;
};

type VistaCalendario = 'month' | 'week' | 'day';

const Agenda = () => {
  const { user, isAuthenticated } = useAuth0();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<VistaCalendario>('month');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        if (!isAuthenticated || !user?.email) return;

        const usuario = await getUserByEmail(user.email);
        if (!usuario?.id) return;

        const [serviciosRes, actividadesRes] = await Promise.all([
          fetch(`${API_URL}/usuarios/servicios?id_usuario=${usuario.id}`),
          fetch(`${API_URL}/usuarios/actividades?id_usuario=${usuario.id}`)
        ]);

        const servicios = await serviciosRes.json();
        const actividades = await actividadesRes.json();

        const serviciosFormateados: Evento[] = servicios.map((s: any): Evento => ({
          title: `🟢 ${s.nombre}`,
          start: new Date(s.fecha_inicio),
          end: new Date(s.fecha_fin),
          tipo: 'servicio',
          descripcion: s.descripcion,
          lugar: s.lugar,
        }));

        const actividadesFormateadas: Evento[] = actividades.map((a: any): Evento => {
          const fechaHoraInicio = new Date(`${a.fecha}T${a.hora}`);
          const fechaHoraFin = new Date(fechaHoraInicio);
          fechaHoraFin.setHours(fechaHoraInicio.getHours() + 1);

          return {
            title: `🔵 ${a.nombre}`,
            start: fechaHoraInicio,
            end: fechaHoraFin,
            tipo: 'actividad',
            descripcion: a.descripcion,
            lugar: a.lugar,
          };
        });

        const todosLosEventos = [...serviciosFormateados, ...actividadesFormateadas];
        setEventos(todosLosEventos);
      } catch (err) {
        console.error('Error al cargar eventos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, [isAuthenticated, user]);

  if (loading) return <p className="text-center mt-10">Cargando agenda…</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">Mi Agenda</h1>

      <div className="bg-white p-4 rounded-xl shadow">
        <Calendar
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day']}
          view={currentView}
          onView={(view: VistaCalendario) => setCurrentView(view)}
          date={currentDate}
          onNavigate={(date: Date) => setCurrentDate(date)}
          defaultView="month"
          messages={mensajes}
          style={{ height: 600 }}
          onSelectEvent={(event: Evento) => setEventoSeleccionado(event)}
          eventPropGetter={(event: Evento) => {
            const backgroundColor = event.tipo === 'servicio' ? '#38bdf8' : '#34d399';
            return {
              style: {
                backgroundColor,
                borderRadius: '0.5rem',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
              },
            };
          }}
        />
      </div>

      <AnimatePresence>
        {eventoSeleccionado && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEventoSeleccionado(null)}
          >
            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-2">{eventoSeleccionado.title}</h2>
              <p className="text-sm text-gray-600">
                {eventoSeleccionado.start.toLocaleString('es-ES')} — {eventoSeleccionado.end.toLocaleTimeString('es-ES')}
              </p>
              {eventoSeleccionado.lugar && (
                <p className="mt-2">
                  <strong>Lugar:</strong> {eventoSeleccionado.lugar}
                </p>
              )}
              {eventoSeleccionado.descripcion && (
                <p className="mt-2">
                  <strong>Descripción:</strong> {eventoSeleccionado.descripcion}
                </p>
              )}
              <div className="mt-4 text-right">
                <button
                  onClick={() => setEventoSeleccionado(null)}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Agenda;
