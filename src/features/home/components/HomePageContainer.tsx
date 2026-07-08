import { Link } from "react-router-dom";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { PageLoader } from "@/components/feedback/PageLoader";
import { EventsGrid } from "@/features/home/components/EventsGrid";
import { EventsPageController } from "@/features/events/hooks/useEventsPage";

interface Props {
  controller: EventsPageController;
}

export const HomePageContainer = ({ controller }: Props) => {
  const { isLoading, error, events } = controller;

  if (isLoading) {
    return (
      <PageLoader
        ariaLabel="Cargando eventos"
        className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        itemClassName="h-64 rounded-2xl"
        items={3}
      />
    );
  }

  if (error) {
    return <ErrorState className="mt-6" error={error} />;
  }

  if (events.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-indigo-200 bg-white px-5">
        <EmptyState
          action={
            <Link
              className="font-bold text-indigo-700 hover:text-indigo-900"
              to="/events/new">
              Crear mi primer evento
            </Link>
          }
          description="Crea tu primer evento y empieza a organizar la próxima juntada."
          title="Todavia no tenes eventos"
        />
      </div>
    );
  }

  return (
    <EventsGrid
      events={controller.events}
      hasNextPage={controller.hasNextPage}
      isFetchingNextPage={controller.isFetchingNextPage}
      loadMore={controller.loadMore}
    />
  );
};
