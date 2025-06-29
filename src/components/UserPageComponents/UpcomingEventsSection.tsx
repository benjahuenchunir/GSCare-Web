// src/components/UserPageComponents/UpcomingEventsSection.tsx
import React, { useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { getUserSubscriptions } from "../../services/subscriptionService";
import { formatSessionTag } from "../../utils/dateHelper";
import { getUserActivities, Actividad } from "../../services/actividadService";
import { fetchServicios } from "../../services/serviceService";
import { UserContext } from "../../context/UserContext";
import EmptyState from "../../common/EmptyState";

// Iconos SVG
import ClockIcon    from "../../assets/Clock2.svg?react";
import LocationIcon from "../../assets/Location.svg?react";

type EventItem =
  | {
      type: "service";
      id: number;
      nombre: string;
      direccion: string;
      sessionDate: Date;
      tag: string;
    }
  | {
      type: "activity";
      id: number;
      nombre: string;
      lugar: string;
      sessionDate: Date;
      tag: string;
    };

export const UpcomingEventsSection: React.FC = () => {
  const { profile } = useContext(UserContext)!;
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !profile?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1) Flujo de servicios periódicos
    const pServices = (async (): Promise<EventItem[]> => {
      const token = await getAccessTokenSilently();
      const [citas, todosLosServicios] = await Promise.all([
        getUserSubscriptions(profile.id, token),
        fetchServicios()
      ]);

      const serviciosMap = new Map(todosLosServicios.map(s => [s.id, s]));

      return citas.map((cita: any) => {
        const sessionDate = new Date(cita.start);
        const servicio = serviciosMap.get(cita.id_servicio);
        return {
          type: "service" as const,
          id: cita.id,
          nombre: cita.title,
          direccion: servicio?.direccion_principal_del_prestador || "Ubicación no especificada",
          sessionDate,
          tag: formatSessionTag(sessionDate),
        };
      });
    })();


    // 2) Flujo de actividades puntuales
    const pActivities = getUserActivities(profile.id).then((acts) =>
      acts.map<EventItem>((a: Actividad) => {
        const [year, month, day] = a.fecha.split('-').map(Number);
        const [h, m] = a.hora_inicio.split(":").map(Number);
        const fecha = new Date(year, month - 1, day, h, m);

        return {
          type: "activity",
          id: a.id,
          nombre: a.nombre,
          lugar: `${a.lugar}, ${a.comuna}`,
          sessionDate: fecha,
          tag: formatSessionTag(fecha),
        };
      })
    );

    // 3) Unimos, filtramos próximos 14 días y ordenamos
    Promise.all([pServices, pActivities])
      .then(([svcs, acts]) => {
        const merged = [...svcs, ...acts]
          .filter((e) => {
            const diff = e.sessionDate.getTime() - Date.now();
            return diff >= 0 && diff <= 14 * 24 * 60 * 60 * 1000;
          })
          .sort((a, b) => a.sessionDate.getTime() - b.sessionDate.getTime());
        setEvents(merged);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthenticated, profile]);

  if (loading) return <p className="text-center py-10">Cargando próximos eventos…</p>;
  if (events.length === 0)
    return <EmptyState mensaje="No tienes eventos en la próxima semana." />;

  return (
    <div className="space-y-4">
      {events.map((e, i) => (
        <div
          key={i}
          className={`w-full px-5 py-4 rounded-lg flex justify-between items-center shadow-sm ${
            e.type === "service" ? "bg-[#e7f5f3]" : "bg-[#F3E8FF]"
          }`}
        >
          <div className="flex flex-col gap-2">
            <h4 className="text-[1.5em] leading-snug font-bold text-black">
              {e.nombre}
            </h4>
            <div className="flex items-center text-[1.2em] gap-2 text-gray-800">
              <ClockIcon className="w-6 h-6 fill-current" />
              <span>
                {e.sessionDate.toLocaleDateString()} ·{" "}
                {e.sessionDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center text-[1.2em] gap-2 text-gray-800">
              <LocationIcon className="w-6 h-6 fill-current" />
              <span>{e.type === "service" ? e.direccion : e.lugar}</span>
            </div>
          </div>
          <span className={`mt-1 px-4 py-1 font-semibold rounded-md ${
              e.type === "service"
                ? "bg-[#62CBC9] text-black"
                : "bg-[#d4bbef] text-black"
            }`}>
            {e.tag}
          </span>
        </div>
      ))}
    </div>
  );
};