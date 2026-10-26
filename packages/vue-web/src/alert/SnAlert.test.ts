import { readFileSync } from 'node:fs'

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import SnAlert from './SnAlert.vue'
import SnIcon from '../icon/SnIcon.vue'
import { expectIconRendered, expectNoMissingIcons } from '../test-utils/icon-assertions'

/** Mount SnAlert with slots, mirroring real usage. */
function mountAlert(
  props: Record<string, unknown> = {},
  slots: Record<string, () => unknown> = {},
) {
  return mount(
    defineComponent({
      components: { SnAlert },
      setup() {
        return () => h(SnAlert, props as never, slots as never)
      },
    }),
  )
}

/** Click the close button and let the async veto check settle. */
async function clickClose(wrapper: ReturnType<typeof mountAlert>) {
  await wrapper.find('.sn-alert__close').trigger('click')
  await nextTick()
  await nextTick()
}

describe('SnAlert (AUI-WEB-FB-008)', () => {
  describe('rendering', () => {
    it('renders with role="alert"', () => {
      const w = mountAlert()
      expect(w.find('.sn-alert').attributes('role')).toBe('alert')
    })

    it('exposes the data-snui-component hook', () => {
      const w = mountAlert()
      expect(w.find('.sn-alert').attributes('data-snui-component')).toBe('alert')
    })

    it('renders the title prop', () => {
      const w = mountAlert({ title: '注意' })
      expect(w.find('.sn-alert-body__title').text()).toBe('注意')
    })

    it('renders default slot content as the body', () => {
      const w = mountAlert({}, { default: () => '磁盘空间不足' })
      expect(w.find('.sn-alert-body__content').text()).toBe('磁盘空间不足')
    })

    it('omits the title element when no title and no header slot', () => {
      const w = mountAlert({}, { default: () => 'body only' })
      expect(w.find('.sn-alert-body__title').exists()).toBe(false)
    })

    it('omits the content element when there is no default slot', () => {
      const w = mountAlert({ title: '仅标题' })
      expect(w.find('.sn-alert-body__content').exists()).toBe(false)
    })

    it('defaults type to "default"', () => {
      const w = mountAlert()
      expect(w.find('.sn-alert').classes()).toContain('sn-alert--default')
    })

    it('applies the type modifier class', () => {
      const w = mountAlert({ type: 'warning' })
      expect(w.find('.sn-alert').classes()).toContain('sn-alert--warning')
    })
  })

  describe('bordered', () => {
    it('renders the border overlay by default', () => {
      const w = mountAlert()
      expect(w.find('.sn-alert__border').exists()).toBe(true)
    })

    it('omits the border overlay when bordered is false', () => {
      const w = mountAlert({ bordered: false })
      expect(w.find('.sn-alert__border').exists()).toBe(false)
    })

    it('drops the body bordered modifier when bordered is false', () => {
      const w = mountAlert({ bordered: false })
      expect(w.find('.sn-alert-body').classes()).not.toContain(
        'sn-alert-body--bordered',
      )
    })
  })

  describe('icon', () => {
    it('shows the type icon by default', () => {
      const w = mountAlert({ type: 'success' })
      expect(w.find('.sn-alert__icon').findComponent(SnIcon).exists()).toBe(true)
    })

    it('renders a real svg for every icon type', () => {
      // Regression: the type glyphs were passed as `:component="…"`, which is
      // not an SnIcon prop — every alert drew the `.sn-icon--missing`
      // placeholder instead of a glyph. `findComponent(SnIcon)` above still
      // passed, so assert on the rendered svg body.
      for (const type of ['success', 'info', 'warning', 'error']) {
        const w = mountAlert({ type })
        expectIconRendered(w.find('.sn-alert__icon'), '.sn-icon')
        expectNoMissingIcons(w, `SnAlert type=${type}`)
      }
    })

    it('hides the icon when showIcon is false', () => {
      const w = mountAlert({ type: 'success', showIcon: false })
      expect(w.find('.sn-alert__icon').exists()).toBe(false)
    })

    it('renders no icon column at all for type="default"', () => {
      // Regression: the column rendered empty but kept its 8px right margin,
      // so every default-type alert indented its body for nothing.
      const w = mountAlert({ type: 'default' })
      expect(w.find('.sn-alert__icon').exists()).toBe(false)
    })

    it('still renders the column when a default-type alert supplies an icon slot', () => {
      const w = mountAlert(
        { type: 'default' },
        { icon: () => h('span', { class: 'custom-icon' }, '!') },
      )
      expect(w.find('.sn-alert__icon .custom-icon').exists()).toBe(true)
    })

    it('marks the icon container aria-hidden', () => {
      const w = mountAlert({ type: 'info' })
      expect(w.find('.sn-alert__icon').attributes('aria-hidden')).toBe('true')
    })

    it('lets the icon slot replace the built-in icon', () => {
      const w = mountAlert(
        { type: 'info' },
        { icon: () => h('span', { class: 'custom-icon' }, '!') },
      )
      expect(w.find('.custom-icon').exists()).toBe(true)
      expect(w.find('.sn-alert__icon').findComponent(SnIcon).exists()).toBe(false)
    })

    it('renders a real svg in the close button', () => {
      // Same regression class as the type glyph: `:component="X"` left the
      // close button visually empty.
      const w = mountAlert({ closable: true })

      expectIconRendered(w.find('.sn-alert__close'), '.sn-icon')
      expectNoMissingIcons(w, 'SnAlert closable')
    })
  })

  /**
   * Icon / title centring.
   *
   * happy-dom has no layout engine, so the geometry contract is asserted
   * against the component's own CSS — the same approach SnSteps.test.ts uses
   * for its hover-colour guard. Measured in a real browser before/after:
   *
   *   before — glyph box 14×16 (squashed), glyph centre 3.5px above the first
   *            text line, close glyph 12.9–24.1px below it, and a title-only
   *            banner sitting 5.2px above its own vertical centre.
   *   after  — glyph 16×16, every offset +0.69px (sub-pixel font-metric noise
   *            between an svg box and the text ink inside the same line box).
   */
  describe('icon / title alignment', () => {
    const source = readFileSync('src/alert/SnAlert.vue', 'utf-8')
    const styleBlock = /<style scoped>([\s\S]*?)<\/style>/.exec(source)
    if (!styleBlock) throw new Error('SnAlert.vue lost its <style scoped> block')
    const style = styleBlock[1].replace(/\/\*[\s\S]*?\*\//g, '')

    /** Flatten the style block into { selectors, body } rules. */
    const rules = [...style.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({
      selectors: m[1].split(',').map((s) => s.replace(/\s+/g, ' ').trim()),
      body: m[2].replace(/\s+/g, ' ').trim(),
    }))

    function bodyOf(selector: string): string {
      const rule = rules.find((r) => r.selectors.includes(selector))
      if (!rule) throw new Error(`no CSS rule for "${selector}"`)
      return rule.body
    }

    it('aligns the icon and close columns to the first text line', () => {
      // `align-items: stretch` grew both columns to the banner height and left
      // their glyphs pinned at the top.
      expect(bodyOf('.sn-alert')).toContain('align-items: flex-start')
    })

    it('centres the glyph in a first-line-tall icon box', () => {
      const body = bodyOf('.sn-alert__icon')
      expect(body).toContain('display: flex')
      expect(body).toContain('align-items: center')
      expect(body).toContain('justify-content: center')
      // 1.6em == the first text line box (font-size 14px × line-height 1.6).
      expect(body).toContain('height: 1.6em')
    })

    it('drops the line-height collapse that offset the glyph', () => {
      expect(bodyOf('.sn-alert__icon')).not.toContain('line-height')
      expect(bodyOf('.sn-alert__close')).not.toContain('line-height')
    })

    it('lets the glyph size its own box instead of squashing it to 1em', () => {
      // SnIcon's wrapper is `width/height: 1em` (14px here) around a 16px svg,
      // so the wrapper shrank the svg horizontally to 14×16.
      expect(bodyOf('.sn-alert__icon :deep(.sn-icon)')).toContain('width: auto')
      expect(bodyOf('.sn-alert__icon :deep(svg)')).toContain('flex: none')
    })

    it('inherits font metrics in the close button so 1.6em matches the text', () => {
      // <button> ignores inherited font-size, so 1.6em resolved against the
      // UA's 13.33px and the × landed off the title line.
      const body = bodyOf('.sn-alert__close')
      expect(body).toContain('font: inherit')
      expect(body).toContain('height: 1.6em')
      expect(body).toContain('align-items: center')
    })

    it('keeps the 2px title gap on the pair, not on a title-only banner', () => {
      expect(bodyOf('.sn-alert-body__title')).not.toContain('margin-bottom')
      expect(
        bodyOf('.sn-alert-body__title + .sn-alert-body__content'),
      ).toContain('margin-top: 2px')
    })
  })

  describe('header slot', () => {
    it('overrides the title prop', () => {
      const w = mountAlert(
        { title: 'prop title' },
        { header: () => 'slot header' },
      )
      expect(w.find('.sn-alert-body__title').text()).toBe('slot header')
    })

    it('renders the header slot even without a title prop', () => {
      const w = mountAlert({}, { header: () => 'only slot' })
      expect(w.find('.sn-alert-body__title').text()).toBe('only slot')
    })
  })

  describe('closable', () => {
    it('renders no close button by default', () => {
      const w = mountAlert()
      expect(w.find('.sn-alert__close').exists()).toBe(false)
    })

    it('renders a close button when closable', () => {
      const w = mountAlert({ closable: true })
      const btn = w.find('.sn-alert__close')
      expect(btn.exists()).toBe(true)
      expect(btn.attributes('type')).toBe('button')
      expect(btn.attributes('aria-label')).toBe('关闭')
    })

    it('removes the alert once the leave transition finishes', async () => {
      const w = mountAlert({ closable: true }, { default: () => 'body' })
      await clickClose(w)
      // The <Transition> keeps the node until after-leave, so drive it.
      const transition = w.findComponent({ name: 'Transition' })
      expect(transition.exists()).toBe(true)
      await transition.vm.$emit('after-leave')
      await nextTick()
      expect(w.find('.sn-alert').exists()).toBe(false)
    })

    it('emits closeClick on close click', async () => {
      const w = mountAlert({ closable: true })
      await clickClose(w)
      expect(w.findComponent(SnAlert).emitted('closeClick')).toHaveLength(1)
    })

    it('calls onClose exactly once per click', async () => {
      // Regression: emitting an event named `close` makes Vue invoke the
      // `onClose` prop listener as well, so the callback used to fire twice.
      const onClose = vi.fn()
      const w = mountAlert({ closable: true, onClose })
      await clickClose(w)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('vetoes the dismissal when onClose returns false', async () => {
      const w = mountAlert(
        { closable: true, onClose: () => false },
        { default: () => 'body' },
      )
      await clickClose(w)
      // Still visible — the veto kept it mounted.
      expect(w.find('.sn-alert').exists()).toBe(true)
    })

    it('honours an async onClose resolving to false', async () => {
      const w = mountAlert(
        { closable: true, onClose: async () => false },
        { default: () => 'body' },
      )
      await clickClose(w)
      await nextTick()
      expect(w.find('.sn-alert').exists()).toBe(true)
    })

    it('dismisses when onClose resolves to anything other than false', async () => {
      const w = mountAlert({ closable: true, onClose: async () => true })
      await clickClose(w)
      const transition = w.findComponent({ name: 'Transition' })
      await transition.vm.$emit('after-leave')
      await nextTick()
      expect(w.find('.sn-alert').exists()).toBe(false)
    })
  })

  describe('after-leave callbacks', () => {
    it('calls onAfterLeave exactly once when the leave transition completes', async () => {
      // Regression: emitting `afterLeave` also maps onto the `onAfterLeave`
      // prop listener, so the callback used to fire twice.
      const onAfterLeave = vi.fn()
      const w = mountAlert({ closable: true, onAfterLeave })
      await clickClose(w)
      await w.findComponent({ name: 'Transition' }).vm.$emit('after-leave')
      expect(onAfterLeave).toHaveBeenCalledTimes(1)
    })

    it('calls the deprecated onAfterHide alias too', async () => {
      const onAfterHide = vi.fn()
      const w = mountAlert({ closable: true, onAfterHide })
      await clickClose(w)
      await w.findComponent({ name: 'Transition' }).vm.$emit('after-leave')
      expect(onAfterHide).toHaveBeenCalledTimes(1)
    })

    it('emits leave', async () => {
      const w = mountAlert({ closable: true })
      await clickClose(w)
      await w.findComponent({ name: 'Transition' }).vm.$emit('after-leave')
      expect(w.findComponent(SnAlert).emitted('leave')).toHaveLength(1)
    })
  })
})
