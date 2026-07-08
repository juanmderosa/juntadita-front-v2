// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { HomePage } from "@/features/home/pages/HomePage";
import { EventDetailPage } from "@/features/events/pages/EventDetailPage";

const mocks = vi.hoisted(() => ({
  useEventsPage: vi.fn(),
  useEventDetailPage: vi.fn(),
}));

vi.mock("@/features/events/hooks/useEventsPage", () => ({
  useEventsPage: mocks.useEventsPage,
}));

vi.mock("@/features/events/hooks/useEventDetailPage", () => ({
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
  optionsLocked: false,
  options: [
    {
      id: "550e8400-e29b-41d4-a716-446655440010",
      eventId: "550e8400-e29b-41d4-a716-446655440000",
      type: "date",
      label: "Sabado",
      startAt: "2026-08-02T03:00:00Z",
      endAt: null,
      createdAt: "2026-07-06T15:00:00Z",
      updatedAt: "2026-07-06T15:00:00Z",
    },
  ],
  participants: [
    {
      id: "550e8400-e29b-41d4-a716-446655440020",
      eventId: "550e8400-e29b-41d4-a716-446655440000",
      userId: "550e8400-e29b-41d4-a716-446655440001",
      email: "juan@example.com",
      displayName: "Juan",
      role: "admin",
      status: "joined",
      invitedBy: null,
      createdAt: "2026-07-06T15:00:00Z",
      updatedAt: "2026-07-06T15:00:00Z",
    },
  ],
} as const;

const detailController = {
  event: {
    ...event,
    type: "poll",
    votingClosesAt: "2026-08-01T23:00:00Z",
    fixedStartAt: null,
  },
  eventId: event.id,
  error: null,
  isLoading: false,
  createOption: vi.fn(),
  createOptionsBatch: vi.fn(),
  createOptionError: null,
  isCreatingOption: false,
  updateOption: vi.fn(),
  updateOptionError: null,
  isUpdatingOption: false,
  deleteOption: vi.fn(),
  deleteOptionError: null,
  isDeletingOption: false,
  inviteParticipants: vi.fn(),
  inviteParticipantsResult: undefined,
  inviteParticipantsError: null,
  isInvitingParticipants: false,
};

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
    mocks.useEventDetailPage.mockReturnValue(detailController);
    const { rerender } = render(
      <MemoryRouter><EventDetailPage /></MemoryRouter>,
    );
    expect(screen.getByText("Editar datos")).toBeTruthy();
    expect(screen.getAllByText("Agregar opcion").length).toBeGreaterThan(0);
    expect(screen.getByText("Enviar invitaciones")).toBeTruthy();

    mocks.useEventDetailPage.mockReturnValue({
      ...detailController,
      event: { ...event, currentUserRole: "guest" },
    });
    rerender(<MemoryRouter><EventDetailPage /></MemoryRouter>);
    expect(screen.queryByText("Editar datos")).toBeNull();
    expect(screen.queryByText("Agregar opcion")).toBeNull();
    expect(screen.queryByText("Enviar invitaciones")).toBeNull();
  });

  it("hides option editing after the poll is published", () => {
    mocks.useEventDetailPage.mockReturnValue({
      ...detailController,
      event: {
        ...detailController.event,
        optionsLocked: true,
      },
    });

    render(<MemoryRouter><EventDetailPage /></MemoryRouter>);

    expect(screen.getByText("Editar datos")).toBeTruthy();
    expect(screen.getByText("Enviar invitaciones")).toBeTruthy();
    expect(screen.getByText("Las opciones quedaron bloqueadas porque la encuesta ya fue publicada.")).toBeTruthy();
    expect(screen.queryByText("Agregar opcion")).toBeNull();
  });

  it("shows setup steps and publish warning for invited step", () => {
    mocks.useEventDetailPage.mockReturnValue(detailController);

    render(
      <MemoryRouter initialEntries={[`/events/${event.id}?setup=guests`]}>
        <EventDetailPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Datos")).toBeTruthy();
    expect(screen.getByText("Opciones")).toBeTruthy();
    expect(screen.getAllByText("Invitados").length).toBeGreaterThan(0);
    expect(
      screen.getByText(/Cuando envies invitaciones, la encuesta quedara publicada/),
    ).toBeTruthy();
    expect(screen.queryByText("Agregar opcion")).toBeNull();
    expect(screen.getByText("Volver a opciones")).toBeTruthy();
  });

  it("does not continue from options setup without options", () => {
    mocks.useEventDetailPage.mockReturnValue({
      ...detailController,
      event: {
        ...detailController.event,
        options: [],
      },
    });

    render(
      <MemoryRouter initialEntries={[`/events/${event.id}?setup=options`]}>
        <EventDetailPage />
      </MemoryRouter>,
    );

    const continueButton = screen.getByRole("button", {
      name: "Continuar a invitados",
    });

    expect(continueButton).toHaveProperty("disabled", true);
    expect(
      screen.getByText("Agrega al menos una opcion antes de invitar personas."),
    ).toBeTruthy();
  });
});
