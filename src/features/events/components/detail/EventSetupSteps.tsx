import { Check } from "lucide-react";
import type { EventType } from "@/types/events";

export type EventSetupStep = "options" | "guests";

type EventSetupStepsProps = {
  currentStep: EventSetupStep;
  eventType: EventType;
};

export function EventSetupSteps({
  currentStep,
  eventType,
}: EventSetupStepsProps) {
  const steps =
    eventType === "poll"
      ? [
          { id: "data", label: "Datos", done: true },
          { id: "options", label: "Opciones", done: currentStep === "guests" },
          { id: "guests", label: "Invitados", done: false },
        ]
      : [
          { id: "data", label: "Datos", done: true },
          { id: "guests", label: "Invitados", done: false },
        ];

  return (
    <ol className="mt-6 grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:grid-cols-3">
      {steps.map((step) => {
        const active = step.id === currentStep;

        return (
          <li
            className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
              active ? "bg-indigo-50 text-indigo-800" : "text-slate-600"
            }`}
            key={step.id}>
            <span
              className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${
                step.done
                  ? "bg-emerald-600 text-white"
                  : active
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-500"
              }`}>
              {step.done ? <Check className="size-4" /> : steps.indexOf(step) + 1}
            </span>
            <span className="text-sm font-bold">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
