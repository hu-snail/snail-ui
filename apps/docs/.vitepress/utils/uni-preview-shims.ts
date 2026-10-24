/**
 * uni-app runtime shims for the docs preview.
 *
 * ## Why this exists
 *
 * The uni components under `packages/uni` are authored for the uni-app runtime,
 * which supplies two things the browser does not:
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
 * Neither gap is a bug in the components: they are correct uni-app code. The
 * fix belongs here, at the preview boundary, so the shipped library keeps its
 * uni-app-native source (AGENTS.md §112) and the docs still get working demos.
 *
 * ## How the bridge works
 *
 * Vue matches `@tap` to the DOM event named `tap`. So instead of touching 58
 * components, we teach the document to emit `tap`:
 *
 *   - a capture-phase `click` listener on `document` dispatches a `tap`
 *     CustomEvent at the same element (bubbling, so `@tap` fires)
 *   - a capture-phase `touchstart`/`touchend` pair dispatches `tap` on touch
 *     devices, and `touchend` also suppresses the follow-up `click` so a tap
 *     fires exactly once
 *
 * Dispatch happens in the capture phase, before Vue's own `click` listeners
 * run, so a component that binds both `@tap` and `@click` sees `tap` first —
 * matching uni-app's ordering.
 *
 * ## Scope
 *
 * Only active inside a docs preview surface (`.sn-phone__screen`, or any
 * `[data-snui-component]` under the docs body). The web components in
 * `packages/vue-web` bind real `click` and are untouched.
 */

/** Mark a synthetic tap so handlers can tell it apart from a runtime one. */
const TAP_FLAG = '__snSyntheticTap'

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
 * Apply uni-app's `hover-class` press feedback.
 *
 * The attribute value names a class to add while pressed (uni-app default is
 * `none`). We add it on pointerdown / touchstart and remove it on
 * pointerup / pointercancel / touchend after the `hover-stay-time` delay.
 */
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
    for (const name of cls.split(/\s+/)) if (name !== '') el.classList.add(name)
    el.setAttribute('data-sn-hover', cls)
  }
  const release = (el: Element): void => {
    const cls = el.getAttribute('data-sn-hover')
    if (cls === null) return
    const stay = Number(el.getAttribute('hover-stay-time') ?? '70')
    window.setTimeout(() => {
      for (const name of cls.split(/\s+/)) if (name !== '') el.classList.remove(name)
      el.removeAttribute('data-sn-hover')
    }, Number.isFinite(stay) ? stay : 70)
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
      for (const el of pressChain(target)) press(el)
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

  const onClick = (event: MouseEvent): void => {
    if (!inPreview(event.target)) return
    // A click that follows a handled touch is the same gesture; skip it.
    if (touchTarget !== null && performance.now() - touchStartAt < 700) {
      touchTarget = null
      return
    }
    dispatchTap(event.target, { source: 'click', x: event.clientX, y: event.clientY })
  }

  const onTouchStart = (event: TouchEvent): void => {
    if (!inPreview(event.target)) return
    const touch = event.touches[0]
    if (touch === undefined) return
    touchTarget = event.target instanceof Element ? event.target : null
    touchStartAt = performance.now()
  }

  const onTouchEnd = (event: TouchEvent): void => {
    if (!inPreview(event.target)) return
    const touch = event.changedTouches[0]
    dispatchTap(event.target, {
      source: 'touch',
      x: touch?.clientX ?? 0,
      y: touch?.clientY ?? 0,
    })
  }

  // Capture phase: run before Vue's own listeners so `tap` precedes `click`.
  document.addEventListener('click', onClick, true)
  document.addEventListener('touchstart', onTouchStart, true)
  document.addEventListener('touchend', onTouchEnd, true)
  bindHoverClass(document)

  return () => {
    document.removeEventListener('click', onClick, true)
    document.removeEventListener('touchstart', onTouchStart, true)
    document.removeEventListener('touchend', onTouchEnd, true)
  }
}
