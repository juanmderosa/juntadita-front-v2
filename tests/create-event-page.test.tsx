// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { CreateEventPage } from "@/features/events/pages/CreateEventPage";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
}));

vi.mock("@/api/events.api", () => ({
  eventsApi: {
    create: mocks.create,
  },
}));

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: () => ({ accessToken: "access-token" }),
}));

describe("create event page", () => {
  it("creates a poll and navigates to its detail", async () => {
    mocks.create.mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440000",
    });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/events/new"]}>
          <Routes>
            <Route path="/events/new" element={<CreateEventPage />} />
            <Route path="/events/:eventId" element={<p>Detalle creado</p>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await user.type(screen.getByLabelText("Titulo"), "Cena del viernes");
    fireEvent.change(screen.getByLabelText("Cierre de la votacion"), {
      target: { value: "2099-01-01T12:00" },
    });
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    await waitFor(() => expect(screen.getByText("Detalle creado")).toBeTruthy());
    expect(mocks.create).toHaveBeenCalledWith(
      "access-token",
      expect.objectContaining({
        type: "poll",
        title: "Cena del viernes",
        votingClosesAt: "2099-01-01T15:00:00.000Z",
      }),
    );
  });
});
