export function parseEmails(value: string) {
  return value
    .split(/[\s,;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function getEmailsValidationError(emails: string[]) {
  if (emails.length === 0) return "Agrega al menos un email.";
  if (new Set(emails).size !== emails.length) return "Hay emails repetidos.";
  const invalidEmail = emails.find((email) => !isValidEmail(email));
  return invalidEmail ? `El email ${invalidEmail} no es valido.` : null;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
