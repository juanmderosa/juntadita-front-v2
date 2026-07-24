import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { RHForm } from "@/components/forms/RHForm";
import { useExpenseForm } from "@/features/expenses/hooks/useExpenseForm";
import { getErrorMessage } from "@/lib/errors";
import type { Expense, ExpenseInput } from "@/types/expenses";
import type { EventParticipant } from "@/types/events";

type Props = {
  isOpen: boolean;
  expense: Expense | null;
  participants: EventParticipant[];
  isSaving: boolean;
  error: unknown;
  onClose: () => void;
  onSave: (input: ExpenseInput, files: File[]) => Promise<void>;
};
export function ExpenseFormModal({
  isOpen,
  expense,
  participants,
  isSaving,
  error,
  onClose,
  onSave,
}: Props) {
  const { form, submit, eligible } = useExpenseForm(expense, participants, async (input, files) => {
    await onSave(input, files);
    onClose();
  });
  const selected = form.watch("participantIds");
  const method = form.watch("splitMethod");
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={expense ? "Editar gasto" : "Cargar gasto"}>
      <RHForm form={form} onSubmit={submit} className="mt-5 space-y-4">
        <input
          className="w-full rounded-lg border p-2"
          placeholder="Concepto"
          {...form.register("title")}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="rounded-lg border p-2"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Monto"
            {...form.register("amount", { valueAsNumber: true })}
          />
          <select className="rounded-lg border p-2" {...form.register("paidByParticipantId")}>
            {participants
              .filter((p) => p.status !== "removed")
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.displayName ?? p.email}
                </option>
              ))}
          </select>
        </div>
        <textarea
          className="w-full rounded-lg border p-2"
          placeholder="Descripción opcional"
          {...form.register("description")}
        />
        <select className="rounded-lg border p-2" {...form.register("splitMethod")}>
          <option value="equal">Dividir en partes iguales</option>
          <option value="custom">División personalizada</option>
        </select>
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">Participan del gasto</legend>
          {eligible.map((p) => (
            <label key={p.id} className="flex items-center gap-2 rounded-lg bg-slate-50 p-2">
              <input type="checkbox" value={p.id} {...form.register("participantIds")} />
              {p.displayName ?? p.email}
              {method === "custom" && selected.includes(p.id) ? (
                <input
                  className="ml-auto w-24 rounded border p-1"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="$"
                  {...form.register(`customAmounts.${p.id}`)}
                />
              ) : null}
            </label>
          ))}
        </fieldset>
        <label className="block rounded-xl border-2 border-dashed border-slate-200 p-3 text-sm text-slate-600">
          Adjuntar comprobantes (opcional)
          <input
            className="mt-2 block w-full"
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,application/pdf"
            onChange={(event) => form.setValue("files", Array.from(event.target.files ?? []))}
          />
        </label>
        {error ? (
          <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{getErrorMessage(error)}</p>
        ) : null}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar gasto"}
          </Button>
        </div>
      </RHForm>
    </Modal>
  );
}
