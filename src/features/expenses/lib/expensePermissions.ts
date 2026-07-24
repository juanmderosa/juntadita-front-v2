import type { Expense } from "@/types/expenses";
import type { EventParticipantRole } from "@/types/events";

type CanManageExpenseInput = {
  currentUserId: string | undefined;
  currentUserRole: EventParticipantRole | undefined;
  expense: Expense;
};

export function canManageExpense({
  currentUserId,
  currentUserRole,
  expense,
}: CanManageExpenseInput) {
  return (
    currentUserRole === "admin" ||
    (currentUserId !== undefined && expense.createdByUserId === currentUserId)
  );
}
