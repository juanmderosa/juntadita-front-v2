import { ArrowLeft, CalendarClock, Crown, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../../lib/errors";
import {
  getEventSchedule,
  getEventStatus,
  getEventTypeLabel,
} from "../lib/events.lib";
import { useEventDetailPage } from "../hooks/useEventDetailPage";

export function EventDetailPage() {
  const controller = useEventDetailPage();

  if (controller.isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (controller.error || !controller.event) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {getErrorMessage(controller.error)}
        </p>
        <Link
          className="mt-5 inline-block font-bold text-indigo-700"
          to="/">
          Volver a mis eventos
        </Link>
      </section>
    );
  }

  const event = controller.event;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <Link
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-700"
        to="/">
        <ArrowLeft className="size-4" />
        Mis eventos
      </Link>

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
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              {event.title}
            </h1>
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-indigo-50 sm:text-base">
              <CalendarClock className="size-5" />
              {getEventSchedule(event)}
            </p>
          </div>
          {event.currentUserRole === "admin" ? (
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-50"
              to={`/events/${event.id}/edit`}>
              <Pencil className="size-4" />
              Editar datos
            </Link>
          ) : null}
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">
            Sobre este evento
          </h2>
          <p className="mt-4 whitespace-pre-wrap text-base leading-7 text-slate-600">
            {event.description || "Todavia no se agrego una descripcion."}
          </p>
        </article>
        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Tu acceso
          </h2>
          <p className="mt-4 flex items-center gap-2 text-base font-bold text-slate-900">
            {event.currentUserRole === "admin" ? (
              <Crown className="size-5 text-amber-600" />
            ) : null}
            {event.currentUserRole === "admin" ? "Organizador" : "Participante"}
          </p>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="text-slate-500">Moneda</dt>
              <dd className="mt-1 font-bold">{event.currencyCode}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Zona horaria</dt>
              <dd className="mt-1 wrap-break-words font-bold">
                {event.timezone}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
