import { http } from "./http";
import {
  eventResponseSchema,
  paginatedEventsResponseSchema,
} from "../features/events/schemas/events.schemas";
import type {
  CreateEventInput,
  EventDetail,
  EventSummary,
  UpdateEventInput,
} from "../types/events";
import type { PaginatedResponse, SuccessResponse } from "../types/api";

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

  async update(
    accessToken: string,
    eventId: string,
    input: UpdateEventInput,
  ) {
    const response = await http.patch<SuccessResponse<EventDetail>>(
      `/api/v1/events/${encodeURIComponent(eventId)}`,
      input,
      { accessToken, responseSchema: eventResponseSchema },
    );
    return response.data;
  },
};
