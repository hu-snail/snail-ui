/**
 * SnVideoPlayer — mini-window (小窗) composable.
 *
 * Benchmark: B 站's "小窗播放" — the player docks into a floating corner
 * window when the page scrolls it out of view (opt-in via
 * `miniOnScrollOut`), stays out via manual toggle, and restores itself when
 * scrolled back. The docked window is draggable within the viewport.
 *
 * All observers / listeners are registered on the client only and cleaned up
 * on unmount (AGENTS.md §41 / §42).
 */

import { onBeforeUnmount, ref, watch, type Ref } from 'vue';

/** Viewport margins kept around the docked window while dragging (px). */
const EDGE_MARGIN = 8;

export interface MiniWindowOptions {
  rootRef: Ref<HTMLElement | null>;
  /** Auto-dock feature enabled (`miniOnScrollOut`). */
  auto: () => boolean;
  /** Whether the player is producing content worth docking (playing). */
  canEnter: () => boolean;
  /** External kill switch (e.g. component disabled) — exits mini when false. */
  enabled?: () => boolean;
}

export interface MiniWindowState {
  isMini: Ref<boolean>;
  /** Drag offset in px (0,0 when not dragged). */
  offset: Ref<{ x: number; y: number }>;
  enterMini(): void;
  exitMini(): void;
  /** Grip pointerdown handler — starts a drag gesture. */
  onGripPointerDown(event: PointerEvent): void;
}

export function useMiniWindow(options: MiniWindowOptions): MiniWindowState {
  const isMini = ref(false);
  const offset = ref({ x: 0, y: 0 });
  /** true while the dock was entered by scrolling (auto-exit applies). */
  let autoDocked = false;
  /** User closed an auto-dock — stay closed until the next leave/enter cycle. */
  let autoDismissed = false;

  let observer: IntersectionObserver | null = null;
  let wasIntersecting = true;

  function enterMini(): void {
    isMini.value = true;
  }

  function exitMini(): void {
    isMini.value = false;
    offset.value = { x: 0, y: 0 };
    autoDocked = false;
  }

  function setupObserver(): void {
    if (observer || typeof IntersectionObserver === 'undefined') return;
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const intersecting = entry.isIntersecting;
        const previouslyVisible = wasIntersecting;
        wasIntersecting = intersecting;
        if (intersecting) {
          autoDismissed = false;
          if (autoDocked && isMini.value) exitMini();
          return;
        }
        if (
          !previouslyVisible ||
          autoDismissed ||
          !options.auto() ||
          !options.canEnter() ||
          isMini.value
        ) {
          return;
        }
        autoDocked = true;
        enterMini();
      },
      // A thin band so the dock happens as soon as the player starts leaving.
      { threshold: 0.25 },
    );
    const root = options.rootRef.value;
    if (root) observer.observe(root);
  }

  function teardownObserver(): void {
    observer?.disconnect();
    observer = null;
  }

  watch(
    options.rootRef,
    (root) => {
      if (typeof window === 'undefined') return;
      teardownObserver();
      if (root) setupObserver();
    },
    { immediate: true, flush: 'post' },
  );

  /* Drag (grip) — pointer events, listeners removed on gesture end + unmount. */

  let dragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let originX = 0;
  let originY = 0;

  function onPointerMove(event: PointerEvent): void {
    if (!dragging) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const nextX = originX + (event.clientX - dragStartX);
    const nextY = originY + (event.clientY - dragStartY);
    offset.value = {
      x: Math.min(Math.max(nextX, -width + 2 * EDGE_MARGIN), width - 2 * EDGE_MARGIN),
      y: Math.min(Math.max(nextY, -height + 2 * EDGE_MARGIN), height - 2 * EDGE_MARGIN),
    };
  }

  function onPointerUp(): void {
    dragging = false;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
  }

  function onGripPointerDown(event: PointerEvent): void {
    if (!isMini.value || typeof window === 'undefined') return;
    dragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    originX = offset.value.x;
    originY = offset.value.y;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  }

  onBeforeUnmount(() => {
    onPointerUp();
    teardownObserver();
  });

  return { isMini, offset, enterMini, exitMini, onGripPointerDown };
}
