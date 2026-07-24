import { Button } from "@/components/ui/Button";
import { RHForm } from "@/components/forms/RHForm";
import type { InviteParticipantsInput, InviteParticipantsResult } from "@/types/events";
import type { ContactGroup } from "@/types/groups";
import { InviteEmailsField } from "@/features/events/components/detail/InviteEmailsField";
import { InviteGroupsSelector } from "@/features/events/components/detail/InviteGroupsSelector";
import { useInviteParticipantsForm } from "@/features/events/hooks/useInviteParticipantsForm";

type InviteParticipantsFormProps = {
  inviteParticipants: (input: InviteParticipantsInput) => Promise<InviteParticipantsResult>;
  isInviting: boolean;
  groups?: ContactGroup[];
};

export function InviteParticipantsForm({
  inviteParticipants,
  isInviting,
  groups = [],
}: InviteParticipantsFormProps) {
  const controller = useInviteParticipantsForm(inviteParticipants, groups);
  return (
    <RHForm className="mt-4 space-y-3" form={controller.form} onSubmit={controller.submit}>
      <InviteGroupsSelector
        groups={groups}
        onToggle={controller.toggleGroup}
        selectedGroupIds={controller.selectedGroupIds}
        selectedMembersUpperBound={controller.selectedMembersUpperBound}
      />
      <InviteEmailsField form={controller.form} />
      <Button disabled={isInviting} type="submit">
        {isInviting ? "Enviando..." : "Enviar invitaciones"}
      </Button>
    </RHForm>
  );
}
