import type { EventParticipant } from "@/types/events";

export type ExpenseSplitMethod = "equal" | "custom";
export type ExpenseAttachment = {
  id: string;
  expenseId: string;
  uploadedByUserId: string;
  fileName: string;
  contentType: string | null;
  sizeBytes: number | null;
  createdAt: string;
};
export type ExpenseSplit = {
  participantId: string;
  amountCents: number;
  participant: EventParticipant;
};
export type Expense = {
  id: string;
  eventId: string;
  paidByParticipantId: string;
  paidBy: EventParticipant;
  createdByUserId: string;
  title: string;
  description: string | null;
  amountCents: number;
  currencyCode: string;
  splitMethod: ExpenseSplitMethod;
  spentAt: string;
  createdAt: string;
  updatedAt: string;
  splits: ExpenseSplit[];
  attachments: ExpenseAttachment[];
};
export type ExpenseInput =
  | {
      paidByParticipantId: string;
      title: string;
      description?: string | null;
      amountCents: number;
      spentAt?: string;
      splitMethod: "equal";
      participantIds: string[];
    }
  | {
      paidByParticipantId: string;
      title: string;
      description?: string | null;
      amountCents: number;
      spentAt?: string;
      splitMethod: "custom";
      splits: Array<{ participantId: string; amountCents: number }>;
    };
