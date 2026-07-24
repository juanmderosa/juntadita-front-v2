import { http } from "@/api/http";
import {
  paymentOverviewResponseSchema,
  paymentResponseSchema,
} from "@/features/payments/schemas/payments.schemas";
import type { CreatePaymentInput, PaymentOverview } from "@/types/payments";
import type { SuccessResponse } from "@/types/api";

const basePath = (eventId: string) => `/api/v1/events/${encodeURIComponent(eventId)}/payments`;

export const paymentsApi = {
  async getOverview(accessToken: string, eventId: string) {
    const response = await http.get<SuccessResponse<PaymentOverview>>(basePath(eventId), {
      accessToken,
      responseSchema: paymentOverviewResponseSchema,
    });
    return response.data;
  },
  async create(accessToken: string, eventId: string, input: CreatePaymentInput) {
    const response = await http.post(basePath(eventId), input, {
      accessToken,
      responseSchema: paymentResponseSchema,
    });
    return response.data;
  },
  async void(accessToken: string, eventId: string, paymentId: string, voidReason: string) {
    const response = await http.post(
      `${basePath(eventId)}/${encodeURIComponent(paymentId)}/void`,
      { voidReason },
      { accessToken, responseSchema: paymentResponseSchema },
    );
    return response.data;
  },
};
