import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { eventsApi } from "@/api/events.api";
import type {
  CreateEventOptionInput,
  InviteParticipantsInput,
  UpdateEventOptionInput,
} from "@/types/events";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useGroups } from "@/features/groups/hooks/useGroups";
import {
  eventQueryKey,
  eventsQueryKey,
} from "@/features/events/hooks/useEventsPage";

export function useEventDetailPage() {
  const { eventId = "" } = useParams();
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const groupsQuery = useGroups();
  const query = useQuery({
    queryKey: eventQueryKey(eventId),
    enabled: Boolean(accessToken && eventId),
    queryFn: () => eventsApi.getById(accessToken!, eventId),
  });
  const invalidateEvent = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: eventQueryKey(eventId) }),
      queryClient.invalidateQueries({ queryKey: eventsQueryKey }),
    ]);
  const createOptionMutation = useMutation({
    mutationFn: (input: CreateEventOptionInput) =>
      eventsApi.createOption(accessToken!, eventId, input),
    onSuccess: invalidateEvent,
  });
  const createOptionsBatchMutation = useMutation({
    mutationFn: (options: CreateEventOptionInput[]) =>
      eventsApi.createOptionsBatch(accessToken!, eventId, options),
    onSuccess: invalidateEvent,
  });
  const updateOptionMutation = useMutation({
    mutationFn: ({
      optionId,
      input,
    }: {
      optionId: string;
      input: UpdateEventOptionInput;
    }) => eventsApi.updateOption(accessToken!, eventId, optionId, input),
    onSuccess: invalidateEvent,
  });
  const deleteOptionMutation = useMutation({
    mutationFn: (optionId: string) =>
      eventsApi.deleteOption(accessToken!, eventId, optionId),
    onSuccess: invalidateEvent,
  });
  const inviteParticipantsMutation = useMutation({
    mutationFn: (input: InviteParticipantsInput) =>
      eventsApi.inviteParticipants(accessToken!, eventId, input),
    onSuccess: invalidateEvent,
  });

  return {
    eventId,
    event: query.data,
    error: query.error,
    isLoading: query.isLoading,
    createOption: (input: CreateEventOptionInput) =>
      createOptionMutation.mutateAsync(input),
    createOptionsBatch: (options: CreateEventOptionInput[]) =>
      createOptionsBatchMutation.mutateAsync(options),
    createOptionError:
      createOptionMutation.error ?? createOptionsBatchMutation.error,
    isCreatingOption:
      createOptionMutation.isPending || createOptionsBatchMutation.isPending,
    updateOption: (optionId: string, input: UpdateEventOptionInput) =>
      updateOptionMutation.mutateAsync({ optionId, input }),
    updateOptionError: updateOptionMutation.error,
    isUpdatingOption: updateOptionMutation.isPending,
    deleteOption: (optionId: string) =>
      deleteOptionMutation.mutateAsync(optionId),
    deleteOptionError: deleteOptionMutation.error,
    isDeletingOption: deleteOptionMutation.isPending,
    inviteParticipants: (input: InviteParticipantsInput) =>
      inviteParticipantsMutation.mutateAsync(input),
    inviteParticipantsResult: inviteParticipantsMutation.data,
    inviteParticipantsError: inviteParticipantsMutation.error,
    isInvitingParticipants: inviteParticipantsMutation.isPending,
    groups: groupsQuery.data ?? [],
  };
}
