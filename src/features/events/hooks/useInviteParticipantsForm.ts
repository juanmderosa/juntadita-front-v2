import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type {
  InviteParticipantsInput,
  InviteParticipantsResult,
} from "@/types/events";
import {
  getInviteEmailsValidationError,
  parseInviteEmails,
} from "@/features/events/lib/eventParticipants.lib";
import {
  inviteParticipantsFormSchema,
  type InviteParticipantsFormInput,
} from "@/features/events/schemas/events.schemas";

export function useInviteParticipantsForm(
  inviteParticipants: (
    input: InviteParticipantsInput,
  ) => Promise<InviteParticipantsResult>,
  groupIds: string[],
) {
  const form = useForm<InviteParticipantsFormInput>({
    resolver: zodResolver(inviteParticipantsFormSchema),
    defaultValues: { emailsText: "" },
  });

  async function submit(values: InviteParticipantsFormInput) {
    const emails = parseInviteEmails(values.emailsText);
    const validationError =
      emails.length > 0 ? getInviteEmailsValidationError(emails) : null;

    if (validationError || (emails.length === 0 && groupIds.length === 0)) {
      form.setError("emailsText", {
        message: validationError ?? "Agrega un email o selecciona un grupo.",
      });
      return;
    }

    await inviteParticipants({ emails, groupIds });
    form.reset({ emailsText: "" });
  }

  return { form, submit };
}
