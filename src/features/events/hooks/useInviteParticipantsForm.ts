import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { InviteParticipantsInput, InviteParticipantsResult } from "@/types/events";
import { getEmailsValidationError, parseEmails } from "@/lib/emails";
import {
  inviteParticipantsFormSchema,
  type InviteParticipantsFormInput,
} from "@/features/events/schemas/events.schemas";
import type { ContactGroup } from "@/types/groups";

export function useInviteParticipantsForm(
  inviteParticipants: (input: InviteParticipantsInput) => Promise<InviteParticipantsResult>,
  groups: ContactGroup[],
) {
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const form = useForm<InviteParticipantsFormInput>({
    resolver: zodResolver(inviteParticipantsFormSchema),
    defaultValues: { emailsText: "" },
  });

  async function submit(values: InviteParticipantsFormInput) {
    const emails = parseEmails(values.emailsText);
    const validationError = emails.length > 0 ? getEmailsValidationError(emails) : null;

    if (validationError || (emails.length === 0 && selectedGroupIds.length === 0)) {
      form.setError("emailsText", {
        message: validationError ?? "Agrega un email o selecciona un grupo.",
      });
      return;
    }

    await inviteParticipants({ emails, groupIds: selectedGroupIds });
    form.reset({ emailsText: "" });
    setSelectedGroupIds([]);
  }

  const selectedMembersUpperBound = groups
    .filter((group) => selectedGroupIds.includes(group.id))
    .reduce((total, group) => total + group.memberCount, 0);
  function toggleGroup(groupId: string) {
    setSelectedGroupIds((current) =>
      current.includes(groupId) ? current.filter((id) => id !== groupId) : [...current, groupId],
    );
  }

  return {
    form,
    submit,
    selectedGroupIds,
    selectedMembersUpperBound,
    toggleGroup,
  };
}
