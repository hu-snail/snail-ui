/**
 * SnColorPicker unit tests — web-end color picker (naive-ui parity).
 *
 * Behavior-focused (AGENTS.md §46): pure conversions, parse of every
 * input format, trigger display, v-model round-trip, panel layout, SV /
 * hue / alpha pointer dragging (document-level move/up), mode tabs,
 * swatches, showAlpha, clearable, disabled / readonly, keyboard stepping
 * on the panel handles, outside click, listener cleanup on unmount.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import SnColorPicker from './SnColorPicker.vue'
import {
  formatRgb,
  formatRgba,
  hsvToRgb,
  hslToRgb,
  parseColor,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
} from './sn-color-picker-types'

/** Expected rgb() string for an HSV triple (keeps drag/keyboard expectations in sync with the helpers). */
function rgbOfHsv(h: number, s: number, v: number): string {
  const rgb = hsvToRgb(h, s, v)
  return formatRgb(rgb.r, rgb.g, rgb.b)
}

const mounted: Array<{ unmount: () => void }> = []

function mountPicker(props: Record<string, unknown> = {}) {
  const w = mount(SnColorPicker, { props, attachTo: document.body })
  mounted.push(w)
  return w
}

function mountVModel(initial: string | null, props: Record<string, unknown> = {}) {
  const value = ref<string | null>(initial)
  const wrapper = mount({
    setup() {
      return () =>
        h(SnColorPicker, {
          ...props,
          modelValue: value.value,
          'onUpdate:modelValue': (v: string | null) => { value.value = v },
        })
    },
  }, { attachTo: document.body })
  mounted.push(wrapper)
  return { wrapper: wrapper.findComponent(SnColorPicker), value }
}

function panelEl(): HTMLElement | null {
  return document.body.querySelector<HTMLElement>('.sn-color-picker-panel')
}

async function openPanel(wrapper: { find: (sel: string) => { trigger: (ev: string, o?: unknown) => Promise<void> } }) {
  await wrapper.find('.sn-color-picker__selection').trigger('click')
  await nextTick()
}

/**
 * Wait out the sn-pop leave transition (150ms + frame timing) so a closed
 * panel is actually gone from the DOM before asserting.
 */
async function panelLeft(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 250))
}

describe('SnColorPicker', () => {
  beforeEach(() => {
    // happy-dom has no layout — stable rects: SV square 200x200 at origin,
    // rails 200 wide at origin, trigger below, panel measured separately.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        const cls = this.classList
        if (cls.contains('sn-color-picker-panel__sv')) {
          return { top: 0, left: 0, width: 200, height: 200, right: 200, bottom: 200, x: 0, y: 0, toJSON: () => ({}) }
        }
        if (cls.contains('sn-color-picker-panel__rail')) {
          return { top: 0, left: 0, width: 200, height: 12, right: 200, bottom: 12, x: 0, y: 0, toJSON: () => ({}) }
        }
        if (cls.contains('sn-color-picker-panel')) {
          return { top: 0, left: 0, width: 220, height: 300, right: 220, bottom: 300, x: 0, y: 0, toJSON: () => ({}) }
        }
        return { top: 300, left: 40, width: 200, height: 32, right: 240, bottom: 332, x: 40, y: 300, toJSON: () => ({}) }
      },
    )
  })

  afterEach(async () => {
    for (const w of mounted.splice(0)) w.unmount()
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  /* ───── pure helpers ───── */

  describe('pure color helpers', () => {
    it('converts hex to rgb and back', () => {
      const parsed = parseColor('#ff0000')
      expect(parsed?.r).toBe(255)
      expect(parsed?.g).toBe(0)
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000')
    })

    it('parses short hex #f00 and #f00c', () => {
      expect(parseColor('#f00')).toMatchObject({ r: 255, g: 0, b: 0, a: 1 })
      expect(parseColor('#f00c')).toMatchObject({ r: 255, g: 0, b: 0, a: 204 / 255 })
    })

    it('parses rgb() / rgba() strings', () => {
      expect(parseColor('rgb(10, 20, 30)')).toMatchObject({ r: 10, g: 20, b: 30, a: 1 })
      expect(parseColor('rgba(10, 20, 30, 0.5)')).toMatchObject({ a: 0.5 })
    })

    it('parses hsl() / hsla() strings', () => {
      expect(parseColor('hsl(120, 50%, 50%)')).toMatchObject({ r: 63.75, g: 191.25, b: 63.75, a: 1 })
      expect(parseColor('hsla(0, 100%, 50%, 0.25)')).toMatchObject({ r: 255, g: 0, b: 0, a: 0.25 })
    })

    it('round-trips rgb <-> hsl <-> hsv', () => {
      const rgb = { r: 128, g: 64, b: 200 }
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      const back = hslToRgb(hsl.h, hsl.s, hsl.l)
      expect(Math.round(back.r)).toBe(128)
      expect(Math.round(back.g)).toBe(64)
      expect(Math.round(back.b)).toBe(200)
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
      const backRgb = hsvToRgb(hsv.h, hsv.s, hsv.v)
      expect(Math.round(backRgb.r)).toBe(128)
      expect(Math.round(backRgb.g)).toBe(64)
      expect(Math.round(backRgb.b)).toBe(200)
    })

    it('clamps and rejects invalid input', () => {
      expect(parseColor('not a color')).toBeNull()
      expect(parseColor('#xyz')).toBeNull()
      expect(parseColor('')).toBeNull()
      expect(formatRgba(300, -5, 10, 2)).toBe('rgba(255, 0, 10, 1)')
    })
  })

  /* ───── trigger display ───── */

  it('shows the placeholder when empty and the normalized value when set', () => {
    const empty = mountPicker()
    expect(empty.find('.sn-color-picker__placeholder').text()).toBe('Please pick a color')
    const filled = mountPicker({ modelValue: '#FF8800' })
    expect(filled.find('.sn-color-picker__value').text()).toBe('#ff8800')
  })

  it('normalizes an rgb() model value to lowercase hex for display', () => {
    const w = mountPicker({ modelValue: 'rgb(255, 136, 0)' })
    expect(w.find('.sn-color-picker__value').text()).toBe('#ff8800')
  })

  it('displays 8-digit hex when showAlpha and alpha < 1', () => {
    const w = mountPicker({ modelValue: 'rgba(255, 136, 0, 0.5)', showAlpha: true })
    expect(w.find('.sn-color-picker__value').text()).toBe('#ff880080')
  })

  /* ───── panel layout ───── */

  it('opens the panel on trigger click with mode tabs and hue rail', async () => {
    const w = mountPicker()
    expect(panelEl()).toBeNull()
    await openPanel(w)
    expect(panelEl()).not.toBeNull()
    expect(document.body.querySelectorAll('.sn-color-picker-panel__mode')).toHaveLength(2)
    expect(document.body.querySelector('.sn-color-picker-panel__hue')).not.toBeNull()
    expect(document.body.querySelector('.sn-color-picker-panel__alpha')).toBeNull()
  })

  it('hides the mode tabs when only one mode is offered', async () => {
    const w = mountPicker({ modes: ['hex'] })
    await openPanel(w)
    expect(document.body.querySelector('.sn-color-picker-panel__modes')).toBeNull()
  })

  it('shows the alpha rail when showAlpha is on', async () => {
    const w = mountPicker({ showAlpha: true })
    await openPanel(w)
    expect(document.body.querySelector('.sn-color-picker-panel__alpha')).not.toBeNull()
  })

  it('renders valid swatches and drops invalid entries', async () => {
    const w = mountPicker({ swatches: ['#ff0000', 'bad value', '#00ff00'] })
    await openPanel(w)
    const swatches = document.body.querySelectorAll('.sn-color-picker-panel__swatch')
    expect(swatches).toHaveLength(2)
    expect(swatches[1]?.getAttribute('aria-label')).toBe('Select #00ff00')
  })

  it('hides the swatch row when no entry is valid', async () => {
    const w = mountPicker({ swatches: ['bad'] })
    await openPanel(w)
    expect(document.body.querySelector('.sn-color-picker-panel__swatches')).toBeNull()
  })

  it('opens immediately when defaultShow is set', async () => {
    mountPicker({ defaultShow: true })
    await nextTick()
    expect(panelEl()).not.toBeNull()
  })

  /* ───── mode tabs ───── */

  it('switching the tab reformats the text input', async () => {
    const { wrapper } = mountVModel('#ff0000')
    await openPanel(wrapper)
    const input = document.body.querySelector<HTMLInputElement>('.sn-color-picker-panel__input')
    expect(input?.value).toBe('rgb(255, 0, 0)')
    const hexTab = [...document.body.querySelectorAll('.sn-color-picker-panel__mode')]
      .find(b => b.textContent?.trim() === 'HEX')
    hexTab?.click()
    await nextTick()
    expect(input?.value).toBe('#ff0000')
  })

  it('default model value initializes the sv handle at the black corner', async () => {
    const w = mountPicker()
    await openPanel(w)
    const handle = document.body.querySelector<HTMLElement>('.sn-color-picker-panel__sv-handle')
    expect(handle?.style.top).toBe('100%')
    expect(handle?.style.left).toBe('0%')
  })

  /* ───── SV drag ───── */

  it('dragging inside the SV square updates v-model live and change on release', async () => {
    const { wrapper, value } = mountVModel('#000000')
    await openPanel(wrapper)
    const sv = document.body.querySelector<HTMLElement>('.sn-color-picker-panel__sv')
    expect(sv).not.toBeNull()
    sv?.dispatchEvent(new PointerEvent('pointerdown', { clientX: 80, clientY: 10, bubbles: true }))
    await nextTick()
    // SV rect is 200x200 at origin → s = 80/200 = 40%, v = 100 - 10/200 = 95%.
    const expected = rgbOfHsv(0, 40, 95)
    expect(value.value).toBe(expected)
    const changes = wrapper.emitted('change')?.length ?? 0
    document.dispatchEvent(new PointerEvent('pointerup'))
    await nextTick()
    expect(wrapper.emitted('change')).toHaveLength(changes + 1)
    expect(wrapper.emitted('change')?.at(-1)).toEqual([expected])
  })

  it('document pointermove continues the SV drag', async () => {
    const { wrapper, value } = mountVModel('#000000')
    await openPanel(wrapper)
    const sv = document.body.querySelector<HTMLElement>('.sn-color-picker-panel__sv')
    sv?.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0, bubbles: true }))
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 100, clientY: 0 }))
    await nextTick()
    expect(value.value).toBe(rgbOfHsv(0, 50, 100))
    document.dispatchEvent(new PointerEvent('pointerup'))
  })

  /* ───── hue / alpha rails ───── */

  it('clicking the hue rail commits the new hue', async () => {
    const { wrapper, value } = mountVModel('#ff0000')
    await openPanel(wrapper)
    const hue = document.body.querySelector<HTMLElement>('.sn-color-picker-panel__hue')
    hue?.dispatchEvent(new PointerEvent('pointerdown', { clientX: 90, clientY: 5, bubbles: true }))
    document.dispatchEvent(new PointerEvent('pointerup'))
    await nextTick()
    // Rail is 200 wide at origin → 90/200 = 45% of 360 = 162° at full s/v.
    const expected = rgbOfHsv(162, 100, 100)
    expect(value.value).toBe(expected)
    expect(wrapper.emitted('change')?.at(-1)).toEqual([expected])
  })

  it('dragging the alpha rail outputs rgba', async () => {
    const { wrapper, value } = mountVModel('#ff0000', { showAlpha: true })
    await openPanel(wrapper)
    const alpha = document.body.querySelector<HTMLElement>('.sn-color-picker-panel__alpha')
    alpha?.dispatchEvent(new PointerEvent('pointerdown', { clientX: 50, clientY: 5, bubbles: true }))
    document.dispatchEvent(new PointerEvent('pointerup'))
    await nextTick()
    expect(value.value).toBe('rgba(255, 0, 0, 0.25)')
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['rgba(255, 0, 0, 0.25)'])
  })

  /* ───── swatches / input ───── */

  it('clicking a swatch commits its color', async () => {
    const { wrapper, value } = mountVModel('#000000', { swatches: ['#00ff00'] })
    await openPanel(wrapper)
    document.body.querySelector<HTMLElement>('.sn-color-picker-panel__swatch')?.click()
    await nextTick()
    expect(value.value).toBe('rgb(0, 255, 0)')
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['rgb(0, 255, 0)'])
  })

  it('typing a valid color in the input commits on Enter', async () => {
    const { wrapper, value } = mountVModel('#000000')
    await openPanel(wrapper)
    const input = document.body.querySelector<HTMLInputElement>('.sn-color-picker-panel__input')
    // Unchanged value — a no-op Enter must not re-emit.
    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('change')).toBeUndefined()
    input!.value = '#ff0000'
    input?.dispatchEvent(new Event('input', { bubbles: true }))
    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await nextTick()
    expect(value.value).toBe('rgb(255, 0, 0)')
  })

  it('an invalid input reverts to the formatted draft', async () => {
    const { wrapper } = mountVModel('#000000')
    await openPanel(wrapper)
    const input = document.body.querySelector<HTMLInputElement>('.sn-color-picker-panel__input')
    input!.value = 'zzz'
    input?.dispatchEvent(new Event('input', { bubbles: true }))
    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await nextTick()
    expect(input?.value).toBe('rgb(0, 0, 0)')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  /* ───── clearable / disabled / readonly ───── */

  it('clear restores the default color and emits clear', async () => {
    const w = mountPicker({ modelValue: '#ff0000', clearable: true })
    await w.find('.sn-color-picker__clear').trigger('click')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['#000000'])
    expect(w.emitted('change')?.at(-1)).toEqual(['#000000'])
    expect(w.emitted('clear')).toHaveLength(1)
  })

  it('hides the clear button when empty or disabled', () => {
    expect(mountPicker({ clearable: true }).find('.sn-color-picker__clear').exists()).toBe(false)
    expect(
      mountPicker({ modelValue: '#ff0000', clearable: true, disabled: true })
        .find('.sn-color-picker__clear').exists(),
    ).toBe(false)
  })

  it('does not open when disabled or readonly', async () => {
    const disabled = mountPicker({ disabled: true })
    await disabled.find('.sn-color-picker__selection').trigger('click')
    expect(panelEl()).toBeNull()
    expect(disabled.find('.sn-color-picker--disabled').exists()).toBe(true)
    const readonly = mountPicker({ readonly: true })
    await readonly.find('.sn-color-picker__selection').trigger('click')
    expect(panelEl()).toBeNull()
  })

  /* ───── keyboard ───── */

  it('ArrowRight steps the sv handle saturation by 1', async () => {
    const w = mountPicker({ modelValue: '#ffffff' })
    await openPanel(w)
    const handle = document.body.querySelector<HTMLElement>('.sn-color-picker-panel__sv-handle')
    handle?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await nextTick()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([rgbOfHsv(0, 1, 100)])
  })

  it('Shift+ArrowRight steps saturation by 10', async () => {
    const w = mountPicker({ modelValue: '#ffffff' })
    await openPanel(w)
    const handle = document.body.querySelector<HTMLElement>('.sn-color-picker-panel__sv-handle')
    handle?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', shiftKey: true, bubbles: true }))
    await nextTick()
    expect(w.emitted('change')?.at(-1)).toEqual([rgbOfHsv(0, 10, 100)])
  })

  it('ArrowUp steps the hue rail by 1', async () => {
    const w = mountPicker({ modelValue: '#ff0000' })
    await openPanel(w)
    const hue = document.body.querySelector<HTMLElement>('.sn-color-picker-panel__hue .sn-color-picker-panel__thumb')
    hue?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    await nextTick()
    expect(w.emitted('change')?.at(-1)).toEqual([rgbOfHsv(1, 100, 100)])
  })

  it('ArrowLeft steps the alpha rail by 0.01', async () => {
    const w = mountPicker({ modelValue: '#ff0000', showAlpha: true })
    await openPanel(w)
    const alpha = document.body.querySelector<HTMLElement>('.sn-color-picker-panel__alpha .sn-color-picker-panel__thumb')
    alpha?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    await nextTick()
    expect(w.emitted('change')?.at(-1)).toEqual(['rgba(255, 0, 0, 0.99)'])
  })

  /* ───── open/close + lifecycle ───── */

  it('toggles the panel on repeated clicks and closes on Escape', async () => {
    const w = mountPicker()
    const trigger = w.find('.sn-color-picker__selection')
    await trigger.trigger('click')
    expect(panelEl()).not.toBeNull()
    await trigger.trigger('click')
    await panelLeft()
    expect(panelEl()).toBeNull()
    await trigger.trigger('keydown', { key: 'Enter' })
    expect(panelEl()).not.toBeNull()
    await trigger.trigger('keydown', { key: 'Escape' })
    await nextTick()
    await panelLeft()
    expect(panelEl()).toBeNull()
  })

  it('closes on outside click but not inside the panel', async () => {
    const w = mountPicker()
    await openPanel(w)
    panelEl()?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    expect(panelEl()).not.toBeNull()
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    await panelLeft()
    expect(panelEl()).toBeNull()
  })

  it('removes the document listeners on unmount (no leak)', async () => {
    const w = mountPicker()
    await openPanel(w)
    const spy = vi.spyOn(document, 'removeEventListener')
    w.unmount()
    expect(spy).toHaveBeenCalledWith('mousedown', expect.any(Function))
    expect(spy).toHaveBeenCalledWith('pointermove', expect.any(Function))
    expect(spy).toHaveBeenCalledWith('pointerup', expect.any(Function))
    spy.mockRestore()
  })

  it('emits focus and blur from the trigger', async () => {
    const w = mountPicker()
    const trigger = w.find('.sn-color-picker__selection')
    await trigger.trigger('focus')
    await trigger.trigger('blur')
    expect(w.emitted('focus')).toHaveLength(1)
    expect(w.emitted('blur')).toHaveLength(1)
  })

  it('applies size class and positions the panel below the trigger', async () => {
    expect(mountPicker({ size: 'large' }).classes()).toContain('sn-color-picker--large')
    const w = mountPicker()
    await openPanel(w)
    await nextTick()
    const panel = panelEl()
    expect(panel?.style.top).toBe('332px')
    expect(panel?.classList.contains('sn-color-picker-panel--bottom')).toBe(true)
  })

  it('opens the panel through the sn-pop transition and settles with it mounted', async () => {
    // VTU stubs Transition by default; opt into the real one here so the
    // sn-pop enter classes are actually applied.
    const w = mount(SnColorPicker, {
      props: {},
      attachTo: document.body,
      global: { stubs: { transition: false } },
    })
    mounted.push(w)
    await openPanel(w)
    const panel = panelEl() as HTMLElement
    // Enter classes prove the Transition name is sn-pop (applied synchronously).
    expect(panel).not.toBeNull()
    expect(
      panel.classList.contains('sn-pop-enter-from') ||
        panel.classList.contains('sn-pop-enter-active'),
    ).toBe(true)
    // Enter completes within 300ms: panel still mounted, enter classes gone.
    await new Promise((resolve) => setTimeout(resolve, 300))
    const settled = panelEl() as HTMLElement | null
    expect(settled).not.toBeNull()
    expect(settled.classList.contains('sn-pop-enter-active')).toBe(false)
    expect(settled.classList.contains('sn-pop-enter-from')).toBe(false)
  })

  /* ───── scroll follow (useOverlayFollow) ───── */

  /** rAF stub that runs the queued frame synchronously. */
  function stubSyncFrame(): void {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0)
      return 0
    })
  }

  it('keeps the panel glued to the trigger when the page scrolls while open', async () => {
    const w = mountPicker()
    await openPanel(w)
    await nextTick()
    const panel = panelEl() as HTMLElement
    expect(panel.style.left).toBe('40px')
    // The page scrolled: the trigger's viewport rect moved 80px right.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        const cls = this.classList
        if (cls.contains('sn-color-picker-panel__sv')) {
          return { top: 0, left: 0, width: 200, height: 200, right: 200, bottom: 200, x: 0, y: 0, toJSON: () => ({}) }
        }
        if (cls.contains('sn-color-picker-panel__rail')) {
          return { top: 0, left: 0, width: 200, height: 12, right: 200, bottom: 12, x: 0, y: 0, toJSON: () => ({}) }
        }
        if (cls.contains('sn-color-picker-panel')) {
          return { top: 0, left: 0, width: 220, height: 300, right: 220, bottom: 300, x: 0, y: 0, toJSON: () => ({}) }
        }
        return { top: 300, left: 120, width: 200, height: 32, right: 320, bottom: 332, x: 120, y: 300, toJSON: () => ({}) }
      },
    )
    stubSyncFrame()
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(panel.style.left).toBe('120px')
    vi.unstubAllGlobals()
  })

  it('stops following page scroll once the panel closes', async () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const w = mountPicker()
    await openPanel(w)
    await nextTick()
    await w.find('.sn-color-picker__selection').trigger('click')
    await nextTick()
    expect(removeSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      expect.objectContaining({ capture: true }),
    )
  })

  it('stops following page scroll after unmount', async () => {
    const w = mountPicker()
    await openPanel(w)
    await nextTick()
    w.unmount()
    mounted.splice(mounted.indexOf(w), 1)
    const reads = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    stubSyncFrame()
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(reads).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
})
