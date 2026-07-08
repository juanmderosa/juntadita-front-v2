import { UserRoundPlus } from "lucide-react";
import { getErrorMessage } from "../../../lib/errors";
import type { InviteParticipantsResult } from "../../../types/events";
import { InviteParticipantsForm } from "./InviteParticipantsForm";
import { InviteParticipantsResultList } from "./InviteParticipantsResultList";

type InviteParticipantsPanelProps = {
  error: unknown;
  inviteParticipants: (emails: string[]) => Promise<InviteParticipantsResult>;
  inviteResult?: InviteParticipantsResult;
  isInviting: boolean;
};

export function InviteParticipantsPanel({
  error,
  inviteParticipants,
  inviteResult,
  isInviting,
}: InviteParticipantsPanelProps) {
  return (
    <div className="mt-6 rounded-2xl bg-slate-50 p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <UserRoundPlus className="size-4" />
        Invitar por email
      </h3>
      <InviteParticipantsForm
        inviteParticipants={inviteParticipants}
        isInviting={isInviting}
      />
      {inviteResult ? (
        <InviteParticipantsResultList inviteResult={inviteResult} />
      ) : null}
      {error ? (
        <p className="mt-3 text-sm text-red-700">{getErrorMessage(error)}</p>
      ) : null}
    </div>
  );
}
