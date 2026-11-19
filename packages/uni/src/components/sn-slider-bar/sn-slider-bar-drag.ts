/**
 * sn-slider-bar — pointer drag core (shared by the uni and uni-app x artifacts).
 *
 * The component keeps every value rule; this module only answers three
 * questions: *did the pointer grab something*, *where is it now*, and *how far
 * did it travel*. Splitting it out is what makes the gesture smooth:
 *
 * 1. **The track box is measured once per gesture.** `getBoundingClientRect()`
 *    per `touchmove` forces a style+layout flush at frame rate — the single
 *    biggest source of a slider that "拖起来发涩". The box cannot move
 *    relative to the viewport mid-gesture, so one read is enough (the SFC
 *    re-measures on mount, on `variant` / `size` change and on press).
 *
 * 2. **The anchor is the knob's own position, not the finger.** A grab stores
 *    the knob percent and the pointer ratio at press time, every move applies
 *    the *delta* — so the thumb travels exactly with the finger instead of
 *    snapping to it on the first move. A press on the track is the opposite
 *    case: the anchor is the press point, so the value jumps there once and
 *    then follows 1:1.
 *
 * 3. **Moves are coalesced to one commit per animation frame.** A 120 Hz
 *    trackpad or a burst of coalesced touch events cannot outrun the renderer;
 *    the last position of the frame wins.
 *
 * 4. **Desktop H5 gets a real mouse drag.** `mousedown` is taken on `document`
 *    and the press is claimed by *geometry* (`trackRect`), not by an element
 *    reference: refs on `<view>` resolve to a component instance on uni H5 and
 *    to a `UniElement` on uni-app x H5, so `instanceof HTMLElement` silently
 *    failed and left desktop with a slider you could not drag at all. The
 *    cached track box is the one thing every runtime can hand over.
 *
 * Cross-platform notes: `touchstart` / `touchmove` / `touchend` are bound by the
 * SFC on the track, so mini-programs and App need nothing from this module
 * beyond the shared core. `bindMouse` is a browser-only branch — it bails out
 * when `document` is missing, and the uni-app x patches gate its DOM listeners
 * behind `#ifdef H5` (ADR-0004).
 */

/** One frame at 60 Hz — fallback cadence for hosts without `requestAnimationFrame`. */
const FRAME_MS = 16;

/**
 * A `mousedown` this soon after a touch is the browser's synthetic mouse event
 * for the same gesture, not a new drag.
 */
const MOUSE_SUPPRESS_MS = 700;

/** Track box in client coordinates. */
export interface SliderBarRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Per-instance DOM id for the track.
 *
 * Every instance needs its own: the desktop mouse path claims a press by
 * hit-testing its own box, and `createSelectorQuery` scopes to an id selector.
 * The counter lives at module scope, not in the component, so instances cannot
 * collide (a `let` inside `<script setup>` would restart at 1 every time).
 */
let trackSeq = 0;

export function nextTrackDomId(): string {
  trackSeq += 1;
  return `sn-slider-bar-track-${trackSeq}`;
}

export interface SliderBarDragOptions {
  /** True while the control must not react (disabled / read-only). */
  isDisabled: () => boolean;
  /** `column` reads the vertical axis, bottom → top. */
  isVertical: () => boolean;
  /** Knob position as a percent of the track (0..100). */
  knobPercentOf: (index: number) => number;
  /** Knob closest to `ratio` (0..1) — the one a track press grabs. */
  nearest: (ratio: number) => number;
  /**
   * Fresh track box, read on demand (desktop mouse press only — one read per
   * gesture, never per move). Hosts that cannot measure return `null`.
   */
  trackRect?: () => SliderBarRect | null;
  /** H5 only: this component's own track node, when the host can resolve one. */
  trackNode?: () => unknown;
  /**
   * Narrow a measured track box to the *value axis*.
   *
   * The thumb is not a point: its centre only travels between half a knob and
   * width − half a knob, so the host hands over the inset box here. Kept as a
   * transform (rather than baked into the callers) so the mouse hit test can
   * still claim a press on the very ends of the bar.
   */
  valueRect?: (box: SliderBarRect) => SliderBarRect;
  /** A gesture took hold of `index` (pressed state / bubble). */
  onGrab: (index: number) => void;
  /** Pointer moved: `ratio` is 0..1 along the value axis, already clamped. */
  onMove: (index: number, ratio: number) => void;
  /** Released — `ratio` is the last pointer position, `null` when cancelled. */
  onSettle: (index: number, ratio: number | null) => void;
  /** Clock override (tests). */
  now?: () => number;
}

export interface SliderBarDragApi {
  /** Press on the track: jump the nearest knob to the pointer, then drag it. */
  startFromTrack: (event: unknown, rect: SliderBarRect | null) => void;
  /** Press on a knob: grab it where it is (no jump). */
  startFromKnob: (event: unknown, index: number, rect: SliderBarRect | null) => void;
  /** Follow a running gesture. */
  move: (event: unknown) => void;
  /** Release a running gesture. */
  end: (event: unknown) => void;
  /** Abort a running gesture without settling. */
  cancel: () => void;
  /** Desktop H5 only — no-op on every other host. Returns a disposer. */
  bindMouse: (root?: unknown) => () => void;
  /** Index currently held, or `null`. */
  draggedIndex: () => number | null;
}

/** Touch / mouse payloads as handed over by uni (H5, MP) and the DOM. */
type PointerLike = { clientX?: number; clientY?: number; pageX?: number; pageY?: number };
type UniEventLike = {
  touches?: ArrayLike<PointerLike>;
  changedTouches?: ArrayLike<PointerLike>;
  detail?: { x?: number; y?: number } | number;
  clientX?: number;
  clientY?: number;
};

function clamp01(value: number): number {
  if (!(value > 0)) return 0;
  return value > 1 ? 1 : value;
}

/**
 * Read the pointer position out of a uni event.
 *
 * Order matters: `touches` first (a running gesture), then the raw client
 * fields a DOM `MouseEvent` carries, then uni's `detail.x/y` — mini-programs
 * report page coordinates there, which is the best effort left.
 *
 * `clientX` is preferred inside a touch too: the cached track box is
 * viewport-relative, so a page-coordinate (`pageX`) reading would drift by the
 * scroll offset. It stays as a last resort for hosts that expose nothing else.
 */
function pointOf(event: unknown): { x: number; y: number } | null {
  const e = event as UniEventLike | null;
  if (!e) return null;
  const list = e.touches && e.touches.length > 0 ? e.touches : e.changedTouches;
  const touch = list && list.length > 0 ? list[0] : undefined;
  if (touch && typeof touch.clientX === 'number' && typeof touch.clientY === 'number') {
    return { x: touch.clientX, y: touch.clientY };
  }
  if (typeof e.clientX === 'number' && typeof e.clientY === 'number') {
    return { x: e.clientX, y: e.clientY };
  }
  if (touch && typeof touch.pageX === 'number' && typeof touch.pageY === 'number') {
    return { x: touch.pageX, y: touch.pageY };
  }
  if (e.detail && typeof e.detail === 'object') {
    const { x, y } = e.detail;
    if (typeof x === 'number' && typeof y === 'number') return { x, y };
  }
  return null;
}

/**
 * Schedule one animation frame. Resolved per call (not at module load) so a
 * host that installs `requestAnimationFrame` later still gets the fast path,
 * and so tests can drive the frame queue themselves.
 */
function nextFrame(cb: () => void): number {
  return typeof requestAnimationFrame === 'function'
    ? requestAnimationFrame(() => cb())
    : (setTimeout(cb, FRAME_MS) as unknown as number);
}

function dropFrame(id: number): void {
  if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(id);
  else clearTimeout(id as unknown as ReturnType<typeof setTimeout>);
}

export function createSliderBarDrag(options: SliderBarDragOptions): SliderBarDragApi {
  /** Index held by the running gesture; `null` at rest. */
  let dragIndex: number | null = null;
  /** Track box for the running gesture — read once, never per move. */
  let rect: SliderBarRect | null = null;

  /** Store a measured box as the value axis (the host may inset it). */
  function useBox(box: SliderBarRect | null): void {
    rect = box && options.valueRect ? options.valueRect(box) : box;
  }
  /** Pointer ratio at grab time. */
  let anchorRatio = 0;
  /** Knob percent at grab time — the value the delta is applied to. */
  let anchorPercent = 0;
  /** Latest ratio waiting for the next frame. */
  let queued: number | null = null;
  let frameId = 0;
  let lastTouchAt = 0;
  let releaseFollowers: (() => void) | null = null;

  const clock = (): number => (options.now ? options.now() : Date.now());

  /** Pointer position (0..1) along the value axis, or `null` without a box. */
  function ratioOf(point: { x: number; y: number }): number | null {
    if (!rect) return null;
    const vertical = options.isVertical();
    const size = vertical ? rect.height : rect.width;
    if (!(size > 0)) return null;
    const offset = vertical ? rect.top + rect.height - point.y : point.x - rect.left;
    return offset / size;
  }

  /** Apply the grab anchor to a raw pointer ratio. */
  function valueRatioOf(pointerRatio: number): number {
    return clamp01(anchorPercent / 100 + (pointerRatio - anchorRatio));
  }

  function commit(ratio: number): void {
    if (dragIndex === null) return;
    options.onMove(dragIndex, ratio);
  }

  function flush(): void {
    if (frameId !== 0) {
      dropFrame(frameId);
      frameId = 0;
    }
    const ratio = queued;
    queued = null;
    if (ratio !== null) commit(ratio);
  }

  /** Coalesce to one commit per frame; the last position of the frame wins. */
  function schedule(): void {
    if (frameId !== 0) return;
    frameId = nextFrame(() => {
      frameId = 0;
      const ratio = queued;
      queued = null;
      if (ratio !== null) commit(ratio);
    });
  }

  function begin(index: number, pointerRatio: number, jump: boolean): void {
    // A press while a drag is still open takes over: a lost `touchend` (finger
    // released outside the window, mini-program gesture cancelled by the host)
    // must never wedge the control into "nothing responds any more".
    dragIndex = index;
    anchorRatio = pointerRatio;
    anchorPercent = jump ? pointerRatio * 100 : clamp01(options.knobPercentOf(index) / 100) * 100;
    queued = null;
    options.onGrab(index);
    // A track press *is* the new value — commit it right away so the thumb
    // lands under the finger instead of travelling there on the next frame.
    if (jump) commit(clamp01(anchorPercent / 100));
  }

  function startFromTrack(event: unknown, box: SliderBarRect | null): void {
    if (options.isDisabled()) return;
    const point = pointOf(event);
    if (!point) return;
    useBox(box);
    const ratio = ratioOf(point);
    if (ratio === null) return;
    lastTouchAt = clock();
    begin(options.nearest(clamp01(ratio)), clamp01(ratio), true);
  }

  function startFromKnob(event: unknown, index: number, box: SliderBarRect | null): void {
    if (options.isDisabled()) return;
    const point = pointOf(event);
    if (!point) return;
    useBox(box);
    const ratio = ratioOf(point);
    if (ratio === null) return;
    lastTouchAt = clock();
    begin(index, clamp01(ratio), false);
  }

  function move(event: unknown): void {
    if (dragIndex === null) return;
    const point = pointOf(event);
    if (!point) return;
    const ratio = ratioOf(point);
    if (ratio === null) return;
    queued = valueRatioOf(ratio);
    schedule();
  }

  function end(event: unknown): void {
    if (dragIndex === null) return;
    const point = pointOf(event);
    if (point) {
      const ratio = ratioOf(point);
      if (ratio !== null) queued = valueRatioOf(ratio);
    }
    flush();
    const index = dragIndex;
    dragIndex = null;
    rect = null;
    options.onSettle(index, null);
  }

  function cancel(): void {
    if (dragIndex === null) return;
    if (frameId !== 0) {
      dropFrame(frameId);
      frameId = 0;
    }
    queued = null;
    const index = dragIndex;
    dragIndex = null;
    rect = null;
    releaseFollowers?.();
    options.onSettle(index, null);
  }

  /* ── Desktop H5: mouse drag (additive) ─────────────────────────────────── */

  /** Horizontal/vertical slack around the track: knobs overhang the bar. */
  const HIT_SLOP = 12;

  function isElement(value: unknown): value is Element {
    return typeof Element !== 'undefined' && value instanceof Element;
  }

  function boxOf(node: Element): SliderBarRect | null {
    const box = node.getBoundingClientRect();
    if (!(box.width > 0) && !(box.height > 0)) return null;
    return { left: box.left, top: box.top, width: box.width, height: box.height };
  }

  function inside(box: SliderBarRect, x: number, y: number): boolean {
    return (
      x >= box.left - HIT_SLOP &&
      x <= box.left + box.width + HIT_SLOP &&
      y >= box.top - HIT_SLOP &&
      y <= box.top + box.height + HIT_SLOP
    );
  }

  function knobIndexOf(track: Element, knob: Element): number {
    const knobs = track.querySelectorAll('.sn-slider-bar__knob');
    for (let i = 0; i < knobs.length; i += 1) {
      if (knobs[i] === knob) return i;
    }
    return options.nearest(0);
  }

  /** This instance's own track node, when the host can resolve one. */
  function ownTrack(fallback: unknown): Element | null {
    const fromOption = options.trackNode?.();
    if (isElement(fromOption)) return fromOption;
    const unwrapped = (fallback as { $el?: unknown } | null)?.$el ?? fallback;
    return isElement(unwrapped) ? unwrapped : null;
  }

  function bindMouse(root?: unknown): () => void {
    // Browser hosts only — mini-programs have no `document`, and the App
    // runtime renders no DOM at all.
    if (typeof document === 'undefined') return () => {};
    const host = root as HTMLElement | null;

    const onMouseDown = (event: MouseEvent): void => {
      if (event.button !== 0) return;
      if (options.isDisabled() || dragIndex !== null) return;
      // The mouse events synthesised after a touch belong to that gesture.
      if (clock() - lastTouchAt < MOUSE_SUPPRESS_MS) return;
      const track = ownTrack(host);
      // Ownership by geometry: refs are unreliable across runtimes, but every
      // instance owns a disjoint rectangle, so the hit test is enough.
      const box = (track ? boxOf(track) : null) ?? options.trackRect?.() ?? null;
      if (!box) return;
      const point = { x: event.clientX, y: event.clientY };
      if (!inside(box, point.x, point.y)) return;
      // The hit test uses the full bar; the value mapping uses the inset axis.
      useBox(box);
      const ratio = ratioOf(point);
      if (ratio === null) return;
      const target = event.target;
      if (track && isElement(target) && !track.contains(target)) return;
      const knob = track && isElement(target) ? target.closest('.sn-slider-bar__knob') : null;
      const index = knob && track && track.contains(knob) ? knobIndexOf(track, knob) : null;
      // A press on the bar jumps; a press on the thumb keeps its offset.
      if (index === null) begin(options.nearest(clamp01(ratio)), clamp01(ratio), true);
      else begin(index, clamp01(ratio), false);
      // A drag must not start a text selection or scroll the page.
      event.preventDefault();
      attachFollowers();
    };

    function attachFollowers(): void {
      const onMove = (event: MouseEvent): void => move(event);
      const onUp = (event: MouseEvent): void => {
        end(event);
        releaseFollowers?.();
      };
      // `mouseleave` does not bubble, so a document-level listener only sees
      // the one targeting the document — the pointer left the window.
      const onLeave = (): void => cancel();
      const onBlur = (): void => cancel();
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('mouseleave', onLeave);
      window.addEventListener('blur', onBlur);
      releaseFollowers = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('mouseleave', onLeave);
        window.removeEventListener('blur', onBlur);
        releaseFollowers = null;
      };
    }

    // `mousedown` sits on the document, not on the host: a ref that resolves to
    // a component instance or a `UniElement` has no `addEventListener` we can
    // rely on, and the hit test above already scopes the press to us.
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      releaseFollowers?.();
    };
  }

  return {
    startFromTrack,
    startFromKnob,
    move,
    end,
    cancel,
    bindMouse,
    draggedIndex: () => dragIndex,
  };
}
