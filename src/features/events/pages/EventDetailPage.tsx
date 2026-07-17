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
import { EventSetupSteps } from "@/features/events/components/detail/EventSetupSteps";
import { EventSetupActions } from "@/features/events/components/detail/EventSetupActions";
import { VotingSection } from "@/features/events/components/detail/VotingSection";
import { useEventVoting } from "@/features/events/hooks/useEventVoting";
import { useEventSetup } from "@/features/events/hooks/useEventSetup";

export function EventDetailPage() {
  const controller = useEventDetailPage();
  const setup = useEventSetup(
    controller.event,
    controller.event?.currentUserRole === "admin",
  );
  const voting = useEventVoting(
    controller.eventId,
    controller.event?.type === "poll" && setup.setupStep === null,
  );

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

      {setup.isSetupMode ? (
        <EventSetupSteps
          currentStep={setup.setupStep!}
          eventType={event.type}
        />
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          {setup.showDescription ? (
            <EventDescription description={event.description} />
          ) : null}
          {setup.showVoting ? (
            <VotingSection
              canManage={canManage}
              cancelTieResolution={voting.cancelTieResolution}
              confirmTieResolution={voting.confirmTieResolution}
              error={voting.error}
              isLoading={voting.isLoading}
              isResolvingTie={voting.isResolvingTie}
              isSaving={voting.isSaving}
              onRequestTieResolution={voting.requestTieResolution}
              onSave={voting.saveVotes}
              onToggle={voting.toggleOption}
              pendingTieOptionId={voting.pendingTieOptionId}
              resolveTieError={voting.resolveTieError}
              selectedOptionIds={voting.selectedOptionIds}
              selectionError={voting.selectionError}
              timeZone={event.timezone}
              voting={voting.voting}
            />
          ) : null}
          {setup.showOptions ? (
            <EventOptionsSection
              canManage={canManage}
              createOption={controller.createOption}
              createOptionsBatch={controller.createOptionsBatch}
              deleteOption={controller.deleteOption}
              error={
                controller.createOptionError ?? controller.deleteOptionError
              }
              event={event}
              isCreating={controller.isCreatingOption}
              updateOption={controller.updateOption}
            />
          ) : null}
          {setup.showParticipants ? (
            <EventParticipantsSection
              canInvite={canManage && !event.finalizedAt}
              error={controller.inviteParticipantsError}
              event={event}
              inviteParticipants={controller.inviteParticipants}
              inviteResult={controller.inviteParticipantsResult}
              isInviting={controller.isInvitingParticipants}
              groups={controller.groups}
              showPublishWarning={setup.isSetupMode && event.type === "poll"}
            />
          ) : null}
          {setup.isSetupMode ? (
            <EventSetupActions
              backLabel="Volver a opciones"
              finishLabel="Ver evento"
              helperText={
                setup.needsOptionsBeforeInviting
                  ? "Agrega al menos una opcion antes de invitar personas."
                  : undefined
              }
              isNextDisabled={setup.needsOptionsBeforeInviting}
              nextLabel="Continuar a invitados"
              onBack={
                event.type === "poll" && setup.setupStep === "guests"
                  ? setup.goToOptions
                  : undefined
              }
              onFinish={setup.setupStep === "guests" ? setup.finishSetup : undefined}
              onNext={setup.setupStep === "options" ? setup.goToGuests : undefined}
            />
          ) : null}
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
