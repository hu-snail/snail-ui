/**
 * SnDialog tests — AUI-WEB-FB-001.
 *
 * Reference: naive-ui `n-dialog`. These tests pin the observable contract
 * that is easy to get subtly wrong, in particular:
 *   - the action row's *presence* rule (slot > action > positiveText >
 *     negativeText) and the `content--last` margin it toggles;
 *   - the positive button inheriting the dialog `type`, with 'default'
 *     falling back to 'primary';
 *   - `loading` disabling *and* loading the positive button only;
 *   - the `type` → icon-colour token mapping, where 'default' uses the base
 *     `icon-color` token rather than a per-type one.
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SnDialog from './SnDialog.vue'
import { expectIconRendered, expectNoMissingIcons } from '../test-utils/icon-assertions'

function mountDialog(
  props: Record<string, unknown> = {},
  slots: Record<string, () => unknown> = {},
) {
  return mount(SnDialog, { props, slots })
}

/** The action row, or `null` when it was skipped. */
function actionOf(wrapper: ReturnType<typeof mountDialog>) {
  return wrapper.find('.sn-dialog__action')
}

/** Positive (confirm) button — always the last button in the row. */
function positiveOf(wrapper: ReturnType<typeof mountDialog>) {
  const buttons = wrapper.findAll('.sn-dialog__action button')
  return buttons[buttons.length - 1]
}

/** Negative (cancel) button — always the first button in the row. */
function negativeOf(wrapper: ReturnType<typeof mountDialog>) {
  return wrapper.findAll('.sn-dialog__action button')[0]
}

describe('SnDialog (AUI-WEB-FB-001)', () => {
  describe('rendering', () => {
    it('should render a `role="dialog"` panel', () => {
      const wrapper = mountDialog()

      expect(wrapper.find('.sn-dialog').attributes('role')).toBe('dialog')
    })

    it('should expose the data-snui-component hook', () => {
      expect(
        mountDialog().find('.sn-dialog').attributes('data-snui-component'),
      ).toBe('SnDialog')
    })

    it('should mark the panel as non-modal', () => {
      // SnDialog is the card only — the modal mask lives in the provider, so
      // claiming `aria-modal="true"` here would be a lie.
      expect(mountDialog().find('.sn-dialog').attributes('aria-modal')).toBe(
        'false',
      )
    })

    it('should render the title prop', () => {
      expect(mountDialog({ title: '确认删除' }).find('.sn-dialog__title').text()).toBe(
        '确认删除',
      )
    })

    it('should render the content prop in the body', () => {
      expect(
        mountDialog({ content: '删除后不可恢复' }).find('.sn-dialog__content').text(),
      ).toBe('删除后不可恢复')
    })

    it('should let the default slot replace the content prop', () => {
      const wrapper = mountDialog(
        { content: '来自 prop' },
        { default: () => '来自插槽' },
      )

      expect(wrapper.find('.sn-dialog__content').text()).toBe('来自插槽')
    })

    it('should let the header slot replace the title prop', () => {
      const wrapper = mountDialog(
        { title: '来自 prop' },
        { header: () => '来自插槽' },
      )

      expect(wrapper.find('.sn-dialog__title').text()).toBe('来自插槽')
    })
  })

  describe('close button', () => {
    it('should render when closable', () => {
      expect(mountDialog({ closable: true }).find('.sn-dialog__close').exists()).toBe(
        true,
      )
    })

    it('should be hidden when not closable', () => {
      expect(mountDialog({ closable: false }).find('.sn-dialog__close').exists()).toBe(
        false,
      )
    })

    it('should be focusable only with closeFocusable', () => {
      // tabindex="-1" keeps the button clickable but out of the tab order,
      // matching n-dialog's default.
      expect(
        mountDialog({ closeFocusable: false })
          .find('.sn-dialog__close')
          .attributes('tabindex'),
      ).toBe('-1')
      expect(
        mountDialog({ closeFocusable: true })
          .find('.sn-dialog__close')
          .attributes('tabindex'),
      ).toBe('0')
    })

    it('should emit close on click', async () => {
      const wrapper = mountDialog({ closable: true })

      await wrapper.find('.sn-dialog__close').trigger('click')

      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('should render a real svg in the close button', () => {
      // Regression: the glyph was passed as `:component="X"` — not an SnIcon
      // prop — so the button rendered the `.sn-icon--missing` placeholder with
      // no svg and looked empty.
      const wrapper = mountDialog({ closable: true })

      expectIconRendered(wrapper.find('.sn-dialog__close'), '.sn-icon')
      expectNoMissingIcons(wrapper, 'SnDialog closable')
    })

    it('should let the close slot replace the built-in button', () => {
      const wrapper = mountDialog(
        { closable: true },
        { close: () => '×' },
      )

      expect(wrapper.find('.sn-dialog__close').exists()).toBe(false)
      expect(wrapper.text()).toContain('×')
    })
  })

  describe('action row presence', () => {
    it('should render when positiveText is set', () => {
      expect(actionOf(mountDialog({ positiveText: '确定' })).exists()).toBe(true)
    })

    it('should render when only negativeText is set', () => {
      expect(actionOf(mountDialog({ negativeText: '取消' })).exists()).toBe(true)
    })

    it('should render for the action slot alone', () => {
      const wrapper = mountDialog({}, { action: () => '自定义' })

      expect(actionOf(wrapper).exists()).toBe(true)
      expect(actionOf(wrapper).text()).toBe('自定义')
    })

    it('should be skipped when there is nothing to show', () => {
      expect(actionOf(mountDialog({ content: '只有正文' })).exists()).toBe(false)
    })

    it('should drop the body bottom margin when the row is absent', () => {
      expect(
        mountDialog({ content: 'x' }).find('.sn-dialog__content').classes(),
      ).toContain('sn-dialog__content--last')
    })

    it('should keep the body bottom margin when the row is present', () => {
      expect(
        mountDialog({ content: 'x', positiveText: '确定' })
          .find('.sn-dialog__content')
          .classes(),
      ).not.toContain('sn-dialog__content--last')
    })
  })

  describe('built-in buttons', () => {
    it('should render both buttons when both texts are set', () => {
      const wrapper = mountDialog({ positiveText: '确定', negativeText: '取消' })

      expect(wrapper.findAll('.sn-dialog__action button')).toHaveLength(2)
    })

    it('should render only the positive button when negativeText is absent', () => {
      const wrapper = mountDialog({ positiveText: '确定' })
      const buttons = wrapper.findAll('.sn-dialog__action button')

      expect(buttons).toHaveLength(1)
      expect(buttons[0]?.text()).toBe('确定')
    })

    it('should place the negative button before the positive one', () => {
      const wrapper = mountDialog({ positiveText: '确定', negativeText: '取消' })

      expect(negativeOf(wrapper).text()).toBe('取消')
      expect(positiveOf(wrapper).text()).toBe('确定')
    })

    it('should emit positive-click with the mouse event', async () => {
      const wrapper = mountDialog({ positiveText: '确定' })

      await positiveOf(wrapper).trigger('click')

      const events = wrapper.emitted('positive-click')
      expect(events).toHaveLength(1)
      expect(events?.[0]?.[0]).toBeInstanceOf(MouseEvent)
    })

    it('should emit negative-click with the mouse event', async () => {
      const wrapper = mountDialog({ negativeText: '取消' })

      await negativeOf(wrapper).trigger('click')

      expect(wrapper.emitted('negative-click')).toHaveLength(1)
    })

    it('should not emit positive-click when the action slot takes over', async () => {
      const wrapper = mountDialog(
        { positiveText: '确定' },
        { action: () => '自定义' },
      )

      expect(wrapper.findAll('.sn-dialog__action button')).toHaveLength(0)
    })
  })

  describe('positive button type', () => {
    it('should fall back to primary for the default type', () => {
      const wrapper = mountDialog({ type: 'default', positiveText: '确定' })
      const button = positiveOf(wrapper)

      expect(button?.classes().join(' ')).toMatch(/primary/)
    })

    it('should inherit an explicit type', () => {
      const wrapper = mountDialog({ type: 'error', positiveText: '删除' })
      const button = positiveOf(wrapper)

      expect(button?.classes().join(' ')).toMatch(/error/)
    })

    it('should not tint the negative button by type', () => {
      const wrapper = mountDialog({ type: 'error', negativeText: '取消' })

      // Upstream passes no `type` to the cancel button, so it stays ghost.
      expect(negativeOf(wrapper)?.classes().join(' ')).not.toMatch(/error/)
    })
  })

  describe('loading', () => {
    it('should put the positive button into its loading state', () => {
      const wrapper = mountDialog({ positiveText: '提交', loading: true })

      expect(positiveOf(wrapper)?.attributes('aria-busy')).toBe('true')
    })

    it('should disable the positive button while loading', () => {
      const wrapper = mountDialog({ positiveText: '提交', loading: true })

      expect(positiveOf(wrapper)?.attributes('disabled')).toBeDefined()
    })

    it('should leave the negative button untouched', () => {
      const wrapper = mountDialog({
        positiveText: '提交',
        negativeText: '取消',
        loading: true,
      })

      expect(negativeOf(wrapper)?.attributes('aria-busy')).toBeUndefined()
      expect(negativeOf(wrapper)?.attributes('disabled')).toBeUndefined()
    })
  })

  describe('type and icon', () => {
    it('should render the icon by default', () => {
      expect(mountDialog({ title: 't' }).find('.sn-dialog__icon').exists()).toBe(true)
    })

    it('should render a real svg for every icon type', () => {
      // Regression: type glyphs went through `:component="…"`, a prop SnIcon
      // does not declare, so `.sn-dialog__icon` existed but held only the
      // placeholder. Assert the svg body for each type (incl. the default).
      for (const type of ['default', 'info', 'success', 'warning', 'error']) {
        const wrapper = mountDialog({ type, title: 't' })
        const icon = wrapper.find('.sn-dialog__icon')
        if (icon.exists()) {
          expectIconRendered(icon, '.sn-icon')
        }
        expectNoMissingIcons(wrapper, `SnDialog type=${type}`)
      }
    })

    it('should hide the icon when showIcon is false', () => {
      const wrapper = mountDialog({ showIcon: false })

      expect(wrapper.find('.sn-dialog__icon').exists()).toBe(false)
      expect(wrapper.find('.sn-dialog__icon-container').exists()).toBe(false)
    })

    it('should keep the icon hidden even when the icon slot is filled', () => {
      // Upstream builds one `icon` node behind `showIcon ? … : null` and
      // reuses it for both placements, so the slot cannot bypass the gate.
      const wrapper = mountDialog({ showIcon: false }, { icon: () => '!' })

      expect(wrapper.find('.sn-dialog__icon').exists()).toBe(false)
    })

    it('should let the icon slot replace the built-in glyph', () => {
      const wrapper = mountDialog({ title: 't' }, { icon: () => '★' })

      expect(wrapper.find('.sn-dialog__icon').text()).toBe('★')
    })

    it('should use the base icon-colour token for the default type', () => {
      // Upstream `createKey('iconColor', 'default')` → `iconColor`, i.e. the
      // un-suffixed token (primary), *not* the info token.
      const wrapper = mountDialog({ type: 'default' })
      const style = wrapper.find('.sn-dialog__icon').attributes('style') ?? ''

      expect(style).toContain('--sn-web-dialog-icon-color)')
      expect(style).not.toContain('--sn-web-dialog-icon-color-info')
    })

    it.each([
      ['info', '--sn-web-dialog-icon-color-info'],
      ['success', '--sn-web-dialog-icon-color-success'],
      ['warning', '--sn-web-dialog-icon-color-warning'],
      ['error', '--sn-web-dialog-icon-color-error'],
    ])('should use the %s icon-colour token for type=%s', (type, token) => {
      const wrapper = mountDialog({ type })
      const style = wrapper.find('.sn-dialog__icon').attributes('style') ?? ''

      expect(style).toContain(token)
    })
  })

  describe('iconPlacement', () => {
    it('should default to the left placement', () => {
      expect(mountDialog().find('.sn-dialog').classes()).toContain(
        'sn-dialog--icon-left',
      )
    })

    it('should hoist the icon into its own row when top', () => {
      const wrapper = mountDialog({ iconPlacement: 'top' })

      expect(wrapper.find('.sn-dialog').classes()).toContain('sn-dialog--icon-top')
      expect(wrapper.find('.sn-dialog__icon-container').exists()).toBe(true)
    })

    it('should not render the extra row when left', () => {
      expect(
        mountDialog({ iconPlacement: 'left' })
          .find('.sn-dialog__icon-container')
          .exists(),
      ).toBe(false)
    })

    it('should keep the extra row out of the way when showIcon is false', () => {
      const wrapper = mountDialog({ iconPlacement: 'top', showIcon: false })

      expect(wrapper.find('.sn-dialog__icon-container').exists()).toBe(false)
    })
  })

  describe('bordered', () => {
    it('should add the bordered modifier', () => {
      expect(mountDialog({ bordered: true }).find('.sn-dialog').classes()).toContain(
        'sn-dialog--bordered',
      )
    })

    it('should omit the modifier by default', () => {
      expect(mountDialog().find('.sn-dialog').classes()).not.toContain(
        'sn-dialog--bordered',
      )
    })
  })

  describe('pop transition', () => {
    it('should mount with the sn-dialog-pop transition name', () => {
      // VTU stubs <Transition> by default, which erases exactly the enter
      // classes pinned here — opt back into the real Transition for this
      // case. With `appear`, the enter fires on first mount, so the card a
      // caller renders with a plain `v-if="show"` pops (opacity + scale)
      // instead of snapping in. Docs demos and e2e key off the class
      // prefix, so the name is part of the observable contract.
      const wrapper = mount(SnDialog, {
        props: { title: 't' },
        global: { stubs: { transition: false } },
      })

      expect(wrapper.find('.sn-dialog').classes()).toEqual(
        expect.arrayContaining(['sn-dialog-pop-enter-from', 'sn-dialog-pop-enter-active']),
      )
    })
  })

  describe('class and style passthrough', () => {
    it('should forward titleClass / titleStyle to the title row', () => {
      const wrapper = mountDialog({
        title: 't',
        titleClass: 'my-title',
        titleStyle: { color: 'red' },
      })
      const title = wrapper.find('.sn-dialog__title')

      expect(title.classes()).toContain('my-title')
      expect(title.attributes('style')).toContain('color: red')
    })

    it('should forward contentClass / contentStyle to the body', () => {
      const wrapper = mountDialog({
        contentClass: 'my-content',
        contentStyle: { 'text-align': 'right' },
      })
      const content = wrapper.find('.sn-dialog__content')

      expect(content.classes()).toContain('my-content')
      expect(content.attributes('style')).toContain('text-align: right')
    })

    it('should forward actionClass / actionStyle to the action row', () => {
      const wrapper = mountDialog({
        positiveText: '确定',
        actionClass: 'my-action',
        actionStyle: { 'justify-content': 'center' },
      })
      const action = actionOf(wrapper)

      expect(action.classes()).toContain('my-action')
      expect(action.attributes('style')).toContain('justify-content: center')
    })

    it('should accept array class values', () => {
      const wrapper = mountDialog({ titleClass: ['a', undefined, 'b'] })

      expect(wrapper.find('.sn-dialog__title').classes()).toEqual(
        expect.arrayContaining(['a', 'b']),
      )
    })
  })

  describe('closable modifier', () => {
    it('should add the closable modifier when closable', () => {
      expect(mountDialog({ closable: true }).find('.sn-dialog').classes()).toContain(
        'sn-dialog--closable',
      )
    })

    it('should omit the modifier when not closable', () => {
      expect(mountDialog({ closable: false }).find('.sn-dialog').classes()).not.toContain(
        'sn-dialog--closable',
      )
    })
  })
})
