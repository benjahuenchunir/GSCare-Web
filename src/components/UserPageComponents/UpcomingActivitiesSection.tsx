// src/components/UserPageComponents/UpcomingActivitiesSection.tsx
import React, { useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { getUserSubscriptions } from "../../services/subscriptionService";
import { getNextSessionDate, formatSessionTag } from "../../utils/dateHelper";
import { UserContext } from "../../context/UserContext";
import EmptyState from "../../common/EmptyState";

// Iconos SVG
import ClockIcon    from "../../assets/Clock2.svg?react";
import LocationIcon from "../../assets/Location.svg?react";

interface ServicioConHorario {
  id: number;
  nombre: string;
  dias_disponibles: number[];
  hora_inicio: string;
  direccion_principal_del_prestador: string;
}


interface Upcoming {
  servicio: ServicioConHorario;
  sessionDate: Date;
  tag: string;
}

export const UpcomingActivitiesSection: React.FC = () => {
  const { profile } = useContext(UserContext)!;
  const { isAuthenticated } = useAuth0();
  const [upcoming, setUpcoming] = useState<Upcoming[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !profile?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    // 1. Obtener servicios suscritos
    getUserSubscriptions(profile.id)
      .then((servs) =>
        getUserSubscriptions(profile.id)
        .then((servs) =>
          Promise.all(
            servs.map(async (s) => {
              const servicio = s as ServicioConHorario; // aseguramos el tipo

              const sessionDate = getNextSessionDate(
                servicio.dias_disponibles,
                servicio.hora_inicio
              );
              if (!sessionDate) return null;
              return {
                servicio,
                sessionDate,
                tag: formatSessionTag(sessionDate),
              };
            })
          )
        )

      )
      .then((list) => {
        // 3. Filtrar nulos, ordenar y limitar a próximos 7 días
        const filtered = (list.filter((x): x is Upcoming => !!x) as Upcoming[])
          .filter(u => {
            const diffMs = u.sessionDate.getTime() - new Date().getTime();
            return diffMs >= 0 && diffMs <= 7 * 24 * 60 * 60 * 1000;
          })
          .sort((a, b) => a.sessionDate.getTime() - b.sessionDate.getTime());
        setUpcoming(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthenticated, profile]);

  if (loading) return <p className="text-center py-10">Cargando próximas actividades…</p>;

  if (upcoming.length === 0) {
    return <EmptyState mensaje="No tienes actividades en los próximos días." />;
  }

  return (
    <>
      {upcoming.map((u, i) => (
        <div
          key={i}
          className="w-full bg-[#e7f5f3] px-5 py-4 rounded-lg flex justify-between items-center shadow-sm"
        >
          <div className="flex flex-col gap-2">
            <h4 className="text-xl font-bold text-black">{u.servicio.nombre}</h4>
            <div className="flex items-center text-lg text-gray-800 gap-2">
              <ClockIcon className="w-6 h-6 text-black fill-current" />
              <span>
                {u.sessionDate.toLocaleDateString()} · {u.servicio.hora_inicio}
              </span>
            </div>
            <div className="flex items-center text-lg text-gray-800 gap-2">
              <LocationIcon className="w-6 h-6 text-black fill-current" />
              <span>{u.servicio.direccion_principal_del_prestador}</span>
            </div>
          </div>
          <div className="flex flex-col items-end text-sm">
            <span className="mt-1 px-4 py-1 bg-[#62CBC9] text-black font-semibold rounded-md">
              {u.tag}
            </span>
          </div>
        </div>
      ))}
    </>
  );
};
