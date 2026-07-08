import { useInfiniteQuery } from "@tanstack/react-query";
import { eventsApi } from "@/api/events.api";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const eventsQueryKey = ["events"] as const;
export const eventQueryKey = (eventId: string) => ["events", eventId] as const;

export function useEventsPage() {
  const { accessToken, currentUser } = useAuth();
  const query = useInfiniteQuery({
    queryKey: eventsQueryKey,
    initialPageParam: 1,
    enabled: Boolean(accessToken),
    queryFn: ({ pageParam }) => eventsApi.list(accessToken!, pageParam, 20),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });

  return {
    displayName: currentUser?.profile.displayName ?? "bienvenido",
    events: query.data?.pages.flatMap((page) => page.data) ?? [],
    error: query.error,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    loadMore: query.fetchNextPage,
  };
}

export type EventsPageController = ReturnType<typeof useEventsPage>;
