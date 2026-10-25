/**
 * uni-app runtime shims for the docs preview.
 *
 * ## Why this exists
 *
 * The uni components under `packages/uni` are authored for the uni-app runtime,
 * which supplies five things the browser does not:
 *
 *   1. **`tap` events.** Every interactive uni component listens with
 *      `@tap="handler"` (58 of the 82 components do). `tap` is a uni-app
 *      synthetic gesture: the runtime listens for `touchstart`/`touchend` (or
 *      `click` on H5) on its own root and dispatches a `tap` CustomEvent.
 *      In a plain browser there is no such dispatcher, so `@tap` handlers
 *      never fire — every button, switch, checkbox, tab and tooltip in the
 *      docs preview was dead.
 *
 *   2. **`hover-class` press feedback.** `:hover-class="…"` is a uni-app
 *      attribute, not a DOM one. Browsers drop unknown attributes silently, so
 *      press states never applied either.
 *
 *   3. **Touch events on desktop.** The gesture components (slider, picker
 *      roller, slide-verify, signature pad, img-cropper) listen to
 *      `@touchstart` / `@touchmove` / `@touchend` — exactly like they must on
 *      a real device. A desktop preview has a mouse, so dragging did nothing.
 *      uni-app's own H5 runtime bridges mouse → touch the same way this
 *      bridge does.
 *
 *   4. **`rpx` in inline styles.** Components compute inline styles with rpx
 *      (`height: 264rpx`, `--sn-circle-size: 120rpx`). The uni runtime
 *      converts them per device; the docs' Vite `rpxTransform` only sees CSS
 *      *files*, so inline declarations were dropped by the CSS parser and
 *      every dynamically-sized box collapsed (circle rings, picker columns,
 *      cropper frame, swiper track, signature bars…).
 *
 *   5. **The `uni` global API.** `uni.createSelectorQuery`,
 *      `uni.getSystemInfoSync`, `uni.chooseImage` etc. exist on every real
 *      target; in the docs preview they were undefined, so selector-mode
 *      image preview hit zones, floating-panel sizing and image picking
 *      degraded silently.
 *
 * None of these gaps are bugs in the components: they are correct uni-app
 * code. The fixes belong here, at the preview boundary, so the shipped
 * library keeps its uni-app-native source (AGENTS.md §112) and the docs still
 * get working demos.
 *
 * ## How each bridge works
 *
 * **tap** — Vue matches `@tap` to the DOM event named `tap`. So instead of
 * touching 58 components, we teach the document to emit `tap`:
 *
 *   - a capture-phase `click` listener on `document` dispatches a `tap`
 *     CustomEvent at the same element (bubbling, so `@tap` fires)
 *   - a capture-phase `touchstart`/`touchend` pair dispatches `tap` on touch
 *     devices, and `touchend` also suppresses the follow-up `click` so a tap
 *     fires exactly once
 *
 * A tap is only dispatched when the gesture stayed within `TAP_SLOP_PX` of
 * its start — a drag that *ends* on an element (picker roller release, slider
 * throw) must not also select whatever sits under the release point.
 *
 * **mouse → touch** — on `mousedown` inside a preview surface we dispatch a
 * synthetic `TouchEvent('touchstart')` at the target, follow `mousemove` with
 * `touchmove`, and finish `mouseup` with `touchend` (plus `touchcancel` on
 * `mouseleave`/window blur). The synthetic events carry real `Touch` objects
 * with client coordinates, and `preventDefault()` inside a component's
 * `@touchmove` handler works because the event is cancelable. Multi-finger
 * pinch (img-cropper zoom) still needs a touch device; pan and every
 * single-finger gesture work with the mouse.
 *
 * **inline rpx** — a `MutationObserver` watches `style` attribute changes and
 * rewrites `N rpx` → `N × 0.5 px` on elements inside a preview surface
 * (0.5 = the standard 750rpx → 375px mapping, same ratio as
 * `rpx-transform.ts`). The rewrite drops `rpx`, so the observer never loops.
 * This mirrors what the uni H5 runtime does to inline styles.
 *
 * **uni API** — a guarded `globalThis.uni` polyfill: `createSelectorQuery`
 * maps to DOM rects, `getSystemInfoSync` to the viewport, `chooseImage` to a
 * hidden `<input type=file>` with blob URLs. An existing `uni` global (a real
 * uni-app host) always wins — the polyfill only fills missing members.
 *
 * ## Scope
 *
 * Everything is gated to docs preview surfaces (`.sn-phone__screen`, any
 * `.sn-demo`, or any `[data-snui-component]` under the docs body). The web
 * components in `packages/vue-web` bind real `click` and are untouched.
 */

/** Mark a synthetic tap so handlers can tell it apart from a runtime one. */
const TAP_FLAG = '__snSyntheticTap'

/** Max distance (px) between touchstart and touchend for a tap. */
const TAP_SLOP_PX = 8

/** rpx → px ratio. Must match `rpx-transform.ts` (750 design → 375px). */
const RPX_RATIO = 0.5

interface TapDetail {
  /** Original DOM event that produced the tap. */
  source: 'click' | 'touch'
  /** Client coordinates, as uni-app's tap detail carries. */
  x: number
  y: number
}

/**
 * Dispatch a `tap` event at `target`.
 *
 * `bubbles: true` is essential: Vue's `@tap` listener sits on the element the
 * attribute was written on, and the originating click may target a descendant
 * (an icon inside a button), so the event has to travel up.
 */
function dispatchTap(target: EventTarget | null, detail: TapDetail): void {
  if (!(target instanceof Element)) return
  const event = new CustomEvent('tap', {
    bubbles: true,
    cancelable: true,
    detail,
  })
  Object.defineProperty(event, TAP_FLAG, { value: true })
  target.dispatchEvent(event)
}

/** Is this node inside a docs preview surface? */
function inPreview(node: EventTarget | null): boolean {
  if (!(node instanceof Element)) return false
  return (
    node.closest('.sn-phone__screen') !== null ||
    node.closest('.sn-demo') !== null ||
    node.closest('[data-snui-component]') !== null
  )
}

/**
 * Apply uni-app's `hover-class` press feedback, honouring
 * `hover-stop-propagation`.
 *
 * uni-app semantics: pressing an element adds its `hover-class`; if that
 * element sets `hover-stop-propagation`, ancestors do NOT get their own press
 * state (the gesture stops at that node). Without the flag every ancestor with
 * a `hover-class` lights up, which is what nested buttons/cells look like
 * when the attribute is ignored.
 */
function bindHoverClass(root: ParentNode): void {
  const press = (el: Element): void => {
    const cls = el.getAttribute('hover-class')
    if (cls === null || cls === '' || cls === 'none') return
    for (const name of cls.split(/\s+/)) if (name !== '') el.classList.add(name);
    el.setAttribute('data-sn-hover', cls)
  }
  const release = (el: Element): void => {
    const cls = el.getAttribute('data-sn-hover')
    if (cls === null) return
    const stay = Number(el.getAttribute('hover-stay-time') ?? '70')
    window.setTimeout(
      () => {
        for (const name of cls.split(/\s+/)) if (name !== '') el.classList.remove(name);
        el.removeAttribute('data-sn-hover')
      },
      Number.isFinite(stay) ? stay : 70,
    )
  }

  /**
   * Collect the press chain for a gesture.
   *
   * Walks from the pressed element up through its ancestors that also declare
   * `hover-class`, and stops as soon as a node sets `hover-stop-propagation` —
   * that node still lights up, but nothing above it does.
   */
  const pressChain = (start: Element): Element[] => {
    const chain: Element[] = []
    let node: Element | null = start
    while (node !== null) {
      if (node.hasAttribute('hover-class')) {
        chain.push(node)
        // uni-app: the stop flag blocks *ancestors*, not the node itself.
        const stop = node.getAttribute('hover-stop-propagation')
        if (stop !== null && stop !== 'false') break
      }
      node = node.parentElement
    }
    return chain
  }

  root.addEventListener(
    'pointerdown',
    (event: Event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      for (const el of pressChain(target)) press(el);
    },
    true,
  )
  for (const type of ['pointerup', 'pointercancel', 'pointerleave']) {
    root.addEventListener(
      type,
      (event: Event) => {
        const target = event.target
        if (!(target instanceof Element)) return
        for (const el of pressChain(target)) {
          if (el.hasAttribute('data-sn-hover')) release(el)
        }
      },
      true,
    )
  }
}

/* ── Mouse → touch bridge ─────────────────────────────────────────────────── */

/** State of the gesture currently bridged from the mouse. */
interface BridgedDrag {
  /** Element the touch began on — touch events retarget here, per spec. */
  target: Element
  /** Touch identifier (constant per gesture). */
  identifier: number
}

let bridged: BridgedDrag | null = null
let bridgedId = 1

/**
 * Build a real `TouchEvent` when the browser supports constructing one, and a
 * `CustomEvent` carrying the same shape otherwise. Components read
 * `event.touches[i].clientX` and call `event.preventDefault()` — both work on
 * either shape (Vue attaches `@touchmove` to the literal event name, so the
 * constructor only has to produce something dispatchable).
 */
export function buildTouchEvent(
  type: 'touchstart' | 'touchmove' | 'touchend' | 'touchcancel',
  target: Element,
  x: number,
  y: number,
): Event {
  const init = { bubbles: true, cancelable: true, composed: true }
  try {
    const touch = new Touch({ identifier: bridgedId, target, clientX: x, clientY: y })
    const touches = type === 'touchend' || type === 'touchcancel' ? [] : [touch]
    return new TouchEvent(type, {
      ...init,
      touches,
      targetTouches: touches,
      changedTouches: [touch],
    })
  } catch {
    const event = new CustomEvent(type, init) as CustomEvent & {
      touches?: unknown[]
      targetTouches?: unknown[]
      changedTouches?: unknown[]
    }
    const point = { identifier: bridgedId, target, clientX: x, clientY: y }
    if (type === 'touchend' || type === 'touchcancel') {
      event.changedTouches = [point]
      event.touches = []
      event.targetTouches = []
    } else {
      event.touches = [point]
      event.targetTouches = [point]
      event.changedTouches = [point]
    }
    return event
  }
}

function dispatchBridgedTouch(
  type: 'touchstart' | 'touchmove' | 'touchend' | 'touchcancel',
  target: Element,
  x: number,
  y: number,
): void {
  target.dispatchEvent(buildTouchEvent(type, target, x, y))
}

/**
 * Bridge mouse drags to touch gestures inside preview surfaces.
 *
 * uni-app's H5 runtime does exactly this conversion, so a component that only
 * listens to touch events behaves identically under a mouse. The bridge keeps
 * the touch *target* pinned to the mousedown element: per the touch-event
 * spec every event of one gesture targets the start element, which is what
 * picker columns and sliders rely on while the pointer travels.
 *
 * Components that own their mouse input (`[data-snui-mouse-gesture]`, e.g.
 * the picker rollers) are skipped: bridging them would drive their drag core
 * twice per gesture.
 */
export function bindMouseToTouch(root: ParentNode): () => void {
  const onMouseDown = (event: MouseEvent): void => {
    if (event.button !== 0) return
    const target = event.target
    if (!(target instanceof Element) || !inPreview(target)) return
    if (target.closest('[data-snui-mouse-gesture]') !== null) return
    if (bridged !== null) return
    bridged = { target, identifier: bridgedId }
    dispatchBridgedTouch('touchstart', target, event.clientX, event.clientY)
  }

  const onMouseMove = (event: MouseEvent): void => {
    if (bridged === null) return
    dispatchBridgedTouch('touchmove', bridged.target, event.clientX, event.clientY)
  }

  const onMouseUp = (event: MouseEvent): void => finish('touchend', event)
  // A `mouseleave` must only end the gesture when the pointer left the
  // window. This listener runs in the capture phase, so it also sees every
  // element-level `mouseleave` — crossing a picker row or a slider tick fires
  // one constantly, and cancelling on those killed any drag longer than one
  // element ("滚轮拖不动"). Only the event that targets the document itself
  // is the left-the-window signal.
  const onMouseLeave = (event: MouseEvent): void => {
    if (bridged === null) return
    if (event.target !== document && event.target !== document.documentElement) return
    finish('touchcancel', event)
  }
  const onBlur = (): void => {
    if (bridged === null) return
    const { target } = bridged
    bridged = null
    bridgedId += 1
    dispatchBridgedTouch('touchcancel', target, 0, 0)
  }

  function finish(type: 'touchend' | 'touchcancel', event: MouseEvent): void {
    if (bridged === null) return
    const { target } = bridged
    bridged = null
    bridgedId += 1
    dispatchBridgedTouch(type, target, event.clientX, event.clientY)
  }

  root.addEventListener('mousedown', onMouseDown, true)
  root.addEventListener('mousemove', onMouseMove, true)
  root.addEventListener('mouseup', onMouseUp, true)
  root.addEventListener('mouseleave', onMouseLeave, true)
  window.addEventListener('blur', onBlur)

  return () => {
    root.removeEventListener('mousedown', onMouseDown, true)
    root.removeEventListener('mousemove', onMouseMove, true)
    root.removeEventListener('mouseup', onMouseUp, true)
    root.removeEventListener('mouseleave', onMouseLeave, true)
    window.removeEventListener('blur', onBlur)
    bridged = null
  }
}

/* ── Inline rpx conversion ────────────────────────────────────────────────── */

/** Collapse every `<number>rpx` token in an inline style value to px. */
export function convertInlineRpx(styleValue: string): string {
  return styleValue.replace(
    /(-?\d+(?:\.\d+)?)rpx\b/g,
    (_m, raw: string) => `${parseFloat(raw) * RPX_RATIO}px`,
  )
}

/**
 * Convert rpx tokens in the inline `style` attribute of one element.
 *
 * Vue writes bound styles through `setAttribute('style', …)` (string form) or
 * `style.setProperty / style.x = …` (object form); both are reflected in the
 * style attribute, so watching that attribute covers every binding shape. The
 * write only happens when the value actually changed, so the observer never
 * re-triggers itself.
 */
function convertElementInlineRpx(el: Element): void {
  // Custom-element `style` attribute only; SVG/skip unreachable here.
  const raw = el.getAttribute('style')
  if (raw === null || !raw.includes('rpx')) return
  const converted = convertInlineRpx(raw)
  if (converted !== raw) el.setAttribute('style', converted)
}

let styleBridgeInstalled = false

/**
 * Install the rpx bridge on `HTMLElement.prototype.style` (idempotent).
 *
 * Two write paths have to be covered, and neither is reachable from the
 * element attribute alone:
 *
 *   - `el.style.width = '64rpx'` (Vue's object-form binding). The browser drops
 *     an unparseable value, so the attribute never changes and an observer sees
 *     nothing. The length accessors themselves are IDL attributes that cannot be
 *     redefined, but the `style` *getter* can be wrapped — every write then
 *     passes through a Proxy that converts rpx first.
 *   - `el.style.setProperty('--sn-circle-size', '120rpx')` (custom properties,
 *     which the circle / picker / swiper use for geometry). Wrapped directly.
 *
 * A `WeakMap` keeps one Proxy per declaration, so `el.style === el.style` still
 * holds for code that compares identity.
 */
export function installStyleRpxBridge(): void {
  if (styleBridgeInstalled) return
  if (typeof HTMLElement === 'undefined') return
  styleBridgeInstalled = true

  const proto = HTMLElement.prototype
  const descriptor = Object.getOwnPropertyDescriptor(proto, 'style')
  const originalGet = descriptor?.get
  const originalSet = descriptor?.set
  if (originalGet === undefined) return

  const proxies = new WeakMap<CSSStyleDeclaration, CSSStyleDeclaration>()

  const wrap = (declaration: CSSStyleDeclaration): CSSStyleDeclaration => {
    const cached = proxies.get(declaration)
    if (cached !== undefined) return cached
    const proxy = new Proxy(declaration, {
      set(target, property, value) {
        if (typeof value === 'string' && value.includes('rpx')) {
          return Reflect.set(target, property, convertInlineRpx(value))
        }
        return Reflect.set(target, property, value)
      },
      get(target, property) {
        const value = Reflect.get(target, property)
        if (property === 'setProperty') {
          return (name: string, val: string | null, priority?: string): void => {
            const converted = typeof val === 'string' ? convertInlineRpx(val) : val
            target.setProperty(name, converted, priority ?? '')
          }
        }
        return typeof value === 'function' ? value.bind(target) : value
      },
    }) as CSSStyleDeclaration
    proxies.set(declaration, proxy)
    return proxy
  }

  Object.defineProperty(proto, 'style', {
    configurable: true,
    enumerable: descriptor.enumerable ?? true,
    get(this: HTMLElement) {
      return wrap(originalGet.call(this))
    },
    set(this: HTMLElement, value: string) {
      originalSet?.call(this, value)
    },
  })
}

/**
 * Sweep every element inside a preview surface (and its shadow-free subtree)
 * for inline rpx, then keep watching for new ones.
 *
 * The initial sweep is what fixes the first render: components compute their
 * inline styles during mount, before any mutation the observer could catch.
 */
function bindInlineRpx(root: ParentNode): () => void {
  const sweep = (node: ParentNode): void => {
    const scope = node instanceof Element && inPreview(node) ? node : null
    const container: ParentNode = scope ?? document.body
    // The `[style]` filter is a cheap attribute scan; docs pages are small.
    for (const el of container.querySelectorAll('[style]')) convertElementInlineRpx(el);
    if (scope) convertElementInlineRpx(scope)
  }

  sweep(root)

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        convertElementInlineRpx(mutation.target as Element)
      } else if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node instanceof Element) {
            convertElementInlineRpx(node)
            for (const el of node.querySelectorAll('[style]')) convertElementInlineRpx(el);
          }
        }
      }
    }
  })
  observer.observe(root, {
    attributes: true,
    attributeFilter: ['style'],
    childList: true,
    subtree: true,
  })
  return () => observer.disconnect()
}

/* ── uni API polyfill ─────────────────────────────────────────────────────── */

/** Minimal shape of the `uni` surface the components touch. */
interface UniShim {
  createSelectorQuery?: () => unknown
  getSystemInfoSync?: () => Record<string, unknown>
  chooseImage?: (options: {
    count?: number
    success?: (result: {
      tempFilePaths: string[]
      tempFiles: Array<{ path: string; size: number; type?: string }>
    }) => void
    fail?: (error: unknown) => void
  }) => void
  pageScrollTo?: (options: { scrollTop?: number; duration?: number }) => void
  vibrateShort?: (options?: Record<string, unknown>) => void
  navigateTo?: (options: { url: string }) => void
}

/**
 * DOM implementation of `uni.createSelectorQuery` (the subset the components
 * use: `in`, `select`, `selectAll`, `boundingClientRect`, `exec`).
 *
 * `in(component)` accepts a Vue component instance or its `$el`; scoping keeps
 * `selectAll('.thumb')` inside one component, matching the MP behaviour where
 * the query is component-scoped by default.
 */
export function domCreateSelectorQuery(): {
  in: (scope: unknown) => unknown
  select: (selector: string) => unknown
  selectAll: (selector: string) => unknown
  boundingClientRect: (callback: (rects: unknown) => void) => unknown
  exec: (callback?: (results: unknown) => void) => void
} {
  let scopeRoot: Element | Document | null = null
  const selections: Array<{
    selector: string
    all: boolean
    callback: (rect: unknown) => void
  }> = []

  function rectOf(el: Element): Record<string, number> {
    const box = el.getBoundingClientRect()
    return {
      id: el.id ? Number(el.id) || 0 : 0,
      dataset: {},
      left: box.left,
      top: box.top,
      width: box.width,
      height: box.height,
      right: box.right,
      bottom: box.bottom,
    }
  }

  function resolveRoot(scope: unknown): Element | Document {
    if (scope instanceof Element) return scope
    if (scope instanceof Document) return scope
    const el = (scope as { $el?: Element } | null | undefined)?.$el
    if (el instanceof Element) return el
    return document
  }

  const query = {
    in(component: unknown): unknown {
      scopeRoot = resolveRoot(component)
      return query
    },
    select(selector: string): unknown {
      selections.push({ selector, all: false, callback: () => {} })
      return query
    },
    selectAll(selector: string): unknown {
      selections.push({ selector, all: true, callback: () => {} })
      return query
    },
    boundingClientRect(callback: (rect: unknown) => void): unknown {
      const last = selections[selections.length - 1]
      if (last) last.callback = callback
      return query
    },
    exec(done?: (results: unknown) => void): void {
      const root = scopeRoot ?? document
      const results = selections.map((entry) => {
        const found = entry.all
          ? Array.from(root.querySelectorAll(entry.selector))
          : [root.querySelector(entry.selector)].filter((el): el is Element => el !== null)
        const rects = found.map(rectOf)
        entry.callback(entry.all ? rects : (rects[0] ?? null))
        return entry.all ? rects : (rects[0] ?? null)
      })
      done?.(results)
    },
  }
  return query
}

/**
 * `uni.chooseImage` through a hidden `<input type="file">`.
 *
 * Returns blob object URLs as `tempFilePaths` — the same contract the MP
 * bridge fulfils with local temp paths, and good enough for `sn-upload`,
 * `sn-img-cropper` and every demo that just needs a real file.
 */
export function domChooseImage(options: {
  count?: number
  success?: (result: {
    tempFilePaths: string[]
    tempFiles: Array<{ path: string; size: number; type?: string }>
  }) => void
  fail?: (error: unknown) => void
}): void {
  if (typeof document === 'undefined') {
    options.fail?.({ errMsg: 'chooseImage:fail no document' })
    return
  }
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = (options.count ?? 1) > 1
  input.style.display = 'none'
  document.body.appendChild(input)
  let settled = false
  input.addEventListener('change', () => {
    settled = true
    const files = Array.from(input.files ?? [])
    const tempFilePaths = files.map((file) => URL.createObjectURL(file))
    options.success?.({
      tempFilePaths,
      tempFiles: files.map((file, index) => ({
        path: tempFilePaths[index] ?? '',
        size: file.size,
        type: file.type,
      })),
    })
    input.remove()
  })
  // A cancelled dialog fires `cancel` in modern browsers; older ones only
  // fire `change` — watch for focus returning without a change.
  input.addEventListener('cancel', () => {
    if (!settled) options.fail?.({ errMsg: 'chooseImage:fail cancel' })
    input.remove()
  })
  input.click()
}

/**
 * Install the `uni` polyfill without clobbering a real host. Members that
 * already exist on `globalThis.uni` are left untouched.
 */
export function installUniApiPolyfill(): void {
  const host = globalThis as { uni?: UniShim }
  const existing: UniShim = host.uni ?? {}
  const polyfill: UniShim = {
    createSelectorQuery: existing.createSelectorQuery ?? domCreateSelectorQuery,
    getSystemInfoSync:
      existing.getSystemInfoSync ??
      (() => ({
        platform: 'h5',
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio,
        statusBarHeight: 0,
        safeAreaInsets: { top: 0, bottom: 0 },
      })),
    chooseImage: existing.chooseImage ?? domChooseImage,
    pageScrollTo:
      existing.pageScrollTo ??
      ((options) => {
        window.scrollTo({
          top: options?.scrollTop ?? 0,
          behavior: options?.duration ? 'smooth' : 'auto',
        })
      }),
    vibrateShort: existing.vibrateShort ?? (() => {}),
    navigateTo: existing.navigateTo ?? (() => {}),
  }
  host.uni = polyfill
}

/* ── Install ──────────────────────────────────────────────────────────────── */

/**
 * Install the bridge. Returns a disposer so a re-mount (HMR) cannot stack
 * duplicate listeners — that would dispatch each tap twice and toggle every
 * switch back off immediately.
 */
export function installUniPreviewShims(): () => void {
  if (typeof document === 'undefined') return () => {}

  /** Element that received the last touchstart, to suppress its click. */
  let touchTarget: Element | null = null
  let touchStartAt = 0
  let touchStartX = 0
  let touchStartY = 0

  const onClick = (event: MouseEvent): void => {
    if (!inPreview(event.target)) return
    // A click that follows a handled touch is the same gesture; skip it.
    if (touchTarget !== null && performance.now() - touchStartAt < 700) {
      touchTarget = null
      return
    }
    dispatchTap(event.target, { source: 'click', x: event.clientX, y: event.clientY })
  }

  const onTouchStart = (event: Event): void => {
    if (!inPreview(event.target)) return
    const detail = event as TouchEvent
    const touch = detail.touches?.[0] ?? detail.changedTouches?.[0]
    touchTarget = event.target instanceof Element ? event.target : null
    touchStartAt = performance.now()
    touchStartX = touch?.clientX ?? 0
    touchStartY = touch?.clientY ?? 0
  }

  const onTouchEnd = (event: Event): void => {
    if (!inPreview(event.target)) return
    const detail = event as TouchEvent
    const touch = detail.changedTouches?.[0]
    const endX = touch?.clientX ?? 0
    const endY = touch?.clientY ?? 0
    const moved = Math.hypot(endX - touchStartX, endY - touchStartY)
    // uni-app only emits `tap` for a gesture that stayed put; a drag release
    // must not select whatever sits under the pointer (picker roller, slider).
    if (touchTarget !== null && moved <= TAP_SLOP_PX) {
      dispatchTap(event.target, { source: 'touch', x: endX, y: endY })
    }
  }

  // Capture phase: run before Vue's own listeners so `tap` precedes `click`.
  document.addEventListener('click', onClick, true)
  document.addEventListener('touchstart', onTouchStart, true)
  document.addEventListener('touchend', onTouchEnd, true)
  bindHoverClass(document)
  installStyleRpxBridge()
  const stopMouseTouch = bindMouseToTouch(document)
  const stopRpx = bindInlineRpx(document)
  installUniApiPolyfill()

  return () => {
    document.removeEventListener('click', onClick, true)
    document.removeEventListener('touchstart', onTouchStart, true)
    document.removeEventListener('touchend', onTouchEnd, true)
    stopMouseTouch()
    stopRpx()
  }
}
