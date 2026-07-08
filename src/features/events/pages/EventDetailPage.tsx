import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ErrorState } from "@/components/feedback/ErrorState";
import { PageLoader } from "@/components/feedback/PageLoader";
import { useEventDetailPage } from "@/features/events/hooks/useEventDetailPage";
import { EventOptionsSection } from "@/features/events/components/detail/EventOptionsSection";
import { EventParticipantsSection } from "@/features/events/components/detail/EventParticipantsSection";
import { EventDetailHeader } from "@/features/events/components/detail/EventDetailHeader";
import { EventDescription } from "@/features/events/components/detail/EventDescription";
import { EventDetailAside } from "@/features/events/components/detail/EventDetailAside";

export function EventDetailPage() {
  const controller = useEventDetailPage();

  if (controller.isLoading) {
    return (
      <PageLoader
        className="mx-auto max-w-5xl px-4 py-12"
        itemClassName="h-80 rounded-2xl"
      />
    );
  }

  if (controller.error || !controller.event)
    return (
      <ErrorState
        action={
          <Link
            className="inline-block font-bold text-indigo-700"
            to="/">
            Volver a mis eventos
          </Link>
        }
        className="mx-auto max-w-3xl px-4 py-12"
        error={controller.error}
      />
    );

  const event = controller.event;
  const canManage = event.currentUserRole === "admin";

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <Link
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-700"
        to="/">
        <ArrowLeft className="size-4" />
        Mis eventos
      </Link>

      <EventDetailHeader
        event={event}
        canManage={canManage}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <EventDescription description={event.description} />
          {event.type === "poll" ? (
            <EventOptionsSection
              canManage={canManage}
              createOption={controller.createOption}
              deleteOption={controller.deleteOption}
              error={
                controller.createOptionError ?? controller.deleteOptionError
              }
              event={event}
              isCreating={controller.isCreatingOption}
              updateOption={controller.updateOption}
            />
          ) : null}
          <EventParticipantsSection
            canManage={canManage}
            error={controller.inviteParticipantsError}
            event={event}
            inviteParticipants={controller.inviteParticipants}
            inviteResult={controller.inviteParticipantsResult}
            isInviting={controller.isInvitingParticipants}
          />
        </div>
        <EventDetailAside
          canManage={canManage}
          currencyCode={event.currencyCode}
          timezone={event.timezone}
        />
      </div>
    </section>
  );
}
