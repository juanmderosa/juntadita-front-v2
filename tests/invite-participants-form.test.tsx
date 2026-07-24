// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach as afterEachVitest, describe, expect, it, vi } from "vitest";
import { InviteParticipantsForm } from "@/features/events/components/detail/InviteParticipantsForm";

const group = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Amigos",
  memberCount: 3,
  createdAt: "2026-07-15T12:00:00Z",
  updatedAt: "2026-07-15T12:00:00Z",
};

afterEachVitest(() => cleanup());

describe("invite participants form", () => {
  it("submits selected groups together with manual emails", async () => {
    const user = userEvent.setup();
    const inviteParticipants = vi.fn().mockResolvedValue({ participants: [], emails: [] });
    render(
      <InviteParticipantsForm
        groups={[group]}
        inviteParticipants={inviteParticipants}
        isInviting={false}
      />,
    );

    await user.click(screen.getByRole("checkbox"));
    await user.type(screen.getByLabelText("Emails"), "ana@example.com");
    await user.click(screen.getByRole("button", { name: "Enviar invitaciones" }));

    expect(inviteParticipants).toHaveBeenCalledWith({
      emails: ["ana@example.com"],
      groupIds: [group.id],
    });
  });

  it("allows a group-only invitation", async () => {
    const user = userEvent.setup();
    const inviteParticipants = vi.fn().mockResolvedValue({ participants: [], emails: [] });
    render(
      <InviteParticipantsForm
        groups={[group]}
        inviteParticipants={inviteParticipants}
        isInviting={false}
      />,
    );

    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Enviar invitaciones" }));

    expect(inviteParticipants).toHaveBeenCalledWith({
      emails: [],
      groupIds: [group.id],
    });
  });
});
