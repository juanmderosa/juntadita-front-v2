import { CalendarDays, Clock, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import type { EventOption } from "../../../types/events";
import {
  formatOptionSchedule,
  optionTypeLabels,
} from "../lib/eventOptions.lib";

type EventOptionViewItemProps = {
  canManage: boolean;
  deleteOption: (optionId: string) => Promise<unknown>;
  option: EventOption;
  startEditing: () => void;
  timeZone: string;
};

export function EventOptionViewItem({
  canManage,
  deleteOption,
  option,
  startEditing,
  timeZone,
}: EventOptionViewItemProps) {
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="flex items-center gap-2 font-bold text-slate-900">
          {option.type === "date" ? (
            <CalendarDays className="size-4 text-indigo-600" />
          ) : (
            <Clock className="size-4 text-indigo-600" />
          )}
          {option.label || optionTypeLabels[option.type]}
        </p>
        <p className="mt-1 text-sm text-slate-600">
          {formatOptionSchedule(option, timeZone)}
        </p>
      </div>
      {canManage ? (
        <div className="flex gap-2">
          <Button
            className="bg-white px-3 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
            onClick={startEditing}>
            <Pencil className="size-4" />
          </Button>
          <Button
            className="bg-red-600 px-3 hover:bg-red-700"
            onClick={() => deleteOption(option.id)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      ) : null}
    </li>
  );
}
