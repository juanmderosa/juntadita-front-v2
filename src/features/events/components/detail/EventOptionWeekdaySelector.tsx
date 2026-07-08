import {
  weekdayOptions,
  type WeekdayValue,
} from "@/features/events/lib/eventOptionGenerator.lib";

type EventOptionWeekdaySelectorProps = {
  selectedWeekdays: WeekdayValue[];
  toggleWeekday: (weekday: WeekdayValue) => void;
};

export function EventOptionWeekdaySelector({
  selectedWeekdays,
  toggleWeekday,
}: EventOptionWeekdaySelectorProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-800">Dias</p>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {weekdayOptions.map((weekday) => {
          const selected = selectedWeekdays.includes(weekday.value);

          return (
            <button
              className={`rounded-lg px-2 py-2 text-sm font-bold transition ${
                selected
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-300"
              }`}
              key={weekday.value}
              onClick={() => toggleWeekday(weekday.value)}
              type="button">
              {weekday.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
