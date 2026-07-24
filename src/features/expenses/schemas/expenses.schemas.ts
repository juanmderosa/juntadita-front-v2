import { z } from "zod";
import { paginatedResponseSchema, successResponseSchema } from "@/schemas/api.schemas";
import { isoDateTimeSchema, uuidSchema } from "@/schemas/common.schemas";
import { eventParticipantSchema } from "@/features/events/schemas/events.schemas";

const attachmentSchema = z.object({
  id: uuidSchema,
  expenseId: uuidSchema,
  uploadedByUserId: uuidSchema,
  fileName: z.string(),
  contentType: z.string().nullable(),
  sizeBytes: z.number().int().nullable(),
  createdAt: isoDateTimeSchema,
});
const splitSchema = z.object({
  participantId: uuidSchema,
  amountCents: z.number().int().positive(),
  participant: eventParticipantSchema,
});
export const expenseSchema = z.object({
  id: uuidSchema,
  eventId: uuidSchema,
  paidByParticipantId: uuidSchema,
  paidBy: eventParticipantSchema,
  createdByUserId: uuidSchema,
  title: z.string(),
  description: z.string().nullable(),
  amountCents: z.number().int().positive(),
  currencyCode: z.string(),
  splitMethod: z.enum(["equal", "custom"]),
  spentAt: isoDateTimeSchema,
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
  splits: z.array(splitSchema),
  attachments: z.array(attachmentSchema),
});
export const expensesResponseSchema = paginatedResponseSchema(expenseSchema);
export const expenseResponseSchema = successResponseSchema(expenseSchema);
export const attachmentResponseSchema = successResponseSchema(attachmentSchema);
export const signedAttachmentResponseSchema = successResponseSchema(
  z.object({ url: z.url(), expiresAt: isoDateTimeSchema }),
);
