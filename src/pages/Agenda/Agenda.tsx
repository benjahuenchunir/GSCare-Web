import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserByEmail } from '../../services/userService';
import { AnimatePresence } from 'framer-motion';
import ModalEvento from '../../components/AgendaComponents/ModalEvento';
import { mensajesCalendario } from '../../data/MensajesCalendario';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { locale: es }),
  getDay,
  locales: { es },
});

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
          title: s.nombre.replace(/^🟢\s*/, ''), // elimina emoji si quedó guardado
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
            title: a.nombre.replace(/^🔵\s*/, ''), // elimina emoji si quedó guardado
            start: fechaHoraInicio,
            end: fechaHoraFin,
            tipo: 'actividad',
            descripcion: a.descripcion,
            lugar: a.lugar,
          };
        });

        // ✅ Limpia eventos anteriores
        setEventos([]);

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
    <div className="min-h-screen flex-1  bg-gray-100 p-6">
      <h1 className="text-[2em] font-bold flex-1  px-10 py-7 text-center mb-6 text-primary">Mi Agenda</h1>

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
          messages={mensajesCalendario}
          style={{ height: 600 }}
          onSelectEvent={(event: Evento) => setEventoSeleccionado(event)}
          eventPropGetter={(event: Evento) => {
            const backgroundColor = event.tipo === 'servicio' ? '#62CBC9' : '#d4bbef';
            return {
              style: {
                backgroundColor,
                borderRadius: '0.5rem',
                color: '#000',
                border: 'none',
                padding: '4px 8px',
                fontWeight: 500,
              },
            };
          }}
        />
      </div>

      <AnimatePresence>
        {eventoSeleccionado && (
          <ModalEvento
            evento={eventoSeleccionado}
            onClose={() => setEventoSeleccionado(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Agenda;
