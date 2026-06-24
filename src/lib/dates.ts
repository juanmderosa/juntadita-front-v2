export function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Buenos_Aires",
  }).format(new Date(value));
}
