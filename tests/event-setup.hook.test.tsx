// @vitest-environment jsdom

import { act, renderHook, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { useEventSetup } from "@/features/events/hooks/useEventSetup";
import type { EventDetail } from "@/types/events";

const pollEvent = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  createdBy: "550e8400-e29b-41d4-a716-446655440001",
  title: "Cena",
  description: null,
  type: "poll",
  currentUserRole: "admin",
  currencyCode: "ARS",
  timezone: "America/Buenos_Aires",
  votingClosesAt: "2026-08-01T23:00:00Z",
  fixedStartAt: null,
  fixedEndAt: null,
  finalizedAt: null,
  financialStatus: "collecting_expenses",
  financialStateChangedAt: "2026-07-17T00:00:00Z",
  financialStateChangedBy: null,
  financialParticipantsLockedAt: null,
  winningOption: null,
  createdAt: "2026-07-01T00:00:00Z",
  updatedAt: "2026-07-01T00:00:00Z",
  optionsLocked: false,
  options: [],
  participants: [],
} satisfies EventDetail;

function wrapper(entry: string) {
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={[entry]}>{children}</MemoryRouter>
  );
}

describe("useEventSetup", () => {
  it("recognizes the options step only for polls", () => {
    const { result: poll } = renderHook(
      () => useEventSetup(pollEvent, true),
      { wrapper: wrapper("/events/id?setup=options") },
    );
    const { result: fixed } = renderHook(
      () => useEventSetup({ ...pollEvent, type: "fixed", votingClosesAt: null }, true),
      { wrapper: wrapper("/events/id?setup=options") },
    );

    expect(poll.current.setupStep).toBe("options");
    expect(fixed.current.setupStep).toBeNull();
  });

  it("recognizes guests and ignores invalid setup values", () => {
    const { result: guests } = renderHook(
      () => useEventSetup(pollEvent, true),
      { wrapper: wrapper("/events/id?setup=guests") },
    );
    const { result: invalid } = renderHook(
      () => useEventSetup(pollEvent, true),
      { wrapper: wrapper("/events/id?setup=unexpected") },
    );

    expect(guests.current.setupStep).toBe("guests");
    expect(invalid.current.setupStep).toBeNull();
  });

  it("blocks the next setup action until a poll has options", () => {
    const { result } = renderHook(
      () => useEventSetup(pollEvent, true),
      { wrapper: wrapper("/events/id?setup=options") },
    );

    expect(result.current.needsOptionsBeforeInviting).toBe(true);
  });

  it("clears the setup parameter when setup finishes", async () => {
    const { result } = renderHook(
      () => useEventSetup({ ...pollEvent, options: [{}] as EventDetail["options"] }, true),
      { wrapper: wrapper("/events/id?setup=guests") },
    );

    act(() => result.current.finishSetup());

    await waitFor(() => expect(result.current.setupStep).toBeNull());
    expect(result.current.isSetupMode).toBe(false);
  });
});
