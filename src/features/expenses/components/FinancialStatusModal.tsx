import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

type Props = {
  mode: "enable" | "reopen" | null;
  expensesCount: number;
  participantsCount: number;
  isPending: boolean;
  error: unknown;
  onClose: () => void;
  onConfirm: () => void;
};

export function FinancialStatusModal({
  mode,
  expensesCount,
  participantsCount,
  isPending,
  error,
  onClose,
  onConfirm,
}: Props) {
  const enabling = mode === "enable";
  return (
    <Modal
      isOpen={mode !== null}
      onClose={onClose}
      title={enabling ? "Habilitar pagos" : "Reabrir gastos"}>
      <p className="mt-3 text-sm text-slate-700">
        {enabling
          ? `Se cerrarán ${expensesCount} gasto(s) y se congelarán ${participantsCount} participante(s) financiero(s). Podrás registrar pagos con estos importes.`
          : "Los pagos ya registrados se conservarán. Podrás corregir gastos, pero no cambiar invitados ni participantes financieros."}
      </p>
      {error instanceof Error ? (
        <p className="mt-3 text-sm text-red-700">{error.message}</p>
      ) : null}
      <div className="mt-5 flex justify-end gap-2">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isPending}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isPending}>
          {isPending
            ? "Guardando..."
            : enabling
              ? "Habilitar pagos"
              : "Reabrir gastos"}
        </Button>
      </div>
    </Modal>
  );
}
