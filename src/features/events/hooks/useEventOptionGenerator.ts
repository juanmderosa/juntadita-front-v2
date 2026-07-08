import { useMemo, useState } from "react";
import type { CreateEventOptionInput, EventOption } from "@/types/events";
import {
  defaultGeneratorInput,
  generateEventOptionPreview,
  getGeneratorPresetRange,
  getUniqueTimes,
  MAX_GENERATED_OPTIONS,
  type EventOptionGeneratorInput,
  type GeneratorPreset,
  type GeneratorScheduleMode,
  type WeekdayValue,
} from "@/features/events/lib/eventOptionGenerator.lib";

export function useEventOptionGenerator({
  createOptionsBatch,
  existingOptions,
  timeZone,
}: {
  createOptionsBatch: (input: CreateEventOptionInput[]) => Promise<unknown>;
  existingOptions: EventOption[];
  timeZone: string;
}) {
  const [values, setValues] = useState(defaultGeneratorInput);
  const [removedKeys, setRemovedKeys] = useState<Set<string>>(() => new Set());
  const [timeDraft, setTimeDraft] = useState("21:00");

  const preview = useMemo(
    () => generateEventOptionPreview(values, existingOptions, timeZone),
    [existingOptions, timeZone, values],
  );
  const activePreview = preview.filter((option) => !removedKeys.has(option.key));
  const newOptions = activePreview.filter((option) => !option.isDuplicate);
  const duplicateCount = activePreview.length - newOptions.length;
  const hasTooManyOptions = newOptions.length > MAX_GENERATED_OPTIONS;
  const canCreate = newOptions.length > 0 && !hasTooManyOptions;
  const errorMessage = hasTooManyOptions
    ? "Este rango genera demasiadas opciones. Ajusta fechas, dias u horarios para llegar a un maximo de 60."
    : null;

  function updateField<K extends keyof EventOptionGeneratorInput>(
    key: K,
    value: EventOptionGeneratorInput[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setRemovedKeys(new Set());
  }

  function applyPreset(preset: GeneratorPreset) {
    const range = getGeneratorPresetRange(preset, timeZone);
    setValues((current) => ({ ...current, ...range }));
    setRemovedKeys(new Set());
  }

  function toggleWeekday(weekday: WeekdayValue) {
    setValues((current) => {
      const exists = current.weekdays.includes(weekday);
      const weekdays = exists
        ? current.weekdays.filter((value) => value !== weekday)
        : [...current.weekdays, weekday];

      return { ...current, weekdays };
    });
    setRemovedKeys(new Set());
  }

  function setScheduleMode(scheduleMode: GeneratorScheduleMode) {
    setValues((current) => ({ ...current, scheduleMode }));
    setRemovedKeys(new Set());
  }

  function addTime() {
    const nextTime = timeDraft.trim();
    if (!nextTime) return;

    setValues((current) => ({
      ...current,
      times: getUniqueTimes([...current.times, nextTime]),
    }));
    setTimeDraft("");
    setRemovedKeys(new Set());
  }

  function removeTime(time: string) {
    setValues((current) => ({
      ...current,
      times: current.times.filter((value) => value !== time),
    }));
    setRemovedKeys(new Set());
  }

  function removePreviewOption(key: string) {
    setRemovedKeys((current) => new Set([...current, key]));
  }

  async function submit() {
    if (!canCreate) return;
    await createOptionsBatch(newOptions.map((option) => option.input));
    setValues(defaultGeneratorInput);
    setRemovedKeys(new Set());
    setTimeDraft("21:00");
  }

  return {
    activePreview,
    addTime,
    applyPreset,
    canCreate,
    duplicateCount,
    errorMessage,
    newOptionsCount: newOptions.length,
    previewCount: activePreview.length,
    removePreviewOption,
    removeTime,
    setScheduleMode,
    setTimeDraft,
    submit,
    timeDraft,
    toggleWeekday,
    updateField,
    values,
  };
}
