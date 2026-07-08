import { Button } from "@/components/ui/Button";

type EventSetupActionsProps = {
  backLabel?: string;
  finishLabel?: string;
  helperText?: string;
  isNextDisabled?: boolean;
  nextLabel?: string;
  onBack?: () => void;
  onFinish?: () => void;
  onNext?: () => void;
};

export function EventSetupActions({
  backLabel = "Volver",
  finishLabel = "Terminar preparacion",
  helperText,
  isNextDisabled = false,
  nextLabel = "Continuar",
  onBack,
  onFinish,
  onNext,
}: EventSetupActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
      {onBack ? (
        <Button onClick={onBack} type="button" variant="secondary">
          {backLabel}
        </Button>
      ) : null}
      <div>
        {onNext ? (
          <Button disabled={isNextDisabled} onClick={onNext} type="button">
            {nextLabel}
          </Button>
        ) : null}
        {helperText ? (
          <p className="mt-2 text-sm font-semibold text-amber-800">{helperText}</p>
        ) : null}
      </div>
      {onFinish ? (
        <Button onClick={onFinish} type="button" variant="secondary">
          {finishLabel}
        </Button>
      ) : null}
    </div>
  );
}
