import { CalendarClock, ChevronRight, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import type { EventSummary } from "@/types/events";
import {
  getEventSchedule,
  getEventStatus,
  getEventTypeLabel,
} from "@/features/events/lib/events.lib";

export function EventCard({ event }: { event: EventSummary }) {
  const status = getEventStatus(event);

  return (
    <Link
      className="group flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_8px_28px_rgba(15,23,42,0.08)]"
      to={`/events/${event.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wide text-indigo-700">
          {getEventTypeLabel(event)}
        </span>
        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
          {status}
        </span>
      </div>

      <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
        {event.title}
      </h2>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
        {event.description || "Sin descripcion por ahora."}
      </p>

      <div className="mt-auto space-y-3 pt-6">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <CalendarClock aria-hidden="true" className="size-4 text-indigo-600" />
          {getEventSchedule(event)}
        </p>
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            {event.currentUserRole === "admin" ? (
              <Crown aria-hidden="true" className="size-4 text-amber-600" />
            ) : null}
            {event.currentUserRole === "admin" ? "Organizador" : "Participante"}
          </span>
          <span className="flex items-center gap-1 text-sm font-bold text-indigo-700">
            Ver detalle
            <ChevronRight aria-hidden="true" className="size-4 transition group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
