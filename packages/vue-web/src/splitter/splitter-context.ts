/**
 * SnSplitter ↔ SnSplitterPanel contract.
 *
 * Mirrors the drawer-context.ts pattern: the container provides an API object
 * under a typed injection key; panels register during setup and receive their
 * percent size state back through the same context. `undefined` from `inject`
 * means the panel was rendered outside a splitter — it then degrades to a
 * static box (no divider, no sizing).
 */
import type { ComputedRef, InjectionKey } from 'vue'

export type SnSplitterDirection = 'horizontal' | 'vertical'

/** Payload of the splitter `resize` event (drag end / keyboard / dblclick). */
export interface SnSplitterResizeState {
  /** Percent size of the panel before the divider. */
  before: number
  /** Percent size of the panel after the divider. */
  after: number
  /** `before` formatted as a CSS percent string. */
  beforeSize: string
  /** `after` formatted as a CSS percent string. */
  afterSize: string
}

/**
 * Public props of SnSplitterPanel. Declared here so the container can read
 * live constraint values from the panel's reactive props via the handle.
 * Optional props carry `| undefined` so the reactive props object stays
 * assignable under `exactOptionalPropertyTypes`.
 */
export interface SnSplitterPanelPublicProps {
  /** Initial percent size. Numbers are percents; strings must be `"N%"`. */
  defaultSize?: number | string | undefined
  /** Lower resize bound, in percent. */
  minSize?: number | string | undefined
  /** Upper resize bound, in percent. */
  maxSize?: number | string | undefined
  /** Allow drag-to-collapse when the panel is pushed below `minSize`. */
  collapsible?: boolean | undefined
  /** Collapsed state — bind with `v-model:collapsed`. Collapsed size is 0. */
  collapsed?: boolean | undefined
}

/** @internal Container-side mirror of one registered panel. */
export interface SplitterPanelEntry {
  readonly id: number
  /** Current percent size (0 while collapsed). */
  size: number
  /** Collapsed mirror (kept in sync with the panel prop, idempotently). */
  collapsed: boolean
  readonly handle: SnSplitterPanelHandle
}

/** @internal What a panel hands to its splitter at registration time. */
export interface SnSplitterPanelHandle {
  /** The panel's reactive props object (live defaultSize / min / max / …). */
  props: SnSplitterPanelPublicProps
  /** Ask the panel to emit `update:collapsed` to its host. */
  emitCollapsed: (next: boolean) => void
}

/** Divider a11y metrics for `role="separator"`. */
export interface SnSplitterBoundaryAria {
  valueNow: number
  valueMin: number
  valueMax: number
}

/** What SnSplitter exposes to its descendant SnSplitterPanels. @internal */
export interface SnSplitterApi {
  direction: ComputedRef<SnSplitterDirection>
  isDisabled: ComputedRef<boolean>
  registerPanel: (handle: SnSplitterPanelHandle) => { id: number; unregister: () => void }
  getEntry: (id: number) => SplitterPanelEntry | undefined
  indexOfPanel: (id: number) => number
  onDividerPointerDown: (boundary: number, event: PointerEvent) => void
  onDividerKeydown: (boundary: number, event: KeyboardEvent) => void
  onDividerDblClick: (boundary: number) => void
  getBoundaryAria: (boundary: number) => SnSplitterBoundaryAria | null
}

export const SN_SPLITTER_INJECTION_KEY: InjectionKey<SnSplitterApi> = Symbol('sn-splitter-api')

/** Keyboard nudge per Arrow press, in percent of the container axis. */
export const SN_SPLITTER_KEYBOARD_STEP_PERCENT = 2

/**
 * Parse naive-style sizes: numbers are percents, strings must be `"N%"`.
 * Anything else (including `"100px"`) is unsupported and reported as unset.
 */
export function parsePercentSize(input: number | string | undefined | null): number | null {
  if (typeof input === 'number') return Number.isFinite(input) ? input : null
  if (typeof input === 'string') {
    const trimmed = input.trim()
    if (!trimmed.endsWith('%')) return null
    const parsed = Number.parseFloat(trimmed.slice(0, -1))
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

/** Round to two decimals so percent sizes stay stable across drags. */
export function round2(value: number): number {
  return Math.round(value * 100) / 100
}
