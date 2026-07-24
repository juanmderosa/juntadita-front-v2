import { Button } from "@/components/ui/Button";
import { RHForm } from "@/components/forms/RHForm";
import { RHFormInput } from "@/components/forms/RHFormInput";
import type { EventOption, UpdateEventOptionInput } from "@/types/events";
import { useEditableEventOption } from "@/features/events/hooks/useEventOptionForms";
import type { OptionFormInput } from "@/features/events/schemas/events.schemas";

type EventOptionEditFormProps = {
  cancelEditing: () => void;
  editableOption: ReturnType<typeof useEditableEventOption>;
};

export function EventOptionEditForm({ cancelEditing, editableOption }: EventOptionEditFormProps) {
  return (
    <RHForm
      className="grid gap-3 sm:grid-cols-2"
      form={editableOption.form}
      onSubmit={editableOption.submit}
    >
      <input type="hidden" {...editableOption.form.register("type")} />
      <RHFormInput<OptionFormInput> label="Etiqueta" name="label" placeholder="Etiqueta opcional" />
      {editableOption.optionType === "date" ? (
        <RHFormInput<OptionFormInput> label="Dia" name="date" type="date" />
      ) : (
        <RHFormInput<OptionFormInput> label="Inicio" name="startAt" type="datetime-local" />
      )}
      {editableOption.optionType === "range" ? (
        <RHFormInput<OptionFormInput> label="Fin" name="endAt" type="datetime-local" />
      ) : null}
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit">Guardar</Button>
        <Button onClick={cancelEditing} variant="secondary">
          Cancelar
        </Button>
      </div>
    </RHForm>
  );
}

export type EditableEventOptionInput = {
  option: EventOption;
  timeZone: string;
  updateOption: (optionId: string, input: UpdateEventOptionInput) => Promise<unknown>;
};
