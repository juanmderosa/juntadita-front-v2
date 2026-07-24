import { Scale } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatOptionSchedule } from "@/features/events/lib/eventOptions.lib";
import type { VotingOption } from "@/types/events";

type TieResolutionPanelProps = {
  onChoose: (optionId: string) => void;
  options: VotingOption[];
  timeZone: string;
};

export function TieResolutionPanel({ onChoose, options, timeZone }: TieResolutionPanelProps) {
  return (
    <section className="mt-5 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
      <div className="flex gap-3">
        <Scale className="mt-0.5 size-5 shrink-0 text-amber-800" />
        <div>
          <h3 className="font-bold text-amber-950">Definir el resultado</h3>
          <p className="mt-1 text-sm text-amber-900">
            Como organizador, elegí una de las opciones empatadas para cerrar la votación.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {options.map((option) => (
          <Button
            className="text-left"
            key={option.id}
            onClick={() => onChoose(option.id)}
            variant="secondary"
          >
            Elegir {option.label || formatOptionSchedule(option, timeZone)}
          </Button>
        ))}
      </div>
    </section>
  );
}
