import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ApiError, http } from "@/api/http";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("HTTP client", () => {
  it("attaches bearer without content-type on GET", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: "success", data: { ok: true } }), {
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await http.get("/health", { accessToken: "token" });

    const [, options] = fetchMock.mock.calls[0];
    const headers = options.headers as Headers;
    expect(options.method).toBe("GET");
    expect(headers.get("Authorization")).toBe("Bearer token");
    expect(headers.has("Content-Type")).toBe(false);
  });

  it("serializes bodies and validates a response schema", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ value: 2 }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await http.post(
      "/items",
      { name: "test" },
      { responseSchema: z.object({ value: z.number() }) },
    );

    const [, options] = fetchMock.mock.calls[0];
    expect(options.body).toBe('{"name":"test"}');
    expect((options.headers as Headers).get("Content-Type")).toBe("application/json");
    expect(result).toEqual({ value: 2 });
  });

  it("supports empty responses and DELETE", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(http.delete<void>("/items/1")).resolves.toBeUndefined();
    expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
  });

  it("normalizes API field errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            status: "error",
            message: "Validation failed",
            errors: [{ field: "name", message: "Required" }],
          }),
          { status: 400 },
        ),
      ),
    );

    await expect(http.get("/items")).rejects.toMatchObject({
      name: "ApiError",
      message: "Validation failed",
      statusCode: 400,
      errors: [{ field: "name", message: "Required" }],
    });
  });

  it("normalizes network, malformed JSON and schema errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await expect(http.get("/items")).rejects.toEqual(
      new ApiError("No se pudo conectar con el servidor."),
    );

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not-json", { status: 200 })));
    await expect(http.get("/items")).rejects.toMatchObject({ statusCode: 200 });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ value: "bad" }))),
    );
    await expect(
      http.get("/items", { responseSchema: z.object({ value: z.number() }) }),
    ).rejects.toMatchObject({
      name: "ApiError",
      message: "La API devolvio una respuesta invalida.",
    });
  });
});
