import type {
  EventOption,
  UpdateEventOptionInput,
} from "../../../types/events";
import { EventOptionItem } from "./EventOptionItem";

type EventOptionsListProps = {
  canManage: boolean;
  deleteOption: (optionId: string) => Promise<unknown>;
  options: EventOption[];
  timeZone: string;
  updateOption: (
    optionId: string,
    input: UpdateEventOptionInput,
  ) => Promise<unknown>;
};

export function EventOptionsList({
  canManage,
  deleteOption,
  options,
  timeZone,
  updateOption,
}: EventOptionsListProps) {
  return (
    <ul className="mt-5 space-y-3">
      {options.map((option) => (
        <EventOptionItem
          canManage={canManage}
          deleteOption={deleteOption}
          key={option.id}
          option={option}
          timeZone={timeZone}
          updateOption={updateOption}
        />
      ))}
    </ul>
  );
}
