import React from "react";
import { EventsEmptyState } from "./EventsEmptyState";
import { EventsError } from "./EventsError";
import { EventsGrid } from "./EventsGrid";
import { EventsLoader } from "./EventsLoader";
import { EventsPageController } from "../../events/hooks/useEventsPage";

interface Props {
  controller: EventsPageController;
}

export const HomePageContainer = ({ controller }: Props) => {
  const { isLoading, error, events } = controller;

  if (isLoading) return <EventsLoader />;

  if (error) return <EventsError error={error} />;

  if (events.length === 0) return <EventsEmptyState />;

  return (
    <EventsGrid
      events={controller.events}
      hasNextPage={controller.hasNextPage}
      isFetchingNextPage={controller.isFetchingNextPage}
      loadMore={controller.loadMore}
    />
  );
};
