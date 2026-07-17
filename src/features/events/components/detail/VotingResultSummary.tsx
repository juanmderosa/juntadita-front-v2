import { Award, CircleAlert, CircleX } from "lucide-react";
import { formatOptionSchedule } from "@/features/events/lib/eventOptions.lib";
import type { EventResult, VotingOption } from "@/types/events";

type VotingResultSummaryProps = {
  options: VotingOption[];
  result: EventResult | null;
  timeZone: string;
};

export function VotingResultSummary({
  options,
  result,
  timeZone,
}: VotingResultSummaryProps) {
  if (!result) {
    return (
      <p className="mt-5 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
        La votación cerró. Estamos calculando el resultado.
      </p>
    );
  }

  if (result.status === "no_winner") {
    return (
      <p className="mt-5 flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
        <CircleX className="size-5" />
        La votación cerró sin votos.
      </p>
    );
  }

  if (result.status === "tie_pending") {
    return (
      <p className="mt-5 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
        <CircleAlert className="size-5" />
        Hay un empate entre las opciones más votadas.
      </p>
    );
  }

  const winner = options.find((option) => option.id === result.winningOptionId);
  return (
    <div className="mt-5 rounded-2xl border-2 border-teal-300 bg-teal-50 px-5 py-5 text-teal-950 sm:px-6">
      <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-teal-800">
        <Award className="size-5" />
        Resultado final
      </p>
      <p className="mt-3 text-xl font-bold sm:text-2xl">
        {winner?.label ||
          (winner ? formatOptionSchedule(winner, timeZone) : "Opción elegida")}
      </p>
    </div>
  );
}
