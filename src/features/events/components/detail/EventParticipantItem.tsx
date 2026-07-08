import { Mail } from "lucide-react";
import type { EventParticipant } from "@/types/events";

type EventParticipantItemProps = {
  participant: EventParticipant;
};

export function EventParticipantItem({
  participant,
}: EventParticipantItemProps) {
  return (
    <li className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="flex items-center gap-2 font-bold text-slate-900">
          <Mail className="size-4 text-slate-500" />
          {participant.displayName || participant.email}
        </p>
        {participant.displayName ? (
          <p className="mt-1 text-sm text-slate-500">{participant.email}</p>
        ) : null}
      </div>
      <div className="flex gap-2 text-xs font-bold">
        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
          {participant.role === "admin" ? "Organizador" : "Invitado"}
        </span>
        <span className="rounded-full bg-indigo-50 px-2 py-1 text-indigo-700">
          {participant.status === "joined" ? "Unido" : "Invitado"}
        </span>
      </div>
    </li>
  );
}
