import type {
  EventDetail,
  InviteParticipantsResult,
} from "@/types/events";
import { EventParticipantsHeader } from "@/features/events/components/detail/EventParticipantsHeader";
import { EventParticipantsList } from "@/features/events/components/detail/EventParticipantsList";
import { InviteParticipantsPanel } from "@/features/events/components/detail/InviteParticipantsPanel";

type EventParticipantsSectionProps = {
  event: EventDetail;
  canManage: boolean;
  inviteParticipants: (emails: string[]) => Promise<InviteParticipantsResult>;
  inviteResult?: InviteParticipantsResult;
  isInviting: boolean;
  error: unknown;
  showPublishWarning?: boolean;
};

export function EventParticipantsSection({
  event,
  canManage,
  inviteParticipants,
  inviteResult,
  isInviting,
  error,
  showPublishWarning = false,
}: EventParticipantsSectionProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-8">
      <EventParticipantsHeader participantsCount={event.participants.length} />
      <EventParticipantsList participants={event.participants} />

      {canManage ? (
        <InviteParticipantsPanel
          error={error}
          inviteParticipants={inviteParticipants}
          inviteResult={inviteResult}
          isInviting={isInviting}
          showPublishWarning={showPublishWarning}
        />
      ) : null}
    </article>
  );
}
