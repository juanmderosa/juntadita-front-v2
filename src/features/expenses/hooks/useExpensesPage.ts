import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { expensesApi } from "@/api/expenses.api";
import { eventsApi } from "@/api/events.api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { canManageExpense } from "@/features/expenses/lib/expensePermissions";
import { usePayments } from "@/features/payments/hooks/usePayments";
import type {
  Expense,
  ExpenseAttachment,
  ExpenseInput,
} from "@/types/expenses";

export function useExpensesPage() {
  const { eventId = "" } = useParams();
  const { accessToken, currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [editingExpense, setEditingExpense] = useState<
    Expense | null | undefined
  >(undefined);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [financialAction, setFinancialAction] = useState<
    "enable" | "reopen" | null
  >(null);

  const eventQuery = useQuery({
    queryKey: ["events", eventId],
    queryFn: () => eventsApi.getById(accessToken!, eventId),
    enabled: Boolean(accessToken && eventId),
  });

  const expensesQuery = useQuery({
    queryKey: ["expenses", eventId],
    queryFn: () => expensesApi.list(accessToken!, eventId),
    enabled: Boolean(accessToken && eventId),
  });
  const payments = usePayments(
    eventId,
    eventQuery.data?.financialStatus === "payments_enabled",
  );

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["events", eventId] }),
      queryClient.invalidateQueries({ queryKey: ["expenses", eventId] }),
      queryClient.invalidateQueries({ queryKey: ["payments", eventId] }),
    ]);

  const saveMutation = useMutation({
    mutationFn: async ({
      expenseId,
      input,
      files,
    }: {
      expenseId?: string;
      input: ExpenseInput;
      files: File[];
    }) => {
      const expense = expenseId
        ? await expensesApi.update(accessToken!, eventId, expenseId, input)
        : await expensesApi.create(accessToken!, eventId, input);
      await Promise.all(
        files.map((file) =>
          expensesApi.uploadAttachment(accessToken!, eventId, expense.id, file),
        ),
      );
      return expense;
    },
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (expenseId: string) =>
      expensesApi.delete(accessToken!, eventId, expenseId),
    onSuccess: invalidate,
  });

  const deleteAttachmentMutation = useMutation({
    mutationFn: ({
      expenseId,
      attachmentId,
    }: {
      expenseId: string;
      attachmentId: string;
    }) =>
      expensesApi.deleteAttachment(
        accessToken!,
        eventId,
        expenseId,
        attachmentId,
      ),
    onSuccess: invalidate,
  });

  const participationMutation = useMutation({
    mutationFn: ({
      participantId,
      participates,
    }: {
      participantId: string;
      participates: boolean;
    }) =>
      eventsApi.updateExpenseParticipation(
        accessToken!,
        eventId,
        participantId,
        participates,
      ),
    onSuccess: invalidate,
  });
  const financialStatusMutation = useMutation({
    mutationFn: (action: "enable" | "reopen") =>
      action === "enable"
        ? eventsApi.enablePayments(accessToken!, eventId)
        : eventsApi.reopenExpenses(accessToken!, eventId),
    onSuccess: invalidate,
  });
  return {
    eventId,
    event: eventQuery.data,
    expenses: expensesQuery.data?.data ?? [],
    isLoading: eventQuery.isLoading || expensesQuery.isLoading,
    error: eventQuery.error ?? expensesQuery.error,
    saveExpense: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    saveError: saveMutation.error,
    deleteExpense: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
    expenseToDelete,
    requestDeleteExpense: (expense: Expense) => setExpenseToDelete(expense),
    cancelDeleteExpense: () => setExpenseToDelete(null),
    confirmDeleteExpense: async () => {
      if (!expenseToDelete) return;
      await deleteMutation.mutateAsync(expenseToDelete.id);
      setExpenseToDelete(null);
    },
    downloadAttachment: async (expenseId: string, attachmentId: string) => {
      const result = await expensesApi.getAttachmentUrl(
        accessToken!,
        eventId,
        expenseId,
        attachmentId,
      );
      window.open(result.url, "_blank", "noopener");
    },
    deleteAttachment: (expenseId: string, attachment: ExpenseAttachment) =>
      deleteAttachmentMutation.mutateAsync({
        expenseId,
        attachmentId: attachment.id,
      }),
    isDeletingAttachment: deleteAttachmentMutation.isPending,
    attachmentError: deleteAttachmentMutation.error,
    updateParticipation: participationMutation.mutateAsync,
    participationError: participationMutation.error,
    canManageExpense: (expense: Expense) =>
      canManageExpense({
        currentUserId: currentUser?.user.id,
        currentUserRole: eventQuery.data?.currentUserRole,
        expense,
      }),
    editingExpense,
    openCreate: () => setEditingExpense(null),
    openEdit: (expense: Expense) => setEditingExpense(expense),
    closeForm: () => setEditingExpense(undefined),
    isParticipantsOpen,
    openParticipants: () => setIsParticipantsOpen(true),
    closeParticipants: () => setIsParticipantsOpen(false),
    financialAction,
    requestEnablePayments: () => setFinancialAction("enable"),
    requestReopenExpenses: () => setFinancialAction("reopen"),
    cancelFinancialAction: () => setFinancialAction(null),
    confirmFinancialAction: async () => {
      if (!financialAction) return;
      await financialStatusMutation.mutateAsync(financialAction);
      setFinancialAction(null);
    },
    isChangingFinancialStatus: financialStatusMutation.isPending,
    financialStatusError: financialStatusMutation.error,
    payments,
    financialParticipants: (eventQuery.data?.participants ?? []).filter(
      (participant) =>
        participant.status !== "removed" && participant.participatesInExpenses,
    ),
    allowedPaymentPayers: (eventQuery.data?.participants ?? []).filter(
      (participant) =>
        participant.status !== "removed" &&
        participant.participatesInExpenses &&
        (participant.userId === currentUser?.user.id ||
          (eventQuery.data?.currentUserRole === "admin" &&
            participant.userId === null)),
    ),
  };
}
