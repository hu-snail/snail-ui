/**
 * alova request layer — the single place where transport concerns live.
 *
 * Wraps `createAlova` with:
 *   - Bearer-token injection from localStorage (`TOKEN_KEY`);
 *   - a `{ code, message, data }` envelope contract: code 0 resolves,
 *     anything else throws `ApiError` (stable numeric codes — the UI
 *     renders them through the `api.error.*` i18n namespace);
 *   - 401 handling: token cleared + `onUnauthorized` hook fired so the
 *     router layer can drop dynamic routes and bounce to /login;
 *   - @alova/mock as the transport with `alova/fetch` as the fall-through
 *     adapter — set `VITE_USE_MOCK=false` and point `baseURL` at a real
 *     backend to leave the template.
 */
import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import VueHook from 'alova/vue';
import { createAlovaMockAdapter } from '@alova/mock';
import type { RequestBody } from 'alova';
import { mockGroups } from '../mock';

/** Single source of truth for the persisted session token. */
export const TOKEN_KEY = 'admin_basic_token';

/** Success envelope code. */
export const CODE_OK = 0;
/** Session invalid — token cleared and user bounced to login. */
export const CODE_UNAUTHORIZED = 401;

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/** Structured request failure (mirrors AGENTS.md §28: code + message). */
export class ApiError extends Error {
  readonly code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

function isEnvelope(value: unknown): value is ApiResponse<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    typeof (value as { code: unknown }).code === 'number' &&
    'message' in value &&
    'data' in value
  );
}

/** Registered by the router guard; drops dynamic routes and redirects. */
type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// mockGroups is already a defineMock() wrapper (its `enable` flag follows
// VITE_USE_MOCK) — pass it through as-is. Unmatched URLs fall through to
// real fetch — flip VITE_USE_MOCK and the same api layer talks to a live
// server.
const mockAdapter = createAlovaMockAdapter([mockGroups], {
  delay: 200,
  httpAdapter: adapterFetch(),
});

export const http = createAlova({
  requestAdapter: mockAdapter,
  statesHook: VueHook,
  timeout: 10_000,
  beforeRequest(method) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token !== null) method.config.headers.Authorization = `Bearer ${token}`;
  },
  async responded(response) {
    if (response.status >= 400) {
      throw new ApiError(response.status, `HTTP ${response.status}`);
    }
    const body: unknown = await response.json();
    if (!isEnvelope(body)) {
      throw new ApiError(-1, 'Malformed response envelope');
    }
    if (body.code === CODE_OK) return body;
    if (body.code === CODE_UNAUTHORIZED) {
      clearToken();
      unauthorizedHandler?.();
    }
    throw new ApiError(body.code, body.message);
  },
});

/**
 * Render a thrown request failure in the UI: known envelope codes map to
 * localized messages (`api.error.<code>`), unknown ones keep the raw text.
 */
export function describeError(error: unknown, translate: (key: string) => string): string {
  if (error instanceof ApiError) {
    const key = `api.error.${error.code}`;
    const localized = translate(key);
    return localized === key ? error.message : localized;
  }
  return error instanceof Error ? error.message : String(error);
}

async function request<T>(method: Promise<ApiResponse<T>>): Promise<T> {
  return (await method).data;
}

/** GET returning the envelope's `data` payload. */
export function httpGet<T>(
  url: string,
  params?: Record<string, string | number | boolean>,
): Promise<T> {
  return request(http.Get<ApiResponse<T>>(url, { params: params ?? {} }));
}

/** POST returning the envelope's `data` payload. */
export function httpPost<T>(url: string, data?: RequestBody): Promise<T> {
  return request(http.Post<ApiResponse<T>>(url, data));
}
