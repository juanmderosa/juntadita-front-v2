import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  paymentFormSchema,
  type PaymentFormInput,
} from "@/features/payments/schemas/payments.schemas";
import { getErrorMessage } from "@/lib/errors";
import { parseMoneyToCents } from "@/lib/money";
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

const name = (participant: EventParticipant) =>
  participant.displayName ?? participant.email;

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
  const form = useForm<PaymentFormInput>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      fromParticipantId: allowedPayers[0]?.id ?? "",
      toParticipantId: "",
      amount: "",
      note: "",
    },
  });
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const fromParticipantId = form.watch("fromParticipantId");
  const toParticipantId = form.watch("toParticipantId");
  const recipientSuggestions = useMemo(
    () =>
      suggestions.filter(
        (item) => item.fromParticipantId === fromParticipantId,
      ),
    [fromParticipantId, suggestions],
  );
  const selectedSuggestion = recipientSuggestions.find(
    (item) => item.toParticipantId === toParticipantId,
  );

  useEffect(() => {
    if (!isOpen) return;
    const payerId = allowedPayers[0]?.id ?? "";
    const suggestion = suggestions.find(
      (item) => item.fromParticipantId === payerId,
    );
    form.reset({
      fromParticipantId: payerId,
      toParticipantId: suggestion?.toParticipantId ?? "",
      amount: suggestion ? String(suggestion.amountCents / 100) : "",
      note: "",
    });
    setIsCustomAmount(false);
  }, [isOpen, allowedPayers, suggestions, form]);

  useEffect(() => {
    if (!fromParticipantId) return;
    if (
      !recipientSuggestions.some(
        (item) => item.toParticipantId === toParticipantId,
      )
    ) {
      form.setValue(
        "toParticipantId",
        recipientSuggestions[0]?.toParticipantId ?? "",
      );
    }
  }, [fromParticipantId, recipientSuggestions, toParticipantId, form]);

  useEffect(() => {
    if (selectedSuggestion && !isCustomAmount) {
      form.setValue("amount", String(selectedSuggestion.amountCents / 100), {
        shouldValidate: true,
      });
    }
  }, [selectedSuggestion, isCustomAmount, form]);

  const recipients = recipientSuggestions
    .map((suggestion) =>
      participants.find((item) => item.id === suggestion.toParticipantId),
    )
    .filter((participant): participant is EventParticipant =>
      Boolean(participant),
    );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar pago">
      <form
        className="mt-4 space-y-4"
        onSubmit={form.handleSubmit(async (value) => {
          await onSave({
            fromParticipantId: value.fromParticipantId,
            toParticipantId: value.toParticipantId,
            amountCents: parseMoneyToCents(value.amount),
            note: value.note || null,
          });
        })}>
        {isAdmin ? (
          <label className="block text-sm font-semibold">
            Pagó
            <select
              className="mt-1 w-full rounded-lg border p-2"
              {...form.register("fromParticipantId")}>
              {allowedPayers.map((participant) => (
                <option
                  key={participant.id}
                  value={participant.id}>
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
            {...form.register("toParticipantId")}>
            <option
              value=""
              disabled>
              {recipients.length === 0
                ? "No hay pagos pendientes para esta persona"
                : "Elegí a quién le pagaste"}
            </option>
            {recipients.map((participant) => (
              <option
                key={participant.id}
                value={participant.id}>
                {name(participant)}
              </option>
            ))}
          </select>
          {form.formState.errors.toParticipantId ? (
            <span className="text-sm text-red-700">
              {form.formState.errors.toParticipantId.message}
            </span>
          ) : null}
        </label>
        {isCustomAmount ? (
          <label className="block text-sm font-semibold">
            Importe
            <input
              className="mt-1 w-full rounded-lg border p-2"
              inputMode="decimal"
              placeholder="$ 100,50"
              {...form.register("amount")}
            />
            {form.formState.errors.amount ? (
              <span className="text-sm text-red-700">
                {form.formState.errors.amount.message}
              </span>
            ) : null}
            {selectedSuggestion ? (
              <button
                className="mt-2 block font-semibold text-indigo-700"
                onClick={() => {
                  form.setValue(
                    "amount",
                    String(selectedSuggestion.amountCents / 100),
                    { shouldValidate: true },
                  );
                  setIsCustomAmount(false);
                }}
                type="button">
                Usar importe sugerido
              </button>
            ) : null}
          </label>
        ) : (
          <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            {selectedSuggestion ? (
              <>
                <span className="block">Importe a pagar</span>
                <strong className="mt-1 block text-xl text-slate-950">
                  {formatMoney(selectedSuggestion.amountCents)}
                </strong>
                <span className="mt-1 block">Según el saldo pendiente.</span>
              </>
            ) : (
              "Elegí una persona con un pago pendiente."
            )}
            {selectedSuggestion ? (
              <button
                className="mt-2 block font-semibold text-indigo-700"
                onClick={() => setIsCustomAmount(true)}
                type="button">
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
            {...form.register("note")}
          />
        </label>
        {error ? (
          <p className="text-sm text-red-700">{getErrorMessage(error)}</p>
        ) : null}
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSaving}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSaving || !selectedSuggestion}>
            {isSaving ? "Guardando..." : "Registrar pago"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
