export type EventType = "poll" | "fixed";
export type EventParticipantRole = "admin" | "guest";

export type EventSummary = {
  id: string;
  createdBy: string;
  title: string;
  description: string | null;
  type: EventType;
  currentUserRole: EventParticipantRole;
  currencyCode: string;
  timezone: string;
  votingClosesAt: string | null;
  fixedStartAt: string | null;
  fixedEndAt: string | null;
  finalizedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EventDetail = EventSummary;

export type CreateEventInput =
  | {
      type: "poll";
      title: string;
      description?: string | null;
      votingClosesAt: string;
    }
  | {
      type: "fixed";
      title: string;
      description?: string | null;
      fixedStartAt: string;
      fixedEndAt?: string | null;
    };

export type UpdateEventInput = {
  title?: string;
  description?: string | null;
};
