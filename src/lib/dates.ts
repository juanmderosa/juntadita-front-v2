import { DEFAULT_LOCALE, DEFAULT_TIME_ZONE } from "./localization";

type DateFormatOptions = {
  locale?: string;
  timeZone?: string;
};

export function formatDate(
  value: string | Date,
  options: DateFormatOptions = {},
) {
  return new Intl.DateTimeFormat(options.locale ?? DEFAULT_LOCALE, {
    dateStyle: "medium",
    timeZone: options.timeZone ?? DEFAULT_TIME_ZONE,
  }).format(new Date(value));
}

export function formatDateTime(
  value: string | Date,
  options: DateFormatOptions = {},
) {
  return new Intl.DateTimeFormat(options.locale ?? DEFAULT_LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: options.timeZone ?? DEFAULT_TIME_ZONE,
  }).format(new Date(value));
}
