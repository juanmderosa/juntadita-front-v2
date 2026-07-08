import type { GeneratorScheduleMode } from "@/features/events/lib/eventOptionGenerator.lib";

type EventOptionScheduleModeSelectorProps = {
  scheduleMode: GeneratorScheduleMode;
  setScheduleMode: (mode: GeneratorScheduleMode) => void;
};

export function EventOptionScheduleModeSelector({
  scheduleMode,
  setScheduleMode,
}: EventOptionScheduleModeSelectorProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-800">Horarios</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
            scheduleMode === "date"
              ? "bg-indigo-600 text-white"
              : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-300"
          }`}
          onClick={() => setScheduleMode("date")}
          type="button">
          Sin horario
        </button>
        <button
          className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
            scheduleMode === "datetime"
              ? "bg-indigo-600 text-white"
              : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-300"
          }`}
          onClick={() => setScheduleMode("datetime")}
          type="button">
          Con horario
        </button>
      </div>
    </div>
  );
}
