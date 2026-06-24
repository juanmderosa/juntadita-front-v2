export type ApiFieldError = {
  field?: string;
  message: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: ApiFieldError[],
  ) {
    super(message);
  }
}

type RequestOptions = RequestInit & {
  accessToken?: string | null;
};

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.accessToken) {
    headers.set("Authorization", `Bearer ${options.accessToken}`);
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers,
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? "No se pudo completar la solicitud.",
      response.status,
      payload?.errors,
    );
  }

  return payload as T;
}

export const http = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: body == null ? undefined : JSON.stringify(body),
    }),
};
