import { ArrowLeft, CalendarClock, Crown, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../../lib/errors";
import {
  getEventSchedule,
  getEventStatus,
  getEventTypeLabel,
} from "../lib/events.lib";
import { useEventDetailPage } from "../hooks/useEventDetailPage";
import { EventOptionsSection } from "../components/EventOptionsSection";
import { EventParticipantsSection } from "../components/EventParticipantsSection";
import { EventDetailLoader } from "../components/EventDetailLoader";
import { EventDetailError } from "../components/EventDetailError";
import { EventDetailHeader } from "../components/EventDetailHeader";
import { EventDescription } from "../components/EventDescription";
import { EventDetailAside } from "../components/EventDetailAside";

export function EventDetailPage() {
  const controller = useEventDetailPage();

  if (controller.isLoading) return <EventDetailLoader />;

  if (controller.error || !controller.event)
    return <EventDetailError error={controller.error} />;

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
