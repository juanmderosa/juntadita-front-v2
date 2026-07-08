import { ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { ErrorState } from "@/components/feedback/ErrorState";
import { PageLoader } from "@/components/feedback/PageLoader";
import { useEventDetailPage } from "@/features/events/hooks/useEventDetailPage";
import { EventOptionsSection } from "@/features/events/components/detail/EventOptionsSection";
import { EventParticipantsSection } from "@/features/events/components/detail/EventParticipantsSection";
import { EventDetailHeader } from "@/features/events/components/detail/EventDetailHeader";
import { EventDescription } from "@/features/events/components/detail/EventDescription";
import { EventDetailAside } from "@/features/events/components/detail/EventDetailAside";
import {
  EventSetupSteps,
  type EventSetupStep,
} from "@/features/events/components/detail/EventSetupSteps";
import { EventSetupActions } from "@/features/events/components/detail/EventSetupActions";

export function EventDetailPage() {
  const controller = useEventDetailPage();
  const [searchParams, setSearchParams] = useSearchParams();

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
  const requestedSetupStep = searchParams.get("setup");
  const setupStep = getSetupStep(requestedSetupStep, event.type);
  const isSetupMode = canManage && setupStep !== null;
  const showDescription = !isSetupMode;
  const showOptions =
    event.type === "poll" && (!isSetupMode || setupStep === "options");
  const showParticipants = !isSetupMode || setupStep === "guests";
  const goToOptions = () => setSearchParams({ setup: "options" }, { replace: true });
  const goToGuests = () => setSearchParams({ setup: "guests" }, { replace: true });
  const finishSetup = () => setSearchParams({}, { replace: true });
  const needsOptionsBeforeInviting =
    event.type === "poll" && setupStep === "options" && event.options.length === 0;

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

      {isSetupMode ? (
        <EventSetupSteps currentStep={setupStep} eventType={event.type} />
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          {showDescription ? (
            <EventDescription description={event.description} />
          ) : null}
          {showOptions ? (
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
          {showParticipants ? (
            <EventParticipantsSection
              canManage={canManage}
              error={controller.inviteParticipantsError}
              event={event}
              inviteParticipants={controller.inviteParticipants}
              inviteResult={controller.inviteParticipantsResult}
              isInviting={controller.isInvitingParticipants}
              showPublishWarning={isSetupMode && event.type === "poll"}
            />
          ) : null}
          {isSetupMode ? (
            <EventSetupActions
              backLabel="Volver a opciones"
              finishLabel="Ver evento"
              helperText={
                needsOptionsBeforeInviting
                  ? "Agrega al menos una opcion antes de invitar personas."
                  : undefined
              }
              isNextDisabled={needsOptionsBeforeInviting}
              nextLabel="Continuar a invitados"
              onBack={
                event.type === "poll" && setupStep === "guests"
                  ? goToOptions
                  : undefined
              }
              onFinish={setupStep === "guests" ? finishSetup : undefined}
              onNext={setupStep === "options" ? goToGuests : undefined}
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

function getSetupStep(
  value: string | null,
  eventType: "poll" | "fixed",
): EventSetupStep | null {
  if (value === "guests") return "guests";
  if (eventType === "poll" && value === "options") return "options";
  return null;
}
