import type { EventParticipant } from "@/types/events";

export type PaymentStatus = "active" | "voided";
export type Payment = {
  id: string;
  eventId: string;
  fromParticipantId: string;
  toParticipantId: string;
  fromParticipant: EventParticipant;
  toParticipant: EventParticipant;
  createdByUserId: string;
  amountCents: number;
  currencyCode: string;
  paidAt: string;
  note: string | null;
  status: PaymentStatus;
  voidedAt: string | null;
  voidedByUserId: string | null;
  voidReason: string | null;
  createdAt: string;
  updatedAt: string;
};
export type ParticipantBalance = {
  participant: EventParticipant;
  balanceCents: number;
};
export type PaymentSuggestion = {
  fromParticipantId: string;
  toParticipantId: string;
  amountCents: number;
};
export type PaymentOverview = {
  balances: ParticipantBalance[];
  suggestions: PaymentSuggestion[];
  payments: Payment[];
};
export type CreatePaymentInput = {
  fromParticipantId: string;
  toParticipantId: string;
  amountCents: number;
  paidAt?: string;
  note?: string | null;
};
