import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatDateTime,
  isoToLocalDateTime,
  localDateTimeToIso,
} from "@/lib/dates";
import { formatMoney, parseMoneyToCents } from "@/lib/money";
import {
  amountInCentsSchema,
  currencyCodeSchema,
  normalizedEmailSchema,
  paginationQuerySchema,
  timeZoneSchema,
} from "@/schemas/common.schemas";

describe("shared frontend helpers", () => {
  it("formats dates with default and custom timezones", () => {
    const value = "2026-07-06T15:30:00Z";

    expect(formatDate(value)).toContain("6 jul 2026");
    expect(formatDateTime(value)).toContain("12:30");
    expect(formatDateTime(value, { timeZone: "UTC" })).toMatch(/(?:15|3):30/);
  });

  it("converts datetime-local using Buenos Aires instead of device timezone", () => {
    expect(localDateTimeToIso("2026-07-06T12:30")).toBe(
      "2026-07-06T15:30:00.000Z",
    );
    expect(isoToLocalDateTime("2026-07-06T15:30:00Z")).toBe(
      "2026-07-06T12:30",
    );
  });

  it("parses and formats money in cents", () => {
    expect(parseMoneyToCents("12,34")).toBe(1234);
    expect(formatMoney(1234)).toContain("12,34");
    expect(formatMoney(1234, { currencyCode: "USD", locale: "en-US" })).toBe(
      "$12.34",
    );
  });

  it.each(["-1", "1.234", "text"])("rejects invalid money %s", (value) => {
    expect(() => parseMoneyToCents(value)).toThrow();
  });

  it("validates and normalizes shared input", () => {
    expect(normalizedEmailSchema.parse(" USER@EXAMPLE.COM ")).toBe(
      "user@example.com",
    );
    expect(currencyCodeSchema.parse(" ars ")).toBe("ARS");
    expect(timeZoneSchema.safeParse("America/Buenos_Aires").success).toBe(true);
    expect(timeZoneSchema.safeParse("Invalid/Zone").success).toBe(false);
    expect(amountInCentsSchema.safeParse(100).success).toBe(true);
    expect(amountInCentsSchema.safeParse(1.5).success).toBe(false);
    expect(paginationQuerySchema.parse({})).toEqual({ page: 1, limit: 20 });
    expect(paginationQuerySchema.safeParse({ limit: 101 }).success).toBe(false);
  });
});
