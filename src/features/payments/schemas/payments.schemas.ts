import { z } from "zod";
import { successResponseSchema } from "@/schemas/api.schemas";
import { isoDateTimeSchema, uuidSchema } from "@/schemas/common.schemas";
import { eventParticipantSchema } from "@/features/events/schemas/events.schemas";
import { parseMoneyToCents } from "@/lib/money";

const paymentSchema = z.object({
  id: uuidSchema,
  eventId: uuidSchema,
  fromParticipantId: uuidSchema,
  toParticipantId: uuidSchema,
  fromParticipant: eventParticipantSchema,
  toParticipant: eventParticipantSchema,
  createdByUserId: uuidSchema,
  amountCents: z.number().int().positive(),
  currencyCode: z.string(),
  paidAt: isoDateTimeSchema,
  note: z.string().nullable(),
  status: z.enum(["active", "voided"]),
  voidedAt: isoDateTimeSchema.nullable(),
  voidedByUserId: uuidSchema.nullable(),
  voidReason: z.string().nullable(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});
export const paymentOverviewSchema = z.object({
  balances: z.array(
    z.object({
      participant: eventParticipantSchema,
      balanceCents: z.number().int(),
    }),
  ),
  suggestions: z.array(
    z.object({
      fromParticipantId: uuidSchema,
      toParticipantId: uuidSchema,
      amountCents: z.number().int().positive(),
    }),
  ),
  payments: z.array(paymentSchema),
});
export const paymentOverviewResponseSchema = successResponseSchema(paymentOverviewSchema);
export const paymentResponseSchema = successResponseSchema(paymentSchema);
export const paymentFormSchema = z
  .object({
    fromParticipantId: uuidSchema,
    toParticipantId: uuidSchema,
    amount: z
      .string()
      .trim()
      .refine((value) => {
        try {
          return parseMoneyToCents(value) > 0;
        } catch {
          return false;
        }
      }, "Ingresá un importe válido de hasta dos decimales."),
    note: z.string().trim().max(500, "La nota no puede superar 500 caracteres."),
  })
  .refine((value) => value.fromParticipantId !== value.toParticipantId, {
    path: ["toParticipantId"],
    message: "Elegí otra persona.",
  });
export const voidPaymentFormSchema = z.object({
  voidReason: z.string().trim().min(1, "Indicá el motivo.").max(500),
});
export type PaymentFormInput = z.infer<typeof paymentFormSchema>;
export type VoidPaymentFormInput = z.infer<typeof voidPaymentFormSchema>;
