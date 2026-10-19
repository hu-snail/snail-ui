import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import SnPopover from './SnPopover.vue'

const Trigger = defineComponent({
  name: 'Trigger',
  setup() {
    return () => h('button', { class: 'trigger-btn' }, 'trigger')
  },
})

/**
 * happy-dom doesn't implement getBoundingClientRect predictably;
 * stub it on every HTMLElement so position math has stable input.
 *
 * The bubble is the only element reporting a *different* rect from the
 * trigger (200×40 vs 100×32) — otherwise `recompute()` cannot tell the
 * two apart, and `top` / `left` assertions would be vacuous.
 *
 * The trigger sits at the centre of the 1280×800 viewport on purpose:
 * every placement then has room on all four sides, so `flip` never
 * fires and each assertion measures the requested side.
 */
const TRIGGER_RECT = { top: 384, left: 500, width: 100, height: 32 }
const POPOVER_RECT = { top: 0, left: 0, width: 200, height: 40 }
const ARROW_GAP = 9 // must track SnPopover's own layout reserve

function stubRect() {
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value(this: HTMLElement) {
      const isPopover = this.classList?.contains('sn-popover')
      const r = isPopover ? POPOVER_RECT : TRIGGER_RECT
      return {
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
        right: r.left + r.width,
        bottom: r.top + r.height,
        x: r.left,
        y: r.top,
        toJSON() { return {} },
      }
    },
  })
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1280 })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 })
}

/** Read the teleported bubble from document.body. */
function bubbleEl(): HTMLElement {
  const pop = document.body.querySelector('.sn-popover') as HTMLElement | null
  expect(pop).not.toBeNull()
  return pop!
}

function bubbleStyle(): CSSStyleDeclaration {
  return bubbleEl().style
}

function arrowEl(): HTMLElement {
  const arrow = document.body.querySelector('.sn-popover__arrow') as HTMLElement | null
  expect(arrow).not.toBeNull()
  return arrow!
}

describe('SnPopover (AUI-WEB-FB-009)', () => {
  /** Every mounted wrapper — unmounted in afterEach so a live component
   * never loses its teleported DOM to the manual body cleanup. */
  const wrappers: ReturnType<typeof mountPopover>[] = []

  beforeEach(() => stubRect())
  afterEach(async () => {
    vi.restoreAllMocks()
    for (const w of wrappers) {
      w.unmount()
      await nextTick()
    }
    wrappers.length = 0
    // Tear down any Teleport nodes that survived the prior component.
    document.body.querySelectorAll('.sn-popover').forEach((el) => el.remove())
  })

  function mountPopover(
    props: Record<string, unknown> = {},
    slots: Record<string, unknown> = {},
  ) {
    const w = mount(SnPopover, {
      props,
      slots: { default: slots.default ?? (() => h(Trigger)), ...slots },
      attachTo: document.body,
    })
    wrappers.push(w)
    return w
  }

  describe('rendering', () => {
    it('renders the default slot wrapped in a span.sn-popover-trigger', () => {
      const w = mountPopover({ content: 'hello' })
      expect(w.find('.sn-popover-trigger').exists()).toBe(true)
      expect(w.find('button.trigger-btn').exists()).toBe(true)
    })

    it('marks the bubble with data-snui-component="popover"', async () => {
      mountPopover({ content: 'x', show: true })
      await new Promise((r) => setTimeout(r, 10))
      expect(bubbleEl().getAttribute('data-snui-component')).toBe('popover')
    })

    it('does not render the bubble until shown (uncontrolled default)', async () => {
      const w = mountPopover({ content: 'hello', delay: 0 })
      expect(document.body.querySelector('.sn-popover')).toBeNull()
      await w.find('.sn-popover-trigger').trigger('mouseenter')
      await nextTick()
      await new Promise((r) => setTimeout(r, 10))
      expect(document.body.querySelector('.sn-popover')).not.toBeNull()
    })

    it('renders role="dialog" with aria-modal="false" on the bubble', async () => {
      mountPopover({ content: 'x', show: true })
      await new Promise((r) => setTimeout(r, 10))
      expect(bubbleEl().getAttribute('role')).toBe('dialog')
      expect(bubbleEl().getAttribute('aria-modal')).toBe('false')
    })

    it('reflects aria-expanded on the trigger while open', async () => {
      const w = mountPopover({ content: 'x', delay: 0 })
      expect(w.find('.sn-popover-trigger').attributes('aria-expanded')).toBe('false')
      await w.find('.sn-popover-trigger').trigger('mouseenter')
      await nextTick()
      await new Promise((r) => setTimeout(r, 10))
      expect(w.find('.sn-popover-trigger').attributes('aria-expanded')).toBe('true')
    })
  })

  describe('controlled show', () => {
    it('show=true renders the bubble on first render', async () => {
      mountPopover({ content: 'x', show: true })
      await nextTick()
      await new Promise((r) => setTimeout(r, 10))
      expect(document.body.querySelector('.sn-popover')).not.toBeNull()
    })

    it('show=false keeps the bubble closed', async () => {
      mountPopover({ content: 'x', show: false })
      await nextTick()
      await new Promise((r) => setTimeout(r, 10))
      expect(document.body.querySelector('.sn-popover')).toBeNull()
    })

    it('defaultShow=true opens the uncontrolled instance', async () => {
      mountPopover({ content: 'x', defaultShow: true })
      await nextTick()
      await new Promise((r) => setTimeout(r, 10))
      expect(document.body.querySelector('.sn-popover')).not.toBeNull()
    })
  })

  describe('trigger gestures', () => {
    it('hover: hides after mouseleave', async () => {
      const w = mountPopover({ content: 'hello', delay: 0, duration: 0 })
      await w.find('.sn-popover-trigger').trigger('mouseenter')
      await new Promise((r) => setTimeout(r, 10))
      expect(document.body.querySelector('.sn-popover')).not.toBeNull()
      await w.find('.sn-popover-trigger').trigger('mouseleave')
      await new Promise((r) => setTimeout(r, 10))
      expect(document.body.querySelector('.sn-popover')).toBeNull()
    })

    it('click: toggles and emits update:show', async () => {
      const seen: boolean[] = []
      const w = mount(SnPopover, {
        props: {
          trigger: 'click',
          show: false,
          content: 'x',
          'onUpdate:show': (v: boolean) => seen.push(v),
        },
        slots: { default: () => h(Trigger) },
        attachTo: document.body,
      })
      await nextTick()
      await w.find('.sn-popover-trigger').trigger('click')
      expect(seen).toEqual([true])
      await w.find('.sn-popover-trigger').trigger('click')
      expect(seen).toEqual([true, true])
      w.unmount()
    })

    it('click: closes on an outside click and calls onClickoutside', async () => {
      const onClickoutside = vi.fn()
      const seen: boolean[] = []
      const w = mount(SnPopover, {
        props: {
          trigger: 'click',
          show: true,
          content: 'x',
          onClickoutside,
          'onUpdate:show': (v: boolean) => seen.push(v),
        },
        slots: { default: () => h(Trigger) },
        attachTo: document.body,
      })
      await nextTick()
      await new Promise((r) => setTimeout(r, 10))
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      expect(onClickoutside).toHaveBeenCalledTimes(1)
      expect(seen).toContain(false)
      w.unmount()
    })

    it('click: outside handler does not fire when the click lands inside the bubble', async () => {
      const onClickoutside = vi.fn()
      mountPopover({ content: 'x', show: true, trigger: 'click', onClickoutside })
      await nextTick()
      await new Promise((r) => setTimeout(r, 10))
      bubbleEl().dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      expect(onClickoutside).not.toHaveBeenCalled()
    })

    it('focus: opens on focusin and closes on focusout', async () => {
      const w = mountPopover({ content: 'x', trigger: 'focus', delay: 0, duration: 0 })
      await w.find('.sn-popover-trigger').trigger('focusin')
      await new Promise((r) => setTimeout(r, 10))
      expect(document.body.querySelector('.sn-popover')).not.toBeNull()
      await w.find('.sn-popover-trigger').trigger('focusout')
      await new Promise((r) => setTimeout(r, 10))
      expect(document.body.querySelector('.sn-popover')).toBeNull()
    })

    it('manual: never opens from gestures — only show drives it', async () => {
      const w = mountPopover({ content: 'x', trigger: 'manual', delay: 0 })
      await w.find('.sn-popover-trigger').trigger('mouseenter')
      await w.find('.sn-popover-trigger').trigger('click')
      await new Promise((r) => setTimeout(r, 10))
      expect(document.body.querySelector('.sn-popover')).toBeNull()
      await w.setProps({ show: true })
      await new Promise((r) => setTimeout(r, 10))
      expect(document.body.querySelector('.sn-popover')).not.toBeNull()
    })

    it('hover bridge: moving into the bubble keeps it open (keepAliveOnHover)', async () => {
      const w = mountPopover({ content: 'x', delay: 0, duration: 0 })
      const trigger = w.find('.sn-popover-trigger')
      await trigger.trigger('mouseenter')
      await new Promise((r) => setTimeout(r, 10))
      // relatedTarget inside the bubble → trigger mouseleave must not close.
      const pop = document.body.querySelector('.sn-popover') as HTMLElement
      await trigger.trigger('mouseleave', { relatedTarget: pop })
      await new Promise((r) => setTimeout(r, 10))
      expect(document.body.querySelector('.sn-popover')).not.toBeNull()
    })

    it('keepAliveOnHover=false: entering the bubble does not cancel the close timer', async () => {
      const w = mountPopover({ content: 'x', delay: 0, duration: 0, keepAliveOnHover: false })
      const trigger = w.find('.sn-popover-trigger')
      await trigger.trigger('mouseenter')
      await new Promise((r) => setTimeout(r, 10))
      await w.find('.sn-popover-trigger').trigger('mouseenter')
      // The bubble mouseenter must NOT clear the pending close.
      const pop = document.body.querySelector('.sn-popover') as HTMLElement
      pop.dispatchEvent(new MouseEvent('mouseenter'))
      await trigger.trigger('mouseleave')
      await new Promise((r) => setTimeout(r, 10))
      expect(document.body.querySelector('.sn-popover')).toBeNull()
    })
  })

  describe('disabled and imperative API', () => {
    it('disabled suppresses any show', async () => {
      const w = mountPopover({ content: 'x', disabled: true, delay: 0 })
      await w.find('.sn-popover-trigger').trigger('mouseenter')
      await new Promise((r) => setTimeout(r, 10))
      expect(document.body.querySelector('.sn-popover')).toBeNull()
    })

    it('exposes show / hide / isShown via the component instance', async () => {
      const w = mountPopover({ content: 'x' })
      const exposed = w.vm as unknown as {
        show: () => void
        hide: () => void
        isShown: () => boolean
      }
      expect(exposed.isShown()).toBe(false)
      exposed.show()
      await new Promise((r) => setTimeout(r, 10))
      expect(exposed.isShown()).toBe(true)
      exposed.hide()
      await nextTick()
      expect(exposed.isShown()).toBe(false)
    })
  })

  describe('content and header', () => {
    it('renders the content prop inside the bubble body', async () => {
      mountPopover({ content: 'Bubble text', show: true })
      await new Promise((r) => setTimeout(r, 10))
      expect(bubbleEl().querySelector('.sn-popover__content')?.textContent).toContain('Bubble text')
    })

    it('renders the header prop as a titled section', async () => {
      mountPopover({ content: 'x', header: 'Card title', show: true })
      await new Promise((r) => setTimeout(r, 10))
      expect(bubbleEl().querySelector('.sn-popover__header')?.textContent).toContain('Card title')
    })

    it('omits the header section when no header prop or slot is given', async () => {
      mountPopover({ content: 'x', show: true })
      await new Promise((r) => setTimeout(r, 10))
      expect(bubbleEl().querySelector('.sn-popover__header')).toBeNull()
    })

    it('header slot takes precedence over the header prop', async () => {
      mountPopover(
        { content: 'x', header: 'prop title', show: true },
        { header: () => 'slot title' },
      )
      await new Promise((r) => setTimeout(r, 10))
      const header = bubbleEl().querySelector('.sn-popover__header')
      expect(header?.textContent).toContain('slot title')
      expect(header?.textContent).not.toContain('prop title')
    })

    it('content slot takes precedence over the content prop', async () => {
      mountPopover(
        { content: 'prop body', show: true },
        { content: () => h('strong', 'slot body') },
      )
      await new Promise((r) => setTimeout(r, 10))
      const content = bubbleEl().querySelector('.sn-popover__content')
      expect(content?.textContent).toContain('slot body')
      expect(content?.textContent).not.toContain('prop body')
    })
  })

  describe('appearance props', () => {
    it('showArrow=false (default) omits the arrow element', async () => {
      mountPopover({ content: 'x', show: true })
      await new Promise((r) => setTimeout(r, 10))
      expect(bubbleEl().querySelector('.sn-popover__arrow')).toBeNull()
    })

    it('showArrow=true renders the arrow', async () => {
      mountPopover({ content: 'x', show: true, showArrow: true })
      await new Promise((r) => setTimeout(r, 10))
      expect(bubbleEl().querySelector('.sn-popover__arrow')).not.toBeNull()
    })

    it('arrow=false hides the arrow even when showArrow is true', async () => {
      mountPopover({ content: 'x', show: true, showArrow: true, arrow: false })
      await new Promise((r) => setTimeout(r, 10))
      expect(bubbleEl().querySelector('.sn-popover__arrow')).toBeNull()
    })

    it('applies arrowClass to the arrow element', async () => {
      mountPopover({ content: 'x', show: true, showArrow: true, arrowClass: 'my-arrow' })
      await new Promise((r) => setTimeout(r, 10))
      expect(arrowEl().classList).toContain('my-arrow')
    })

    it('applies arrowStyle to the arrow element', async () => {
      mountPopover({ content: 'x', show: true, showArrow: true, arrowStyle: { opacity: '0.5' } })
      await new Promise((r) => setTimeout(r, 10))
      expect(arrowEl().style.opacity).toBe('0.5')
    })

    it('drops the built-in card styling when raw', async () => {
      mountPopover({ content: 'x', show: true, raw: true })
      await new Promise((r) => setTimeout(r, 10))
      expect(bubbleEl().classList).toContain('sn-popover--raw')
    })

    it('marks the bubble non-animated when animated is false', async () => {
      mountPopover({ content: 'x', show: true, animated: false })
      await new Promise((r) => setTimeout(r, 10))
      expect(bubbleEl().classList).toContain('sn-popover--no-animation')
    })

    it('marks the body scrollable when scrollable', async () => {
      mountPopover({ content: 'x', show: true, scrollable: true })
      await new Promise((r) => setTimeout(r, 10))
      expect(bubbleEl().classList).toContain('sn-popover--scrollable')
    })

    it('forwards contentClass and contentStyle to the body', async () => {
      mountPopover({
        content: 'x',
        show: true,
        contentClass: 'my-body',
        contentStyle: { color: 'red' },
      })
      await new Promise((r) => setTimeout(r, 10))
      const body = bubbleEl().querySelector('.sn-popover__content') as HTMLElement
      expect(body.classList).toContain('my-body')
      expect(body.style.color).toBe('red')
    })

    it('applies zIndex to the bubble style', async () => {
      mountPopover({ content: 'x', show: true, zIndex: 4242 })
      await new Promise((r) => setTimeout(r, 10))
      expect(bubbleStyle().zIndex).toBe('4242')
    })

    it('pins the bubble width to the trigger when width="trigger"', async () => {
      mountPopover({ content: 'x', show: true, width: 'trigger' })
      await new Promise((r) => setTimeout(r, 10))
      expect(bubbleStyle().width).toBe('100px')
    })

    it('applies a numeric width directly', async () => {
      mountPopover({ content: 'x', show: true, width: 240 })
      await new Promise((r) => setTimeout(r, 10))
      expect(bubbleStyle().width).toBe('240px')
    })

    it('renders inline (no teleport) when to=false', async () => {
      const w = mountPopover({ content: 'x', show: true, to: false })
      await new Promise((r) => setTimeout(r, 10))
      expect(w.find('.sn-popover').exists()).toBe(true)
      expect(document.body.querySelector(':scope > .sn-popover')).toBeNull()
    })
  })

  describe('displayDirective', () => {
    it('unmounts the bubble after hiding by default', async () => {
      const w = mountPopover({ content: 'x', delay: 0, duration: 0 })
      await w.find('.sn-popover-trigger').trigger('mouseenter')
      await new Promise((r) => setTimeout(r, 10))
      await w.find('.sn-popover-trigger').trigger('mouseleave')
      await new Promise((r) => setTimeout(r, 10))
      expect(document.body.querySelector('.sn-popover')).toBeNull()
    })

    it('keeps the node mounted with displayDirective=show', async () => {
      const w = mountPopover({ content: 'x', delay: 0, duration: 0, displayDirective: 'show' })
      await w.find('.sn-popover-trigger').trigger('mouseenter')
      await new Promise((r) => setTimeout(r, 10))
      await w.find('.sn-popover-trigger').trigger('mouseleave')
      await new Promise((r) => setTimeout(r, 10))
      const pop = document.body.querySelector('.sn-popover') as HTMLElement | null
      expect(pop).not.toBeNull()
      expect(pop?.style.display).toBe('none')
    })
  })

  /**
   * Positioning + arrow geometry. All expectations derive from the
   * stubbed rects:
   *   trigger → top 384, left 500, 100×32 (right 600, bottom 416)
   *   bubble  → 200×40
   *   ARROW_GAP = 9 is the band between bubble and trigger.
   */
  describe('positioning and arrow geometry', () => {
    it('places an arrowless top bubble flush against the trigger', async () => {
      mountPopover({ content: 'x', show: true, placement: 'top' })
      await new Promise((r) => setTimeout(r, 10))
      const s = bubbleStyle()
      expect(Number.parseFloat(s.top)).toBe(TRIGGER_RECT.top - POPOVER_RECT.height)
    })

    it('reserves the arrow band below the bubble when showArrow is on', async () => {
      mountPopover({ content: 'x', show: true, placement: 'top', showArrow: true })
      await new Promise((r) => setTimeout(r, 10))
      const s = bubbleStyle()
      expect(Number.parseFloat(s.top)).toBe(TRIGGER_RECT.top - POPOVER_RECT.height - ARROW_GAP)
    })

    it('places a bottom bubble below the trigger', async () => {
      mountPopover({ content: 'x', show: true, placement: 'bottom', showArrow: true })
      await new Promise((r) => setTimeout(r, 10))
      const triggerBottom = TRIGGER_RECT.top + TRIGGER_RECT.height
      expect(Number.parseFloat(bubbleStyle().top)).toBe(triggerBottom + ARROW_GAP)
    })

    it('places a left bubble left of the trigger', async () => {
      mountPopover({ content: 'x', show: true, placement: 'left', showArrow: true })
      await new Promise((r) => setTimeout(r, 10))
      expect(Number.parseFloat(bubbleStyle().left))
        .toBe(TRIGGER_RECT.left - POPOVER_RECT.width - ARROW_GAP)
    })

    it('places a right bubble right of the trigger', async () => {
      mountPopover({ content: 'x', show: true, placement: 'right', showArrow: true })
      await new Promise((r) => setTimeout(r, 10))
      const triggerRight = TRIGGER_RECT.left + TRIGGER_RECT.width
      expect(Number.parseFloat(bubbleStyle().left)).toBe(triggerRight + ARROW_GAP)
    })

    it('centres the bubble on the trigger for a plain side placement', async () => {
      mountPopover({ content: 'x', show: true, placement: 'top' })
      await new Promise((r) => setTimeout(r, 10))
      const s = bubbleStyle()
      const popCenter = Number.parseFloat(s.left) + POPOVER_RECT.width / 2
      const triggerCenter = TRIGGER_RECT.left + TRIGGER_RECT.width / 2
      expect(popCenter).toBe(triggerCenter)
    })

    it('keeps the requested placement class on the bubble', async () => {
      mountPopover({ content: 'x', show: true, placement: 'bottom-end' })
      await new Promise((r) => setTimeout(r, 10))
      expect(bubbleEl().classList.contains('sn-popover--bottom-end')).toBe(true)
    })

    it('follows the flipped side when the requested side overflows', async () => {
      // Trigger pinned to the top edge: a `top` bubble has nowhere to go.
      Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
        configurable: true,
        value(this: HTMLElement) {
          const isPopover = this.classList?.contains('sn-popover')
          const r = isPopover ? POPOVER_RECT : { top: 4, left: 500, width: 100, height: 32 }
          return {
            top: r.top, left: r.left, width: r.width, height: r.height,
            right: r.left + r.width, bottom: r.top + r.height,
            x: r.left, y: r.top, toJSON() { return {} },
          }
        },
      })
      mountPopover({ content: 'x', show: true, placement: 'top', showArrow: true })
      await new Promise((r) => setTimeout(r, 10))

      const pop = bubbleEl()
      expect(pop.classList.contains('sn-popover--bottom')).toBe(true)
      expect(Number.parseFloat(bubbleStyle().top)).toBe(4 + 32 + ARROW_GAP)
      const arrow = arrowEl()
      expect(arrow.classList.contains('sn-popover__arrow--bottom')).toBe(true)
      expect(arrow.classList.contains('sn-popover__arrow--top')).toBe(false)
    })

    it('aims the arrow at the trigger centre along the cross axis', async () => {
      mountPopover({ content: 'x', show: true, placement: 'top-start', showArrow: true })
      await new Promise((r) => setTimeout(r, 10))

      const a = arrowEl().style
      const popLeft = Number.parseFloat(bubbleStyle().left)
      const triggerCenter = TRIGGER_RECT.left + TRIGGER_RECT.width / 2
      const arrowLeft = Number.parseFloat(a.left)
      // arrow left = centre − popLeft − half square (7px)
      expect(arrowLeft).toBeCloseTo(triggerCenter - popLeft - 7, 5)
      expect(Number.parseFloat(a.bottom)).toBe(-7)
      expect(a.top).toBe('')
    })

    it('anchors a side arrow on the vertical axis', async () => {
      mountPopover({ content: 'x', show: true, placement: 'left', showArrow: true })
      await new Promise((r) => setTimeout(r, 10))

      const a = arrowEl().style
      const popTop = Number.parseFloat(bubbleStyle().top)
      const triggerCenterY = TRIGGER_RECT.top + TRIGGER_RECT.height / 2
      expect(Number.parseFloat(a.right)).toBe(-7)
      expect(a.left).toBe('')
      expect(Number.parseFloat(a.top)).toBeCloseTo(triggerCenterY - popTop - 7, 5)
    })
  })

  describe('events', () => {
    it('emits show and hide in uncontrolled mode', async () => {
      const seen: string[] = []
      const w = mountPopover({
        content: 'x',
        delay: 0,
        duration: 0,
        onShow: () => seen.push('show'),
        onHide: () => seen.push('hide'),
      })
      await w.find('.sn-popover-trigger').trigger('mouseenter')
      await new Promise((r) => setTimeout(r, 10))
      await w.find('.sn-popover-trigger').trigger('mouseleave')
      await new Promise((r) => setTimeout(r, 10))
      expect(seen).toEqual(['show', 'hide'])
    })
  })
})
