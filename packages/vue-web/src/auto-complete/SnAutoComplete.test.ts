/**
 * SnAutoComplete unit tests — web-end autocomplete input (naive-ui parity).
 *
 * Behavior-focused (AGENTS.md §46): v-model sync, option rendering (string
 * / object / nested label array + highlight), keyboard navigation, click
 * selection, clearable, getShow, blurAfterSelect, disabled, empty slot,
 * outside-click close, aria combobox wiring.
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import SnAutoComplete from './SnAutoComplete.vue'

function mountComplete(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(SnAutoComplete, { props, slots })
}

/** Mount with a live v-model so keystrokes accumulate. */
function mountVModel(initial: string, props: Record<string, unknown> = {}) {
  const value = ref(initial)
  const wrapper = mount({
    setup() {
      return () =>
        h(SnAutoComplete, {
          ...props,
          modelValue: value.value,
          'onUpdate:modelValue': (v: string) => { value.value = v },
        })
    },
  })
  return { wrapper: wrapper.findComponent(SnAutoComplete), value }
}

/** Focus the input to open the dropdown, then return helpers. */
async function openDropdown(wrapper: ReturnType<typeof mount>) {
  await wrapper.find('input').trigger('focus')
  return {
    menu: wrapper.find('.sn-auto-complete__menu'),
    options: wrapper.findAll('.sn-auto-complete__option'),
  }
}

/**
 * Wait out the sn-pop leave transition (150ms + frame timing) so a closed
 * panel is actually gone from the DOM before asserting.
 */
async function menuLeft(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 250))
}

describe('SnAutoComplete', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders a combobox input with the modelValue', () => {
    const wrapper = mountComplete({ modelValue: 'hello' })
    const input = wrapper.find('input')
    expect(input.attributes('role')).toBe('combobox')
    expect((input.element as HTMLInputElement).value).toBe('hello')
  })

  it('syncs v-model on keystroke and emits search', async () => {
    const { wrapper, value } = mountVModel('', { options: ['a', 'ab'] })
    await wrapper.find('input').setValue('a')
    expect(value.value).toBe('a')
    expect(wrapper.emitted('search')?.at(-1)).toEqual(['a'])
  })

  it('renders string options in the dropdown on focus', async () => {
    const wrapper = mountComplete({ modelValue: '', options: ['apple', 'banana'] })
    const { options } = await openDropdown(wrapper)
    expect(options).toHaveLength(2)
    expect(options[0].text()).toBe('apple')
  })

  it('renders object options with label and value semantics', async () => {
    const wrapper = mountComplete({
      modelValue: '',
      options: [{ label: 'Apple', value: 'apple' }, 'banana'],
    })
    const { options } = await openDropdown(wrapper)
    expect(options[0].text()).toBe('Apple')
    expect(options[1].text()).toBe('banana')
  })

  it('renders nested label array options as joined segments with highlight', async () => {
    const wrapper = mountComplete({
      modelValue: 'rail',
      options: [{ label: ['Inter', 'rail', ' 500'], value: 'inter-rail' }],
    })
    const { options } = await openDropdown(wrapper)
    expect(options[0].text()).toContain('rail')
    const hl = options[0].find('.sn-auto-complete__option-hl')
    expect(hl.exists()).toBe(true)
    expect(hl.text()).toBe('rail')
  })

  it('selects an option on click and emits select + change', async () => {
    const wrapper = mountComplete({ modelValue: '', options: ['apple', 'banana'] })
    const { options } = await openDropdown(wrapper)
    await options[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['banana'])
    expect(wrapper.emitted('update:value')?.at(-1)).toEqual(['banana'])
    expect(wrapper.emitted('select')?.at(-1)).toEqual(['banana'])
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['banana'])
  })

  it('commits the option value, not the label, for object options', async () => {
    const wrapper = mountComplete({
      modelValue: '',
      options: [{ label: 'Apple', value: 'apple' }],
    })
    const { options } = await openDropdown(wrapper)
    await options[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['apple'])
    expect(wrapper.emitted('select')?.at(-1)).toEqual(['apple'])
  })

  it('highlights the next option with ArrowDown and selects it with Enter', async () => {
    const wrapper = mountComplete({ modelValue: '', options: ['apple', 'banana', 'cherry'] })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.find('.sn-auto-complete__option--active').text()).toBe('apple')
    expect(input.attributes('aria-activedescendant')).toBeDefined()
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.find('.sn-auto-complete__option--active').text()).toBe('banana')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('select')?.at(-1)).toEqual(['banana'])
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['banana'])
  })

  it('wraps ArrowUp from none to the last option', async () => {
    const wrapper = mountComplete({ modelValue: '', options: ['apple', 'banana'] })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.find('.sn-auto-complete__option--active').text()).toBe('banana')
  })

  it('closes the dropdown with Escape', async () => {
    const wrapper = mountComplete({ modelValue: '', options: ['apple'] })
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(wrapper.find('.sn-auto-complete__menu').exists()).toBe(true)
    await input.trigger('keydown', { key: 'Escape' })
    await menuLeft()
    expect(wrapper.find('.sn-auto-complete__menu').exists()).toBe(false)
  })

  it('does not select disabled options via keyboard', async () => {
    const wrapper = mountComplete({
      modelValue: '',
      options: [{ label: 'apple', disabled: true }, 'banana'],
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    // Skips the disabled first option and lands on banana.
    expect(wrapper.find('.sn-auto-complete__option--active').text()).toBe('banana')
  })

  it('does not select disabled options via click', async () => {
    const wrapper = mountComplete({
      modelValue: '',
      options: [{ label: 'apple', disabled: true }],
    })
    const { options } = await openDropdown(wrapper)
    await options[0].trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('clears the value via the clear button', async () => {
    const wrapper = mountComplete({ modelValue: 'keep', clearable: true, options: ['keep'] })
    await wrapper.find('.sn-auto-complete__clear-btn').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
    expect(wrapper.emitted('change')?.at(-1)).toEqual([''])
  })

  it('hides the clear button when the value is empty', () => {
    const wrapper = mountComplete({ modelValue: '', clearable: true })
    expect(wrapper.find('.sn-auto-complete__clear-btn').exists()).toBe(false)
  })

  it('hides the clear button when disabled', () => {
    const wrapper = mountComplete({ modelValue: 'x', clearable: true, disabled: true })
    expect(wrapper.find('.sn-auto-complete__clear-btn').exists()).toBe(false)
  })

  it('derives candidates from getShow instead of options', async () => {
    const wrapper = mountComplete({
      modelValue: 'ap',
      options: ['should-not-show'],
      getShow: (v: string) => (v === 'ap' ? ['apple', 'apricot'] : []),
    })
    const { options } = await openDropdown(wrapper)
    expect(options).toHaveLength(2)
    expect(options[0].text()).toBe('apple')
  })

  it('shows the empty slot when there are no candidates', async () => {
    const wrapper = mountComplete(
      { modelValue: '', options: [] },
      { empty: () => h('span', { class: 'custom-empty' }, 'nothing here') },
    )
    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('.custom-empty').exists()).toBe(true)
  })

  it('blurs the input after selection when blurAfterSelect is on', async () => {
    const blurListener = vi.fn()
    const wrapper = mount(SnAutoComplete, {
      props: {
        modelValue: '',
        options: ['apple'],
        blurAfterSelect: true,
        onBlur: blurListener,
      },
      // Real DOM focus/blur need the element attached to the document —
      // happy-dom ignores focus() on detached trees.
      attachTo: document.body,
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    ;(input.element as HTMLInputElement).focus()
    await wrapper.findAll('.sn-auto-complete__option')[0].trigger('click')
    await new Promise((r) => setTimeout(r, 0))
    expect(blurListener).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('keeps focus after selection by default', async () => {
    const blurListener = vi.fn()
    const wrapper = mount(SnAutoComplete, {
      props: {
        modelValue: '',
        options: ['apple'],
        onBlur: blurListener,
      },
      attachTo: document.body,
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    ;(input.element as HTMLInputElement).focus()
    await wrapper.findAll('.sn-auto-complete__option')[0].trigger('click')
    await new Promise((r) => setTimeout(r, 0))
    expect(blurListener).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('does not open the dropdown when disabled', async () => {
    const wrapper = mountComplete({ modelValue: '', disabled: true, options: ['apple'] })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('.sn-auto-complete__menu').exists()).toBe(false)
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('does not open the dropdown when readonly', async () => {
    const wrapper = mountComplete({ modelValue: '', readonly: true, options: ['apple'] })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('.sn-auto-complete__menu').exists()).toBe(false)
    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('closes the dropdown on outside click and cleans up on unmount', async () => {
    const wrapper = mountComplete({ modelValue: '', options: ['apple'] })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.find('.sn-auto-complete__menu').exists()).toBe(true)
    document.dispatchEvent(new Event('pointerdown'))
    await wrapper.vm.$nextTick()
    await menuLeft()
    expect(wrapper.find('.sn-auto-complete__menu').exists()).toBe(false)

    // Listener must be removed on unmount — dispatch after unmount is a no-op.
    wrapper.unmount()
    expect(() => document.dispatchEvent(new Event('pointerdown'))).not.toThrow()
  })

  it('exposes aria combobox wiring on the input and listbox in the panel', async () => {
    const wrapper = mountComplete({ modelValue: '', options: ['apple'] })
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(input.attributes('aria-expanded')).toBe('true')
    const menuId = input.attributes('aria-controls')
    expect(menuId).toBeDefined()
    expect(wrapper.find(`#${menuId}`).attributes('role')).toBe('listbox')
    await input.trigger('blur')
    expect(input.attributes('aria-expanded')).toBe('false')
  })

  it('applies size and status classes', () => {
    expect(mountComplete({ size: 'large' }).classes()).toContain('sn-auto-complete--large')
    expect(mountComplete({ status: 'error' }).classes()).toContain('sn-auto-complete--status-error')
    expect(mountComplete({ status: 'warning' }).classes()).toContain('sn-auto-complete--status-warning')
  })

  it('forwards the placeholder', () => {
    const wrapper = mountComplete({ placeholder: 'Type a fruit' })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Type a fruit')
  })

  it('opens the dropdown through the sn-pop transition and settles with it mounted', async () => {
    // VTU stubs Transition by default; opt into the real one here so the
    // sn-pop enter classes are actually applied.
    const wrapper = mount(SnAutoComplete, {
      props: { modelValue: '', options: ['apple'] },
      global: { stubs: { transition: false } },
    })
    await wrapper.find('input').trigger('focus')
    const menu = wrapper.find('.sn-auto-complete__menu')
    // Enter classes prove the Transition name is sn-pop (applied synchronously).
    expect(menu.exists()).toBe(true)
    expect(
      menu.classes().includes('sn-pop-enter-from') ||
        menu.classes().includes('sn-pop-enter-active'),
    ).toBe(true)
    // Enter completes within 300ms: panel still mounted, enter classes gone.
    await new Promise((resolve) => setTimeout(resolve, 300))
    const settled = wrapper.find('.sn-auto-complete__menu')
    expect(settled.exists()).toBe(true)
    expect(settled.classes().includes('sn-pop-enter-active')).toBe(false)
    expect(settled.classes().includes('sn-pop-enter-from')).toBe(false)
  })

  /* ───── scroll follow (useOverlayFollow) ───── */

  /** rAF stub that runs the queued frame synchronously. */
  function stubSyncFrame(): void {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0)
      return 0
    })
  }

  it('re-derives the flip placement when the page scrolls while open', async () => {
    const w = mountComplete({ options: ['a', 'ab'] })
    await w.find('input').trigger('focus')
    await nextTick()
    const menu = w.find('.sn-auto-complete__menu')
    expect(menu.exists()).toBe(true)
    // Default (unmocked) rects leave plenty of room below — no flip.
    expect(menu.classes().includes('sn-auto-complete__menu--flip')).toBe(false)
    // The page scrolled: the field now sits near the viewport bottom.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        return {
          top: 700, left: 40, width: 200, height: 32, right: 240, bottom: 732, x: 40, y: 700, toJSON: () => ({}),
        }
      },
    )
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(
      function (this: HTMLElement) {
        return this.classList.contains('sn-auto-complete__menu') ? 160 : 0
      },
    )
    stubSyncFrame()
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    // No room below (768 - 732 < 160), room above — the dropdown flips up.
    expect(w.find('.sn-auto-complete__menu').classes()).toContain('sn-auto-complete__menu--flip')
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('stops following page scroll once the dropdown closes', async () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const w = mountComplete({ options: ['a', 'ab'] })
    await w.find('input').trigger('focus')
    await nextTick()
    await w.find('input').trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(removeSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      expect.objectContaining({ capture: true }),
    )
  })

  it('detaches the scroll follower on unmount', async () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const w = mountComplete({ options: ['a', 'ab'] })
    await w.find('input').trigger('focus')
    await nextTick()
    w.unmount()
    expect(removeSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      expect.objectContaining({ capture: true }),
    )
  })
})
