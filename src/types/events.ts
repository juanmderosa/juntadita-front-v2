export type EventType = "poll" | "fixed";
export type EventParticipantRole = "admin" | "guest";
export type EventParticipantStatus = "invited" | "joined" | "removed";
export type EventOptionType = "date" | "datetime" | "range";

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

export type EventOption = {
  id: string;
  eventId: string;
  type: EventOptionType;
  label: string | null;
  startAt: string;
  endAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EventParticipant = {
  id: string;
  eventId: string;
  userId: string | null;
  email: string;
  displayName: string | null;
  role: EventParticipantRole;
  status: EventParticipantStatus;
  invitedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InviteEmailDelivery = {
  email: string;
  status: "sent" | "failed" | "skipped";
  providerMessageId: string | null;
  errorMessage: string | null;
};

export type InviteParticipantsResult = {
  participants: EventParticipant[];
  emails: InviteEmailDelivery[];
};

export type EventDetail = EventSummary & {
  options: EventOption[];
  participants: EventParticipant[];
};

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

export type CreateEventOptionInput =
  | {
      type: "date";
      label?: string | null;
      startAt: string;
    }
  | {
      type: "datetime";
      label?: string | null;
      startAt: string;
    }
  | {
      type: "range";
      label?: string | null;
      startAt: string;
      endAt: string;
    };

export type UpdateEventOptionInput = {
  label?: string | null;
  startAt?: string;
  endAt?: string | null;
};
