import type { CreateEventOptionInput, EventOption } from "@/types/events";
import { useEventOptionGenerator } from "@/features/events/hooks/useEventOptionGenerator";
import { EventOptionGeneratedPreviewList } from "@/features/events/components/detail/EventOptionGeneratedPreviewList";
import { EventOptionPresetSelector } from "@/features/events/components/detail/EventOptionPresetSelector";
import { EventOptionScheduleModeSelector } from "@/features/events/components/detail/EventOptionScheduleModeSelector";
import { EventOptionTimeSelector } from "@/features/events/components/detail/EventOptionTimeSelector";
import { EventOptionWeekdaySelector } from "@/features/events/components/detail/EventOptionWeekdaySelector";

type EventOptionGeneratorFormProps = {
  createOptionsBatch: (input: CreateEventOptionInput[]) => Promise<unknown>;
  existingOptions: EventOption[];
  isCreating: boolean;
  timeZone: string;
};

export function EventOptionGeneratorForm({
  createOptionsBatch,
  existingOptions,
  isCreating,
  timeZone,
}: EventOptionGeneratorFormProps) {
  const generator = useEventOptionGenerator({
    createOptionsBatch,
    existingOptions,
    timeZone,
  });

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <EventOptionPresetSelector applyPreset={generator.applyPreset} />
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-gray-800">Desde</span>
        <input
          className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base text-gray-950 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          onChange={(event) => generator.updateField("startDate", event.target.value)}
          type="date"
          value={generator.values.startDate}
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-gray-800">Hasta</span>
        <input
          className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base text-gray-950 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          onChange={(event) => generator.updateField("endDate", event.target.value)}
          type="date"
          value={generator.values.endDate}
        />
      </label>

      <div className="sm:col-span-2">
        <EventOptionWeekdaySelector
          selectedWeekdays={generator.values.weekdays}
          toggleWeekday={generator.toggleWeekday}
        />
      </div>

      <div className="sm:col-span-2">
        <EventOptionScheduleModeSelector
          scheduleMode={generator.values.scheduleMode}
          setScheduleMode={generator.setScheduleMode}
        />
      </div>

      {generator.values.scheduleMode === "datetime" ? (
        <EventOptionTimeSelector
          addTime={generator.addTime}
          removeTime={generator.removeTime}
          setTimeDraft={generator.setTimeDraft}
          timeDraft={generator.timeDraft}
          times={generator.values.times}
        />
      ) : null}

      <label className="block sm:col-span-2">
        <span className="text-sm font-semibold text-gray-800">Etiqueta opcional</span>
        <input
          className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base text-gray-950 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          maxLength={120}
          onChange={(event) => generator.updateField("label", event.target.value)}
          placeholder="Ej: cena"
          type="text"
          value={generator.values.label}
        />
      </label>

      <p className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-800 sm:col-span-2">
        Maximo 60 opciones por vez. Vas a poder quitar opciones antes de guardar.
      </p>

      <EventOptionGeneratedPreviewList
        duplicateCount={generator.duplicateCount}
        errorMessage={generator.errorMessage}
        isCreating={isCreating}
        newOptionsCount={generator.newOptionsCount}
        options={generator.activePreview}
        previewCount={generator.previewCount}
        removePreviewOption={generator.removePreviewOption}
        submit={generator.submit}
        timeZone={timeZone}
      />
    </div>
  );
}
