import type { EventParticipant } from "../../../types/events";
import { EventParticipantItem } from "./EventParticipantItem";

type EventParticipantsListProps = {
  participants: EventParticipant[];
};

export function EventParticipantsList({
  participants,
}: EventParticipantsListProps) {
  return (
    <ul className="mt-5 divide-y divide-slate-100">
      {participants.map((participant) => (
        <EventParticipantItem key={participant.id} participant={participant} />
      ))}
    </ul>
  );
}
