import { motion } from 'framer-motion';
import {
  CalendarDays,
  Clock,
  MapPin,
  MessageSquareText,
  X,
} from 'lucide-react';

type Evento = {
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
};

const ModalEvento = ({ evento, onClose }: Props) => {
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
        {/* Título con círculo de color */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: colorTipo }}
          />
          <h2 className="text-[1.5em] font-bold text-gray-900 text-center">
            {evento.title}
          </h2>
        </div>

        {/* Contenido del evento */}
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
                <p className="font-semibold text-gray-900">Descripción</p>
                <p className="text-gray-900">{evento.descripcion}</p>
              </div>
            </div>
          )}
        </div>

        {/* Botón cerrar */}
        <div className="mt-6 text-right">
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
