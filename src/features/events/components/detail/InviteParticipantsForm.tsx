import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { RHForm } from "@/components/forms/RHForm";
import type {
  InviteParticipantsInput,
  InviteParticipantsResult,
} from "@/types/events";
import { useInviteParticipantsForm } from "@/features/events/hooks/useInviteParticipantsForm";
import type { ContactGroup } from "@/types/groups";

type InviteParticipantsFormProps = {
  inviteParticipants: (
    input: InviteParticipantsInput,
  ) => Promise<InviteParticipantsResult>;
  isInviting: boolean;
  groups?: ContactGroup[];
};

export function InviteParticipantsForm({
  inviteParticipants,
  isInviting,
  groups = [],
}: InviteParticipantsFormProps) {
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const inviteForm = useInviteParticipantsForm(inviteParticipants, groupIds);
  const selectedMembers =
    groups
      ?.filter((group) => groupIds.includes(group.id))
      .reduce((total, group) => total + group.memberCount, 0) ?? 0;

  function toggleGroup(groupId: string) {
    setGroupIds((current) =>
      current.includes(groupId)
        ? current.filter((id) => id !== groupId)
        : [...current, groupId],
    );
  }

  return (
    <RHForm
      className="mt-4 space-y-3"
      form={inviteForm.form}
      onSubmit={inviteForm.submit}>
      {groups.length > 0 ? (
        <fieldset>
          <legend className="text-sm font-semibold text-gray-800">
            Tus grupos
          </legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {groups.map((group) => (
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${groupIds.includes(group.id) ? "border-indigo-500 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-700"}`}
                key={group.id}>
                <input
                  checked={groupIds.includes(group.id)}
                  className="size-4 accent-indigo-600"
                  onChange={() => toggleGroup(group.id)}
                  type="checkbox"
                />
                <span className="min-w-0">
                  <span className="block truncate font-semibold">
                    {group.name}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {group.memberCount} contactos
                  </span>
                </span>
              </label>
            ))}
          </div>
          {groupIds.length > 0 ? (
            <p className="mt-2 text-xs text-slate-500">
              Seleccionaste {groupIds.length}{" "}
              {groupIds.length === 1 ? "grupo" : "grupos"} (hasta{" "}
              {selectedMembers} contactos; se omiten repetidos).
            </p>
          ) : null}
        </fieldset>
      ) : null}
      <label className="block">
        <span className="text-sm font-semibold text-gray-800">Emails</span>
        <textarea
          className="mt-2 min-h-28 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          placeholder="ana@mail.com, juan@mail.com (opcional si elegis un grupo)"
          {...inviteForm.form.register("emailsText")}
        />
        {inviteForm.form.formState.errors.emailsText?.message ? (
          <span className="mt-2 block text-sm text-red-700">
            {inviteForm.form.formState.errors.emailsText.message}
          </span>
        ) : null}
      </label>
      <Button
        disabled={isInviting}
        type="submit">
        {isInviting ? "Enviando..." : "Enviar invitaciones"}
      </Button>
    </RHForm>
  );
}
