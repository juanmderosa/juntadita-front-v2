export type EventOptionCreationMode = "manual" | "generator";

type EventOptionModeTabsProps = {
  mode: EventOptionCreationMode;
  setMode: (mode: EventOptionCreationMode) => void;
};

export function EventOptionModeTabs({ mode, setMode }: EventOptionModeTabsProps) {
  return (
    <div className="mt-4 grid grid-cols-2 rounded-xl bg-white p-1 ring-1 ring-slate-200">
      <button
        className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
          mode === "manual"
            ? "bg-indigo-600 text-white"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
        onClick={() => setMode("manual")}
        type="button">
        Manual
      </button>
      <button
        className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
          mode === "generator"
            ? "bg-indigo-600 text-white"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
        onClick={() => setMode("generator")}
        type="button">
        Generar varias
      </button>
    </div>
  );
}
