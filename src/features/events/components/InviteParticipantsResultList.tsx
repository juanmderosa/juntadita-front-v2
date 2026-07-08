import type { InviteParticipantsResult } from "../../../types/events";
import { getDeliveryLabel } from "../lib/eventParticipants.lib";

type InviteParticipantsResultListProps = {
  inviteResult: InviteParticipantsResult;
};

export function InviteParticipantsResultList({
  inviteResult,
}: InviteParticipantsResultListProps) {
  return (
    <ul className="mt-4 space-y-1 text-sm">
      {inviteResult.emails.map((delivery) => (
        <li
          className={
            delivery.status === "failed" ? "text-red-700" : "text-slate-600"
          }
          key={delivery.email}>
          {delivery.email}: {getDeliveryLabel(delivery.status)}
        </li>
      ))}
    </ul>
  );
}
