import { Check, UsersRound } from "lucide-react";
import { formatOptionSchedule } from "@/features/events/lib/eventOptions.lib";
import type { VotingOption } from "@/types/events";

type VotingOptionCardProps = {
  isOpen: boolean;
  isSelected: boolean;
  compact?: boolean;
  onToggle: () => void;
  option: VotingOption;
  timeZone: string;
};

export function VotingOptionCard({
  isOpen,
  isSelected,
  compact = false,
  onToggle,
  option,
  timeZone,
}: VotingOptionCardProps) {
  return (
    <li>
      <button
        aria-pressed={isSelected}
        className={`w-full rounded-xl border text-left transition ${compact ? "p-3 sm:p-4" : "p-4 sm:p-5"} ${
          isSelected
            ? "border-2 border-indigo-600 bg-indigo-50/40"
            : "border-slate-200 bg-white hover:border-indigo-300"
        } ${!isOpen ? "cursor-default" : "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"}`}
        disabled={!isOpen}
        onClick={onToggle}
        type="button"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-bold text-slate-900">
              {option.label || formatOptionSchedule(option, timeZone)}
            </p>
            {option.label ? (
              <p className="mt-1 text-sm text-slate-600">
                {formatOptionSchedule(option, timeZone)}
              </p>
            ) : null}
          </div>
          {isOpen ? (
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${isSelected ? "bg-teal-50 text-teal-700" : "bg-slate-100 text-slate-600"}`}
            >
              <Check className="size-4" />
              {isSelected ? "Seleccionada" : "Seleccionar"}
            </span>
          ) : null}
        </div>
        <div
          className={`${compact ? "mt-3" : "mt-4 border-t border-slate-100 pt-3"} flex items-center gap-3`}
        >
          <UsersRound className="size-4 shrink-0 text-slate-400" />
          <div
            aria-label={`${option.availabilityPercent}% de disponibilidad`}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200"
          >
            <div
              className="h-full rounded-full bg-teal-600 transition-[width]"
              style={{ width: `${option.availabilityPercent}%` }}
            />
          </div>
          <span className="min-w-28 text-right text-xs font-semibold text-slate-500">
            {option.votesCount} persona{option.votesCount === 1 ? "" : "s"} (
            {option.availabilityPercent}%)
          </span>
        </div>
      </button>
    </li>
  );
}
