import { formatInTimeZone } from "date-fns-tz";
import { localDateTimeToIso, localDateToIso } from "@/lib/dates";
import { DEFAULT_TIME_ZONE } from "@/lib/localization";
import type { CreateEventOptionInput, EventOption } from "@/types/events";

export const MAX_GENERATED_OPTIONS = 60;

export type WeekdayValue = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type GeneratorScheduleMode = "date" | "datetime";
export type GeneratorPreset =
  "this-week" | "next-week" | "this-weekend" | "next-weekend" | "this-month" | "next-month";

export type EventOptionGeneratorInput = {
  endDate: string;
  label: string;
  scheduleMode: GeneratorScheduleMode;
  startDate: string;
  times: string[];
  weekdays: WeekdayValue[];
};

export type GeneratedEventOptionPreview = {
  key: string;
  input: CreateEventOptionInput;
  isDuplicate: boolean;
};

export const weekdayOptions: Array<{ label: string; value: WeekdayValue }> = [
  { label: "L", value: 1 },
  { label: "M", value: 2 },
  { label: "X", value: 3 },
  { label: "J", value: 4 },
  { label: "V", value: 5 },
  { label: "S", value: 6 },
  { label: "D", value: 0 },
];

export const generatorPresets: Array<{ label: string; value: GeneratorPreset }> = [
  { label: "Esta semana", value: "this-week" },
  { label: "Proxima semana", value: "next-week" },
  { label: "Este finde", value: "this-weekend" },
  { label: "Proximo finde", value: "next-weekend" },
  { label: "Este mes", value: "this-month" },
  { label: "Proximo mes", value: "next-month" },
];

export const defaultGeneratorInput: EventOptionGeneratorInput = {
  endDate: "",
  label: "",
  scheduleMode: "date",
  startDate: "",
  times: ["21:00"],
  weekdays: [1, 2, 3, 4, 5, 6, 0],
};

export function getGeneratorPresetRange(
  preset: GeneratorPreset,
  timeZone = DEFAULT_TIME_ZONE,
  now = new Date(),
) {
  const today = formatInTimeZone(now, timeZone, "yyyy-MM-dd");

  if (preset === "this-month") return getMonthRange(today, 0);
  if (preset === "next-month") return getMonthRange(today, 1);

  const thisWeekStart = startOfWeek(today);
  const offset = preset === "next-week" || preset === "next-weekend" ? 7 : 0;
  const weekStart = addDays(thisWeekStart, offset);

  if (preset === "this-week" || preset === "next-week") {
    return { startDate: weekStart, endDate: addDays(weekStart, 6) };
  }

  return { startDate: addDays(weekStart, 5), endDate: addDays(weekStart, 6) };
}

export function generateEventOptionPreview(
  input: EventOptionGeneratorInput,
  existingOptions: EventOption[],
  timeZone = DEFAULT_TIME_ZONE,
): GeneratedEventOptionPreview[] {
  if (!input.startDate || !input.endDate) return [];
  if (compareDateStrings(input.endDate, input.startDate) < 0) return [];
  if (input.weekdays.length === 0) return [];
  if (input.scheduleMode === "datetime" && getUniqueTimes(input.times).length === 0) {
    return [];
  }

  const existingKeys = new Set(existingOptions.map(getEventOptionKey));
  const weekdays = new Set(input.weekdays);
  const label = input.label.trim() || null;
  const generated = new Map<string, GeneratedEventOptionPreview>();
  const times = getUniqueTimes(input.times);

  for (const date of getDateRange(input.startDate, input.endDate)) {
    if (!weekdays.has(getWeekday(date))) continue;

    const inputs =
      input.scheduleMode === "date"
        ? [{ type: "date" as const, label, startAt: localDateToIso(date, timeZone) }]
        : times.map((time) => ({
            type: "datetime" as const,
            label,
            startAt: localDateTimeToIso(`${date}T${time}`, timeZone),
          }));

    for (const optionInput of inputs) {
      const key = getEventOptionInputKey(optionInput);

      if (!generated.has(key)) {
        generated.set(key, {
          key,
          input: optionInput,
          isDuplicate: existingKeys.has(key),
        });
      }
    }
  }

  return [...generated.values()];
}

export function getEventOptionInputKey(option: CreateEventOptionInput) {
  return [
    option.type,
    new Date(option.startAt).toISOString(),
    option.type === "range" ? new Date(option.endAt).toISOString() : "",
  ].join("|");
}

export function getEventOptionKey(option: EventOption) {
  return [
    option.type,
    new Date(option.startAt).toISOString(),
    option.endAt ? new Date(option.endAt).toISOString() : "",
  ].join("|");
}

export function getUniqueTimes(times: string[]) {
  return [...new Set(times.map((time) => time.trim()).filter(Boolean))].sort();
}

function getDateRange(startDate: string, endDate: string) {
  const dates: string[] = [];
  let current = startDate;

  while (compareDateStrings(current, endDate) <= 0) {
    dates.push(current);
    current = addDays(current, 1);
  }

  return dates;
}

function getWeekday(date: string): WeekdayValue {
  return new Date(`${date}T00:00:00.000Z`).getUTCDay() as WeekdayValue;
}

function startOfWeek(date: string) {
  const weekday = getWeekday(date);
  const distanceToMonday = weekday === 0 ? 6 : weekday - 1;
  return addDays(date, -distanceToMonday);
}

function getMonthRange(date: string, offsetMonths: number) {
  const [year, month] = date.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 1 + offsetMonths, 1));
  const end = new Date(Date.UTC(year, month + offsetMonths, 0));

  return {
    startDate: toDateString(start),
    endDate: toDateString(end),
  };
}

function addDays(date: string, amount: number) {
  const [year, month, day] = date.split("-").map(Number);
  const value = new Date(Date.UTC(year, month - 1, day + amount));
  return toDateString(value);
}

function toDateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

function compareDateStrings(left: string, right: string) {
  return left.localeCompare(right);
}
