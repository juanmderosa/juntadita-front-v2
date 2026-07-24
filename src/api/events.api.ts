import { http } from "@/api/http";
import {
  eventResponseSchema,
  inviteParticipantsResponseSchema,
  optionResponseSchema,
  optionsResponseSchema,
  paginatedEventsResponseSchema,
  participantsResponseSchema,
  votingResponseSchema,
} from "@/features/events/schemas/events.schemas";
import type {
  CreateEventOptionInput,
  CreateEventInput,
  EventDetail,
  EventOption,
  EventParticipant,
  EventSummary,
  InviteParticipantsResult,
  InviteParticipantsInput,
  UpdateEventOptionInput,
  UpdateEventInput,
  ReplaceVotesInput,
  VotingState,
} from "@/types/events";
import type { PaginatedResponse, SuccessResponse } from "@/types/api";

export const eventsApi = {
  async list(accessToken: string, page = 1, limit = 20) {
    return http.get<PaginatedResponse<EventSummary>>(
      `/api/v1/events?page=${page}&limit=${limit}`,
      { accessToken, responseSchema: paginatedEventsResponseSchema },
    );
  },

  async getById(accessToken: string, eventId: string) {
    const response = await http.get<SuccessResponse<EventDetail>>(
      `/api/v1/events/${encodeURIComponent(eventId)}`,
      { accessToken, responseSchema: eventResponseSchema },
    );
    return response.data;
  },

  async create(accessToken: string, input: CreateEventInput) {
    const response = await http.post<SuccessResponse<EventDetail>>(
      "/api/v1/events",
      input,
      { accessToken, responseSchema: eventResponseSchema },
    );
    return response.data;
  },

  async update(accessToken: string, eventId: string, input: UpdateEventInput) {
    const response = await http.patch<SuccessResponse<EventDetail>>(
      `/api/v1/events/${encodeURIComponent(eventId)}`,
      input,
      { accessToken, responseSchema: eventResponseSchema },
    );
    return response.data;
  },

  async createOption(
    accessToken: string,
    eventId: string,
    input: CreateEventOptionInput,
  ) {
    const response = await http.post<SuccessResponse<EventOption>>(
      `/api/v1/events/${encodeURIComponent(eventId)}/options`,
      input,
      { accessToken, responseSchema: optionResponseSchema },
    );
    return response.data;
  },

  async createOptionsBatch(
    accessToken: string,
    eventId: string,
    options: CreateEventOptionInput[],
  ) {
    const response = await http.post<SuccessResponse<EventOption[]>>(
      `/api/v1/events/${encodeURIComponent(eventId)}/options/batch`,
      { options },
      { accessToken, responseSchema: optionsResponseSchema },
    );
    return response.data;
  },

  async updateOption(
    accessToken: string,
    eventId: string,
    optionId: string,
    input: UpdateEventOptionInput,
  ) {
    const response = await http.patch<SuccessResponse<EventOption>>(
      `/api/v1/events/${encodeURIComponent(eventId)}/options/${encodeURIComponent(optionId)}`,
      input,
      { accessToken, responseSchema: optionResponseSchema },
    );
    return response.data;
  },

  async deleteOption(accessToken: string, eventId: string, optionId: string) {
    await http.delete<SuccessResponse<{ deleted: true }>>(
      `/api/v1/events/${encodeURIComponent(eventId)}/options/${encodeURIComponent(optionId)}`,
      { accessToken },
    );
  },

  async listParticipants(accessToken: string, eventId: string) {
    const response = await http.get<SuccessResponse<EventParticipant[]>>(
      `/api/v1/events/${encodeURIComponent(eventId)}/participants`,
      { accessToken, responseSchema: participantsResponseSchema },
    );
    return response.data;
  },

  async inviteParticipants(
    accessToken: string,
    eventId: string,
    input: InviteParticipantsInput,
  ) {
    const response = await http.post<SuccessResponse<InviteParticipantsResult>>(
      `/api/v1/events/${encodeURIComponent(eventId)}/participants/invite`,
      input,
      { accessToken, responseSchema: inviteParticipantsResponseSchema },
    );
    return response.data;
  },

  async updateExpenseParticipation(accessToken: string, eventId: string, participantId: string, participatesInExpenses: boolean) {
    const response = await http.patch<SuccessResponse<EventParticipant>>(
      `/api/v1/events/${encodeURIComponent(eventId)}/participants/${encodeURIComponent(participantId)}/expense-participation`,
      { participatesInExpenses },
      { accessToken },
    );
    return response.data;
  },

  async getVoting(accessToken: string, eventId: string) {
    const response = await http.get<SuccessResponse<VotingState>>(
      `/api/v1/events/${encodeURIComponent(eventId)}/voting`,
      { accessToken, responseSchema: votingResponseSchema },
    );
    return response.data;
  },

  async replaceVotes(
    accessToken: string,
    eventId: string,
    input: ReplaceVotesInput,
  ) {
    const response = await http.put<SuccessResponse<VotingState>>(
      `/api/v1/events/${encodeURIComponent(eventId)}/votes`,
      input,
      { accessToken, responseSchema: votingResponseSchema },
    );
    return response.data;
  },

  async resolveTie(accessToken: string, eventId: string, optionId: string) {
    const response = await http.post<SuccessResponse<VotingState>>(
      `/api/v1/events/${encodeURIComponent(eventId)}/result/resolve-tie`,
      { optionId },
      { accessToken, responseSchema: votingResponseSchema },
    );
    return response.data;
  },
};
