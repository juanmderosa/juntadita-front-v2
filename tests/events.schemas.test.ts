import { describe, expect, it, vi } from "vitest";
import {
  editEventFormSchema,
  eventFormSchema,
} from "../src/features/events/schemas/events.schemas";

describe("event form schemas", () => {
  it("requires a future poll close", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-06T15:00:00Z"));

    expect(
      eventFormSchema.safeParse({
        type: "poll",
        title: "Cena",
        description: "",
        votingClosesAt: "2026-07-06T13:00",
        fixedStartAt: "",
        fixedEndAt: "",
      }).success,
    ).toBe(true);
    expect(
      eventFormSchema.safeParse({
        type: "poll",
        title: "Cena",
        description: "",
        votingClosesAt: "2026-07-06T11:00",
        fixedStartAt: "",
        fixedEndAt: "",
      }).success,
    ).toBe(false);

    vi.useRealTimers();
  });

  it("validates fixed range and editing limits", () => {
    expect(
      eventFormSchema.safeParse({
        type: "fixed",
        title: "Asado",
        description: "",
        votingClosesAt: "",
        fixedStartAt: "2026-08-01T20:00",
        fixedEndAt: "2026-08-01T19:00",
      }).success,
    ).toBe(false);
    expect(
      editEventFormSchema.safeParse({ title: "", description: "" }).success,
    ).toBe(false);
  });
});
