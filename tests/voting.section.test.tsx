// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { VotingSection } from "@/features/events/components/detail/VotingSection";

const voting = {
  isOpen: true,
  votingClosesAt: "2026-08-01T23:00:00Z",
  eligibleParticipants: 3,
  selectedOptionIds: ["550e8400-e29b-41d4-a716-446655440010"],
  options: [
    {
      id: "550e8400-e29b-41d4-a716-446655440010",
      eventId: "550e8400-e29b-41d4-a716-446655440000",
      type: "date" as const,
      label: "Sábado 1",
      startAt: "2026-08-01T03:00:00Z",
      endAt: null,
      createdAt: "2026-07-01T03:00:00Z",
      updatedAt: "2026-07-01T03:00:00Z",
      votesCount: 2,
      availabilityPercent: 67,
    },
  ],
  result: null,
  tiedOptionIds: [],
};

describe("VotingSection", () => {
  it("shows partial results and delegates option selection and saving", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onSave = vi.fn();

    render(
      <VotingSection
        canManage={false}
        cancelTieResolution={vi.fn()}
        confirmTieResolution={vi.fn().mockResolvedValue(undefined)}
        error={null}
        isLoading={false}
        isResolvingTie={false}
        isSaving={false}
        onRequestTieResolution={vi.fn()}
        onSave={onSave}
        onToggle={onToggle}
        pendingTieOptionId={null}
        resolveTieError={null}
        selectedOptionIds={voting.selectedOptionIds}
        timeZone="America/Buenos_Aires"
        voting={voting}
      />,
    );

    expect(screen.getByText("2 personas (67%)")).toBeTruthy();
    expect(screen.getByText("Seleccionada")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /sábado 1/i }));
    await user.click(screen.getByRole("button", { name: "Guardar mi voto" }));

    expect(onToggle).toHaveBeenCalledWith(voting.options[0].id);
    expect(onSave).toHaveBeenCalledOnce();
  });

  it("lets an admin choose and confirm an option when the result is tied", async () => {
    const user = userEvent.setup();
    const onRequestTieResolution = vi.fn();
    const confirmTieResolution = vi.fn().mockResolvedValue(undefined);
    const tiedVoting = {
      ...voting,
      isOpen: false,
      result: {
        status: "tie_pending" as const,
        winningOptionId: null,
        totalVotes: 4,
        decidedBy: "system" as const,
        decidedAt: "2026-08-02T00:00:00Z",
      },
      tiedOptionIds: [voting.options[0].id],
    };

    const { rerender } = render(
      <VotingSection
        canManage
        cancelTieResolution={vi.fn()}
        confirmTieResolution={confirmTieResolution}
        error={null}
        isLoading={false}
        isResolvingTie={false}
        isSaving={false}
        onRequestTieResolution={onRequestTieResolution}
        onSave={vi.fn()}
        onToggle={vi.fn()}
        pendingTieOptionId={null}
        resolveTieError={null}
        selectedOptionIds={[]}
        timeZone="America/Buenos_Aires"
        voting={tiedVoting}
      />,
    );

    expect(screen.getByText("Hay un empate entre las opciones más votadas.")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Elegir Sábado 1" }));
    expect(onRequestTieResolution).toHaveBeenCalledWith(voting.options[0].id);

    rerender(
      <VotingSection
        canManage
        cancelTieResolution={vi.fn()}
        confirmTieResolution={confirmTieResolution}
        error={null}
        isLoading={false}
        isResolvingTie={false}
        isSaving={false}
        onRequestTieResolution={onRequestTieResolution}
        onSave={vi.fn()}
        onToggle={vi.fn()}
        pendingTieOptionId={voting.options[0].id}
        resolveTieError={null}
        selectedOptionIds={[]}
        timeZone="America/Buenos_Aires"
        voting={tiedVoting}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Confirmar resultado" }));

    expect(confirmTieResolution).toHaveBeenCalledOnce();
  });
});
