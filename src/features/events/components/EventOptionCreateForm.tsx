import { Button } from "../../../components/ui/Button";
import { RHForm } from "../../../components/forms/RHForm";
import { RHFormInput } from "../../../components/forms/RHFormInput";
import type { CreateEventOptionInput } from "../../../types/events";
import { useCreateEventOptionForm } from "../hooks/useEventOptionForms";
import type { OptionFormInput } from "../schemas/events.schemas";

type EventOptionCreateFormProps = {
  createOption: (input: CreateEventOptionInput) => Promise<unknown>;
  isCreating: boolean;
  timeZone: string;
};

export function EventOptionCreateForm({
  createOption,
  isCreating,
  timeZone,
}: EventOptionCreateFormProps) {
  const createForm = useCreateEventOptionForm({ createOption, timeZone });

  return (
    <RHForm
      className="mt-4 grid gap-4 sm:grid-cols-2"
      form={createForm.form}
      onSubmit={createForm.submit}>
      <label className="block">
        <span className="text-sm font-semibold text-gray-800">Tipo</span>
        <select
          className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base text-gray-950 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          {...createForm.form.register("type")}>
          <option value="date">Dia</option>
          <option value="datetime">Dia y hora</option>
          <option value="range">Franja horaria</option>
        </select>
      </label>
      <RHFormInput<OptionFormInput>
        label="Etiqueta opcional"
        name="label"
        placeholder="Ej: despues del trabajo"
      />
      {createForm.optionType === "date" ? (
        <RHFormInput<OptionFormInput> label="Dia" name="date" type="date" />
      ) : (
        <RHFormInput<OptionFormInput>
          label="Inicio"
          name="startAt"
          type="datetime-local"
        />
      )}
      {createForm.optionType === "range" ? (
        <RHFormInput<OptionFormInput>
          label="Fin"
          name="endAt"
          type="datetime-local"
        />
      ) : null}
      <div className="sm:col-span-2">
        <Button disabled={isCreating} type="submit">
          {isCreating ? "Guardando..." : "Agregar opcion"}
        </Button>
      </div>
    </RHForm>
  );
}
