import type { ZodType } from "zod";
import { errorResponseSchema } from "../schemas/api.schemas";

export type ApiFieldError = {
  field?: string;
  message: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly errors?: ApiFieldError[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type RequestOptions<T> = Omit<RequestInit, "body" | "method"> & {
  accessToken?: string | null;
  responseSchema?: ZodType<T>;
};

type InternalRequestOptions<T> = RequestOptions<T> & {
  body?: BodyInit;
  method: "GET" | "POST" | "PATCH" | "DELETE";
};

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(
  path: string,
  options: InternalRequestOptions<T>,
): Promise<T> {
  const { accessToken, responseSchema, ...fetchOptions } = options;
  const headers = new Headers(options.headers);

  if (options.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response: Response;

  try {
    response = await fetch(`${apiUrl}${path}`, {
      ...fetchOptions,
      headers,
    });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor.");
  }

  const responseText = await response.text();
  let payload: unknown;

  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      const message = response.ok
        ? "La API devolvio una respuesta invalida."
        : "No se pudo completar la solicitud.";
      throw new ApiError(message, response.status);
    }
  }

  if (!response.ok) {
    const parsedError = errorResponseSchema.safeParse(payload);

    throw new ApiError(
      parsedError.success
        ? parsedError.data.message
        : "No se pudo completar la solicitud.",
      response.status,
      parsedError.success ? parsedError.data.errors : undefined,
    );
  }

  if (payload === undefined) return undefined as T;

  if (responseSchema) {
    const parsedResponse = responseSchema.safeParse(payload);

    if (!parsedResponse.success) {
      throw new ApiError("La API devolvio una respuesta invalida.", response.status);
    }

    return parsedResponse.data;
  }

  return payload as T;
}

export const http = {
  get: <T>(path: string, options: RequestOptions<T> = {}) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options: RequestOptions<T> = {}) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: body == null ? undefined : JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: unknown, options: RequestOptions<T> = {}) =>
    request<T>(path, {
      ...options,
      method: "PATCH",
      body: body == null ? undefined : JSON.stringify(body),
    }),
  delete: <T>(path: string, options: RequestOptions<T> = {}) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
