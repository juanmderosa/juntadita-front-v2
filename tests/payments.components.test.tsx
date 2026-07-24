// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PaymentsSection } from "@/features/payments/components/PaymentsSection";
import type { PaymentOverview } from "@/types/payments";

const participant = (id: string, userId: string | null) => ({
  id,
  eventId: "event-id",
  userId,
  email: `${id}@example.com`,
  displayName: id.toUpperCase(),
  role: "guest" as const,
  status: "joined" as const,
  participatesInExpenses: true,
  invitedBy: null,
  createdAt: "2026-07-24T00:00:00Z",
  updatedAt: "2026-07-24T00:00:00Z",
});
const a = participant("a", "user-a");
const b = participant("b", "user-b");
const overview: PaymentOverview = {
  balances: [
    { participant: a, balanceCents: 1500 },
    { participant: b, balanceCents: -1500 },
  ],
  suggestions: [{ fromParticipantId: "b", toParticipantId: "a", amountCents: 1500 }],
  payments: [
    {
      id: "payment-id",
      eventId: "event-id",
      fromParticipantId: "b",
      toParticipantId: "a",
      fromParticipant: b,
      toParticipant: a,
      createdByUserId: "user-b",
      amountCents: 500,
      currencyCode: "ARS",
      paidAt: "2026-07-24T00:00:00Z",
      note: null,
      status: "active",
      voidedAt: null,
      voidedByUserId: null,
      voidReason: null,
      createdAt: "2026-07-24T00:00:00Z",
      updatedAt: "2026-07-24T00:00:00Z",
    },
  ],
};

describe("PaymentsSection", () => {
  it("shows the current balance and settlement suggestion", () => {
    render(
      <PaymentsSection
        overview={overview}
        currentUserId="user-a"
        isAdmin={false}
        onRegister={vi.fn()}
        onVoid={vi.fn()}
      />,
    );
    expect(screen.getByText(/Te deben/)).not.toBeNull();
    expect(screen.getByText("Sugerencias").parentElement?.textContent).toContain("B paga");
  });
  it("only exposes void action to the payment creator or admin", () => {
    const onVoid = vi.fn();
    const { rerender } = render(
      <PaymentsSection
        overview={overview}
        currentUserId="user-a"
        isAdmin={false}
        onRegister={vi.fn()}
        onVoid={onVoid}
      />,
    );
    expect(screen.queryByText("Anular")).toBeNull();
    rerender(
      <PaymentsSection
        overview={overview}
        currentUserId="user-a"
        isAdmin
        onRegister={vi.fn()}
        onVoid={onVoid}
      />,
    );
    fireEvent.click(screen.getByText("Anular"));
    expect(onVoid).toHaveBeenCalledWith(overview.payments[0]);
  });
});
