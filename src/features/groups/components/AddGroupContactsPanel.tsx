import { UserPlus } from "lucide-react";
import { RHForm } from "@/components/forms/RHForm";
import { Button } from "@/components/ui/Button";
import { useGroupContactsForm } from "@/features/groups/hooks/useGroupContactsForm";

type Props = { isAdding: boolean; onAdd: (emails: string[]) => Promise<void> };
export function AddGroupContactsPanel({ isAdding, onAdd }: Props) {
  const { form, submit } = useGroupContactsForm(onAdd);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
      <h2 className="text-lg font-bold text-slate-950">Agregar contactos</h2>
      <p className="mt-1 text-sm text-slate-600">
        Pegá emails separados por coma, espacio o salto de línea.
      </p>
      <RHForm
        className="mt-4 space-y-3"
        form={form}
        onSubmit={submit}>
        <textarea
          className="min-h-28 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          placeholder="ana@mail.com, juan@mail.com"
          {...form.register("emailsText")}
        />
        {form.formState.errors.emailsText?.message ? (
          <p className="text-sm text-red-700">
            {form.formState.errors.emailsText.message}
          </p>
        ) : null}
        <Button
          disabled={isAdding}
          type="submit">
          <UserPlus
            aria-hidden="true"
            className="mr-2 inline size-4"
          />
          {isAdding ? "Agregando..." : "Agregar contactos"}
        </Button>
      </RHForm>
    </section>
  );
}
