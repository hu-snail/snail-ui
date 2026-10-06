import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import SnTooltip from './SnTooltip.vue'

const Trigger = defineComponent({
  name: 'Trigger',
  setup() {
    return () => h('button', { class: 'trigger-btn' }, 'trigger')
  },
})

/**
 * happy-dom doesn't implement getBoundingClientRect predictably;
 * stub it on every HTMLElement so position math has stable input.
 */
function stubRect() {
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value(this: HTMLElement) {
      return { top: 100, left: 100, right: 200, bottom: 132, width: 100, height: 32, x: 100, y: 100, toJSON() { return {} } }
    },
  })
  Object.defineProperty(window, 'innerWidth',  { configurable: true, value: 1280 })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 })
}

describe('SnTooltip (AUI-WEB-FEED-006)', () => {
  beforeEach(() => stubRect())
  afterEach(() => {
    vi.restoreAllMocks()
    // Tear down any Teleport nodes that survived the prior component.
    document.body.querySelectorAll('.sn-tooltip').forEach((el) => el.remove())
  })

  function mountTooltip(
    props: Record<string, unknown> = {},
    slot?: () => unknown,
  ) {
    return mount(SnTooltip, {
      props,
      slots: { default: slot ?? (() => h(Trigger)) },
      attachTo: document.body,
    })
  }

  it('renders the default slot wrapped in a <span class="sn-tooltip-trigger">', () => {
    const w = mountTooltip({ content: 'hello' })
    expect(w.find('.sn-tooltip-trigger').exists()).toBe(true)
    expect(w.find('button.trigger-btn').exists()).toBe(true)
  })

  it('does not render the popover until hovered (uncontrolled default)', async () => {
    const w = mountTooltip({ content: 'hello', delay: 0 })
    expect(document.body.querySelector('.sn-tooltip')).toBeNull()
    await w.find('.sn-tooltip-trigger').trigger('mouseenter')
    await nextTick()
    await new Promise((r) => setTimeout(r, 10))
    expect(document.body.querySelector('.sn-tooltip')).not.toBeNull()
  })

  it('hides after mouseleave', async () => {
    const w = mountTooltip({ content: 'hello', delay: 0 })
    await w.find('.sn-tooltip-trigger').trigger('mouseenter')
    await nextTick()
    await new Promise((r) => setTimeout(r, 10))
    expect(document.body.querySelector('.sn-tooltip')).not.toBeNull()
    await w.find('.sn-tooltip-trigger').trigger('mouseleave')
    await new Promise((r) => setTimeout(r, 10))
    expect(document.body.querySelector('.sn-tooltip')).toBeNull()
  })

  it('controlled show=true renders the popover on first render', async () => {
    mountTooltip({ show: true })
    await nextTick()
    await new Promise((r) => setTimeout(r, 10))
    expect(document.body.querySelector('.sn-tooltip')).not.toBeNull()
  })

  it('controlled show=false leaves the popover closed', async () => {
    mountTooltip({ show: false })
    await nextTick()
    await new Promise((r) => setTimeout(r, 10))
    expect(document.body.querySelector('.sn-tooltip')).toBeNull()
  })

  it('trigger=click emits update:show (parent can opt in to toggle)', async () => {
    const seen: boolean[] = []
    const w = mount(SnTooltip, {
      props: {
        trigger: 'click',
        show: false,
        'onUpdate:show': (v: boolean) => seen.push(v),
      },
      slots: { default: () => h(Trigger) },
      attachTo: document.body,
    })
    await nextTick()
    await w.find('.sn-tooltip-trigger').trigger('click')
    expect(seen).toEqual([true])
    // Second click while still false → another true (parent has to mirror
    // the prop; we don't simulate that here, just verify the event payload).
    await w.find('.sn-tooltip-trigger').trigger('click')
    expect(seen).toEqual([true, true])
    w.unmount()
  })

  it('disabled suppresses any show', async () => {
    const w = mountTooltip({ content: 'x', disabled: true, delay: 0 })
    await w.find('.sn-tooltip-trigger').trigger('mouseenter')
    await new Promise((r) => setTimeout(r, 10))
    expect(document.body.querySelector('.sn-tooltip')).toBeNull()
  })

  it('content prop renders inside the popover body', async () => {
    mountTooltip({ content: 'Ideas', show: true })
    await nextTick()
    await new Promise((r) => setTimeout(r, 10))
    const pop = document.body.querySelector('.sn-tooltip')
    expect(pop?.textContent).toContain('Ideas')
  })

  it('placement prop sets direction class', async () => {
    mountTooltip({ content: 'x', show: true, placement: 'bottom-end' })
    await nextTick()
    await new Promise((r) => setTimeout(r, 10))
    const pop = document.body.querySelector('.sn-tooltip')
    expect(pop?.classList.contains('sn-tooltip--bottom-end')).toBe(true)
  })

  it('exposes imperative show / hide via the component instance', async () => {
    const w = mountTooltip({ content: 'x' })
    // defineExpose in <script setup> surfaces on vm directly (vue-test-utils
    // unwraps the proxy).
    const exposed = w.vm as unknown as {
      show: () => void
      hide: () => void
      isShown: () => boolean
    }
    expect(typeof exposed.show).toBe('function')
    expect(typeof exposed.hide).toBe('function')
    expect(typeof exposed.isShown).toBe('function')
    expect(exposed.isShown()).toBe(false)
    exposed.show()
    await new Promise((r) => setTimeout(r, 10))
    expect(exposed.isShown()).toBe(true)
    exposed.hide()
    await nextTick()
    expect(exposed.isShown()).toBe(false)
  })

  it('arrow prop=false omits the arrow element', async () => {
    mountTooltip({ content: 'x', show: true, arrow: false })
    await nextTick()
    await new Promise((r) => setTimeout(r, 10))
    const pop = document.body.querySelector('.sn-tooltip')
    expect(pop?.querySelector('.sn-tooltip__arrow')).toBeNull()
  })
})