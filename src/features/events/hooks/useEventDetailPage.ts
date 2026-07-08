import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { eventsApi } from "../../../api/events.api";
import { useAuth } from "../../auth/hooks/useAuth";
import { eventQueryKey } from "./useEventsPage";

export function useEventDetailPage() {
  const { eventId = "" } = useParams();
  const { accessToken } = useAuth();
  const query = useQuery({
    queryKey: eventQueryKey(eventId),
    enabled: Boolean(accessToken && eventId),
    queryFn: () => eventsApi.getById(accessToken!, eventId),
  });

  return {
    eventId,
    event: query.data,
    error: query.error,
    isLoading: query.isLoading,
  };
}
