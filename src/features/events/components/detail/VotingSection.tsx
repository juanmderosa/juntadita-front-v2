import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/feedback/ErrorState";
import { VotingOptionsList } from "@/features/events/components/detail/VotingOptionsList";
import { VotingResultSummary } from "@/features/events/components/detail/VotingResultSummary";
import { VotingSectionHeader } from "@/features/events/components/detail/VotingSectionHeader";
import { TieResolutionModal } from "@/features/events/components/detail/TieResolutionModal";
import { TieResolutionPanel } from "@/features/events/components/detail/TieResolutionPanel";
import type { VotingState } from "@/types/events";

type VotingSectionProps = {
  canManage: boolean;
  cancelTieResolution: () => void;
  confirmTieResolution: () => Promise<unknown>;
  error: unknown;
  isLoading: boolean;
  isResolvingTie: boolean;
  isSaving: boolean;
  onRequestTieResolution: (optionId: string) => void;
  onSave: () => void;
  onToggle: (optionId: string) => void;
  pendingTieOptionId: string | null;
  resolveTieError: unknown;
  selectedOptionIds: string[];
  selectionError?: string;
  timeZone: string;
  voting?: VotingState;
};

export function VotingSection({
  canManage,
  cancelTieResolution,
  confirmTieResolution,
  error,
  isLoading,
  isResolvingTie,
  isSaving,
  onRequestTieResolution,
  onSave,
  onToggle,
  pendingTieOptionId,
  resolveTieError,
  selectedOptionIds,
  selectionError,
  timeZone,
  voting,
}: VotingSectionProps) {
  if (isLoading) {
    return <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />;
  }

  if (error && !voting) {
    return (
      <ErrorState
        className="rounded-2xl bg-white p-6"
        error={error}
      />
    );
  }

  if (!voting) return null;

  const tiedOptions = voting.options.filter((option) =>
    voting.tiedOptionIds.includes(option.id),
  );
  const pendingTieOption =
    tiedOptions.find((option) => option.id === pendingTieOptionId) ?? null;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-8">
      <VotingSectionHeader
        isOpen={voting.isOpen}
        timeZone={timeZone}
        votingClosesAt={voting.votingClosesAt}
      />
      {!voting.isOpen ? (
        <VotingResultSummary
          options={voting.options}
          result={voting.result}
          timeZone={timeZone}
        />
      ) : null}
      <VotingOptionsList
        compact={!voting.isOpen}
        isOpen={voting.isOpen}
        onToggle={onToggle}
        options={voting.options}
        selectedOptionIds={selectedOptionIds}
        timeZone={timeZone}
      />
      {error ? (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
          <AlertCircle className="size-4" />
          No pudimos guardar tu voto. Inténtalo otra vez.
        </p>
      ) : null}
      {selectionError ? (
        <p className="mt-3 text-sm font-semibold text-red-700">
          {selectionError}
        </p>
      ) : null}
      {resolveTieError ? (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
          <AlertCircle className="size-4" />
          No pudimos confirmar el resultado. Inténtalo otra vez.
        </p>
      ) : null}
      {!voting.isOpen &&
      voting.result?.status === "tie_pending" &&
      canManage ? (
        <TieResolutionPanel
          onChoose={onRequestTieResolution}
          options={tiedOptions}
          timeZone={timeZone}
        />
      ) : null}
      {voting.isOpen ? (
        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            {selectedOptionIds.length === 0
              ? "Selecciona al menos una opción para votar."
              : `Elegiste ${selectedOptionIds.length} opción${selectedOptionIds.length === 1 ? "" : "es"}.`}
          </p>
          <Button
            disabled={isSaving}
            onClick={onSave}>
            {isSaving ? "Guardando…" : "Guardar mi voto"}
          </Button>
        </div>
      ) : null}
      <TieResolutionModal
        isResolving={isResolvingTie}
        onClose={cancelTieResolution}
        onConfirm={confirmTieResolution}
        option={pendingTieOption}
        timeZone={timeZone}
      />
    </article>
  );
}
