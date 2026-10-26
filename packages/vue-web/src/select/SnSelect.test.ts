/**
 * SnSelect unit tests — web-end select (naive-ui parity).
 *
 * Behavior-focused (AGENTS.md §46): single/multiple v-model, filtering,
 * clearable, disabled, keyboard navigation, grouping, maxTagCount,
 * custom fields, outside-click close, events, a11y.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import SnSelect from './SnSelect.vue'

const FRUITS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Durian', value: 'durian', disabled: true },
]

/** Mounted wrappers tracked so afterEach can unmount before clearing body. */
const mounted: Array<{ unmount: () => void }> = []

/** Mount helper with default options. */
function mountSelect(props: Record<string, unknown> = {}) {
  const w = mount(SnSelect, {
    props: { options: FRUITS, ...props },
    attachTo: document.body,
  })
  mounted.push(w)
  return w
}

/** Mount with a live v-model so commits round-trip. */
function mountVModel(
  initial: unknown,
  props: Record<string, unknown> = {},
) {
  const value = ref<unknown>(initial)
  const wrapper = mount({
    setup() {
      return () =>
        h(SnSelect, {
          options: FRUITS,
          ...props,
          modelValue: value.value as never,
          'onUpdate:modelValue': (v: unknown) => { value.value = v },
        })
    },
  }, { attachTo: document.body })
  mounted.push(wrapper)
  return { wrapper: wrapper.findComponent(SnSelect), value }
}

/** Open the dropdown by clicking the trigger. */
async function openMenu(wrapper: ReturnType<typeof mountSelect>) {
  await wrapper.find('.sn-select__selection').trigger('click')
  await nextTick()
}

/**
 * Wait out the sn-pop leave transition (150ms + frame timing) so a closed
 * panel is actually gone from the DOM before asserting.
 */
async function menuLeft(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 250))
}

/** All option rows currently in the teleported menu. */
function menuRows(): HTMLElement[] {
  return Array.from(document.body.querySelectorAll<HTMLElement>('.sn-select-option'))
}

/** Row by its data-value. */
function rowByValue(value: string): HTMLElement | null {
  return document.body.querySelector<HTMLElement>(
    `.sn-select-option[data-value="${value}"]`,
  )
}

/** The trigger combobox element. */
function triggerOf(wrapper: ReturnType<typeof mountSelect>) {
  return wrapper.find('.sn-select__selection')
}

/** The most recently mounted wrapper (last element of `mounted`). */
function mountedWrapper(): { find: (sel: string) => { trigger: (ev: string, o?: unknown) => Promise<void> } } {
  const w = mounted[mounted.length - 1]
  if (!w) throw new Error('nothing mounted')
  return w as never
}

describe('SnSelect', () => {
  beforeEach(() => {
    // happy-dom has no layout — give the trigger + menu stable rects.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        const isMenu = this.classList.contains('sn-select-menu')
        return isMenu
          ? { top: 0, left: 0, width: 200, height: 160, right: 200, bottom: 160, x: 0, y: 0, toJSON: () => ({}) }
          : { top: 300, left: 40, width: 200, height: 32, right: 240, bottom: 332, x: 40, y: 300, toJSON: () => ({}) }
      },
    )
  })

  afterEach(async () => {
    // Unmount first so Vue removes its own Teleport nodes cleanly (wiping
    // document.body under a live component crashes the patcher).
    for (const w of mounted.splice(0)) w.unmount()
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  /* ───── single selection ───── */

  it('shows the placeholder when empty', () => {
    const w = mountSelect({ placeholder: 'Pick one' })
    expect(w.find('.sn-select__placeholder').text()).toBe('Pick one')
  })

  it('displays the selected option label', () => {
    const w = mountSelect({ modelValue: 'banana' })
    expect(w.find('.sn-select__single-value').text()).toBe('Banana')
  })

  it('selects an option from the menu and syncs v-model', async () => {
    const w = mountSelect()
    await openMenu(w)
    rowByValue('banana')?.click()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['banana'])
    expect(w.emitted('change')?.at(-1)).toEqual(['banana'])
  })

  it('round-trips selection through a live v-model harness', async () => {
    const { wrapper, value } = mountVModel(null)
    await wrapper.find('.sn-select__selection').trigger('click')
    await nextTick()
    document.body.querySelector<HTMLElement>('.sn-select-option[data-value="apple"]')?.click()
    expect(value.value).toBe('apple')
  })

  it('closes the menu after a single selection', async () => {
    const w = mountSelect()
    await openMenu(w)
    expect(document.body.querySelector('.sn-select-menu')).not.toBeNull()
    rowByValue('apple')?.click()
    await nextTick()
    await menuLeft()
    expect(document.body.querySelector('.sn-select-menu')).toBeNull()
  })

  it('marks the selected option with aria-selected', async () => {
    const w = mountSelect({ modelValue: 'cherry' })
    await openMenu(w)
    const row = rowByValue('cherry')
    expect(row?.getAttribute('aria-selected')).toBe('true')
    expect(row?.classList.contains('sn-select-option--selected')).toBe(true)
  })

  it('refuses to choose a disabled option', async () => {
    const w = mountSelect()
    await openMenu(w)
    rowByValue('durian')?.click()
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(document.body.querySelector('.sn-select-menu')).not.toBeNull()
  })

  /* ───── multiple ───── */

  it('renders tags for a multiple selection', () => {
    const w = mountSelect({ multiple: true, modelValue: ['apple', 'cherry'] })
    const tags = w.findAll('.sn-select__tag')
    expect(tags.map(t => t.text())).toEqual(['Apple', 'Cherry'])
  })

  it('toggles values in a multiple selection', async () => {
    const { wrapper, value } = mountVModel(['apple'], { multiple: true })
    await wrapper.find('.sn-select__selection').trigger('click')
    await nextTick()
    document.body.querySelector<HTMLElement>('.sn-select-option[data-value="cherry"]')?.click()
    expect(value.value).toEqual(['apple', 'cherry'])
    await nextTick()
    document.body.querySelector<HTMLElement>('.sn-select-option[data-value="apple"]')?.click()
    await nextTick()
    expect(value.value).toEqual(['cherry'])
  })

  it('keeps the menu open in multiple mode after selecting', async () => {
    const w = mountSelect({ multiple: true })
    await openMenu(w)
    rowByValue('apple')?.click()
    await nextTick()
    expect(document.body.querySelector('.sn-select-menu')).not.toBeNull()
  })

  it('removes a tag via its × button', async () => {
    const w = mountSelect({ multiple: true, modelValue: ['apple', 'banana'] })
    await w.findAll('.sn-select__tag-close')[1]!.trigger('click')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['apple']])
    expect(w.emitted('change')?.at(-1)).toEqual([['apple']])
  })

  it('removes the last tag with Backspace on an empty query', async () => {
    const w = mountSelect({ multiple: true, modelValue: ['apple', 'banana'], filterable: true })
    await openMenu(w)
    await w.find('.sn-select__filter-input').trigger('keydown', { key: 'Backspace' })
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['apple']])
  })

  it('collapses extra tags with maxTagCount', () => {
    const w = mountSelect({
      multiple: true,
      modelValue: ['apple', 'banana', 'cherry'],
      maxTagCount: 2,
    })
    const tags = w.findAll('.sn-select__tag')
    expect(tags.map(t => t.text())).toEqual(['Apple', 'Banana', '+1'])
  })

  /* ───── options normalization ───── */

  it('accepts bare string options', async () => {
    const w = mountSelect({ options: ['red', 'green'] })
    await openMenu(w)
    const labels = menuRows().map(r => r.textContent?.trim())
    expect(labels).toEqual(['red', 'green'])
    rowByValue('green')?.click()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['green'])
  })

  it('accepts bare number and boolean options', async () => {
    const w = mountSelect({ options: [1, true] })
    await openMenu(w)
    expect(rowByValue('1')).not.toBeNull()
    expect(rowByValue('true')).not.toBeNull()
  })

  it('supports labelField / valueField remapping', async () => {
    const { value } = mountVModel(null, {
      options: [
        { name: 'Alice', id: 'a1' },
        { name: 'Bob', id: 'b2' },
      ],
      labelField: 'name',
      valueField: 'id',
    })
    await openMenu(mountedWrapper())
    expect(rowByValue('a1')?.textContent?.trim()).toBe('Alice')
    rowByValue('b2')?.click()
    expect(value.value).toBe('b2')
  })

  it('renders grouped options with non-selectable group headers', async () => {
    const w = mountSelect({
      options: [
        {
          label: 'Fruits',
          value: 'fruits-group',
          children: [
            { label: 'Apple', value: 'apple' },
            { label: 'Banana', value: 'banana' },
          ],
        },
        {
          label: 'Veggies',
          value: 'veggies-group',
          children: [{ label: 'Kale', value: 'kale' }],
        },
      ],
    })
    await openMenu(w)
    const groups = Array.from(document.body.querySelectorAll('.sn-select-menu__group'))
    expect(groups).toHaveLength(2)
    expect(document.body.querySelector('.sn-select-menu__group-label')?.textContent).toBe('Fruits')
    // Only leaves are selectable rows.
    expect(menuRows().map(r => r.getAttribute('data-value'))).toEqual([
      'apple', 'banana', 'kale',
    ])
    rowByValue('kale')?.click()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['kale'])
  })

  it('supports a custom childrenField', async () => {
    mountSelect({
      options: [
        {
          label: 'Group A',
          value: 'ga',
          kids: [{ label: 'One', value: 1 }],
        },
      ],
      childrenField: 'kids',
    })
    // mounted; open and verify the child row exists
  })

  it('selects a leaf inside a custom childrenField group', async () => {
    const w = mountSelect({
      options: [
        { label: 'Group A', value: 'ga', kids: [{ label: 'One', value: 1 }] },
      ],
      childrenField: 'kids',
    })
    await openMenu(w)
    rowByValue('1')?.click()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([1])
  })

  /* ───── filterable ───── */

  it('filters options by label as the user types', async () => {
    const w = mountSelect({ filterable: true })
    await openMenu(w)
    const input = w.find('.sn-select__filter-input')
    await input.setValue('ban')
    await nextTick()
    const visible = menuRows().map(r => r.getAttribute('data-value'))
    expect(visible).toEqual(['banana'])
  })

  it('uses a custom filter predicate', async () => {
    const w = mountSelect({
      filterable: true,
      filter: (pattern: string, option: { label: string }) =>
        option.label.startsWith(pattern),
    })
    await openMenu(w)
    await w.find('.sn-select__filter-input').setValue('C')
    await nextTick()
    const visible = menuRows().map(r => r.getAttribute('data-value'))
    expect(visible).toEqual(['cherry'])
  })

  it('shows the empty state when nothing matches', async () => {
    const w = mountSelect({ filterable: true })
    await openMenu(w)
    await w.find('.sn-select__filter-input').setValue('zzz')
    await nextTick()
    expect(menuRows()).toHaveLength(0)
    expect(document.body.querySelector('.sn-select-menu__empty')?.textContent).toBe('No options')
  })

  it('emits search on every keystroke', async () => {
    const w = mountSelect({ filterable: true })
    await openMenu(w)
    const input = w.find('.sn-select__filter-input')
    await input.setValue('a')
    await input.setValue('ap')
    const emitted = w.emitted('search')
    expect(emitted).toEqual([['a'], ['ap']])
  })

  it('remote mode keeps the full list and still emits search', async () => {
    const w = mountSelect({ filterable: true, remote: true })
    await openMenu(w)
    await w.find('.sn-select__filter-input').setValue('zzz')
    // remote: the host owns filtering, options stay mounted
    expect(menuRows().map(r => r.getAttribute('data-value'))).toEqual([
      'apple', 'banana', 'cherry', 'durian',
    ])
  })

  /* ───── clearable ───── */

  it('clears the selection via the clear button', async () => {
    const w = mountSelect({ modelValue: 'apple', clearable: true })
    await w.find('.sn-select__clear').trigger('click')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([null])
    expect(w.emitted('clear')).toHaveLength(1)
  })

  it('clears a multiple selection to an empty array', async () => {
    const w = mountSelect({ multiple: true, modelValue: ['apple'], clearable: true })
    await w.find('.sn-select__clear').trigger('click')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([[]])
  })

  it('hides the clear button when empty or disabled', () => {
    expect(mountSelect({ clearable: true }).find('.sn-select__clear').exists()).toBe(false)
    expect(
      mountSelect({ modelValue: 'apple', clearable: true, disabled: true }).find('.sn-select__clear').exists(),
    ).toBe(false)
  })

  /* ───── disabled / readonly ───── */

  it('does not open when disabled', async () => {
    const w = mountSelect({ disabled: true })
    await triggerOf(w).trigger('click')
    expect(document.body.querySelector('.sn-select-menu')).toBeNull()
    expect(w.find('.sn-select--disabled').exists()).toBe(true)
  })

  it('does not open when readonly', async () => {
    const w = mountSelect({ readonly: true })
    await triggerOf(w).trigger('click')
    expect(document.body.querySelector('.sn-select-menu')).toBeNull()
  })

  it('does not respond to keyboard when disabled', async () => {
    const w = mountSelect({ disabled: true })
    await triggerOf(w).trigger('keydown', { key: 'Enter' })
    expect(document.body.querySelector('.sn-select-menu')).toBeNull()
  })

  /* ───── keyboard ───── */

  it('opens with Enter and selects the highlighted option with a second Enter', async () => {
    const w = mountSelect()
    const trigger = triggerOf(w)
    await trigger.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(document.body.querySelector('.sn-select-menu')).not.toBeNull()
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'Enter' })
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['apple'])
  })

  it('opens with Space without scrolling the page', async () => {
    const w = mountSelect()
    await triggerOf(w).trigger('keydown', { key: ' ' })
    await nextTick()
    expect(document.body.querySelector('.sn-select-menu')).not.toBeNull()
  })

  it('moves the highlight down then wraps around', async () => {
    const w = mountSelect()
    const trigger = triggerOf(w)
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    expect(trigger.attributes('aria-activedescendant')).toContain('sn-select-option')
    const pending = document.body.querySelector('.sn-select-option--pending')
    expect(pending?.getAttribute('data-value')).toBe('banana')
    // wrap: durian is disabled, skip to apple
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    const pending2 = document.body.querySelector('.sn-select-option--pending')
    expect(pending2?.getAttribute('data-value')).toBe('apple')
  })

  it('moves the highlight up from the first row to the last', async () => {
    const w = mountSelect()
    const trigger = triggerOf(w)
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'ArrowUp' })
    const pending = document.body.querySelector('.sn-select-option--pending')
    expect(pending?.getAttribute('data-value')).toBe('cherry')
  })

  it('closes with Escape', async () => {
    const w = mountSelect()
    await openMenu(w)
    await triggerOf(w).trigger('keydown', { key: 'Escape' })
    await nextTick()
    await menuLeft()
    expect(document.body.querySelector('.sn-select-menu')).toBeNull()
  })

  it('sets aria-expanded on the trigger', async () => {
    const w = mountSelect()
    const trigger = triggerOf(w)
    expect(trigger.attributes('aria-expanded')).toBe('false')
    await openMenu(w)
    expect(trigger.attributes('aria-expanded')).toBe('true')
  })

  /* ───── open/close behavior ───── */

  it('toggles the menu on repeated trigger clicks', async () => {
    const w = mountSelect()
    const trigger = triggerOf(w)
    await trigger.trigger('click')
    await nextTick()
    expect(document.body.querySelector('.sn-select-menu')).not.toBeNull()
    await trigger.trigger('click')
    await nextTick()
    await menuLeft()
    expect(document.body.querySelector('.sn-select-menu')).toBeNull()
  })

  it('closes on outside click', async () => {
    const w = mountSelect()
    await openMenu(w)
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    await menuLeft()
    expect(document.body.querySelector('.sn-select-menu')).toBeNull()
  })

  it('stays open when clicking inside the menu', async () => {
    const w = mountSelect()
    await openMenu(w)
    document.body.querySelector('.sn-select-menu')
      ?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    expect(document.body.querySelector('.sn-select-menu')).not.toBeNull()
  })

  it('removes the document listener on unmount (no leak)', async () => {
    const w = mountSelect()
    await openMenu(w)
    const spy = vi.spyOn(document, 'removeEventListener')
    w.unmount()
    expect(spy).toHaveBeenCalledWith('mousedown', expect.any(Function))
    spy.mockRestore()
  })

  /* ───── slots / loading / events ───── */

  it('renders header, empty and action slots', async () => {
    const w = mount(SnSelect, {
      props: { options: [], filterable: true },
      slots: {
        header: '<div data-testid="hd">Header</div>',
        empty: '<div data-testid="em">Nothing here</div>',
        action: '<div data-testid="ac">Action</div>',
      },
      attachTo: document.body,
    })
    mounted.push(w)
    await openMenu(w as never)
    expect(document.body.querySelector('[data-testid="hd"]')).not.toBeNull()
    expect(document.body.querySelector('[data-testid="em"]')).not.toBeNull()
    expect(document.body.querySelector('[data-testid="ac"]')).not.toBeNull()
  })

  it('shows the loading spinner instead of the arrow', () => {
    const w = mountSelect({ loading: true })
    expect(w.find('.sn-select__loading').exists()).toBe(true)
    expect(w.find('.sn-select__arrow').exists()).toBe(false)
  })

  it('flips the arrow direction while open', async () => {
    const w = mountSelect()
    expect(w.find('.sn-select__arrow--up').exists()).toBe(false)
    await openMenu(w)
    expect(w.find('.sn-select__arrow--up').exists()).toBe(true)
  })

  it('emits focus and blur from the trigger', async () => {
    const w = mountSelect()
    await triggerOf(w).trigger('focus')
    await triggerOf(w).trigger('blur')
    expect(w.emitted('focus')).toHaveLength(1)
    expect(w.emitted('blur')).toHaveLength(1)
  })

  it('emits scroll when the menu body scrolls', async () => {
    const w = mountSelect({ options: Array.from({ length: 40 }, (_, i) => ({ label: `Opt ${i}`, value: i })) })
    await openMenu(w)
    const body = document.body.querySelector('.sn-select-menu__body') as HTMLElement
    // jsdom-like env: clientHeight/scrollHeight are 0 → 0 + 0 >= 0 - 8 fires.
    body.dispatchEvent(new Event('scroll'))
    expect(w.emitted('scroll')).toHaveLength(1)
  })

  it('applies size and status classes', () => {
    expect(mountSelect({ size: 'large' }).classes()).toContain('sn-select--large')
    expect(mountSelect({ status: 'error' }).classes()).toContain('sn-select--status-error')
  })

  it('positions the menu below the trigger by default', async () => {
    const w = mountSelect()
    await openMenu(w)
    await nextTick()
    const menu = document.body.querySelector('.sn-select-menu') as HTMLElement
    expect(menu.style.top).toBe('332px')
    expect(menu.style.left).toBe('40px')
  })

  it('flips the menu above the trigger when below lacks room', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        const isMenu = this.classList.contains('sn-select-menu')
        return isMenu
          ? { top: 0, left: 0, width: 200, height: 160, right: 200, bottom: 160, x: 0, y: 0, toJSON: () => ({}) }
          : { top: 700, left: 40, width: 200, height: 32, right: 240, bottom: 732, x: 40, y: 700, toJSON: () => ({}) }
      },
    )
    // repositionMenu measures the layout box (offsetHeight), not the
    // transformed rect, so the enter scale never skews the flip math.
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(
      function (this: HTMLElement) {
        return this.classList.contains('sn-select-menu') ? 160 : 32
      },
    )
    const w = mountSelect()
    await openMenu(w)
    await nextTick()
    const menu = document.body.querySelector('.sn-select-menu') as HTMLElement
    expect(menu.classList.contains('sn-select-menu--top')).toBe(true)
    expect(menu.style.top).toBe('540px') // 700 - 160
  })

  it('opens the menu through the sn-pop transition and settles with it mounted', async () => {
    // VTU stubs Transition by default; opt into the real one here so the
    // sn-pop enter classes are actually applied.
    const w = mount(SnSelect, {
      props: { options: FRUITS },
      attachTo: document.body,
      global: { stubs: { transition: false } },
    })
    mounted.push(w)
    await openMenu(w)
    const menu = document.body.querySelector('.sn-select-menu') as HTMLElement
    // Enter classes prove the Transition name is sn-pop (applied synchronously).
    expect(menu).not.toBeNull()
    expect(
      menu.classList.contains('sn-pop-enter-from') ||
        menu.classList.contains('sn-pop-enter-active'),
    ).toBe(true)
    // Enter completes within 300ms: panel still mounted, enter classes gone.
    await new Promise((resolve) => setTimeout(resolve, 300))
    const settled = document.body.querySelector('.sn-select-menu') as HTMLElement | null
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

  const TRIGGER_RECT = (left: number) =>
    ({ top: 300, left, width: 200, height: 32, right: left + 200, bottom: 332, x: left, y: 300, toJSON: () => ({}) })
  const MENU_RECT =
    { top: 0, left: 0, width: 200, height: 160, right: 200, bottom: 160, x: 0, y: 0, toJSON: () => ({}) }

  it('keeps the menu glued to the trigger when the page scrolls while open', async () => {
    const w = mountSelect()
    await openMenu(w)
    await nextTick()
    const menu = document.body.querySelector('.sn-select-menu') as HTMLElement
    expect(menu.style.left).toBe('40px')
    // The page scrolled: the trigger's viewport rect moved 80px right.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        return this.classList.contains('sn-select-menu') ? MENU_RECT : TRIGGER_RECT(120)
      },
    )
    stubSyncFrame()
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    // The fixed-position menu re-derived its coords from the fresh rect.
    expect(menu.style.left).toBe('120px')
    vi.unstubAllGlobals()
  })

  it('stops following page scroll once the menu closes', async () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const w = mountSelect()
    await openMenu(w)
    await nextTick()
    await triggerOf(w).trigger('click')
    await nextTick()
    expect(removeSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      expect.objectContaining({ capture: true }),
    )
  })

  it('stops following page scroll after unmount', async () => {
    const w = mountSelect()
    await openMenu(w)
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

  it('shifts the menu left when the trigger sits at the viewport right edge (naive shrink)', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        return this.classList.contains('sn-select-menu') ? MENU_RECT : TRIGGER_RECT(900)
      },
    )
    // Trigger is 120 wide; the menu lays out 200 wide.
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(
      function (this: HTMLElement) {
        return this.classList.contains('sn-select-menu') ? 200 : 120
      },
    )
    const w = mountSelect()
    await openMenu(w)
    await nextTick()
    const menu = document.body.querySelector('.sn-select-menu') as HTMLElement
    // 900 + 200 would cross the viewport's right edge (innerWidth 1024):
    // the panel shifts left so its right edge fits — 1024 - 200 - 4.
    expect(menu.style.left).toBe('820px')
    expect(menu.style.top).toBe('332px')
  })
})
