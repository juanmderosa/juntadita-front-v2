import { describe, expect, it } from "vitest";
import {
  generateEventOptionPreview,
  getGeneratorPresetRange,
  MAX_GENERATED_OPTIONS,
} from "@/features/events/lib/eventOptionGenerator.lib";
import type { EventOption } from "@/types/events";

const timeZone = "America/Buenos_Aires";

describe("event option generator", () => {
  it("generates date options for selected weekdays", () => {
    const preview = generateEventOptionPreview(
      {
        endDate: "2026-08-09",
        label: "",
        scheduleMode: "date",
        startDate: "2026-08-01",
        times: [],
        weekdays: [6, 0],
      },
      [],
      timeZone,
    );

    expect(preview.map((option) => option.input)).toEqual([
      { type: "date", label: null, startAt: "2026-08-01T03:00:00.000Z" },
      { type: "date", label: null, startAt: "2026-08-02T03:00:00.000Z" },
      { type: "date", label: null, startAt: "2026-08-08T03:00:00.000Z" },
      { type: "date", label: null, startAt: "2026-08-09T03:00:00.000Z" },
    ]);
  });

  it("generates datetime options for multiple sorted times", () => {
    const preview = generateEventOptionPreview(
      {
        endDate: "2026-08-01",
        label: "Cena",
        scheduleMode: "datetime",
        startDate: "2026-08-01",
        times: ["22:00", "21:00", "21:00"],
        weekdays: [6],
      },
      [],
      timeZone,
    );

    expect(preview.map((option) => option.input)).toEqual([
      {
        type: "datetime",
        label: "Cena",
        startAt: "2026-08-02T00:00:00.000Z",
      },
      {
        type: "datetime",
        label: "Cena",
        startAt: "2026-08-02T01:00:00.000Z",
      },
    ]);
  });

  it("applies calendar presets from the event timezone", () => {
    const now = new Date("2026-08-12T15:00:00.000Z");

    expect(getGeneratorPresetRange("this-week", timeZone, now)).toEqual({
      startDate: "2026-08-10",
      endDate: "2026-08-16",
    });
    expect(getGeneratorPresetRange("next-weekend", timeZone, now)).toEqual({
      startDate: "2026-08-22",
      endDate: "2026-08-23",
    });
    expect(getGeneratorPresetRange("this-month", timeZone, now)).toEqual({
      startDate: "2026-08-01",
      endDate: "2026-08-31",
    });
  });

  it("marks duplicates by normalized type, start and end", () => {
    const existingOptions = [
      {
        id: "option-id",
        eventId: "event-id",
        type: "datetime",
        label: "Otra etiqueta",
        startAt: "2026-08-02T00:00:00.000Z",
        endAt: null,
        createdAt: "2026-07-06T15:00:00Z",
        updatedAt: "2026-07-06T15:00:00Z",
      },
    ] as EventOption[];

    const preview = generateEventOptionPreview(
      {
        endDate: "2026-08-01",
        label: "Cena",
        scheduleMode: "datetime",
        startDate: "2026-08-01",
        times: ["21:00"],
        weekdays: [6],
      },
      existingOptions,
      timeZone,
    );

    expect(preview).toHaveLength(1);
    expect(preview[0].isDuplicate).toBe(true);
  });

  it("exposes the configured max for UI validation", () => {
    const preview = generateEventOptionPreview(
      {
        endDate: "2026-03-31",
        label: "",
        scheduleMode: "date",
        startDate: "2026-01-01",
        times: [],
        weekdays: [1, 2, 3, 4, 5, 6, 0],
      },
      [],
      timeZone,
    );

    expect(preview.length).toBeGreaterThan(MAX_GENERATED_OPTIONS);
  });
});
