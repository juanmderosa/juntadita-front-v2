import { z } from "zod";
import { successResponseSchema, paginatedResponseSchema } from "@/schemas/api.schemas";
import {
  currencyCodeSchema,
  isoDateTimeSchema,
  timeZoneSchema,
  uuidSchema,
} from "@/schemas/common.schemas";
import { localDateTimeToIso } from "@/lib/dates";

export const eventSummarySchema = z.object({
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
  winningOption: z.object({
    id: uuidSchema,
    eventId: uuidSchema,
    type: z.enum(["date", "datetime", "range"]),
    label: z.string().nullable(),
    startAt: isoDateTimeSchema,
    endAt: isoDateTimeSchema.nullable(),
    createdAt: isoDateTimeSchema,
    updatedAt: isoDateTimeSchema,
  }).nullable(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const eventOptionSchema = z.object({
  id: uuidSchema,
  eventId: uuidSchema,
  type: z.enum(["date", "datetime", "range"]),
  label: z.string().nullable(),
  startAt: isoDateTimeSchema,
  endAt: isoDateTimeSchema.nullable(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const eventParticipantSchema = z.object({
  id: uuidSchema,
  eventId: uuidSchema,
  userId: uuidSchema.nullable(),
  email: z.email(),
  displayName: z.string().nullable(),
  role: z.enum(["admin", "guest"]),
  status: z.enum(["invited", "joined", "removed"]),
  participatesInExpenses: z.boolean().default(true),
  invitedBy: uuidSchema.nullable(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const inviteEmailDeliverySchema = z.object({
  email: z.email(),
  status: z.enum(["sent", "failed", "skipped"]),
  providerMessageId: z.string().nullable(),
  errorMessage: z.string().nullable(),
});

export const inviteParticipantsResultSchema = z.object({
  participants: z.array(eventParticipantSchema),
  emails: z.array(inviteEmailDeliverySchema),
});

export const eventDetailSchema = eventSummarySchema.extend({
  optionsLocked: z.boolean(),
  options: z.array(eventOptionSchema),
  participants: z.array(eventParticipantSchema),
});

export const eventResponseSchema = successResponseSchema(eventDetailSchema);
export const optionResponseSchema = successResponseSchema(eventOptionSchema);
export const optionsResponseSchema = successResponseSchema(z.array(eventOptionSchema));
export const participantsResponseSchema = successResponseSchema(
  z.array(eventParticipantSchema),
);
export const inviteParticipantsResponseSchema = successResponseSchema(
  inviteParticipantsResultSchema,
);
const eventResultSchema = z.object({
  status: z.enum(["finalized", "tie_pending", "no_winner"]),
  winningOptionId: uuidSchema.nullable(),
  totalVotes: z.number().int().nonnegative(),
  decidedBy: z.enum(["system", "admin"]),
  decidedAt: isoDateTimeSchema,
});
const votingOptionSchema = eventOptionSchema.extend({
  votesCount: z.number().int().nonnegative(),
  availabilityPercent: z.number().int().min(0).max(100),
});
export const votingStateSchema = z.object({
  isOpen: z.boolean(),
  votingClosesAt: isoDateTimeSchema,
  eligibleParticipants: z.number().int().nonnegative(),
  selectedOptionIds: z.array(uuidSchema),
  options: z.array(votingOptionSchema),
  result: eventResultSchema.nullable(),
  tiedOptionIds: z.array(uuidSchema),
});
export const votingResponseSchema = successResponseSchema(votingStateSchema);
export const paginatedEventsResponseSchema =
  paginatedResponseSchema(eventSummarySchema);

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

export const optionFormSchema = z
  .object({
    type: z.enum(["date", "datetime", "range"]),
    label: z.string().trim().max(120, "La etiqueta no puede superar 120 caracteres."),
    date: z.string(),
    startAt: z.string(),
    endAt: z.string(),
  })
  .superRefine((value, context) => {
    if (value.type === "date") {
      if (!value.date) {
        context.addIssue({
          code: "custom",
          path: ["date"],
          message: "Indica el dia de la opcion.",
        });
      }
      return;
    }

    if (!value.startAt) {
      context.addIssue({
        code: "custom",
        path: ["startAt"],
        message: "Indica la fecha y hora de inicio.",
      });
      return;
    }

    if (value.type === "range") {
      if (!value.endAt) {
        context.addIssue({
          code: "custom",
          path: ["endAt"],
          message: "Indica la fecha y hora de fin.",
        });
        return;
      }

      if (
        new Date(localDateTimeToIso(value.endAt)).getTime() <=
        new Date(localDateTimeToIso(value.startAt)).getTime()
      ) {
        context.addIssue({
          code: "custom",
          path: ["endAt"],
          message: "El fin debe ser posterior al inicio.",
        });
      }
    }
  });

export const inviteParticipantsFormSchema = z.object({
  emailsText: z.string(),
});

export const voteFormSchema = z.object({
  optionIds: z.array(uuidSchema).min(1, "Selecciona al menos una opción."),
});

export type EventFormInput = z.infer<typeof eventFormSchema>;
export type EditEventFormInput = z.infer<typeof editEventFormSchema>;
export type OptionFormInput = z.infer<typeof optionFormSchema>;
export type InviteParticipantsFormInput = z.infer<
  typeof inviteParticipantsFormSchema
>;
export type VoteFormInput = z.infer<typeof voteFormSchema>;
