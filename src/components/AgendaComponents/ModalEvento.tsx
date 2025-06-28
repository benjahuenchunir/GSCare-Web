import { motion } from 'framer-motion';
import {
  CalendarDays,
  Clock,
  MapPin,
  MessageSquareText,
  X,
  Trash,
  Globe,
  Link as LinkIcon,
  Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
};

type Props = {
  evento: Evento;
  onClose: () => void;
  onRefresh: () => void;
  onCancelEvento: (evento: Evento) => void;
};

const ModalEvento = ({ evento, onClose, onCancelEvento }: Props) => {
  const fecha = evento.start.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const horaInicio = evento.start.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const horaFin = evento.end.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const colorTipo = evento.tipo === 'servicio' ? '#62CBC9' : '#d4bbef';

  const navigate = useNavigate();

  const handleGoToForum = () => {
    if (evento.id_foro_actividad) {
      navigate(`/actividades/${evento.id}/foro`);
    }
  };

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
          {/* Fecha */}
          <div className="flex items-start gap-3">
            <CalendarDays className="text-primary mt-1" size={20} />
            <div>
              <p className="font-semibold text-gray-900">Fecha</p>
              <p className="text-gray-900">
                {fecha.charAt(0).toUpperCase() + fecha.slice(1)}
              </p>
            </div>
          </div>

          {/* Hora */}
          <div className="flex items-start gap-3">
            <Clock className="text-primary mt-1" size={20} />
            <div>
              <p className="font-semibold text-gray-900">Hora</p>
              <p className="text-gray-900">
                {horaInicio} — {horaFin}
              </p>
            </div>
          </div>

          {/* Modalidad */}
          {evento.modalidad && (
            <div className="flex items-start gap-3">
              <Globe className="text-primary mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Modalidad</p>
                <p className="text-gray-900 capitalize">{evento.modalidad}</p>
              </div>
            </div>
          )}

          {/* Link (si es online) */}
          {evento.modalidad === 'online' && evento.link && (
            <div className="flex items-start gap-3">
              <LinkIcon className="text-primary mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Enlace</p>
                <a
                  href={evento.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {evento.link}
                </a>
              </div>
            </div>
          )}

          {/* Lugar */}
          {evento.lugar && evento.modalidad === 'presencial' && (
            <div className="flex items-start gap-3">
              <MapPin className="text-primary mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Lugar</p>
                <p className="text-gray-900">{evento.lugar}</p>
              </div>
            </div>
          )}

          {/* Comuna */}
          {evento.comuna && (
            <div className="flex items-start gap-3">
              <Building2 className="text-primary mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Comuna</p>
                <p className="text-gray-900">{evento.comuna}</p>
              </div>
            </div>
          )}

          {/* Descripción */}
          {evento.descripcion && (
            <div className="flex items-start gap-3">
              <MessageSquareText className="text-primary mt-1" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Detalle</p>
                <p className="text-gray-900">{evento.descripcion}</p>
                {/* Link al foro de la actividad */}
                {evento.tipo === 'actividad' && evento.id_foro_actividad && (
                  <a
                    href={`/actividades/${evento.id}/foro`}
                    className="text-blue-600 underline mt-2 inline-block"
                  >
                    Ir al foro de la actividad
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Foro (botón para ir al foro si es una actividad y existe foro) */}
        {evento.tipo === 'actividad' && evento.id_foro_actividad && (
          <div className="text-center mt-4">
            <button
              onClick={handleGoToForum}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              <MessageSquareText size={18} />
              Ir al foro de mi actividad
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => onCancelEvento(evento)}
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
