import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatOptionSchedule } from "@/features/events/lib/eventOptions.lib";
import type { VotingOption } from "@/types/events";

type TieResolutionModalProps = {
  isResolving: boolean;
  onClose: () => void;
  onConfirm: () => Promise<unknown>;
  option: VotingOption | null;
  timeZone: string;
};

export function TieResolutionModal({
  isResolving,
  onClose,
  onConfirm,
  option,
  timeZone,
}: TieResolutionModalProps) {
  const optionName =
    option?.label || (option ? formatOptionSchedule(option, timeZone) : "esta opción");

  return (
    <Modal isOpen={Boolean(option)} onClose={onClose} title="Confirmar resultado">
      <p className="mt-2 text-sm text-slate-600">
        Vas a elegir <strong>{optionName}</strong> como resultado final. Esta decisión cerrará la
        votación.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button disabled={isResolving} onClick={onClose} variant="secondary">
          Cancelar
        </Button>
        <Button disabled={isResolving} onClick={() => void onConfirm()}>
          {isResolving ? "Confirmando…" : "Confirmar resultado"}
        </Button>
      </div>
    </Modal>
  );
}
