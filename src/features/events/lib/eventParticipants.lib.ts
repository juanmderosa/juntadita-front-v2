export function parseInviteEmails(value: string) {
  return value
    .split(/[\s,;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function getInviteEmailsValidationError(emails: string[]) {
  if (emails.length === 0) return "Agrega al menos un email.";

  if (new Set(emails).size !== emails.length) return "Hay emails repetidos.";

  const invalidEmail = emails.find((email) => !isValidEmail(email));
  if (invalidEmail) return `El email ${invalidEmail} no es valido.`;

  return null;
}

export function getDeliveryLabel(status: "sent" | "failed" | "skipped") {
  if (status === "sent") return "enviado";
  if (status === "failed") return "fallo el envio";
  return "ya existia";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
