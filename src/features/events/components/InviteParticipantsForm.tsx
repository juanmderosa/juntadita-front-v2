import { Button } from "../../../components/ui/Button";
import { RHForm } from "../../../components/forms/RHForm";
import type { InviteParticipantsResult } from "../../../types/events";
import { useInviteParticipantsForm } from "../hooks/useInviteParticipantsForm";

type InviteParticipantsFormProps = {
  inviteParticipants: (emails: string[]) => Promise<InviteParticipantsResult>;
  isInviting: boolean;
};

export function InviteParticipantsForm({
  inviteParticipants,
  isInviting,
}: InviteParticipantsFormProps) {
  const inviteForm = useInviteParticipantsForm(inviteParticipants);

  return (
    <RHForm
      className="mt-4 space-y-3"
      form={inviteForm.form}
      onSubmit={inviteForm.submit}>
      <label className="block">
        <span className="text-sm font-semibold text-gray-800">Emails</span>
        <textarea
          className="mt-2 min-h-28 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          placeholder="ana@mail.com, juan@mail.com"
          {...inviteForm.form.register("emailsText")}
        />
        {inviteForm.form.formState.errors.emailsText?.message ? (
          <span className="mt-2 block text-sm text-red-700">
            {inviteForm.form.formState.errors.emailsText.message}
          </span>
        ) : null}
      </label>
      <Button disabled={isInviting} type="submit">
        {isInviting ? "Enviando..." : "Enviar invitaciones"}
      </Button>
    </RHForm>
  );
}
