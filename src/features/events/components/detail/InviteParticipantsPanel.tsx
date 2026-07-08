import { UserRoundPlus } from "lucide-react";
import { getErrorMessage } from "@/lib/errors";
import type { InviteParticipantsResult } from "@/types/events";
import { InviteParticipantsForm } from "@/features/events/components/detail/InviteParticipantsForm";
import { InviteParticipantsResultList } from "@/features/events/components/detail/InviteParticipantsResultList";

type InviteParticipantsPanelProps = {
  error: unknown;
  inviteParticipants: (emails: string[]) => Promise<InviteParticipantsResult>;
  inviteResult?: InviteParticipantsResult;
  isInviting: boolean;
  showPublishWarning?: boolean;
};

export function InviteParticipantsPanel({
  error,
  inviteParticipants,
  inviteResult,
  isInviting,
  showPublishWarning = false,
}: InviteParticipantsPanelProps) {
  return (
    <div className="mt-6 rounded-2xl bg-slate-50 p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <UserRoundPlus className="size-4" />
        Invitar por email
      </h3>
      {showPublishWarning ? (
        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
          Cuando envies invitaciones, la encuesta quedara publicada y no vas a
          poder modificar las opciones.
        </p>
      ) : null}
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
