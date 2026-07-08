import { getErrorMessage } from "@/lib/errors";
import type { CreateEventOptionInput } from "@/types/events";
import { EventOptionCreateForm } from "@/features/events/components/detail/EventOptionCreateForm";

type EventOptionAdminPanelProps = {
  createOption: (input: CreateEventOptionInput) => Promise<unknown>;
  error: unknown;
  isCreating: boolean;
  timeZone: string;
};

export function EventOptionAdminPanel({
  createOption,
  error,
  isCreating,
  timeZone,
}: EventOptionAdminPanelProps) {
  return (
    <div className="mt-6 rounded-2xl bg-slate-50 p-4">
      <h3 className="text-sm font-bold text-slate-900">Agregar opcion</h3>
      <EventOptionCreateForm
        createOption={createOption}
        isCreating={isCreating}
        timeZone={timeZone}
      />
      {error ? (
        <p className="mt-3 text-sm text-red-700">{getErrorMessage(error)}</p>
      ) : null}
    </div>
  );
}
