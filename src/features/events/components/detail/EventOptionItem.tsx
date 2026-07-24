import type { EventOption, UpdateEventOptionInput } from "@/types/events";
import { useEditableEventOption } from "@/features/events/hooks/useEventOptionForms";
import { EventOptionEditForm } from "@/features/events/components/detail/EventOptionEditForm";
import { EventOptionViewItem } from "@/features/events/components/detail/EventOptionViewItem";

type EventOptionItemProps = {
  canManage: boolean;
  deleteOption: (optionId: string) => Promise<unknown>;
  option: EventOption;
  timeZone: string;
  updateOption: (optionId: string, input: UpdateEventOptionInput) => Promise<unknown>;
};

export function EventOptionItem({
  canManage,
  deleteOption,
  option,
  timeZone,
  updateOption,
}: EventOptionItemProps) {
  const editableOption = useEditableEventOption({
    option,
    timeZone,
    updateOption,
  });

  if (editableOption.isEditing) {
    return (
      <li className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
        <EventOptionEditForm
          cancelEditing={editableOption.cancelEditing}
          editableOption={editableOption}
        />
      </li>
    );
  }

  return (
    <EventOptionViewItem
      canManage={canManage}
      deleteOption={deleteOption}
      option={option}
      startEditing={editableOption.startEditing}
      timeZone={timeZone}
    />
  );
}
