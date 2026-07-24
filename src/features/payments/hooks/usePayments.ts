import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { paymentsApi } from "@/api/payments.api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { CreatePaymentInput, Payment } from "@/types/payments";

export function usePayments(eventId: string, enabled: boolean) {
  const { accessToken, currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [paymentToVoid, setPaymentToVoid] = useState<Payment | null>(null);
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["payments", eventId] });
  const query = useQuery({
    queryKey: ["payments", eventId],
    queryFn: () => paymentsApi.getOverview(accessToken!, eventId),
    enabled: Boolean(accessToken && eventId && enabled),
  });
  const createMutation = useMutation({
    mutationFn: (input: CreatePaymentInput) =>
      paymentsApi.create(accessToken!, eventId, input),
    onSuccess: async () => {
      await invalidate();
      setIsFormOpen(false);
    },
  });
  const voidMutation = useMutation({
    mutationFn: ({
      paymentId,
      reason,
    }: {
      paymentId: string;
      reason: string;
    }) => paymentsApi.void(accessToken!, eventId, paymentId, reason),
    onSuccess: async () => {
      await invalidate();
      setPaymentToVoid(null);
    },
  });
  return {
    overview: query.data,
    isLoading: query.isLoading,
    error: query.error,
    currentUserId: currentUser?.user.id,
    isFormOpen,
    openForm: () => setIsFormOpen(true),
    closeForm: () => setIsFormOpen(false),
    createPayment: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    paymentToVoid,
    requestVoid: setPaymentToVoid,
    cancelVoid: () => setPaymentToVoid(null),
    voidPayment: voidMutation.mutateAsync,
    isVoiding: voidMutation.isPending,
    voidError: voidMutation.error,
  };
}
