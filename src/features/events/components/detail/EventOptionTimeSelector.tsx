import { X } from "lucide-react";

type EventOptionTimeSelectorProps = {
  addTime: () => void;
  removeTime: (time: string) => void;
  setTimeDraft: (time: string) => void;
  timeDraft: string;
  times: string[];
};

export function EventOptionTimeSelector({
  addTime,
  removeTime,
  setTimeDraft,
  timeDraft,
  times,
}: EventOptionTimeSelectorProps) {
  return (
    <div className="sm:col-span-2">
      <label className="block">
        <span className="text-sm font-semibold text-gray-800">Agregar horario</span>
        <div className="mt-2 flex gap-2">
          <input
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base text-gray-950 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            onChange={(event) => setTimeDraft(event.target.value)}
            type="time"
            value={timeDraft}
          />
          <button
            className="rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
            onClick={addTime}
            type="button">
            Agregar
          </button>
        </div>
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        {times.map((time) => (
          <button
            aria-label={`Quitar horario ${time}`}
            className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
            key={time}
            onClick={() => removeTime(time)}
            type="button">
            {time}
            <X className="size-3" />
          </button>
        ))}
      </div>
    </div>
  );
}
