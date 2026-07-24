import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { usePaymentForm } from "@/features/payments/hooks/usePaymentForm";
import { getErrorMessage } from "@/lib/errors";
import { formatMoney } from "@/lib/money";
import type { EventParticipant } from "@/types/events";
import type { CreatePaymentInput, PaymentSuggestion } from "@/types/payments";

type Props = {
  isOpen: boolean;
  isAdmin: boolean;
  participants: EventParticipant[];
  allowedPayers: EventParticipant[];
  suggestions: PaymentSuggestion[];
  isSaving: boolean;
  error: unknown;
  onClose: () => void;
  onSave: (input: CreatePaymentInput) => Promise<unknown>;
};
const name = (participant: EventParticipant) => participant.displayName ?? participant.email;

export function PaymentFormModal({
  isOpen,
  isAdmin,
  participants,
  allowedPayers,
  suggestions,
  isSaving,
  error,
  onClose,
  onSave,
}: Props) {
  const controller = usePaymentForm({
    isOpen,
    allowedPayers,
    suggestions,
    onSave,
  });
  const recipients = controller.recipientSuggestions
    .map((suggestion) => participants.find((item) => item.id === suggestion.toParticipantId))
    .filter((participant): participant is EventParticipant => Boolean(participant));
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar pago">
      <form className="mt-4 space-y-4" onSubmit={controller.submit}>
        {isAdmin ? (
          <label className="block text-sm font-semibold">
            Pagó
            <select
              className="mt-1 w-full rounded-lg border p-2"
              {...controller.form.register("fromParticipantId")}
            >
              {allowedPayers.map((participant) => (
                <option key={participant.id} value={participant.id}>
                  {name(participant)}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className="block text-sm font-semibold">
          {isAdmin ? "Le paga a" : "Le estás pagando a"}
          <select
            className="mt-1 w-full rounded-lg border p-2"
            disabled={recipients.length === 0}
            {...controller.form.register("toParticipantId")}
          >
            <option value="" disabled>
              {recipients.length === 0
                ? "No hay pagos pendientes para esta persona"
                : "Elegí a quién le pagaste"}
            </option>
            {recipients.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {name(participant)}
              </option>
            ))}
          </select>
          {controller.form.formState.errors.toParticipantId ? (
            <span className="text-sm text-red-700">
              {controller.form.formState.errors.toParticipantId.message}
            </span>
          ) : null}
        </label>
        {controller.isCustomAmount ? (
          <label className="block text-sm font-semibold">
            Importe
            <input
              className="mt-1 w-full rounded-lg border p-2"
              inputMode="decimal"
              placeholder="$ 100,50"
              {...controller.form.register("amount")}
            />
            {controller.form.formState.errors.amount ? (
              <span className="text-sm text-red-700">
                {controller.form.formState.errors.amount.message}
              </span>
            ) : null}
            {controller.selectedSuggestion ? (
              <button
                className="mt-2 block font-semibold text-indigo-700"
                onClick={controller.useSuggestedAmount}
                type="button"
              >
                Usar importe sugerido
              </button>
            ) : null}
          </label>
        ) : (
          <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            {controller.selectedSuggestion ? (
              <>
                <span className="block">Importe a pagar</span>
                <strong className="mt-1 block text-xl text-slate-950">
                  {formatMoney(controller.selectedSuggestion.amountCents)}
                </strong>
                <span className="mt-1 block">Según el saldo pendiente.</span>
              </>
            ) : (
              "Elegí una persona con un pago pendiente."
            )}
            {controller.selectedSuggestion ? (
              <button
                className="mt-2 block font-semibold text-indigo-700"
                onClick={() => controller.setIsCustomAmount(true)}
                type="button"
              >
                Ingresar otro monto
              </button>
            ) : null}
          </div>
        )}
        <label className="block text-sm font-semibold">
          Nota opcional
          <textarea
            className="mt-1 w-full rounded-lg border p-2"
            rows={2}
            {...controller.form.register("note")}
          />
        </label>
        {error ? <p className="text-sm text-red-700">{getErrorMessage(error)}</p> : null}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving || !controller.selectedSuggestion}>
            {isSaving ? "Guardando..." : "Registrar pago"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
