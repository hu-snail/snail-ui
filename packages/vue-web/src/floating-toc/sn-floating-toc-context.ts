/**
 * Shared context for the SnFloatingToc compound component
 * (AUI-WEB-NAV-010).
 *
 * The root owns open state, placement, timing and the section registry; the
 * four parts (Trigger / Bar / Content / Item) read it through `inject`. Per
 * AGENTS.md §14 the context type is internal — it is never exported from the
 * package entry, so its shape stays free to change.
 */

import type { ComputedRef, InjectionKey } from 'vue';

/** An entry observed by the floating TOC (bar + item share it). */
export interface SnFloatingTocSection {
  /** `href` of the section — the link target and the registry key. */
  href: string;
  /** Visible label shown in the expanded content panel. */
  title: string;
  /** One-line summary shown in the hover preview. */
  summary: string;
  /** Nesting depth, 1 = top level. Deeper levels render shorter bars. */
  level: number;
  /** Section element for offset measurement ({@link SnFloatingTocRoot} only). */
  element: HTMLElement | null;
  /** Scroll-to handler shared by the bar and the item. */
  activate: () => void;
  /** Id of the owning bar, used to look the active highlight up again. */
  id: symbol;
}

/** The hover preview shown when the pointer rests on a single bar. */
export interface SnFloatingTocPreview {
  /** Section label. */
  title: string;
  /** One-line summary; empty hides the summary line. */
  summary: string;
  /** Vertical centre of the hovered bar, relative to the root. */
  top: number;
}

export interface SnFloatingTocContext {
  /** Which side of the page the bars grow from. */
  placement: ComputedRef<'left' | 'right'>;
  /** Expanded state of the content panel. */
  isOpen: ComputedRef<boolean>;
  /** `href` of the section currently in view. */
  activeHref: ComputedRef<string | null>;
  /** Every observed section, in document order. */
  sections: ComputedRef<readonly SnFloatingTocSection[]>;
  /** Register a section; returns the unregister clean-up. */
  registerSection: (section: SnFloatingTocSection) => () => void;
  /** Flag a section as no longer attached (called on bar / item unmount). */
  detachSection: (id: symbol) => void;
  /** Walk to the previous / next section (`ArrowUp` / `ArrowDown`). */
  moveActive: (delta: 1 | -1) => void;
  /** Scroll a section into view and mark it active. */
  activateSection: (href: string) => void;
  /** Trigger hover / focus entry — schedules an open after `openDelay`. */
  requestOpen: () => void;
  /** Exit — schedules a close after `closeDelay`. */
  requestClose: () => void;
  /** Immediate open / close (press mode, Escape, item activation). */
  setOpen: (open: boolean) => void;
  /** Toggle immediately (keyboard `Enter` / `Space`). */
  toggleOpen: () => void;
  /**
   * Pointer activation on the trigger.
   *
   * `press` mode toggles; `hover` mode only opens, because the pointer has
   * already opened the panel on entry and a click there is a confirmation,
   * not a request to close.
   */
  triggerActivate: () => void;
  /** The bar currently under the pointer, or `null`. */
  preview: ComputedRef<SnFloatingTocPreview | null>;
  /** Show the hover preview for a bar. */
  showPreview: (preview: SnFloatingTocPreview) => void;
  /** Hide the hover preview. */
  hidePreview: () => void;
}

export const snFloatingTocInjectionKey: InjectionKey<SnFloatingTocContext> =
  Symbol('SnFloatingToc');
