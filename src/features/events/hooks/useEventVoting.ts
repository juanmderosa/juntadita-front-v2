import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { eventsApi } from "@/api/events.api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { eventQueryKey, eventsQueryKey } from "@/features/events/hooks/useEventsPage";
import { voteFormSchema, type VoteFormInput } from "@/features/events/schemas/events.schemas";

export const votingQueryKey = (eventId: string) => ["events", eventId, "voting"];

export function useEventVoting(eventId: string, enabled: boolean) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<VoteFormInput>({
    defaultValues: { optionIds: [] },
    resolver: zodResolver(voteFormSchema),
  });

  const [pendingTieOptionId, setPendingTieOptionId] = useState<string | null>(null);
  const query = useQuery({
    queryKey: votingQueryKey(eventId),
    enabled: Boolean(accessToken && eventId && enabled),
    queryFn: () => eventsApi.getVoting(accessToken!, eventId),
  });

  const mutation = useMutation({
    mutationFn: (input: VoteFormInput) => eventsApi.replaceVotes(accessToken!, eventId, input),
    onSuccess: async (voting) => {
      form.reset({ optionIds: voting.selectedOptionIds });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: votingQueryKey(eventId) }),
        queryClient.invalidateQueries({ queryKey: eventQueryKey(eventId) }),
        queryClient.invalidateQueries({ queryKey: eventsQueryKey }),
      ]);
    },
  });

  const resolveTieMutation = useMutation({
    mutationFn: (optionId: string) => eventsApi.resolveTie(accessToken!, eventId, optionId),
    onSuccess: async () => {
      setPendingTieOptionId(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: votingQueryKey(eventId) }),
        queryClient.invalidateQueries({ queryKey: eventQueryKey(eventId) }),
        queryClient.invalidateQueries({ queryKey: eventsQueryKey }),
      ]);
    },
  });

  const selectedOptionIds = form.watch("optionIds");

  useEffect(() => {
    if (query.data) form.reset({ optionIds: query.data.selectedOptionIds });
  }, [form, query.data]);

  return {
    voting: query.data,
    error: query.error ?? mutation.error,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
    selectedOptionIds,
    toggleOption: (optionId: string) => {
      const next = selectedOptionIds.includes(optionId)
        ? selectedOptionIds.filter((id) => id !== optionId)
        : [...selectedOptionIds, optionId];
      form.setValue("optionIds", next, { shouldValidate: true });
    },
    saveVotes: form.handleSubmit((input) => mutation.mutateAsync(input)),
    selectionError: form.formState.errors.optionIds?.message,
    pendingTieOptionId,
    requestTieResolution: setPendingTieOptionId,
    cancelTieResolution: () => setPendingTieOptionId(null),
    confirmTieResolution: () =>
      pendingTieOptionId ? resolveTieMutation.mutateAsync(pendingTieOptionId) : Promise.resolve(),
    isResolvingTie: resolveTieMutation.isPending,
    resolveTieError: resolveTieMutation.error,
  };
}
