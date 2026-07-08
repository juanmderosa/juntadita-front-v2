import { DEFAULT_LOCALE, DEFAULT_TIME_ZONE } from "./localization";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

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

export function localDateTimeToIso(
  value: string,
  timeZone = DEFAULT_TIME_ZONE,
) {
  return fromZonedTime(value, timeZone).toISOString();
}

export function isoToLocalDateTime(
  value: string,
  timeZone = DEFAULT_TIME_ZONE,
) {
  return formatInTimeZone(value, timeZone, "yyyy-MM-dd'T'HH:mm");
}
