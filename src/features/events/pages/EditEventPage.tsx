import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { RHForm } from "@/components/forms/RHForm";
import { RHFormInput } from "@/components/forms/RHFormInput";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/lib/errors";
import { useEditEventPage } from "@/features/events/hooks/useEditEventPage";
import type { EditEventFormInput } from "@/features/events/schemas/events.schemas";

export function EditEventPage() {
  const controller = useEditEventPage();

  if (controller.isLoading)
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );

  if (controller.error || !controller.event) {
    return (
      <p className="mx-auto mt-12 max-w-3xl rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {getErrorMessage(controller.error)}
      </p>
    );
  }

  if (controller.event.currentUserRole !== "admin") {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">No podes editar este evento</h1>
        <Link
          className="mt-4 inline-block font-bold text-indigo-700"
          to={`/events/${controller.event.id}`}>
          Volver al detalle
        </Link>
      </section>
    );
  }

  const descriptionError =
    controller.form.formState.errors.description?.message;

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <Link
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-700"
        to={`/events/${controller.event.id}`}>
        <ArrowLeft className="size-4" />
        Volver al evento
      </Link>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight">Editar evento</h1>
        <p className="mt-3 text-sm text-slate-600">
          El tipo y las fechas no se modifican en esta etapa.
        </p>
        <RHForm
          className="mt-8 space-y-6"
          form={controller.form}
          onSubmit={controller.updateEvent}>
          <RHFormInput<EditEventFormInput>
            label="Titulo"
            maxLength={120}
            name="title"
          />
          <label className="block">
            <span className="text-sm font-semibold text-gray-800">
              Descripcion
            </span>
            <textarea
              className="mt-2 min-h-36 w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              maxLength={2000}
              {...controller.form.register("description")}
            />
            {descriptionError ? (
              <span className="mt-2 block text-sm text-red-700">
                {descriptionError}
              </span>
            ) : null}
          </label>
          {controller.rootError ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {controller.rootError}
            </p>
          ) : null}
          <Button
            disabled={controller.isSubmitting}
            type="submit">
            {controller.isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </RHForm>
      </div>
    </section>
  );
}
