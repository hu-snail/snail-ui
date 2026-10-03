/**
 * AUI Platform Adapter (AUI-RUNTIME-001 / §18 / §84).
 *
 * Runtime MUST NOT depend on Vue / DOM / DOM directly. All host integration
 * goes through the `PlatformAdapter` interface. The actual implementations
 * live in @snui/vue-web (DOM) and @snui/uni (uni-app) — they bind to runtime
 * via `runtime.attachPlatform(adapter)`.
 *
 * Capabilities (AGENTS.md §84) are reported by the adapter and consumed by
 * component capabilities + UICapabilitySchema to skip / fallback unsupported
 * features per §85.
 */

export type PlatformId = 'web' | 'uni' | 'native' | 'unknown';

export interface PlatformCapabilities {
  readonly supports: Readonly<Record<string, boolean>>;
}

export interface PlatformAdapter {
  /** Stable platform identifier (used for capability lookups). */
  readonly id: PlatformId;
  /** Which platform features are supported. */
  readonly capabilities: PlatformCapabilities;
  /** Attach a hook called when the runtime starts. Returns a dispose fn. */
  onLifecycle?(phase: string, payload: unknown): void;
  /** Schedule a microtask for async work. */
  schedule?(fn: () => void): void;
  /** Current monotonic timestamp (Date.now fallback). */
  now?(): number;
  /** Optional AbortSignal that fires when the host tears down. */
  signal?: AbortSignal;
}