import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { ContactGroupMember } from "@/types/groups";

type Props = {
  contact: ContactGroupMember | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export function DeleteGroupContactModal({ contact, isDeleting, onClose, onConfirm }: Props) {
  return (
    <Modal isOpen={Boolean(contact)} onClose={onClose} title="Quitar contacto">
      <p className="mt-2 text-sm text-slate-600">
        ¿Querés quitar a <strong>{contact?.email}</strong> de este grupo?
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
          {isDeleting ? "Quitando..." : "Quitar contacto"}
        </Button>
      </div>
    </Modal>
  );
}
