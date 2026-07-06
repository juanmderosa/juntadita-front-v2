import { z } from "zod";
import { isValidTimeZone } from "../lib/timezones";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;

export const uuidSchema = z.uuid("El identificador no es valido.");

export const normalizedEmailSchema = z
  .string()
  .transform((value) => value.trim().toLowerCase())
  .pipe(z.email("Ingresa un email valido."));

export const isoDateTimeSchema = z.iso.datetime({
  offset: true,
  message: "Ingresa una fecha y hora ISO con zona horaria.",
});

export const currencyCodeSchema = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .pipe(z.string().regex(/^[A-Z]{3}$/, "La moneda no es valida."));

export const timeZoneSchema = z
  .string()
  .trim()
  .min(1, "La zona horaria es obligatoria.")
  .refine(isValidTimeZone, "La zona horaria no es valida.");

export const amountInCentsSchema = z
  .number()
  .int("El importe debe expresarse en centavos enteros.")
  .nonnegative("El importe no puede ser negativo.")
  .refine(Number.isSafeInteger, "El importe excede el rango permitido.");

export const positiveAmountInCentsSchema = amountInCentsSchema.refine(
  (value) => value > 0,
  "El importe debe ser mayor que cero.",
);

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_LIMIT)
    .default(DEFAULT_PAGE_LIMIT),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
