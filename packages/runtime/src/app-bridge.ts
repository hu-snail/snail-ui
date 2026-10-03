/**
 * AUI AppBridge (AUI-ACTION-003).
 *
 * Per AGENTS.md §60 + AUI-WBS-v1.0.md §19, AppBridge is the Host Capability
 * Boundary. It exposes Router / Storage / Notify / Analytics / Events / Abort
 * to the runtime without leaking business services.
 *
 * Each capability is a thin protocol — implementations live in the host
 * application (or default no-op stubs for unit tests). The Runtime MUST NOT
 * depend on any concrete AppBridge implementation.
 */

/** Router contract — navigate / back / replace. */
export interface RouterCapability {
  push(path: string, query?: Readonly<Record<string, unknown>>): Promise<void>;
  replace(path: string, query?: Readonly<Record<string, unknown>>): Promise<void>;
  back(): Promise<void>;
  current(): { readonly path: string; readonly query: Readonly<Record<string, unknown>> };
}

/** Storage contract — typed key/value with namespacing. */
export interface StorageCapability {
  get<T = unknown>(key: string): Promise<T | null>;
  set<T = unknown>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

/** Notify contract — toast / dialog. */
export type NotifyLevel = 'info' | 'success' | 'warning' | 'error';
export interface NotifyCapability {
  toast(message: string, opts?: { readonly level?: NotifyLevel; readonly durationMs?: number }): void;
  dialog(input: {
    readonly title?: string;
    readonly message: string;
    readonly confirmLabel?: string;
    readonly cancelLabel?: string;
  }): Promise<boolean>;
}

/** Analytics contract. */
export interface AnalyticsCapability {
  track(event: string, props?: Readonly<Record<string, unknown>>): void;
  identify(userId: string, traits?: Readonly<Record<string, unknown>>): void;
}

/** Host-level event subscription. */
export interface EventCapability {
  on(event: string, handler: (payload: unknown) => void): () => void;
  emit(event: string, payload?: unknown): void;
}

/** The complete AppBridge surface. All capabilities are optional; missing
 * capabilities are reported via `capabilities` for §84 Capability / Fallback. */
export interface AppBridge {
  readonly router?: RouterCapability;
  readonly storage?: StorageCapability;
  readonly notify?: NotifyCapability;
  readonly analytics?: AnalyticsCapability;
  readonly event?: EventCapability;
  /** Host abort signal — fires when the host tears the app down. */
  readonly abortSignal?: AbortSignal;
}

/** Structural peer of AppBridge used by ActionContext.bridge so that callers
 * can supply any subset (e.g. tests that pass only `notify`). */
export interface AppBridgeLike {
  readonly router?: RouterCapability;
  readonly storage?: StorageCapability;
  readonly notify?: NotifyCapability;
  readonly analytics?: AnalyticsCapability;
  readonly event?: EventCapability;
  readonly abortSignal?: AbortSignal;
}

/** Which capabilities the bridge provides. Stable enum tag for §84. */
export type AppBridgeCapability = 'router' | 'storage' | 'notify' | 'analytics' | 'event';

export function listCapabilities(bridge: AppBridge): readonly AppBridgeCapability[] {
  const out: AppBridgeCapability[] = [];
  if (bridge.router) out.push('router');
  if (bridge.storage) out.push('storage');
  if (bridge.notify) out.push('notify');
  if (bridge.analytics) out.push('analytics');
  if (bridge.event) out.push('event');
  return out;
}

/** A no-op AppBridge — useful in unit tests + browser-side storybooks. */
export function createNoopAppBridge(): AppBridge {
  const noopAsync = (): Promise<void> => Promise.resolve();
  const router: RouterCapability = {
    push: noopAsync,
    replace: noopAsync,
    back: noopAsync,
    current: () => ({ path: '/', query: {} }),
  };
  const storage: StorageCapability = {
    get: async () => null,
    set: noopAsync,
    remove: noopAsync,
    clear: noopAsync,
  };
  const notify: NotifyCapability = {
    toast: () => {},
    dialog: async () => false,
  };
  const analytics: AnalyticsCapability = {
    track: () => {},
    identify: () => {},
  };
  const event: EventCapability = {
    on: () => () => {},
    emit: () => {},
  };
  return { router, storage, notify, analytics, event };
}