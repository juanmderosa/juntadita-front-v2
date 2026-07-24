// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ExpenseActions } from "@/features/expenses/components/ExpenseActions";
import { ExpenseAttachments } from "@/features/expenses/components/ExpenseAttachments";
import { DeleteExpenseModal } from "@/features/expenses/components/DeleteExpenseModal";
import { canManageExpense } from "@/features/expenses/lib/expensePermissions";
import type { Expense } from "@/types/expenses";

const expense = {
  id: "expense-id",
  eventId: "event-id",
  paidByParticipantId: "participant-id",
  paidBy: {},
  createdByUserId: "creator-id",
  title: "Cena",
  description: null,
  amountCents: 12000,
  currencyCode: "ARS",
  splitMethod: "equal",
  spentAt: "2026-07-24T12:00:00Z",
  createdAt: "2026-07-24T12:00:00Z",
  updatedAt: "2026-07-24T12:00:00Z",
  splits: [],
  attachments: [],
} as unknown as Expense;

describe("expense permissions", () => {
  it("allows an admin to manage every expense", () => {
    expect(
      canManageExpense({
        currentUserId: "another-user-id",
        currentUserRole: "admin",
        expense,
      }),
    ).toBe(true);
  });

  it("allows a non-admin creator to manage their own expense only", () => {
    expect(
      canManageExpense({
        currentUserId: "creator-id",
        currentUserRole: "guest",
        expense,
      }),
    ).toBe(true);
    expect(
      canManageExpense({
        currentUserId: "another-user-id",
        currentUserRole: "guest",
        expense,
      }),
    ).toBe(false);
  });

  it("only renders the edit and delete actions for authorized users", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onRequestDelete = vi.fn();
    const { rerender } = render(
      <ExpenseActions canManage={false} onEdit={onEdit} onRequestDelete={onRequestDelete} />,
    );

    expect(screen.queryByRole("button", { name: "Editar" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Eliminar" })).toBeNull();

    rerender(<ExpenseActions canManage onEdit={onEdit} onRequestDelete={onRequestDelete} />);
    await user.click(screen.getByRole("button", { name: "Editar" }));
    await user.click(screen.getByRole("button", { name: "Eliminar" }));

    expect(onEdit).toHaveBeenCalledOnce();
    expect(onRequestDelete).toHaveBeenCalledOnce();
  });

  it("makes receipts downloadable for all participants but removable only by managers", () => {
    const attachment = {
      id: "attachment-id",
      expenseId: expense.id,
      uploadedByUserId: "creator-id",
      fileName: "ticket.pdf",
      contentType: "application/pdf",
      sizeBytes: 1200,
      createdAt: expense.createdAt,
    };
    const onDownload = vi.fn().mockResolvedValue(undefined);
    const onRequestDelete = vi.fn();
    const { rerender } = render(
      <ExpenseAttachments
        attachments={[attachment]}
        canManage={false}
        onDownload={onDownload}
        onRequestDelete={onRequestDelete}
      />,
    );

    expect(screen.getByRole("button", { name: "Ver ticket.pdf" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Eliminar comprobante ticket.pdf" })).toBeNull();

    rerender(
      <ExpenseAttachments
        attachments={[attachment]}
        canManage
        onDownload={onDownload}
        onRequestDelete={onRequestDelete}
      />,
    );

    expect(screen.getByRole("button", { name: "Eliminar comprobante ticket.pdf" })).toBeTruthy();
  });

  it("confirms an expense deletion in a modal", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    render(
      <DeleteExpenseModal
        expense={expense}
        isDeleting={false}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Eliminar gasto" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
