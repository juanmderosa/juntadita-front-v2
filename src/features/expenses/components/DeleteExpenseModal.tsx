import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { Expense } from "@/types/expenses";

type Props = {
  expense: Expense | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export function DeleteExpenseModal({
  expense,
  isDeleting,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal isOpen={expense !== null} onClose={onClose} title="Eliminar gasto">
      <p className="mt-3 text-slate-600">
        ¿Querés eliminar “{expense?.title}”? Esta acción no se puede deshacer.
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" disabled={isDeleting} onClick={() => void onConfirm()}>
          {isDeleting ? "Eliminando..." : "Eliminar gasto"}
        </Button>
      </div>
    </Modal>
  );
}
