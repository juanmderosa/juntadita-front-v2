import { http } from "@/api/http";
import {
  attachmentResponseSchema,
  expenseResponseSchema,
  expensesResponseSchema,
  signedAttachmentResponseSchema,
} from "@/features/expenses/schemas/expenses.schemas";
import type { Expense, ExpenseInput } from "@/types/expenses";
import type { PaginatedResponse, SuccessResponse } from "@/types/api";

const basePath = (eventId: string) => `/api/v1/events/${encodeURIComponent(eventId)}/expenses`;
export const expensesApi = {
  async list(accessToken: string, eventId: string) {
    return http.get<PaginatedResponse<Expense>>(`${basePath(eventId)}?page=1&limit=100`, {
      accessToken,
      responseSchema: expensesResponseSchema,
    });
  },
  async create(accessToken: string, eventId: string, input: ExpenseInput) {
    const response = await http.post<SuccessResponse<Expense>>(basePath(eventId), input, {
      accessToken,
      responseSchema: expenseResponseSchema,
    });
    return response.data;
  },
  async update(accessToken: string, eventId: string, expenseId: string, input: ExpenseInput) {
    const response = await http.patch<SuccessResponse<Expense>>(
      `${basePath(eventId)}/${encodeURIComponent(expenseId)}`,
      input,
      { accessToken, responseSchema: expenseResponseSchema },
    );
    return response.data;
  },
  async delete(accessToken: string, eventId: string, expenseId: string) {
    await http.delete(`${basePath(eventId)}/${encodeURIComponent(expenseId)}`, {
      accessToken,
    });
  },
  async uploadAttachment(accessToken: string, eventId: string, expenseId: string, file: File) {
    const form = new FormData();
    form.append("file", file);
    const response = await http.postForm(
      `${basePath(eventId)}/${encodeURIComponent(expenseId)}/attachments`,
      form,
      { accessToken, responseSchema: attachmentResponseSchema },
    );
    return response.data;
  },
  async getAttachmentUrl(
    accessToken: string,
    eventId: string,
    expenseId: string,
    attachmentId: string,
  ) {
    const response = await http.get(
      `${basePath(eventId)}/${encodeURIComponent(expenseId)}/attachments/${encodeURIComponent(attachmentId)}/download`,
      { accessToken, responseSchema: signedAttachmentResponseSchema },
    );
    return response.data;
  },
  async deleteAttachment(
    accessToken: string,
    eventId: string,
    expenseId: string,
    attachmentId: string,
  ) {
    await http.delete(
      `${basePath(eventId)}/${encodeURIComponent(expenseId)}/attachments/${encodeURIComponent(attachmentId)}`,
      { accessToken },
    );
  },
};
