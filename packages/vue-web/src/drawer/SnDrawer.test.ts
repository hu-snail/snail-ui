/**
 * SnDrawer tests — AUI-WEB-FB-003.
 *
 * Reference: naive-ui `n-drawer`. These tests pin the contract that is easy
 * to get wrong:
 *   - `width` only applies to left/right and `height` only to top/bottom;
 *   - the mask's three states (`true` / `'transparent'` / `false`) and the
 *     fact that `onMaskClick` fires even when `maskClosable` is off;
 *   - `displayDirective` deciding whether the panel unmounts;
 *   - Escape closing the drawer while honouring `closeOnEsc` + IME.
 *
 * The drawer teleports to `body` by default, so the tests mount with
 * `to: undefined` (teleport disabled) and read the markup in place.
 */

import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import SnDrawer from './SnDrawer.vue'
import SnDrawerContent from './SnDrawerContent.vue'

function mountDrawer(
  props: Record<string, unknown> = {},
  slots: Record<string, () => unknown> = {},
) {
  return mount(SnDrawer, {
    props: props as never,
    slots: slots as never,
    global: { stubs: { teleport: true } },
  })
}

function panelOf(wrapper: ReturnType<typeof mountDrawer>) {
  return wrapper.find('.sn-drawer')
}

describe('SnDrawer (AUI-WEB-FB-003)', () => {
  // The drawer locks <html> and teleports into `document.body`; reset both so
  // an earlier case cannot leak state (scroll lock / duplicate DOM nodes) into
  // the next one.
  beforeEach(() => {
    document.documentElement.style.overflow = ''
    document.body.innerHTML = ''
  })

  describe('rendering', () => {
    it('should not render the panel while closed', () => {
      expect(panelOf(mountDrawer({ show: false })).exists()).toBe(false)
    })

    it('should render the panel while open', () => {
      expect(panelOf(mountDrawer({ show: true })).exists()).toBe(true)
    })

    it('should expose the data-snui-component hook', () => {
      expect(
        panelOf(mountDrawer({ show: true })).attributes('data-snui-component'),
      ).toBe('SnDrawer')
    })

    it('should render as an aria-modal dialog', () => {
      const panel = panelOf(mountDrawer({ show: true }))

      expect(panel.attributes('role')).toBe('dialog')
      expect(panel.attributes('aria-modal')).toBe('true')
    })

    it('should render the default slot inside the content wrapper', () => {
      const wrapper = mountDrawer({ show: true }, { default: () => '抽屉内容' })

      expect(wrapper.find('.sn-drawer-content-wrapper').text()).toBe('抽屉内容')
    })
  })

  describe('placement', () => {
    it.each(['left', 'right', 'top', 'bottom'])(
      'should add the %s-placement modifier',
      (placement) => {
        const panel = panelOf(mountDrawer({ show: true, placement }))

        expect(panel.classes()).toContain(`sn-drawer--${placement}-placement`)
      },
    )

    it('should default to the right placement', () => {
      expect(panelOf(mountDrawer({ show: true })).classes()).toContain(
        'sn-drawer--right-placement',
      )
    })
  })

  describe('width and height', () => {
    it('should treat a numeric width as px', () => {
      const panel = panelOf(mountDrawer({ show: true, width: 400 }))

      expect(panel.element.style.width).toBe('400px')
    })

    it('should pass a CSS length width through untouched', () => {
      const panel = panelOf(mountDrawer({ show: true, width: '60%' }))

      expect(panel.element.style.width).toBe('60%')
    })

    it('should ignore width for vertical placements', () => {
      const panel = panelOf(mountDrawer({ show: true, placement: 'top', width: 400 }))

      expect(panel.element.style.width).toBe('')
    })

    it('should apply height to a top placement', () => {
      const panel = panelOf(mountDrawer({ show: true, placement: 'top', height: 300 }))

      expect(panel.element.style.height).toBe('300px')
    })

    it('should ignore height for horizontal placements', () => {
      const panel = panelOf(mountDrawer({ show: true, height: 300 }))

      expect(panel.element.style.height).toBe('')
    })

    it('should leave both dimensions to the stylesheet when unset', () => {
      const panel = panelOf(mountDrawer({ show: true }))

      expect(panel.element.style.width).toBe('')
      expect(panel.element.style.height).toBe('')
    })
  })

  describe('mask', () => {
    it('should render the mask by default', () => {
      expect(mountDrawer({ show: true }).find('.sn-drawer-mask').exists()).toBe(true)
    })

    it('should not render the mask when showMask is false', () => {
      expect(
        mountDrawer({ show: true, showMask: false }).find('.sn-drawer-mask').exists(),
      ).toBe(false)
    })

    it('should keep the transparent mask mounted and clickable', () => {
      const wrapper = mountDrawer({ show: true, showMask: 'transparent' })
      const mask = wrapper.find('.sn-drawer-mask')

      expect(mask.exists()).toBe(true)
      expect(mask.classes()).toContain('sn-drawer-mask--invisible')
    })

    it('should hide the mask from assistive tech', () => {
      expect(
        mountDrawer({ show: true }).find('.sn-drawer-mask').attributes('aria-hidden'),
      ).toBe('true')
    })

    it('should request a close on mask click when maskClosable', async () => {
      const wrapper = mountDrawer({ show: true, maskClosable: true })

      await wrapper.find('.sn-drawer-mask').trigger('click')

      expect(wrapper.emitted('update:show')).toEqual([[false]])
    })

    it('should not request a close when maskClosable is false', async () => {
      const wrapper = mountDrawer({ show: true, maskClosable: false })

      await wrapper.find('.sn-drawer-mask').trigger('click')

      expect(wrapper.emitted('update:show')).toBeUndefined()
    })

    it('should emit mask-click even when maskClosable is false', async () => {
      const wrapper = mountDrawer({ show: true, maskClosable: false })

      await wrapper.find('.sn-drawer-mask').trigger('click')

      expect(wrapper.emitted('mask-click')).toHaveLength(1)
    })

    it('should call onMaskClick with the mouse event', async () => {
      const onMaskClick = vi.fn()
      const wrapper = mountDrawer({ show: true, onMaskClick })

      await wrapper.find('.sn-drawer-mask').trigger('click')

      expect(onMaskClick).toHaveBeenCalledTimes(1)
      expect(onMaskClick.mock.calls[0]?.[0]).toBeInstanceOf(MouseEvent)
    })

    // Regression: `mask-click` maps onto the `onMaskClick` prop, so emitting it
    // already invokes the caller's handler. An extra manual call would fire twice.
    it('should invoke onMaskClick exactly once per click', async () => {
      const onMaskClick = vi.fn()
      const wrapper = mountDrawer({ show: true, onMaskClick })

      await wrapper.find('.sn-drawer-mask').trigger('click')
      await wrapper.find('.sn-drawer-mask').trigger('click')

      expect(onMaskClick).toHaveBeenCalledTimes(2)
    })
  })

  describe('escape', () => {
    it('should request a close on Escape', async () => {
      const wrapper = mountDrawer({ show: true })

      await wrapper.find('.sn-drawer-viewport').trigger('keydown', { key: 'Escape' })

      expect(wrapper.emitted('update:show')).toEqual([[false]])
    })

    it('should ignore Escape when closeOnEsc is false', async () => {
      const wrapper = mountDrawer({ show: true, closeOnEsc: false })

      await wrapper.find('.sn-drawer-viewport').trigger('keydown', { key: 'Escape' })

      expect(wrapper.emitted('update:show')).toBeUndefined()
    })

    it('should emit esc even when closeOnEsc is false', async () => {
      const wrapper = mountDrawer({ show: true, closeOnEsc: false })

      await wrapper.find('.sn-drawer-viewport').trigger('keydown', { key: 'Escape' })

      expect(wrapper.emitted('esc')).toHaveLength(1)
    })

    // Same double-fire trap as `onMaskClick`: `esc` maps onto the `onEsc` prop.
    it('should invoke onEsc exactly once per Escape', async () => {
      const onEsc = vi.fn()
      const wrapper = mountDrawer({ show: true, onEsc })

      await wrapper.find('.sn-drawer-viewport').trigger('keydown', { key: 'Escape' })

      expect(onEsc).toHaveBeenCalledTimes(1)
    })

    it('should ignore Escape pressed during IME composition', async () => {
      const wrapper = mountDrawer({ show: true })

      await wrapper.find('.sn-drawer-viewport').trigger('keydown', {
        key: 'Escape',
        isComposing: true,
      })

      expect(wrapper.emitted('update:show')).toBeUndefined()
    })

    it('should ignore other keys', async () => {
      const wrapper = mountDrawer({ show: true })

      await wrapper.find('.sn-drawer-viewport').trigger('keydown', { key: 'a' })

      expect(wrapper.emitted('update:show')).toBeUndefined()
    })
  })

  describe('displayDirective', () => {
    it('should keep the node mounted with "show" after hiding', async () => {
      const wrapper = mountDrawer({ show: true, displayDirective: 'show' })

      await wrapper.setProps({ show: false })

      // Still rendered (v-show keeps it), just visually hidden.
      expect(panelOf(wrapper).exists()).toBe(true)
    })

    it('should hide the node with v-show rather than unmounting it', async () => {
      const wrapper = mountDrawer({ show: true, displayDirective: 'show' })

      await wrapper.setProps({ show: false })

      expect(panelOf(wrapper).attributes('style')).toContain('display: none')
    })
  })

  describe('zIndex', () => {
    it('should apply z-index to the container when set', () => {
      const wrapper = mountDrawer({ show: true, zIndex: 2000 })

      expect(wrapper.find('.sn-drawer-container').element.style.zIndex).toBe('2000')
    })

    it('should leave z-index to the stylesheet when unset', () => {
      const wrapper = mountDrawer({ show: true })

      expect(wrapper.find('.sn-drawer-container').element.style.zIndex).toBe('')
    })
  })

  describe('nativeScrollbar', () => {
    it('should add the native-scrollbar modifier by default', () => {
      expect(panelOf(mountDrawer({ show: true })).classes()).toContain(
        'sn-drawer--native-scrollbar',
      )
    })

    it('should drop the modifier when disabled', () => {
      expect(
        panelOf(mountDrawer({ show: true, nativeScrollbar: false })).classes(),
      ).not.toContain('sn-drawer--native-scrollbar')
    })
  })

  describe('content passthrough', () => {
    it('should forward contentClass / contentStyle to the wrapper', () => {
      const wrapper = mountDrawer({
        show: true,
        contentClass: 'my-content',
        contentStyle: { padding: '0' },
      })
      const inner = wrapper.find('.sn-drawer-content-wrapper')

      expect(inner.classes()).toContain('my-content')
      expect(inner.attributes('style')).toContain('padding: 0')
    })

    it('should render a default SnDrawerContent when no slot is given', () => {
      const wrapper = mountDrawer({ show: true, title: '设置' })

      expect(wrapper.find('[data-snui-component="SnDrawerContent"]').exists()).toBe(true)
      expect(wrapper.find('.sn-drawer-header__main').text()).toBe('设置')
    })
  })

  describe('scroll lock', () => {
    it('should lock the html scroll while open', () => {
      const wrapper = mountDrawer({ show: true })

      expect(document.documentElement.style.overflow).toBe('hidden')

      wrapper.unmount()
    })

    it('should restore the html scroll on unmount', () => {
      const wrapper = mountDrawer({ show: true })
      wrapper.unmount()

      expect(document.documentElement.style.overflow).not.toBe('hidden')
    })

    it('should not lock when blockScroll is false', () => {
      const wrapper = mountDrawer({ show: true, blockScroll: false })

      expect(document.documentElement.style.overflow).not.toBe('hidden')

      wrapper.unmount()
    })
  })
})

describe('SnDrawerContent (AUI-WEB-FB-003)', () => {
  function mountContent(
    props: Record<string, unknown> = {},
    slots: Record<string, () => unknown> = {},
  ) {
    return mount(SnDrawerContent, { props: props as never, slots: slots as never })
  }

  it('should expose the data-snui-component hook', () => {
    expect(
      mountContent().find('.sn-drawer-content').attributes('data-snui-component'),
    ).toBe('SnDrawerContent')
  })

  it('should render the title prop in the header', () => {
    expect(mountContent({ title: '设置' }).find('.sn-drawer-header__main').text()).toBe(
      '设置',
    )
  })

  it('should mark the header title as a level-1 heading', () => {
    const main = mountContent({ title: '设置' }).find('.sn-drawer-header__main')

    expect(main.attributes('role')).toBe('heading')
    expect(main.attributes('aria-level')).toBe('1')
  })

  it('should let the header slot replace the title', () => {
    const wrapper = mountContent({ title: '来自 prop' }, { header: () => '来自插槽' })

    expect(wrapper.find('.sn-drawer-header__main').text()).toBe('来自插槽')
  })

  it('should omit the header when there is no title, slot or close button', () => {
    expect(mountContent().find('.sn-drawer-header').exists()).toBe(false)
  })

  it('should render the header for a bare closable drawer', () => {
    // Upstream renders the header when `closable` alone is set, so the close
    // button has a home.
    expect(mountContent({ closable: true }).find('.sn-drawer-header').exists()).toBe(
      true,
    )
  })

  it('should render the close button only when closable', () => {
    expect(mountContent({ closable: false }).find('.sn-drawer-header__close').exists()).toBe(
      false,
    )
    expect(mountContent({ closable: true }).find('.sn-drawer-header__close').exists()).toBe(
      true,
    )
  })

  it('should label the close button for screen readers', () => {
    expect(
      mountContent({ closable: true })
        .find('.sn-drawer-header__close')
        .attributes('aria-label'),
    ).toBe('关闭')
  })

  it('should emit close on close-button click', async () => {
    const wrapper = mountContent({ closable: true })

    await wrapper.find('.sn-drawer-header__close').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('should render the default slot in the body', () => {
    expect(mountContent({}, { default: () => '正文' }).find('.sn-drawer-body').text()).toBe(
      '正文',
    )
  })

  it('should omit the footer when the slot is empty', () => {
    expect(mountContent().find('.sn-drawer-footer').exists()).toBe(false)
  })

  it('should render the footer when the slot is filled', () => {
    expect(
      mountContent({}, { footer: () => '底部' }).find('.sn-drawer-footer').text(),
    ).toBe('底部')
  })

  it('should forward header / body / footer class and style', () => {
    const wrapper = mountContent({
      title: 't',
      headerClass: 'h',
      headerStyle: { color: 'red' },
      bodyClass: 'b',
      bodyStyle: { padding: '0' },
    })

    expect(wrapper.find('.sn-drawer-header').classes()).toContain('h')
    expect(wrapper.find('.sn-drawer-header').attributes('style')).toContain('color: red')
    expect(wrapper.find('.sn-drawer-body').classes()).toContain('b')
  })

  it('should close the parent drawer from the close button', async () => {
    const wrapper = mountDrawer(
      { show: true },
      {
        default: () => h(SnDrawerContent, { title: '设置', closable: true }),
      },
    )

    await wrapper.find('.sn-drawer-header__close').trigger('click')

    expect(wrapper.emitted('update:show')).toEqual([[false]])
  })
})
