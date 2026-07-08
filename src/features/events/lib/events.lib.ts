import { formatDateTime } from "@/lib/dates";
import type { EventSummary } from "@/types/events";

export function getEventStatus(event: EventSummary) {
  if (event.finalizedAt) return "Finalizado";

  if (event.type === "poll") {
    return event.votingClosesAt && new Date(event.votingClosesAt) <= new Date()
      ? "Votacion cerrada"
      : "Votacion abierta";
  }

  const ending = event.fixedEndAt ?? event.fixedStartAt;
  return ending && new Date(ending) < new Date() ? "Realizado" : "Confirmado";
}

export function getEventSchedule(event: EventSummary) {
  const value =
    event.type === "poll" ? event.votingClosesAt : event.fixedStartAt;
  if (!value) return "Sin fecha";

  const prefix = event.type === "poll" ? "Cierra" : "Comienza";
  return `${prefix} ${formatDateTime(value, { timeZone: event.timezone })}`;
}

export function getEventTypeLabel(event: EventSummary) {
  return event.type === "poll" ? "Evento con votacion" : "Fecha confirmada";
}
