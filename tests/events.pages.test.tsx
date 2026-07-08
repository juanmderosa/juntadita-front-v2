// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { HomePage } from "../src/features/home/pages/HomePage";
import { EventDetailPage } from "../src/features/events/pages/EventDetailPage";

const mocks = vi.hoisted(() => ({
  useEventsPage: vi.fn(),
  useEventDetailPage: vi.fn(),
}));

vi.mock("../src/features/events/hooks/useEventsPage", () => ({
  useEventsPage: mocks.useEventsPage,
}));

vi.mock("../src/features/events/hooks/useEventDetailPage", () => ({
  useEventDetailPage: mocks.useEventDetailPage,
}));

const event = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  createdBy: "550e8400-e29b-41d4-a716-446655440001",
  title: "Asado con amigos",
  description: "Nos juntamos a cenar.",
  type: "fixed",
  currentUserRole: "admin",
  currencyCode: "ARS",
  timezone: "America/Buenos_Aires",
  votingClosesAt: null,
  fixedStartAt: "2026-08-01T23:00:00Z",
  fixedEndAt: null,
  finalizedAt: null,
  createdAt: "2026-07-06T15:00:00Z",
  updatedAt: "2026-07-06T15:00:00Z",
} as const;

beforeEach(() => {
  mocks.useEventsPage.mockReturnValue({
    displayName: "Juan",
    events: [],
    error: null,
    hasNextPage: false,
    isFetchingNextPage: false,
    isLoading: false,
    loadMore: vi.fn(),
  });
});

afterEach(() => cleanup());

describe("events pages", () => {
  it("shows the empty dashboard without future-feature controls", () => {
    render(<HomePage />, { wrapper: MemoryRouter });

    expect(screen.getByText("Todavia no tenes eventos")).toBeTruthy();
    expect(screen.queryByText("Filtrar")).toBeNull();
    expect(screen.queryByText("Grupos")).toBeNull();
  });

  it("renders event cards", () => {
    mocks.useEventsPage.mockReturnValue({
      ...mocks.useEventsPage(),
      events: [event],
    });
    render(<HomePage />, { wrapper: MemoryRouter });

    expect(screen.getByText("Asado con amigos")).toBeTruthy();
    expect(screen.getByText("Confirmado")).toBeTruthy();
  });

  it("only exposes editing to an admin", () => {
    mocks.useEventDetailPage.mockReturnValue({
      event,
      eventId: event.id,
      error: null,
      isLoading: false,
    });
    const { rerender } = render(
      <MemoryRouter><EventDetailPage /></MemoryRouter>,
    );
    expect(screen.getByText("Editar datos")).toBeTruthy();

    mocks.useEventDetailPage.mockReturnValue({
      event: { ...event, currentUserRole: "guest" },
      eventId: event.id,
      error: null,
      isLoading: false,
    });
    rerender(<MemoryRouter><EventDetailPage /></MemoryRouter>);
    expect(screen.queryByText("Editar datos")).toBeNull();
  });
});
