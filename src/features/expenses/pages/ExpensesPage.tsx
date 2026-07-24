import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ExpenseActions } from "@/features/expenses/components/ExpenseActions";
import { ExpenseAttachments } from "@/features/expenses/components/ExpenseAttachments";
import { DeleteExpenseModal } from "@/features/expenses/components/DeleteExpenseModal";
import { ExpenseFormModal } from "@/features/expenses/components/ExpenseFormModal";
import { FinancialStatusModal } from "@/features/expenses/components/FinancialStatusModal";
import { FinancialStatusPanel } from "@/features/expenses/components/FinancialStatusPanel";
import { useExpensesPage } from "@/features/expenses/hooks/useExpensesPage";
import { PaymentFormModal } from "@/features/payments/components/PaymentFormModal";
import { PaymentsSection } from "@/features/payments/components/PaymentsSection";
import { VoidPaymentModal } from "@/features/payments/components/VoidPaymentModal";
import { getErrorMessage } from "@/lib/errors";

const money = (cents: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(cents / 100);

export function ExpensesPage() {
  const page = useExpensesPage();

  if (page.isLoading) return <p className="p-8 text-slate-600">Cargando gastos...</p>;

  if (!page.event) return <p className="p-8 text-red-700">{getErrorMessage(page.error)}</p>;

  const event = page.event;
  const canManage = event.currentUserRole === "admin";
  const canManageParticipants = canManage && !event.financialParticipantsLockedAt;
  const expensesAreOpen = event.financialStatus === "collecting_expenses";
  const total = page.expenses.reduce((sum, expense) => sum + expense.amountCents, 0);

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-8">
      <Link to={`/events/${page.eventId}`} className="text-sm font-semibold text-indigo-700">
        ← Volver al evento
      </Link>
      <header className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{event.title} · Gastos</h1>
          <p className="text-slate-600">Repartí y consultá los gastos del evento.</p>
        </div>
        <div className="flex gap-2">
          {canManageParticipants ? (
            <Button variant="secondary" onClick={page.openParticipants}>
              Participantes de gastos
            </Button>
          ) : null}
          {expensesAreOpen ? <Button onClick={page.openCreate}>+ Cargar gasto</Button> : null}
        </div>
      </header>
      <section className="mt-6 rounded-2xl bg-indigo-600 p-6 text-white">
        <p>Total gastado</p>
        <strong className="text-4xl">{money(total)}</strong>
      </section>
      <FinancialStatusPanel
        canManage={canManage}
        financialStatus={event.financialStatus}
        hasBeenFinanciallyClosed={Boolean(event.financialParticipantsLockedAt)}
        onEnablePayments={page.requestEnablePayments}
        onReopenExpenses={page.requestReopenExpenses}
      />
      <section className="mt-8">
        <h2 className="text-xl font-bold">Movimientos</h2>
        {page.expenses.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed p-8 text-center text-slate-600">
            Todavía no hay gastos.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {page.expenses.map((expense) => (
              <li key={expense.id} className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-bold">{expense.title}</p>
                    <p className="text-sm text-slate-600">
                      Pagó {expense.paidBy.displayName ?? expense.paidBy.email} ·{" "}
                      {expense.splitMethod === "equal"
                        ? "Dividido en partes iguales"
                        : "División personalizada"}
                    </p>
                  </div>
                  <strong>{money(expense.amountCents)}</strong>
                </div>
                <ExpenseActions
                  canManage={expensesAreOpen && page.canManageExpense(expense)}
                  onEdit={() => page.openEdit(expense)}
                  onRequestDelete={() => page.requestDeleteExpense(expense)}
                />
                <ExpenseAttachments
                  attachments={expense.attachments}
                  canManage={expensesAreOpen && page.canManageExpense(expense)}
                  onDownload={(attachmentId) => page.downloadAttachment(expense.id, attachmentId)}
                  onRequestDelete={(attachment) =>
                    void page.deleteAttachment(expense.id, attachment)
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </section>
      {event.financialStatus === "payments_enabled" ? (
        page.payments.isLoading ? (
          <p className="mt-8 text-slate-600">Calculando balances...</p>
        ) : page.payments.overview ? (
          <PaymentsSection
            overview={page.payments.overview}
            currentUserId={page.payments.currentUserId}
            isAdmin={canManage}
            onRegister={page.payments.openForm}
            onVoid={page.payments.requestVoid}
          />
        ) : (
          <p className="mt-8 text-red-700">{getErrorMessage(page.payments.error)}</p>
        )
      ) : null}
      <ExpenseFormModal
        isOpen={page.editingExpense !== undefined}
        expense={page.editingExpense ?? null}
        participants={event.participants}
        isSaving={page.isSaving}
        error={page.saveError}
        onClose={page.closeForm}
        onSave={async (input, files) => {
          await page.saveExpense({
            expenseId: page.editingExpense?.id,
            input,
            files,
          });
        }}
      />
      <DeleteExpenseModal
        expense={page.expenseToDelete}
        isDeleting={page.isDeleting}
        onClose={page.cancelDeleteExpense}
        onConfirm={page.confirmDeleteExpense}
      />
      <FinancialStatusModal
        mode={page.financialAction}
        expensesCount={page.expenses.length}
        participantsCount={
          event.participants.filter(
            (participant) => participant.participatesInExpenses && participant.status !== "removed",
          ).length
        }
        isPending={page.isChangingFinancialStatus}
        error={page.financialStatusError}
        onClose={page.cancelFinancialAction}
        onConfirm={() => void page.confirmFinancialAction()}
      />
      <PaymentFormModal
        isOpen={page.payments.isFormOpen}
        isAdmin={canManage}
        participants={page.financialParticipants}
        allowedPayers={page.allowedPaymentPayers}
        suggestions={page.payments.overview?.suggestions ?? []}
        isSaving={page.payments.isCreating}
        error={page.payments.createError}
        onClose={page.payments.closeForm}
        onSave={page.payments.createPayment}
      />
      <VoidPaymentModal
        payment={page.payments.paymentToVoid}
        isSaving={page.payments.isVoiding}
        error={page.payments.voidError}
        onClose={page.payments.cancelVoid}
        onConfirm={async (reason) => {
          if (!page.payments.paymentToVoid) return;
          await page.payments.voidPayment({
            paymentId: page.payments.paymentToVoid.id,
            reason,
          });
        }}
      />
      <Modal
        isOpen={page.isParticipantsOpen}
        onClose={page.closeParticipants}
        title="Participantes de gastos"
      >
        <ul className="mt-4 space-y-2">
          {event.participants
            .filter((p) => p.status !== "removed")
            .map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
              >
                <span>{p.displayName ?? p.email}</span>
                <Button
                  disabled={!expensesAreOpen}
                  variant={p.participatesInExpenses ? "secondary" : "primary"}
                  onClick={() =>
                    void page.updateParticipation({
                      participantId: p.id,
                      participates: !p.participatesInExpenses,
                    })
                  }
                >
                  {p.participatesInExpenses ? "Excluir" : "Incluir"}
                </Button>
              </li>
            ))}
        </ul>
        {page.participationError ? (
          <p className="mt-3 text-sm text-red-700">{getErrorMessage(page.participationError)}</p>
        ) : null}
      </Modal>
    </main>
  );
}
