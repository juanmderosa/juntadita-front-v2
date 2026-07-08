import { z } from "zod";
import { successResponseSchema, paginatedResponseSchema } from "../../../schemas/api.schemas";
import {
  currencyCodeSchema,
  isoDateTimeSchema,
  timeZoneSchema,
  uuidSchema,
} from "../../../schemas/common.schemas";
import { localDateTimeToIso } from "../../../lib/dates";

export const eventSchema = z.object({
  id: uuidSchema,
  createdBy: uuidSchema,
  title: z.string(),
  description: z.string().nullable(),
  type: z.enum(["poll", "fixed"]),
  currentUserRole: z.enum(["admin", "guest"]),
  currencyCode: currencyCodeSchema,
  timezone: timeZoneSchema,
  votingClosesAt: isoDateTimeSchema.nullable(),
  fixedStartAt: isoDateTimeSchema.nullable(),
  fixedEndAt: isoDateTimeSchema.nullable(),
  finalizedAt: isoDateTimeSchema.nullable(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const eventResponseSchema = successResponseSchema(eventSchema);
export const paginatedEventsResponseSchema = paginatedResponseSchema(eventSchema);

const titleSchema = z
  .string()
  .trim()
  .min(1, "El titulo es obligatorio.")
  .max(120, "El titulo no puede superar 120 caracteres.");

const descriptionSchema = z
  .string()
  .trim()
  .max(2000, "La descripcion no puede superar 2000 caracteres.");

export const eventFormSchema = z
  .object({
    type: z.enum(["poll", "fixed"]),
    title: titleSchema,
    description: descriptionSchema,
    votingClosesAt: z.string(),
    fixedStartAt: z.string(),
    fixedEndAt: z.string(),
  })
  .superRefine((value, context) => {
    if (value.type === "poll") {
      if (!value.votingClosesAt) {
        context.addIssue({
          code: "custom",
          path: ["votingClosesAt"],
          message: "Indica cuando cierra la votacion.",
        });
        return;
      }

      if (new Date(localDateTimeToIso(value.votingClosesAt)).getTime() <= Date.now()) {
        context.addIssue({
          code: "custom",
          path: ["votingClosesAt"],
          message: "El cierre debe ser futuro.",
        });
      }
      return;
    }

    if (!value.fixedStartAt) {
      context.addIssue({
        code: "custom",
        path: ["fixedStartAt"],
        message: "Indica la fecha y hora del evento.",
      });
      return;
    }

    if (
      value.fixedEndAt &&
      new Date(localDateTimeToIso(value.fixedEndAt)).getTime() <=
        new Date(localDateTimeToIso(value.fixedStartAt)).getTime()
    ) {
      context.addIssue({
        code: "custom",
        path: ["fixedEndAt"],
        message: "La finalizacion debe ser posterior al inicio.",
      });
    }
  });

export const editEventFormSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
});

export type EventFormInput = z.infer<typeof eventFormSchema>;
export type EditEventFormInput = z.infer<typeof editEventFormSchema>;
