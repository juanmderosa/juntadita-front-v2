import { Pencil } from "lucide-react";
import { RHForm } from "@/components/forms/RHForm";
import { Button } from "@/components/ui/Button";
import { useGroupNameForm } from "@/features/groups/hooks/useGroupNameForm";

type Props = {
  isSaving: boolean;
  name: string;
  onSave: (name: string) => Promise<void>;
};
export function GroupNameForm({ isSaving, name, onSave }: Props) {
  const { form, submit, isEditing, startEditing, cancel } = useGroupNameForm(name, onSave);
  if (!isEditing) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-slate-950">{name}</h2>
        <Button onClick={startEditing} type="button" variant="secondary">
          <Pencil aria-hidden="true" className="mr-2 inline size-4" />
          Editar
        </Button>
      </div>
    );
  }
  return (
    <RHForm className="flex flex-col gap-3 sm:flex-row" form={form} onSubmit={submit}>
      <label className="min-w-0 flex-1">
        <span className="sr-only">Nombre del grupo</span>
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-lg font-bold text-slate-950 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          {...form.register("name")}
        />
        {form.formState.errors.name?.message ? (
          <span className="mt-2 block text-sm text-red-700">
            {form.formState.errors.name.message}
          </span>
        ) : null}
      </label>
      <Button onClick={cancel} type="button" variant="secondary">
        Cancelar
      </Button>
      <Button disabled={isSaving} type="submit">
        <Pencil aria-hidden="true" className="mr-2 inline size-4" />
        {isSaving ? "Guardando..." : "Guardar nombre"}
      </Button>
    </RHForm>
  );
}
