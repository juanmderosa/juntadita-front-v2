import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { eventsApi } from "@/api/events.api";
import type {
  CreateEventOptionInput,
  UpdateEventOptionInput,
} from "@/types/events";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { eventQueryKey, eventsQueryKey } from "@/features/events/hooks/useEventsPage";

export function useEventDetailPage() {
  const { eventId = "" } = useParams();
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
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
    mutationFn: (emails: string[]) =>
      eventsApi.inviteParticipants(accessToken!, eventId, emails),
    onSuccess: invalidateEvent,
  });

  return {
    eventId,
    event: query.data,
    error: query.error,
    isLoading: query.isLoading,
    createOption: (input: CreateEventOptionInput) =>
      createOptionMutation.mutateAsync(input),
    createOptionError: createOptionMutation.error,
    isCreatingOption: createOptionMutation.isPending,
    updateOption: (optionId: string, input: UpdateEventOptionInput) =>
      updateOptionMutation.mutateAsync({ optionId, input }),
    updateOptionError: updateOptionMutation.error,
    isUpdatingOption: updateOptionMutation.isPending,
    deleteOption: (optionId: string) => deleteOptionMutation.mutateAsync(optionId),
    deleteOptionError: deleteOptionMutation.error,
    isDeletingOption: deleteOptionMutation.isPending,
    inviteParticipants: (emails: string[]) =>
      inviteParticipantsMutation.mutateAsync(emails),
    inviteParticipantsResult: inviteParticipantsMutation.data,
    inviteParticipantsError: inviteParticipantsMutation.error,
    isInvitingParticipants: inviteParticipantsMutation.isPending,
  };
}
