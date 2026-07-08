import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { eventsApi } from "@/api/events.api";
import { getErrorMessage } from "@/lib/errors";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  editEventFormSchema,
  type EditEventFormInput,
} from "@/features/events/schemas/events.schemas";
import { eventQueryKey, eventsQueryKey } from "@/features/events/hooks/useEventsPage";

export function useEditEventPage() {
  const { eventId = "" } = useParams();
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const form = useForm<EditEventFormInput>({
    resolver: zodResolver(editEventFormSchema),
    defaultValues: { title: "", description: "" },
  });
  const eventQuery = useQuery({
    queryKey: eventQueryKey(eventId),
    enabled: Boolean(accessToken && eventId),
    queryFn: () => eventsApi.getById(accessToken!, eventId),
  });

  useEffect(() => {
    if (!eventQuery.data) return;
    form.reset({
      title: eventQuery.data.title,
      description: eventQuery.data.description ?? "",
    });
  }, [eventQuery.data, form]);

  const mutation = useMutation({
    mutationFn: (values: EditEventFormInput) =>
      eventsApi.update(accessToken!, eventId, {
        title: values.title,
        description: values.description || null,
      }),
    onSuccess: async (event) => {
      queryClient.setQueryData(eventQueryKey(eventId), event);
      await queryClient.invalidateQueries({ queryKey: eventsQueryKey });
      navigate(`/events/${eventId}`, { replace: true });
    },
  });

  async function updateEvent(values: EditEventFormInput) {
    if (!accessToken) return;
    try {
      await mutation.mutateAsync(values);
    } catch (error) {
      form.setError("root", { message: getErrorMessage(error) });
    }
  }

  return {
    event: eventQuery.data,
    error: eventQuery.error,
    form,
    isLoading: eventQuery.isLoading,
    isSubmitting: mutation.isPending,
    rootError: form.formState.errors.root?.message,
    updateEvent,
  };
}
