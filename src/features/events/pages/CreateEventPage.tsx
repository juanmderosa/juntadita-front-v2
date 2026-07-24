import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { EventForm } from "@/features/events/components/create/EventForm";
import { useCreateEventPage } from "@/features/events/hooks/useCreateEventPage";

export function CreateEventPage() {
  const controller = useCreateEventPage();
  const eventType = controller.form.watch("type");
  const totalSteps = eventType === "poll" ? 3 : 2;

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <Link
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-700"
        to="/"
      >
        <ArrowLeft className="size-4" />
        Volver a mis eventos
      </Link>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-700">
          Paso 1 de {totalSteps}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Datos del evento</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Primero crea la base del evento. Despues vas a preparar opciones e invitados.
        </p>
        <div className="mt-8">
          <EventForm
            submitLabel="Continuar"
            form={controller.form}
            isSubmitting={controller.isSubmitting}
            onSubmit={controller.createEvent}
            rootError={controller.rootError}
          />
        </div>
      </div>
    </section>
  );
}
