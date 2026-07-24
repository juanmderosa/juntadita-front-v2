import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

type Props = {
  groupName: string;
  isDeleting: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};
export function DeleteGroupModal({ groupName, isDeleting, isOpen, onClose, onConfirm }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar grupo">
      <p className="mt-2 text-sm text-slate-600">
        Vas a eliminar <strong>{groupName}</strong> y todos sus contactos. Esta acción no se puede
        deshacer.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button disabled={isDeleting} onClick={onClose} type="button" variant="secondary">
          Cancelar
        </Button>
        <Button
          disabled={isDeleting}
          onClick={() => void onConfirm()}
          type="button"
          variant="danger"
        >
          {isDeleting ? "Eliminando..." : "Eliminar grupo"}
        </Button>
      </div>
    </Modal>
  );
}
