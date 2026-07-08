import type {
  CreateEventOptionInput,
  EventDetail,
  UpdateEventOptionInput,
} from "@/types/events";
import { EmptyState } from "@/components/feedback/EmptyState";
import { EventOptionAdminPanel } from "@/features/events/components/detail/EventOptionAdminPanel";
import { EventOptionsHeader } from "@/features/events/components/detail/EventOptionsHeader";
import { EventOptionsList } from "@/features/events/components/detail/EventOptionsList";

type EventOptionsSectionProps = {
  event: EventDetail;
  canManage: boolean;
  createOption: (input: CreateEventOptionInput) => Promise<unknown>;
  updateOption: (
    optionId: string,
    input: UpdateEventOptionInput,
  ) => Promise<unknown>;
  deleteOption: (optionId: string) => Promise<unknown>;
  isCreating: boolean;
  error: unknown;
};

export function EventOptionsSection({
  event,
  canManage,
  createOption,
  updateOption,
  deleteOption,
  isCreating,
  error,
}: EventOptionsSectionProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-8">
      <EventOptionsHeader optionsCount={event.options.length} />

      {event.options.length === 0 ? (
        <EmptyState
          className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-left"
          title="Todavia no hay opciones cargadas."
        />
      ) : (
        <EventOptionsList
          canManage={canManage}
          deleteOption={deleteOption}
          options={event.options}
          timeZone={event.timezone}
          updateOption={updateOption}
        />
      )}

      {canManage && event.type === "poll" ? (
        <EventOptionAdminPanel
          createOption={createOption}
          error={error}
          isCreating={isCreating}
          timeZone={event.timezone}
        />
      ) : null}
    </article>
  );
}
