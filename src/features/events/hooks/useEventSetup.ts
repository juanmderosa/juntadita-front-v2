import { useSearchParams } from "react-router-dom";
import type { EventDetail } from "@/types/events";
import type { EventSetupStep } from "@/features/events/components/detail/EventSetupSteps";

export function useEventSetup(
  event: EventDetail | undefined,
  canManage: boolean,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const setupStep = getSetupStep(searchParams.get("setup"), event?.type ?? "fixed");
  const isSetupMode = canManage && setupStep !== null;

  return {
    setupStep,
    isSetupMode,
    showDescription: !isSetupMode,
    showOptions:
      event?.type === "poll" &&
      !event.optionsLocked &&
      (!isSetupMode || setupStep === "options"),
    showVoting: event?.type === "poll" && !isSetupMode,
    showParticipants: !isSetupMode || setupStep === "guests",
    needsOptionsBeforeInviting:
      event?.type === "poll" &&
      setupStep === "options" &&
      event.options.length === 0,
    goToOptions: () => setSearchParams({ setup: "options" }, { replace: true }),
    goToGuests: () => setSearchParams({ setup: "guests" }, { replace: true }),
    finishSetup: () => setSearchParams({}, { replace: true }),
  };
}

function getSetupStep(
  value: string | null,
  eventType: "poll" | "fixed",
): EventSetupStep | null {
  if (value === "guests") return "guests";
  if (eventType === "poll" && value === "options") return "options";
  return null;
}
