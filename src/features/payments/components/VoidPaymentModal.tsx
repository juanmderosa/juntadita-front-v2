import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  voidPaymentFormSchema,
  type VoidPaymentFormInput,
} from "@/features/payments/schemas/payments.schemas";
import { getErrorMessage } from "@/lib/errors";
import type { Payment } from "@/types/payments";
type Props = {
  payment: Payment | null;
  isSaving: boolean;
  error: unknown;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
};
export function VoidPaymentModal({ payment, isSaving, error, onClose, onConfirm }: Props) {
  const form = useForm<VoidPaymentFormInput>({
    resolver: zodResolver(voidPaymentFormSchema),
    defaultValues: { voidReason: "" },
  });
  return (
    <Modal isOpen={payment !== null} onClose={onClose} title="Anular pago">
      <form
        className="mt-4 space-y-4"
        onSubmit={form.handleSubmit(async (value) => await onConfirm(value.voidReason))}
      >
        <p className="text-sm text-slate-700">
          El pago seguirá en el historial, pero dejará de afectar los balances.
        </p>
        <label className="block text-sm font-semibold">
          Motivo
          <textarea
            className="mt-1 w-full rounded-lg border p-2"
            rows={3}
            {...form.register("voidReason")}
          />
          {form.formState.errors.voidReason ? (
            <span className="text-sm text-red-700">{form.formState.errors.voidReason.message}</span>
          ) : null}
        </label>
        {error ? <p className="text-sm text-red-700">{getErrorMessage(error)}</p> : null}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button variant="danger" type="submit" disabled={isSaving}>
            Anular pago
          </Button>
        </div>
      </form>
    </Modal>
  );
}
