import { useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import type { CreateEventOptionInput, EventOption } from "@/types/events";
import { EventOptionCreateForm } from "@/features/events/components/detail/EventOptionCreateForm";
import {
  EventOptionModeTabs,
  type EventOptionCreationMode,
} from "@/features/events/components/detail/EventOptionModeTabs";
import { EventOptionGeneratorForm } from "@/features/events/components/detail/EventOptionGeneratorForm";

type EventOptionAdminPanelProps = {
  createOption: (input: CreateEventOptionInput) => Promise<unknown>;
  createOptionsBatch: (input: CreateEventOptionInput[]) => Promise<unknown>;
  error: unknown;
  isCreating: boolean;
  options: EventOption[];
  timeZone: string;
};

export function EventOptionAdminPanel({
  createOption,
  createOptionsBatch,
  error,
  isCreating,
  options,
  timeZone,
}: EventOptionAdminPanelProps) {
  const [mode, setMode] = useState<EventOptionCreationMode>("manual");

  return (
    <div className="mt-6 rounded-2xl bg-slate-50 p-4">
      <h3 className="text-sm font-bold text-slate-900">Agregar opcion</h3>
      <EventOptionModeTabs mode={mode} setMode={setMode} />
      {mode === "manual" ? (
        <EventOptionCreateForm
          createOption={createOption}
          isCreating={isCreating}
          timeZone={timeZone}
        />
      ) : (
        <EventOptionGeneratorForm
          createOptionsBatch={createOptionsBatch}
          existingOptions={options}
          isCreating={isCreating}
          timeZone={timeZone}
        />
      )}
      {error ? <p className="mt-3 text-sm text-red-700">{getErrorMessage(error)}</p> : null}
    </div>
  );
}
