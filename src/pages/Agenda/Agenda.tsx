import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserByEmail } from '../../services/userService';
import { AnimatePresence } from 'framer-motion';
import ModalEvento from '../../components/AgendaComponents/ModalEvento';
import ModalConfirmacion from '../../components/AgendaComponents/ModalConfirmacion';
import { mensajesCalendario } from '../../data/MensajesCalendario';
import { cancelAttendanceGrupo } from '../../services/actividadService';
import { getCitasParaProveedor } from '../../services/subscriptionService';
import { UserContext } from '../../context/UserContext';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { locale: es }),
  getDay,
  locales: { es },
});

type Evento = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  tipo: 'servicio' | 'actividad';
  descripcion?: string;
  lugar?: string;
  modalidad?: 'presencial' | 'online';
  link?: string | null;
  comuna?: string;
  id_foro_actividad?: number | null;
  datos_cliente?: {
    nombre: string;
    email: string;
  };
};

type VistaCalendario = 'month' | 'week' | 'day';

const Agenda = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { profile } = useContext(UserContext);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const [eventoPendiente, setEventoPendiente] = useState<Evento | null>(null);
  const [confirmacionVisible, setConfirmacionVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<VistaCalendario>('month');

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchEventos = async () => {
    try {
      if (!isAuthenticated || !user?.email || !profile) return;

      const usuario = profile;
      if (!usuario?.id) return;

      if (profile.rol === 'proveedor') {
        const token = await getAccessTokenSilently();
        const eventosProveedor = await getCitasParaProveedor(usuario.id, token);
        const eventosFormateados: Evento[] = eventosProveedor.map((evento: any) => ({
          ...evento,
          tipo: 'servicio' as const,
        }));
        setEventos(eventosFormateados);
        return;
      }

      // Para otros roles (socio)
      const [citasRes, actividadesRes] = await Promise.all([
        fetch(`${API_URL}/usuarios/usuarios/${usuario.id}/citas`),
        fetch(`${API_URL}/usuarios/actividades?id_usuario=${usuario.id}`)
      ]);

      const citas = await citasRes.json();
      const actividades = await actividadesRes.json();

      const serviciosFormateados: Evento[] = citas.map((cita: any): Evento => ({
        id: cita.id,
        title: cita.title ?? 'Servicio',
        start: new Date(cita.start),
        end: new Date(cita.end),
        tipo: 'servicio',
        descripcion: `Estado: ${cita.extendedProps?.estado ?? cita.estado}`,
      }));

      const actividadesFormateadas: Evento[] = actividades.map((a: any): Evento => {
        const fechaHoraInicio = new Date(`${a.fecha}T${a.hora_inicio}`);
        const fechaHoraFin = new Date(`${a.fecha}T${a.hora_final}`);

        return {
          id: a.id,
          title: a.nombre.replace(/^🔵\s*/, ''),
          start: fechaHoraInicio,
          end: fechaHoraFin,
          tipo: 'actividad',
          descripcion: a.descripcion,
          lugar: a.lugar,
          modalidad: a.modalidad,
          link: a.link,
          comuna: a.comuna,
          id_foro_actividad: a.id_foro_actividad,
        };
      });

      setEventos([...serviciosFormateados, ...actividadesFormateadas]);
    } catch (err) {
      console.error('Error al cargar eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user && profile) {
      fetchEventos();
    }
  }, [isAuthenticated, user, profile]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated && user && profile) {
        fetchEventos();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user, profile]);

  const eventosFiltrados = (profile?.rol === "socio" || profile?.rol === "proveedor") ? eventos : [];
  if (loading) return <p className="text-center mt-10">Cargando agenda…</p>;

  const cancelarEventoOptimista = async (evento: Evento) => {
    setEventoPendiente(evento);
    setConfirmacionVisible(true);
  };

  const confirmarCancelacion = async () => {
    if (!eventoPendiente || !user?.email || !isAuthenticated) return;

    const eventosPrevios = eventos;
    setConfirmacionVisible(false);
    setEventoSeleccionado(null);
    setEventoPendiente(null);

    setEventos(prev =>
      prev.filter(e =>
        eventoPendiente.tipo === 'actividad'
          ? (
              eventoPendiente.id_foro_actividad
                ? (
                    e.tipo !== 'actividad' ||
                    e.id_foro_actividad !== eventoPendiente.id_foro_actividad
                  )
                : (
                    e.tipo !== 'actividad' || e.id !== eventoPendiente.id
                  )
            )
          : e.id !== eventoPendiente.id || e.tipo !== eventoPendiente.tipo
      )
    );

    try {
      const usuario = await getUserByEmail(user.email);
      const token = await getAccessTokenSilently();

      if (!usuario?.id) throw new Error('No se encontró el ID del usuario');

      if (eventoPendiente.tipo === 'actividad') {
        await cancelAttendanceGrupo(eventoPendiente.id, usuario.id, token);
      } else if (eventoPendiente.tipo === 'servicio') {
        if (profile?.rol === 'socio') {
          const res = await fetch(`${API_URL}/usuarios/usuarios/${usuario.id}/citas/${eventoPendiente.id}`, {
            method: 'DELETE',
          });
          if (!res.ok) throw new Error('Error al cancelar cita');
        }
      }
    } catch (err) {
      setEventos(eventosPrevios);
      alert('No se pudo cancelar el evento.');
      console.error("Error al cancelar evento:", err);
    }
  };

  const CustomEvent = ({ event }: { event: Evento }) => {
    // Formatea la hora de inicio y fin
    const horaInicio = format(event.start, 'hh:mm a');
    const horaFin = format(event.end, 'hh:mm a');
    const hora = `${horaInicio} - ${horaFin}`;
    // El texto es el título del evento
    const texto = event.title;
    return (
      <div className="flex flex-col text-sm leading-tight">
        <span className="font-semibold">{hora}</span>
        <span className="text-sm font-semibold truncate">{texto}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex-1 bg-gray-100 p-6">
      <h1 className="text-[2em] font-bold flex-1 text-center mb-6 text-primary mt-8">
        {profile?.rol === 'socio' || profile?.rol === 'proveedor' ? 'Mi Agenda' : 'Calendario'}
      </h1>

      <div className="bg-white p-4 rounded-xl shadow">
        <Calendar
          localizer={localizer}
          events={eventosFiltrados}
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
          components={{
            event: (props: { event: Evento }) => <CustomEvent {...props} />,
          }}
            formats={{
    eventTimeRangeFormat: () => '', // <-- Aquí ocultas la hora automática
  }}
        />
      </div>

      <AnimatePresence>
        {eventoSeleccionado && (
          <ModalEvento
            evento={eventoSeleccionado}
            onClose={() => setEventoSeleccionado(null)}
            onRefresh={fetchEventos}
            onCancelEvento={cancelarEventoOptimista}
          />
        )}
      </AnimatePresence>

      <ModalConfirmacion
        visible={confirmacionVisible}
        onClose={() => setConfirmacionVisible(false)}
        onConfirm={confirmarCancelacion}
        titulo="¿Cancelar inscripción?"
        mensaje="¿Estás seguro de que deseas cancelar tu inscripción a todos los bloques de esta actividad?"
      />
    </div>
  );
};

export default Agenda;
  