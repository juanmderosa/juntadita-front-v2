import type { UseFormReturn } from "react-hook-form";
import { CalendarClock, CheckCircle2 } from "lucide-react";
import { RHForm } from "@/components/forms/RHForm";
import { RHFormInput } from "@/components/forms/RHFormInput";
import { Button } from "@/components/ui/Button";
import type { EventFormInput } from "@/features/events/schemas/events.schemas";

type EventFormProps = {
  form: UseFormReturn<EventFormInput>;
  isSubmitting: boolean;
  onSubmit: (values: EventFormInput) => Promise<void>;
  rootError?: string;
  submitLabel?: string;
};

export function EventForm({
  form,
  isSubmitting,
  onSubmit,
  rootError,
  submitLabel = "Crear evento",
}: EventFormProps) {
  const type = form.watch("type");
  const descriptionError = form.formState.errors.description?.message;

  return (
    <RHForm className="space-y-6" form={form} onSubmit={onSubmit}>
      <fieldset>
        <legend className="text-sm font-bold text-slate-800">Tipo de evento</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className={`cursor-pointer rounded-xl border p-4 transition ${type === "poll" ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100" : "border-slate-200 bg-white"}`}>
            <input className="sr-only" type="radio" value="poll" {...form.register("type")} />
            <span className="flex items-center gap-2 font-bold text-slate-950">
              <CalendarClock className="size-5 text-indigo-600" />
              Elegir fecha despues
            </span>
            <span className="mt-2 block text-sm leading-5 text-slate-600">
              Define un cierre y agrega opciones en la siguiente etapa.
            </span>
          </label>
          <label className={`cursor-pointer rounded-xl border p-4 transition ${type === "fixed" ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100" : "border-slate-200 bg-white"}`}>
            <input className="sr-only" type="radio" value="fixed" {...form.register("type")} />
            <span className="flex items-center gap-2 font-bold text-slate-950">
              <CheckCircle2 className="size-5 text-teal-600" />
              Ya tengo fecha
            </span>
            <span className="mt-2 block text-sm leading-5 text-slate-600">
              Crea el evento con un comienzo confirmado.
            </span>
          </label>
        </div>
      </fieldset>

      <RHFormInput<EventFormInput>
        autoComplete="off"
        label="Titulo"
        maxLength={120}
        name="title"
        placeholder="Ej. Asado con amigos"
      />

      <label className="block">
        <span className="text-sm font-semibold text-gray-800">Descripcion opcional</span>
        <textarea
          className="mt-2 min-h-32 w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          maxLength={2000}
          placeholder="Conta brevemente de que se trata."
          {...form.register("description")}
        />
        {descriptionError ? (
          <span className="mt-2 block text-sm text-red-700">{descriptionError}</span>
        ) : null}
      </label>

      {type === "poll" ? (
        <RHFormInput<EventFormInput>
          label="Cierre de la votacion"
          name="votingClosesAt"
          type="datetime-local"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <RHFormInput<EventFormInput>
            label="Comienza"
            name="fixedStartAt"
            type="datetime-local"
          />
          <RHFormInput<EventFormInput>
            label="Finaliza (opcional)"
            name="fixedEndAt"
            type="datetime-local"
          />
        </div>
      )}

      <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
        Las fechas se interpretan en America/Buenos_Aires. La moneda del evento
        sera ARS.
      </p>

      {rootError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {rootError}
        </p>
      ) : null}

      <Button className="w-full sm:w-auto" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Creando..." : submitLabel}
      </Button>
    </RHForm>
  );
}
