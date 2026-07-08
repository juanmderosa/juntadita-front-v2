import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { InviteParticipantsResult } from "@/types/events";
import {
  getInviteEmailsValidationError,
  parseInviteEmails,
} from "@/features/events/lib/eventParticipants.lib";
import {
  inviteParticipantsFormSchema,
  type InviteParticipantsFormInput,
} from "@/features/events/schemas/events.schemas";

export function useInviteParticipantsForm(
  inviteParticipants: (emails: string[]) => Promise<InviteParticipantsResult>,
) {
  const form = useForm<InviteParticipantsFormInput>({
    resolver: zodResolver(inviteParticipantsFormSchema),
    defaultValues: { emailsText: "" },
  });

  async function submit(values: InviteParticipantsFormInput) {
    const emails = parseInviteEmails(values.emailsText);
    const validationError = getInviteEmailsValidationError(emails);

    if (validationError) {
      form.setError("emailsText", { message: validationError });
      return;
    }

    await inviteParticipants(emails);
    form.reset({ emailsText: "" });
  }

  return { form, submit };
}
