// src/utils/dateHelper.ts

/**
 * Dado un array de días de la semana (0=domingo…6=sábado) y una hora "HH:MM",
 * retorna la próxima fecha futura que coincida con uno de esos días,
 * o null si no hay en los próximos 7 días.
 */
export function getNextSessionDate(
  diasDisponibles: number[],
  horaInicio: string
): Date | null {
  const [hora, minuto] = horaInicio.split(":").map(Number);
  const hoy = new Date();
  for (let offset = 0; offset < 7; offset++) {
    const candidate = new Date(hoy);
    candidate.setDate(hoy.getDate() + offset);
    candidate.setHours(hora, minuto, 0, 0);
    if (diasDisponibles.includes(candidate.getDay()) && candidate > hoy) {
      return candidate;
    }
  }
  return null;
}

/**
 * Formatea la etiqueta tipo "Hoy", "Mañana", "En X días"
 */
export function formatSessionTag(sessionDate: Date): string {
  const hoy = new Date();

  // Normaliza ambas fechas al inicio del día (00:00:00)
  const cleanToday = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const cleanSession = new Date(
    sessionDate.getFullYear(),
    sessionDate.getMonth(),
    sessionDate.getDate()
  );

  const diffMs = cleanSession.getTime() - cleanToday.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Mañana";
  return `En ${diffDays} días`;
}
