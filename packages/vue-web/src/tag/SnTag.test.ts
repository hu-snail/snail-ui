import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import SnTag from './SnTag.vue'

/** Mount SnTag through a wrapper component, mirroring real usage. */
function mountTag(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) {
  return mount(
    defineComponent({
      components: { SnTag },
      setup() {
        return () => h(SnTag, props as never, slots as never)
      },
    }),
  )
}

describe('SnTag (AUI-WEB-DS-002)', () => {
  describe('rendering', () => {
    it('renders a bordered medium default tag by default', () => {
      const w = mountTag({}, { default: () => '标签' })
      const root = w.find('.sn-tag')
      expect(root.classes()).toContain('sn-tag')
      expect(root.classes()).toContain('sn-tag--default')
      expect(root.classes()).toContain('sn-tag--medium')
      expect(root.classes()).toContain('sn-tag--bordered')
      expect(root.text()).toBe('标签')
    })

    it('applies the type modifier class for every semantic type', () => {
      for (const type of ['primary', 'info', 'success', 'warning', 'error'] as const) {
        const w = mountTag({ type })
        expect(w.find('.sn-tag').classes()).toContain(`sn-tag--${type}`)
      }
    })

    it('applies the size modifier classes', () => {
      for (const size of ['small', 'medium', 'large'] as const) {
        const w = mountTag({ size })
        expect(w.find('.sn-tag').classes()).toContain(`sn-tag--${size}`)
      }
    })

    it('drops the border when bordered is false', () => {
      const w = mountTag({ bordered: false })
      expect(w.find('.sn-tag').classes()).not.toContain('sn-tag--bordered')
    })

    it('marks round tags', () => {
      const w = mountTag({ round: true })
      expect(w.find('.sn-tag').classes()).toContain('sn-tag--round')
    })

    it('applies the color override via inline style', () => {
      const w = mountTag({ color: '#ff5722' })
      expect(w.find('.sn-tag').attributes('style')).toContain('background')
    })
  })

  describe('closable', () => {
    it('renders no close button by default', () => {
      const w = mountTag()
      expect(w.find('.sn-tag__close').exists()).toBe(false)
    })

    it('renders a close button with a real svg glyph', () => {
      // AGENTS.md §113: the close glyph must be an inline svg, never emoji.
      const w = mountTag({ closable: true })
      const btn = w.find('.sn-tag__close')
      expect(btn.exists()).toBe(true)
      expect(btn.attributes('aria-label')).toBe('关闭')
      expect(btn.find('svg').exists()).toBe(true)
    })

    it('emits close and hides the tag when the close button is clicked', async () => {
      const w = mountTag({ closable: true }, { default: () => '标签' })
      await w.find('.sn-tag__close').trigger('click')
      await w.vm.$nextTick()

      expect(w.findComponent(SnTag).emitted('close')).toHaveLength(1)
      expect(w.find('.sn-tag').exists()).toBe(false)
    })

    it('does not toggle the checked state when closing a checkable tag', async () => {
      const w = mountTag({ closable: true, checkable: true })
      await w.find('.sn-tag__close').trigger('click')
      await w.vm.$nextTick()

      expect(w.findComponent(SnTag).emitted('close')).toHaveLength(1)
      expect(w.findComponent(SnTag).emitted('update:checked')).toBeUndefined()
    })

    it('keeps the tag when disabled, even on close click', async () => {
      const w = mountTag({ closable: true, disabled: true })
      await w.find('.sn-tag__close').trigger('click')
      await w.vm.$nextTick()

      expect(w.findComponent(SnTag).emitted('close')).toBeUndefined()
      expect(w.find('.sn-tag').exists()).toBe(true)
    })
  })

  describe('checkable', () => {
    it('emits update:checked with the inverted value on click', async () => {
      const w = mountTag({ checkable: true, checked: false })
      await w.find('.sn-tag').trigger('click')

      expect(w.findComponent(SnTag).emitted('update:checked')?.[0]?.[0]).toBe(true)
    })

    it('supports v-model:checked', async () => {
      const w = mount(
        defineComponent({
          components: { SnTag },
          setup() {
            const checked = ref(false)
            return () =>
              h(SnTag, {
                checkable: true,
                checked: checked.value,
                'onUpdate:checked': (value: boolean) => {
                  checked.value = value
                },
              } as never)
          },
        }),
      )

      await w.find('.sn-tag').trigger('click')
      expect(w.find('.sn-tag').classes()).toContain('sn-tag--checked')

      await w.find('.sn-tag').trigger('click')
      expect(w.find('.sn-tag').classes()).not.toContain('sn-tag--checked')
    })

    it('toggles via keyboard enter and space', async () => {
      const w = mountTag({ checkable: true, checked: false })
      await w.find('.sn-tag').trigger('keydown.enter')
      expect(w.findComponent(SnTag).emitted('update:checked')?.[0]?.[0]).toBe(true)

      await w.find('.sn-tag').trigger('keydown.space')
      expect(w.findComponent(SnTag).emitted('update:checked')?.[1]?.[0]).toBe(true)
    })

    it('does not toggle when not checkable', async () => {
      const w = mountTag({ checked: false })
      await w.find('.sn-tag').trigger('click')
      expect(w.findComponent(SnTag).emitted('update:checked')).toBeUndefined()
    })

    it('does not toggle when disabled', async () => {
      const w = mountTag({ checkable: true, disabled: true })
      await w.find('.sn-tag').trigger('click')
      expect(w.findComponent(SnTag).emitted('update:checked')).toBeUndefined()
    })

    it('exposes button semantics for assistive tech', () => {
      const w = mountTag({ checkable: true, checked: true })
      const root = w.find('.sn-tag')
      expect(root.attributes('role')).toBe('button')
      expect(root.attributes('aria-pressed')).toBe('true')
      expect(root.attributes('tabindex')).toBe('0')
    })

    it('marks a disabled checkable tag as not focusable', () => {
      const w = mountTag({ checkable: true, disabled: true })
      const root = w.find('.sn-tag')
      expect(root.attributes('aria-disabled')).toBe('true')
      expect(root.attributes('tabindex')).toBeUndefined()
    })
  })
})
