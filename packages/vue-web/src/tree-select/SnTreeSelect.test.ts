/**
 * SnTreeSelect unit tests — web-end tree select (naive-ui parity).
 *
 * Behavior-focused (AGENTS.md §46): single/multiple v-model, expansion,
 * defaultExpandAll, filterable ancestor expand, clearable, disabled,
 * custom fields, keyboard navigation, outside-click close, a11y.
 *
 * The menu is Teleported to body, so row assertions go through
 * document.body (SnSelect test convention). getBoundingClientRect is
 * mocked — happy-dom has no layout.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import SnTreeSelect from './SnTreeSelect.vue'

const TREE = [
  {
    label: 'Fruits',
    key: 'fruits',
    children: [
      { label: 'Apple', key: 'apple' },
      { label: 'Banana', key: 'banana' },
    ],
  },
  {
    label: 'Veggies',
    key: 'veggies',
    disabled: true,
    children: [{ label: 'Kale', key: 'kale' }],
  },
  { label: 'Milk', key: 'milk' },
]

/** Mounted wrappers tracked so afterEach can unmount before clearing body. */
const mounted: Array<{ unmount: () => void }> = []

/** Mount helper with default options. */
function mountTree(props: Record<string, unknown> = {}) {
  const w = mount(SnTreeSelect, {
    props: { options: TREE, ...props },
    attachTo: document.body,
  })
  mounted.push(w)
  return w
}

/** Mount with a live v-model so commits round-trip. */
function mountVModel(initial: unknown, props: Record<string, unknown> = {}) {
  const value = ref<unknown>(initial)
  const wrapper = mount({
    setup() {
      return () =>
        h(SnTreeSelect, {
          options: TREE,
          ...props,
          modelValue: value.value as never,
          'onUpdate:modelValue': (v: unknown) => { value.value = v },
        })
    },
  }, { attachTo: document.body })
  mounted.push(wrapper)
  return { wrapper: wrapper.findComponent(SnTreeSelect), value }
}

/** Open the dropdown by clicking the trigger. */
async function openMenu(wrapper: { find: (sel: string) => { trigger: (ev: string, o?: unknown) => Promise<void> } }) {
  await wrapper.find('.sn-tree-select__selection').trigger('click')
  await nextTick()
}

/**
 * Wait out the sn-pop leave transition (150ms + frame timing) so a closed
 * panel is actually gone from the DOM before asserting.
 */
async function menuLeft(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 250))
}

/** All node rows currently in the teleported menu. */
function nodeRows(): HTMLElement[] {
  return Array.from(document.body.querySelectorAll<HTMLElement>('.sn-tree-select-node'))
}

/** Row by its data-value. */
function rowByValue(value: string): HTMLElement | null {
  return document.body.querySelector<HTMLElement>(
    `.sn-tree-select-node[data-value="${value}"]`,
  )
}

/** data-value list of all visible rows. */
function visibleValues(): string[] {
  return nodeRows().map(row => row.getAttribute('data-value') ?? '')
}

/** Switcher button of one node row. */
function switcherOf(value: string): HTMLElement | null {
  return rowByValue(value)?.querySelector<HTMLElement>('.sn-tree-select-node__switcher') ?? null
}

/** The trigger combobox element. */
function triggerOf(wrapper: ReturnType<typeof mountTree>) {
  return wrapper.find('.sn-tree-select__selection')
}

describe('SnTreeSelect', () => {
  beforeEach(() => {
    // happy-dom has no layout — give the trigger + menu stable rects.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        const isMenu = this.classList.contains('sn-tree-select-menu')
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
    const w = mountTree({ placeholder: 'Pick one' })
    expect(w.find('.sn-tree-select__placeholder').text()).toBe('Pick one')
  })

  it('displays the selected node label', () => {
    const w = mountTree({ modelValue: 'milk' })
    expect(w.find('.sn-tree-select__single-value').text()).toBe('Milk')
  })

  it('selects a leaf node and syncs v-model', async () => {
    const w = mountTree({ defaultExpandAll: true })
    await openMenu(w)
    rowByValue('apple')?.click()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['apple'])
    expect(w.emitted('change')?.at(-1)).toEqual(['apple'])
  })

  it('closes the menu after a single selection', async () => {
    const w = mountTree({ defaultExpandAll: true })
    await openMenu(w)
    expect(document.body.querySelector('.sn-tree-select-menu')).not.toBeNull()
    rowByValue('apple')?.click()
    await nextTick()
    await menuLeft()
    expect(document.body.querySelector('.sn-tree-select-menu')).toBeNull()
  })

  it('selects a parent node and commits only the parent value', async () => {
    const w = mountTree()
    await openMenu(w)
    rowByValue('fruits')?.click()
    // Parent selection commits the parent key alone — no cascade to children.
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['fruits'])
  })

  it('round-trips selection through a live v-model harness', async () => {
    const { wrapper, value } = mountVModel(null, { defaultExpandAll: true })
    await wrapper.find('.sn-tree-select__selection').trigger('click')
    await nextTick()
    rowByValue('banana')?.click()
    expect(value.value).toBe('banana')
  })

  it('marks the selected node with aria-selected', async () => {
    const w = mountTree({ modelValue: 'milk' })
    await openMenu(w)
    const row = rowByValue('milk')
    expect(row?.getAttribute('aria-selected')).toBe('true')
    expect(row?.classList.contains('sn-tree-select-node--selected')).toBe(true)
    expect(rowByValue('fruits')?.getAttribute('aria-selected')).toBe('false')
  })

  /* ───── expansion ───── */

  it('hides children until the parent is expanded', async () => {
    const w = mountTree()
    await openMenu(w)
    expect(visibleValues()).toEqual(['fruits', 'veggies', 'milk'])
  })

  it('expands and collapses a subtree via the switcher', async () => {
    const w = mountTree()
    await openMenu(w)
    switcherOf('fruits')?.click()
    await nextTick()
    expect(visibleValues()).toEqual(['fruits', 'apple', 'banana', 'veggies', 'milk'])
    switcherOf('fruits')?.click()
    await nextTick()
    expect(visibleValues()).toEqual(['fruits', 'veggies', 'milk'])
  })

  it('expands all levels with defaultExpandAll', async () => {
    const w = mountTree({ defaultExpandAll: true })
    await openMenu(w)
    expect(visibleValues()).toEqual([
      'fruits', 'apple', 'banana', 'veggies', 'kale', 'milk',
    ])
  })

  it('exposes tree aria structure on the menu rows', async () => {
    const w = mountTree({ defaultExpandAll: true })
    await openMenu(w)
    const menu = document.body.querySelector('.sn-tree-select-menu')
    expect(menu?.getAttribute('role')).toBe('tree')
    const parent = rowByValue('fruits')
    expect(parent?.getAttribute('role')).toBe('treeitem')
    expect(parent?.getAttribute('aria-level')).toBe('1')
    expect(parent?.getAttribute('aria-expanded')).toBe('true')
    const leaf = rowByValue('apple')
    expect(leaf?.getAttribute('aria-level')).toBe('2')
    expect(leaf?.getAttribute('aria-expanded')).toBeNull()
  })

  /* ───── multiple ───── */

  it('renders tags for a multiple selection', () => {
    const w = mountTree({ multiple: true, modelValue: ['fruits', 'milk'] })
    const tags = w.findAll('.sn-tree-select__tag')
    expect(tags.map(t => t.text())).toEqual(['Fruits', 'Milk'])
  })

  it('toggles values independently in multiple mode without cascade', async () => {
    const { wrapper, value } = mountVModel([], { multiple: true, defaultExpandAll: true })
    await wrapper.find('.sn-tree-select__selection').trigger('click')
    await nextTick()
    rowByValue('fruits')?.click()
    expect(value.value).toEqual(['fruits'])
    await nextTick()
    rowByValue('apple')?.click()
    expect(value.value).toEqual(['fruits', 'apple'])
    await nextTick()
    // Selecting a child never touches the parent's membership and vice versa.
    rowByValue('fruits')?.click()
    expect(value.value).toEqual(['apple'])
  })

  it('keeps the menu open in multiple mode after selecting', async () => {
    const w = mountTree({ multiple: true })
    await openMenu(w)
    rowByValue('fruits')?.click()
    await nextTick()
    expect(document.body.querySelector('.sn-tree-select-menu')).not.toBeNull()
  })

  it('removes a tag via its × button', async () => {
    const w = mountTree({ multiple: true, modelValue: ['fruits', 'milk'] })
    await w.findAll('.sn-tree-select__tag-close')[1]!.trigger('click')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['fruits']])
    expect(w.emitted('change')?.at(-1)).toEqual([['fruits']])
  })

  it('removes the last tag with Backspace on an empty query', async () => {
    const w = mountTree({ multiple: true, modelValue: ['fruits', 'milk'], filterable: true })
    await openMenu(w)
    await w.find('.sn-tree-select__filter-input').trigger('keydown', { key: 'Backspace' })
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['fruits']])
  })

  it('treats checkable as an alias of multiple', async () => {
    const { wrapper, value } = mountVModel([], { checkable: true })
    await wrapper.find('.sn-tree-select__selection').trigger('click')
    await nextTick()
    rowByValue('fruits')?.click()
    await nextTick()
    rowByValue('milk')?.click()
    expect(value.value).toEqual(['fruits', 'milk'])
  })

  /* ───── disabled ───── */

  it('does not select a disabled node', async () => {
    const w = mountTree()
    await openMenu(w)
    rowByValue('veggies')?.click()
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(document.body.querySelector('.sn-tree-select-menu')).not.toBeNull()
    expect(rowByValue('veggies')?.classList.contains('sn-tree-select-node--disabled')).toBe(true)
    expect(rowByValue('veggies')?.getAttribute('aria-disabled')).toBe('true')
  })

  it('still selects children under a disabled parent', async () => {
    const w = mountTree()
    await openMenu(w)
    switcherOf('veggies')?.click()
    await nextTick()
    rowByValue('kale')?.click()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['kale'])
  })

  it('does not open when disabled', async () => {
    const w = mountTree({ disabled: true })
    await triggerOf(w).trigger('click')
    expect(document.body.querySelector('.sn-tree-select-menu')).toBeNull()
    expect(w.find('.sn-tree-select--disabled').exists()).toBe(true)
  })

  it('does not open when readonly', async () => {
    const w = mountTree({ readonly: true })
    await triggerOf(w).trigger('click')
    expect(document.body.querySelector('.sn-tree-select-menu')).toBeNull()
  })

  it('does not respond to keyboard when disabled', async () => {
    const w = mountTree({ disabled: true })
    await triggerOf(w).trigger('keydown', { key: 'Enter' })
    expect(document.body.querySelector('.sn-tree-select-menu')).toBeNull()
  })

  /* ───── filterable ───── */

  it('filters nodes by label and expands ancestors of matches', async () => {
    const w = mountTree({ filterable: true })
    await openMenu(w)
    const input = w.find('.sn-tree-select__filter-input')
    await input.setValue('app')
    await nextTick()
    // Fruits stays visible as the auto-expanded ancestor of the match.
    expect(visibleValues()).toEqual(['fruits', 'apple'])
  })

  it('hides non-matching subtrees while filtering', async () => {
    const w = mountTree({ filterable: true })
    await openMenu(w)
    await w.find('.sn-tree-select__filter-input').setValue('kal')
    await nextTick()
    expect(visibleValues()).toEqual(['veggies', 'kale'])
  })

  it('matches parents by their own label while filtering', async () => {
    const w = mountTree({ filterable: true })
    await openMenu(w)
    await w.find('.sn-tree-select__filter-input').setValue('fru')
    await nextTick()
    expect(visibleValues()).toEqual(['fruits'])
  })

  it('shows the empty state when nothing matches', async () => {
    const w = mountTree({ filterable: true })
    await openMenu(w)
    await w.find('.sn-tree-select__filter-input').setValue('zzz')
    await nextTick()
    expect(nodeRows()).toHaveLength(0)
    expect(document.body.querySelector('.sn-tree-select-menu__empty')?.textContent).toBe('No data')
  })

  it('renders the empty slot with no options', async () => {
    const w = mount(SnTreeSelect, {
      props: { options: [] },
      slots: { empty: '<div data-testid="em">Nothing here</div>' },
      attachTo: document.body,
    })
    mounted.push(w)
    await openMenu(w as never)
    expect(document.body.querySelector('[data-testid="em"]')).not.toBeNull()
  })

  it('restores manual expansion after the filter is cleared', async () => {
    const w = mountTree({ filterable: true })
    await openMenu(w)
    switcherOf('fruits')?.click()
    await nextTick()
    const input = w.find('.sn-tree-select__filter-input')
    await input.setValue('zzz')
    await nextTick()
    await input.setValue('')
    await nextTick()
    expect(visibleValues()).toEqual(['fruits', 'apple', 'banana', 'veggies', 'milk'])
  })

  /* ───── clearable ───── */

  it('clears the selection via the clear button', async () => {
    const w = mountTree({ modelValue: 'milk', clearable: true })
    await w.find('.sn-tree-select__clear').trigger('click')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([null])
    expect(w.emitted('clear')).toHaveLength(1)
  })

  it('clears a multiple selection to an empty array', async () => {
    const w = mountTree({ multiple: true, modelValue: ['fruits'], clearable: true })
    await w.find('.sn-tree-select__clear').trigger('click')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([[]])
  })

  it('hides the clear button when empty or disabled', () => {
    expect(mountTree({ clearable: true }).find('.sn-tree-select__clear').exists()).toBe(false)
    expect(
      mountTree({ modelValue: 'milk', clearable: true, disabled: true }).find('.sn-tree-select__clear').exists(),
    ).toBe(false)
  })

  /* ───── custom fields ───── */

  it('supports labelField / keyField / childrenField remapping', async () => {
    const w = mountTree({
      options: [
        {
          name: 'Group',
          id: 'g1',
          nodes: [{ name: 'Child', id: 'c1' }],
        },
      ],
      labelField: 'name',
      keyField: 'id',
      childrenField: 'nodes',
    })
    await openMenu(w)
    expect(rowByValue('g1')?.textContent?.trim()).toBe('Group')
    switcherOf('g1')?.click()
    await nextTick()
    expect(rowByValue('c1')?.textContent?.trim()).toBe('Child')
    rowByValue('c1')?.click()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['c1'])
  })

  it('falls back to the value field when key is missing', async () => {
    const w = mountTree({
      options: [{ label: 'Apple', value: 'apple-value' }],
    })
    await openMenu(w)
    const row = rowByValue('apple-value')
    expect(row?.textContent?.trim()).toBe('Apple')
    row?.click()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['apple-value'])
  })

  /* ───── keyboard ───── */

  it('opens with Enter and selects the highlighted node with a second Enter', async () => {
    const w = mountTree()
    const trigger = triggerOf(w)
    await trigger.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(document.body.querySelector('.sn-tree-select-menu')).not.toBeNull()
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'Enter' })
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['apple'])
  })

  it('moves the highlight down then wraps around', async () => {
    const w = mountTree()
    const trigger = triggerOf(w)
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    expect(trigger.attributes('aria-activedescendant')).toContain('sn-tree-select-menu')
    const pending = document.body.querySelector('.sn-tree-select-node--pending')
    expect(pending?.getAttribute('data-value')).toBe('veggies')
    // wrap: milk → fruits
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    const pending2 = document.body.querySelector('.sn-tree-select-node--pending')
    expect(pending2?.getAttribute('data-value')).toBe('fruits')
  })

  it('collapses with ArrowLeft and jumps to the parent row', async () => {
    const w = mountTree({ defaultExpandAll: true })
    const trigger = triggerOf(w)
    await trigger.trigger('keydown', { key: 'Enter' })
    await nextTick()
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    // pending = apple (leaf) → ArrowLeft jumps to its parent
    await trigger.trigger('keydown', { key: 'ArrowLeft' })
    let pending = document.body.querySelector('.sn-tree-select-node--pending')
    expect(pending?.getAttribute('data-value')).toBe('fruits')
    // fruits is expanded → ArrowLeft collapses it
    await trigger.trigger('keydown', { key: 'ArrowLeft' })
    await nextTick()
    pending = document.body.querySelector('.sn-tree-select-node--pending')
    expect(pending?.getAttribute('data-value')).toBe('fruits')
    expect(visibleValues()).toEqual(['fruits', 'veggies', 'kale', 'milk'])
  })

  it('descends to the first child with a second ArrowRight', async () => {
    const w = mountTree({ defaultExpandAll: true })
    const trigger = triggerOf(w)
    await trigger.trigger('keydown', { key: 'Enter' })
    await nextTick()
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    // fruits already expanded → ArrowRight moves onto apple
    await trigger.trigger('keydown', { key: 'ArrowRight' })
    const pending = document.body.querySelector('.sn-tree-select-node--pending')
    expect(pending?.getAttribute('data-value')).toBe('apple')
  })

  it('opens with Space without scrolling the page', async () => {
    const w = mountTree()
    await triggerOf(w).trigger('keydown', { key: ' ' })
    await nextTick()
    expect(document.body.querySelector('.sn-tree-select-menu')).not.toBeNull()
  })

  it('lets the filter input receive spaces while open', async () => {
    const w = mountTree({ filterable: true })
    await openMenu(w)
    const input = w.find('.sn-tree-select__filter-input')
    // Space must not be swallowed by the combobox keydown handler while
    // the filter input owns the keystroke.
    const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
    input.element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
  })

  it('closes with Escape', async () => {
    const w = mountTree()
    await openMenu(w)
    await triggerOf(w).trigger('keydown', { key: 'Escape' })
    await nextTick()
    await menuLeft()
    expect(document.body.querySelector('.sn-tree-select-menu')).toBeNull()
  })

  it('sets aria-expanded on the trigger', async () => {
    const w = mountTree()
    const trigger = triggerOf(w)
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.attributes('aria-haspopup')).toBe('tree')
    await openMenu(w)
    expect(trigger.attributes('aria-expanded')).toBe('true')
  })

  /* ───── open/close behavior ───── */

  it('toggles the menu on repeated trigger clicks', async () => {
    const w = mountTree()
    const trigger = triggerOf(w)
    await trigger.trigger('click')
    await nextTick()
    expect(document.body.querySelector('.sn-tree-select-menu')).not.toBeNull()
    await trigger.trigger('click')
    await nextTick()
    await menuLeft()
    expect(document.body.querySelector('.sn-tree-select-menu')).toBeNull()
  })

  it('closes on outside click', async () => {
    const w = mountTree()
    await openMenu(w)
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    await menuLeft()
    expect(document.body.querySelector('.sn-tree-select-menu')).toBeNull()
  })

  it('stays open when clicking inside the menu', async () => {
    const w = mountTree()
    await openMenu(w)
    document.body.querySelector('.sn-tree-select-menu')
      ?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await nextTick()
    expect(document.body.querySelector('.sn-tree-select-menu')).not.toBeNull()
  })

  it('removes the document listener on unmount (no leak)', async () => {
    const w = mountTree()
    await openMenu(w)
    const spy = vi.spyOn(document, 'removeEventListener')
    w.unmount()
    expect(spy).toHaveBeenCalledWith('mousedown', expect.any(Function))
    spy.mockRestore()
  })

  /* ───── misc ───── */

  it('emits focus and blur from the trigger', async () => {
    const w = mountTree()
    await triggerOf(w).trigger('focus')
    await triggerOf(w).trigger('blur')
    expect(w.emitted('focus')).toHaveLength(1)
    expect(w.emitted('blur')).toHaveLength(1)
  })

  it('flips the arrow direction while open', async () => {
    const w = mountTree()
    expect(w.find('.sn-tree-select__arrow--up').exists()).toBe(false)
    await openMenu(w)
    expect(w.find('.sn-tree-select__arrow--up').exists()).toBe(true)
  })

  it('applies size and status classes', () => {
    expect(mountTree({ size: 'large' }).classes()).toContain('sn-tree-select--large')
    expect(mountTree({ status: 'error' }).classes()).toContain('sn-tree-select--status-error')
  })

  it('positions the menu below the trigger by default', async () => {
    const w = mountTree()
    await openMenu(w)
    await nextTick()
    const menu = document.body.querySelector('.sn-tree-select-menu') as HTMLElement
    expect(menu.style.top).toBe('332px')
    expect(menu.style.left).toBe('40px')
  })

  it('opens the menu through the sn-pop transition and settles with it mounted', async () => {
    // VTU stubs Transition by default; opt into the real one here so the
    // sn-pop enter classes are actually applied.
    const w = mount(SnTreeSelect, {
      props: { options: TREE },
      attachTo: document.body,
      global: { stubs: { transition: false } },
    })
    mounted.push(w)
    await openMenu(w)
    const menu = document.body.querySelector('.sn-tree-select-menu') as HTMLElement
    // Enter classes prove the Transition name is sn-pop (applied synchronously).
    expect(menu).not.toBeNull()
    expect(
      menu.classList.contains('sn-pop-enter-from') ||
        menu.classList.contains('sn-pop-enter-active'),
    ).toBe(true)
    // Enter completes within 300ms: panel still mounted, enter classes gone.
    await new Promise((resolve) => setTimeout(resolve, 300))
    const settled = document.body.querySelector('.sn-tree-select-menu') as HTMLElement | null
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
    const w = mountTree()
    await openMenu(w)
    await nextTick()
    const menu = document.body.querySelector('.sn-tree-select-menu') as HTMLElement
    expect(menu.style.left).toBe('40px')
    // The page scrolled: the trigger's viewport rect moved 80px right.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        return this.classList.contains('sn-tree-select-menu') ? MENU_RECT : TRIGGER_RECT(120)
      },
    )
    stubSyncFrame()
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(menu.style.left).toBe('120px')
    vi.unstubAllGlobals()
  })

  it('stops following page scroll once the menu closes', async () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const w = mountTree()
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
    const w = mountTree()
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
})
