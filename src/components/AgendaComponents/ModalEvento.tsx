import { motion } from 'framer-motion';
import {
  CalendarDays,
  Clock,
  MapPin,
  MessageSquareText,
  X,
  Trash,
} from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserByEmail } from '../../services/userService';

type Evento = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  tipo: 'servicio' | 'actividad';
  descripcion?: string;
  lugar?: string;
};

type Props = {
  evento: Evento;
  onClose: () => void;
  onRefresh: () => void; 
};

const ModalEvento = ({ evento, onClose, onRefresh }: Props) => {
  const { user } = useAuth0();
  const API_URL = import.meta.env.VITE_API_URL;

  const cancelarEvento = async () => {
    if (!user?.email) return;

    const confirmar = window.confirm(
      `¿Estás seguro de que quieres cancelar este ${evento.tipo}?`
    );
    if (!confirmar) return;

    try {
      const usuario = await getUserByEmail(user.email);
      if (!usuario?.id) throw new Error('No se encontró el ID del usuario');

      let res: Response | undefined;

      if (evento.tipo === 'servicio') {
        res = await fetch(`${API_URL}/usuarios/usuarios/${usuario.id}/citas/${evento.id}`, {
          method: 'DELETE',
        });
      } else if (evento.tipo === 'actividad') {
        res = await fetch(`${API_URL}/asistencias`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_evento_a_asistir: evento.id,
            id_usuario_asistente: usuario.id,
          }),
        });
      }

      if (!res || !res.ok) {
        const msg = await res?.text();
        throw new Error(msg || 'Error al cancelar el evento');
      }

      onClose();
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('No se pudo cancelar el evento.');
    }
  };

  const fecha = evento.start.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const horaInicio = evento.start.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const horaFin = evento.end.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const colorTipo = evento.tipo === 'servicio' ? '#62CBC9' : '#d4bbef';

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full border border-gray-200"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colorTipo }} />
          <h2 className="text-[1.5em] font-bold text-gray-900 text-center">{evento.title}</h2>
        </div>

        <div className="mb-4 space-y-4 text-[1em]">
          <div className="flex items-start gap-3">
            <CalendarDays className="text-primary mt-1" size={20} />
            <div>
              <p className="font-semibold text-gray-900">Fecha</p>
              <p className="text-gray-900">
                {fecha.charAt(0).toUpperCase() + fecha.slice(1)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="text-primary mt-1" size={20} />
            <div>
              <p className="font-semibold text-gray-900">Hora</p>
              <p className="text-gray-900">
                {horaInicio} — {horaFin}
              </p>
            </div>
          </div>

          {evento.lugar && (
            <div className="flex items-start gap-3">
              <MapPin className="text-primary mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Lugar</p>
                <p className="text-gray-900">{evento.lugar}</p>
              </div>
            </div>
          )}

          {evento.descripcion && (
            <div className="flex items-start gap-3">
              <MessageSquareText className="text-primary mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Detalle</p>
                <p className="text-gray-900">{evento.descripcion}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={cancelarEvento}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition shadow-md"
          >
            <Trash size={18} />
            Cancelar
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition shadow-md"
          >
            <X size={18} />
            Cerrar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModalEvento;
