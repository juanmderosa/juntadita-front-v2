import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { eventsApi } from "@/api/events.api";
import { localDateTimeToIso } from "@/lib/dates";
import { getErrorMessage } from "@/lib/errors";
import type { CreateEventInput } from "@/types/events";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { eventFormSchema, type EventFormInput } from "@/features/events/schemas/events.schemas";
import { eventsQueryKey } from "@/features/events/hooks/useEventsPage";

export function useCreateEventPage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<EventFormInput>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      type: "poll",
      title: "",
      description: "",
      votingClosesAt: "",
      fixedStartAt: "",
      fixedEndAt: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (input: CreateEventInput) => eventsApi.create(accessToken!, input),
    onSuccess: async (event, input) => {
      await queryClient.invalidateQueries({ queryKey: eventsQueryKey });
      const setupStep = input.type === "poll" ? "options" : "guests";
      navigate(`/events/${event.id}?setup=${setupStep}`, { replace: true });
    },
  });

  async function createEvent(values: EventFormInput) {
    if (!accessToken) return;

    const base = {
      title: values.title,
      description: values.description || null,
    };
    const input: CreateEventInput =
      values.type === "poll"
        ? {
            ...base,
            type: "poll",
            votingClosesAt: localDateTimeToIso(values.votingClosesAt),
          }
        : {
            ...base,
            type: "fixed",
            fixedStartAt: localDateTimeToIso(values.fixedStartAt),
            fixedEndAt: values.fixedEndAt ? localDateTimeToIso(values.fixedEndAt) : null,
          };

    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      form.setError("root", { message: getErrorMessage(error) });
    }
  }

  return {
    form,
    createEvent,
    isSubmitting: mutation.isPending,
    rootError: form.formState.errors.root?.message,
  };
}
