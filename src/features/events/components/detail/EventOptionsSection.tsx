import type { CreateEventOptionInput, EventDetail, UpdateEventOptionInput } from "@/types/events";
import { EmptyState } from "@/components/feedback/EmptyState";
import { EventOptionAdminPanel } from "@/features/events/components/detail/EventOptionAdminPanel";
import { EventOptionsHeader } from "@/features/events/components/detail/EventOptionsHeader";
import { EventOptionsList } from "@/features/events/components/detail/EventOptionsList";

type EventOptionsSectionProps = {
  event: EventDetail;
  canManage: boolean;
  createOption: (input: CreateEventOptionInput) => Promise<unknown>;
  createOptionsBatch: (input: CreateEventOptionInput[]) => Promise<unknown>;
  updateOption: (optionId: string, input: UpdateEventOptionInput) => Promise<unknown>;
  deleteOption: (optionId: string) => Promise<unknown>;
  isCreating: boolean;
  error: unknown;
};

export function EventOptionsSection({
  event,
  canManage,
  createOption,
  createOptionsBatch,
  updateOption,
  deleteOption,
  isCreating,
  error,
}: EventOptionsSectionProps) {
  const canManageOptions = canManage && !event.optionsLocked;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-8">
      <EventOptionsHeader optionsCount={event.options.length} />
      {canManage && event.optionsLocked ? (
        <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
          Las opciones quedaron bloqueadas porque la encuesta ya fue publicada.
        </p>
      ) : null}

      {event.options.length === 0 ? (
        <EmptyState
          className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-left"
          title="Todavia no hay opciones cargadas."
        />
      ) : (
        <EventOptionsList
          canManage={canManageOptions}
          deleteOption={deleteOption}
          options={event.options}
          timeZone={event.timezone}
          updateOption={updateOption}
        />
      )}

      {canManageOptions && event.type === "poll" ? (
        <EventOptionAdminPanel
          createOption={createOption}
          createOptionsBatch={createOptionsBatch}
          error={error}
          isCreating={isCreating}
          options={event.options}
          timeZone={event.timezone}
        />
      ) : null}
    </article>
  );
}
