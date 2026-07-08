import { CalendarDays, Clock, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { EventOption } from "@/types/events";
import {
  formatOptionSchedule,
  optionTypeLabels,
} from "@/features/events/lib/eventOptions.lib";

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
            className="px-3"
            onClick={startEditing}
            variant="secondary">
            <Pencil className="size-4" />
          </Button>
          <Button
            className="px-3"
            onClick={() => deleteOption(option.id)}
            variant="danger">
            <Trash2 className="size-4" />
          </Button>
        </div>
      ) : null}
    </li>
  );
}
