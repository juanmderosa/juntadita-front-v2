import React from "react";
import { EventCard } from "@/features/events/components/list/EventCard";
import { EventSummary } from "@/types/events";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { PaginatedResponse } from "@/types/api";

interface Props {
  events: EventSummary[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMore: (
    options?: FetchNextPageOptions,
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<PaginatedResponse<EventSummary>, unknown>, Error>
  >;
}

export const EventsGrid = ({ events, hasNextPage, isFetchingNextPage, loadMore }: Props) => {
  return (
    <>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>
      {hasNextPage ? (
        <div className="mt-8 text-center">
          <button
            className="rounded-lg border border-indigo-200 bg-white px-5 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-50 disabled:opacity-60"
            disabled={isFetchingNextPage}
            onClick={() => void loadMore()}
            type="button"
          >
            {isFetchingNextPage ? "Cargando..." : "Cargar mas"}
          </button>
        </div>
      ) : null}
    </>
  );
};
