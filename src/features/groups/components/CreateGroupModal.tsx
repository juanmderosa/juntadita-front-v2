import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { RHForm } from "@/components/forms/RHForm";
import { useCreateGroupForm } from "@/features/groups/hooks/useCreateGroupForm";
import { getErrorMessage } from "@/lib/errors";

type CreateGroupModalProps = {
  error: unknown;
  isCreating: boolean;
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
};

export function CreateGroupModal({
  error,
  isCreating,
  isOpen,
  onClose,
  onCreate,
}: CreateGroupModalProps) {
  const { form, submit } = useCreateGroupForm(onCreate);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear grupo">
      <p className="mt-2 text-sm text-slate-600">
        Usalo para reunir los contactos que invitás con frecuencia.
      </p>
      <RHForm
        className="mt-5 space-y-4"
        form={form}
        onSubmit={submit}>
        <label className="block">
          <span className="text-sm font-semibold text-slate-800">Nombre</span>
          <input
            autoFocus
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            placeholder="Ej. Amigos del barrio"
            {...form.register("name")}
          />
          {form.formState.errors.name?.message ? (
            <span className="mt-2 block text-sm text-red-700">
              {form.formState.errors.name.message}
            </span>
          ) : null}
        </label>
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {getErrorMessage(error)}
          </p>
        ) : null}
        <div className="flex justify-end gap-3">
          <Button
            disabled={isCreating}
            onClick={onClose}
            type="button"
            variant="secondary">
            Cancelar
          </Button>
          <Button
            disabled={isCreating}
            type="submit">
            {isCreating ? "Creando..." : "Crear grupo"}
          </Button>
        </div>
      </RHForm>
    </Modal>
  );
}
