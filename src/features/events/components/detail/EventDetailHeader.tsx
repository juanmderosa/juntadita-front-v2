import { CalendarClock, Pencil } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import {
  getEventTypeLabel,
  getEventStatus,
  getEventSchedule,
} from "@/features/events/lib/events.lib";
import { EventDetail } from "@/types/events";

interface Props {
  event: EventDetail;
  canManage: boolean;
}

export const EventDetailHeader = ({ event, canManage }: Props) => {
  return (
    <header className="mt-6 rounded-2xl bg-linear-to-br from-indigo-700 to-indigo-500 p-6 text-white shadow-lg sm:p-9">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide">
          {getEventTypeLabel(event)}
        </span>
        <span className="rounded-full bg-teal-300 px-3 py-1 text-xs font-bold text-teal-950">
          {getEventStatus(event)}
        </span>
      </div>
      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{event.title}</h1>
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-indigo-50 sm:text-base">
            <CalendarClock className="size-5" />
            {getEventSchedule(event)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/15 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/25"
            to={`/events/${event.id}/expenses`}
          >
            Gastos
          </Link>
          {canManage ? (
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-50"
              to={`/events/${event.id}/edit`}
            >
              <Pencil className="size-4" />
              Editar datos
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
};
