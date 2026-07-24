import { Clock3 } from "lucide-react";
import { formatDateTime } from "@/lib/dates";

type VotingSectionHeaderProps = {
  isOpen: boolean;
  timeZone: string;
  votingClosesAt: string;
};

export function VotingSectionHeader({
  isOpen,
  timeZone,
  votingClosesAt,
}: VotingSectionHeaderProps) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Votación de disponibilidad</h2>
        <p className="mt-1 text-sm text-slate-600">
          {isOpen
            ? "Puedes seleccionar todas las fechas que te sirvan."
            : "La votación cerró y ya no admite cambios."}
        </p>
      </div>
      <p
        className={`inline-flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold ${isOpen ? "bg-amber-50 text-amber-900" : "bg-slate-100 text-slate-700"}`}
      >
        <Clock3 className="size-4" />
        {isOpen ? "Cierra" : "Cerró"} {formatDateTime(votingClosesAt, { timeZone })}
      </p>
    </header>
  );
}
