/**
 * Measurement + scroll helpers for SnFloatingToc (AUI-WEB-NAV-010).
 *
 * Pure functions only, so the scroll logic is testable without mounting a
 * component and the root stays under the 400-line file budget (AGENTS.md
 * §105).
 */

/* -------------------------------------------------------------------------
 * Scroll container detection (borrowed shape from SnBackTop)
 * ---------------------------------------------------------------------- */

/**
 * Whether the node is a `Document`.
 *
 * `nodeName` rather than `instanceof Document`: the component can be mounted
 * in another realm (iframe, test DOM) where the realm's `Document` fails an
 * `instanceof` check against the host constructor (same guard as SnBackTop).
 */
export function isDocumentLike(el: unknown): el is Document {
  return (el as Node | null)?.nodeName === '#document';
}

function isScrollable(el: HTMLElement): boolean {
  const { overflowY } = window.getComputedStyle(el);
  return /(auto|scroll|overlay)/.test(overflowY);
}

/**
 * Resolve the container the page sections scroll inside.
 *
 * An explicit `scrollContainer` wins (string selector or element). Otherwise
 * the sections' nearest common scrollable ancestor is used, and the document
 * is the final fallback — a floating TOC must attach to the page by default,
 * so it cannot rely on a placeholder element the way SnBackTop does.
 */
export function resolveScrollContainer(
  sections: readonly { element: HTMLElement | null }[],
  explicit: string | HTMLElement | undefined,
): HTMLElement | Document {
  if (typeof explicit === 'string') {
    return document.querySelector<HTMLElement>(explicit) ?? document;
  }
  if (explicit) return explicit;

  const first = sections.find((section) => section.element)?.element;
  let node: HTMLElement | null = first?.parentElement ?? null;
  while (node) {
    if (isScrollable(node)) return node;
    node = node.parentElement;
  }
  return document;
}

/** Current vertical scroll offset of the container. */
export function readScrollTop(container: HTMLElement | Document): number {
  return isDocumentLike(container)
    ? window.scrollY || document.documentElement.scrollTop
    : container.scrollTop;
}

/* -------------------------------------------------------------------------
 * Active section calculation
 * ---------------------------------------------------------------------- */

export interface SectionOffset {
  href: string;
  top: number;
  height: number;
}

/**
 * Vertical offset + height of `el` relative to the top of `container`.
 *
 * A document container contributes a zero baseline; an element container
 * subtracts its own rect top so nested scrollers are measured in the same
 * space (mirrors SnAnchor's `getOffset`).
 */
export function measureOffset(
  el: HTMLElement,
  container: HTMLElement | Document,
): { top: number; height: number } {
  const rect = el.getBoundingClientRect();
  // `container` is narrowed by `isDocumentLike` before this point; when it is
  // an element we need its own rect top.
  const containerTop = isDocumentLike(container) ? 0 : container.getBoundingClientRect().top;
  return { top: rect.top - containerTop, height: rect.height };
}

/**
 * The `href` of the section currently in view.
 *
 * Rule: the active section is the last one whose viewport top has reached the
 * `bound` line; when nothing has reached it yet, the first section wins so the
 * indicator is never blank.
 *
 * `bound` follows SnAnchor's convention — the distance in px below the
 * container top at which a section counts as active (`0` = the viewport top
 * exactly). A positive value therefore *delays* the switch, which is what
 * keeps this TOC and a same-page SnAnchor in agreement.
 *
 * `offsets` must be in document order.
 */
export function findActiveHref(
  offsets: readonly SectionOffset[],
  currentScrollTop: number,
  bound: number,
): string | null {
  const [first] = offsets;
  if (!first) return null;

  // Sections arrive in document order. A section is "active" once its top has
  // passed the bound line, i.e. its viewport position (`top - scrollTop`) is
  // at or above `bound`. `bound` is measured from the container top (same
  // convention as SnAnchor): 0 is the viewport top, a positive value moves the
  // line down the page (switches happen later), a negative value moves it
  // above the viewport (switches happen earlier).
  let active = first.href;
  for (const offset of offsets) {
    if (offset.top - currentScrollTop > bound) break;
    active = offset.href;
  }
  return active;
}

/* -------------------------------------------------------------------------
 * Navigation
 * ---------------------------------------------------------------------- */

/** Id of the element an `href` fragment points at (`'#intro'` → `'intro'`). */
export function hrefToId(href: string): string {
  return href.startsWith('#') ? decodeURIComponent(href.slice(1)) : href;
}

/**
 * Scroll the section referenced by `href` into view.
 *
 * `prefers-reduced-motion: reduce` disables the smooth animation, matching
 * the library's a11y policy (SnBackTop does the same).
 */
export function scrollToSection(href: string, container: HTMLElement | Document): void {
  const id = hrefToId(href);
  if (!id) return;

  const target = document.getElementById(id);
  if (!target) return;

  const behavior: ScrollBehavior = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth';

  if (isDocumentLike(container)) {
    window.scrollTo({
      top: target.getBoundingClientRect().top + readScrollTop(container),
      behavior,
    });
    return;
  }
  container.scrollTo({
    top: container.scrollTop + measureOffset(target, container).top,
    behavior,
  });
}

/**
 * Clamp a nesting depth to the CSS layer budget.
 *
 * Deeper levels only shorten the bar; the stylesheet stops shrinking past 3
 * (`--floating-toc-bar-level-step` would make level 4+ invisible), so the
 * attribute is clamped rather than the caller's value rejected.
 */
export function clampLevel(level: number | undefined): number {
  if (level === undefined || !Number.isFinite(level)) return 1;
  return Math.min(3, Math.max(1, Math.round(level)));
}
