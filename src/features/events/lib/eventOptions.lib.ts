import {
  formatDate,
  formatDateTime,
  isoToLocalDate,
  isoToLocalDateTime,
  localDateToIso,
  localDateTimeToIso,
} from "@/lib/dates";
import type {
  CreateEventOptionInput,
  EventOption,
  UpdateEventOptionInput,
} from "@/types/events";
import type { OptionFormInput } from "@/features/events/schemas/events.schemas";

export const optionTypeLabels = {
  date: "Dia",
  datetime: "Dia y hora",
  range: "Franja",
} as const;

export const defaultOptionFormValues: OptionFormInput = {
  type: "date",
  label: "",
  date: "",
  startAt: "",
  endAt: "",
};

export function toCreateEventOptionInput(
  values: OptionFormInput,
  timeZone: string,
): CreateEventOptionInput {
  const label = values.label || null;

  if (values.type === "date") {
    return {
      type: "date",
      label,
      startAt: localDateToIso(values.date, timeZone),
    };
  }

  if (values.type === "datetime") {
    return {
      type: "datetime",
      label,
      startAt: localDateTimeToIso(values.startAt, timeZone),
    };
  }

  return {
    type: "range",
    label,
    startAt: localDateTimeToIso(values.startAt, timeZone),
    endAt: localDateTimeToIso(values.endAt, timeZone),
  };
}

export function toUpdateEventOptionInput(
  values: OptionFormInput,
  timeZone: string,
): UpdateEventOptionInput {
  const input = toCreateEventOptionInput(values, timeZone);

  return {
    label: input.label,
    startAt: input.startAt,
    endAt: input.type === "range" ? input.endAt : null,
  };
}

export function toOptionFormValues(
  option: EventOption,
  timeZone: string,
): OptionFormInput {
  return {
    type: option.type,
    label: option.label ?? "",
    date: option.type === "date" ? isoToLocalDate(option.startAt, timeZone) : "",
    startAt:
      option.type !== "date" ? isoToLocalDateTime(option.startAt, timeZone) : "",
    endAt: option.endAt ? isoToLocalDateTime(option.endAt, timeZone) : "",
  };
}

export function formatOptionSchedule(option: EventOption, timeZone: string) {
  if (option.type === "date") return formatDate(option.startAt, { timeZone });

  if (option.type === "range" && option.endAt) {
    return `${formatDateTime(option.startAt, { timeZone })} - ${formatDateTime(option.endAt, { timeZone })}`;
  }

  return formatDateTime(option.startAt, { timeZone });
}
