// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { CreateGroupModal } from "@/features/groups/components/CreateGroupModal";
import { GroupCard } from "@/features/groups/components/GroupCard";

const group = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Amigos",
  memberCount: 2,
  createdAt: "2026-07-15T12:00:00Z",
  updatedAt: "2026-07-15T12:00:00Z",
};

describe("group components", () => {
  it("links each group card to its dedicated detail route", () => {
    render(<GroupCard group={group} />, { wrapper: MemoryRouter });

    expect(screen.getByRole("link", { name: /amigos/i }).getAttribute("href")).toBe(
      `/groups/${group.id}`,
    );
  });

  it("submits the modal form with the group name", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockResolvedValue(undefined);

    render(
      <CreateGroupModal
        error={null}
        isCreating={false}
        isOpen
        onClose={vi.fn()}
        onCreate={onCreate}
      />,
    );

    await user.type(screen.getByLabelText("Nombre"), "Amigos del barrio");
    await user.click(screen.getByRole("button", { name: "Crear grupo" }));

    expect(onCreate).toHaveBeenCalledWith("Amigos del barrio");
  });
});
