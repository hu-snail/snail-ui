/**
 * sn-text unit tests — uni-end semantic text (AUI-MP-DS-005).
 *
 * Covers the reference surface: type / text / size / mode / decoration / call /
 * bold / format / color / prefix / suffix / lines / lineHeight / customClass /
 * customStyle, plus the slot overrides and the click event.
 *
 * Assertions stay on classes / attributes / text — happy-dom drops CSS lengths
 * it cannot parse, so `rpx` values are never asserted.
 */

import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SnText from './sn-text.vue'

/** Minimal shape of the runtime global the `call` prop reads. */
interface PhoneCallSpy {
  makePhoneCall: (options: { phoneNumber: string }) => void
}

afterEach(() => {
  delete (globalThis as { uni?: PhoneCallSpy }).uni
})

describe('sn-text', () => {
  describe('content', () => {
    it('renders the text prop', () => {
      const w = mount(SnText, { props: { text: '你好' } })
      expect(w.text()).toBe('你好')
    })

    it('renders a numeric text prop', () => {
      const w = mount(SnText, { props: { text: 42 } })
      expect(w.text()).toBe('42')
    })

    it('prefers the default slot over the text prop', () => {
      const w = mount(SnText, { props: { text: 'prop' }, slots: { default: 'slot' } })
      expect(w.text()).toBe('slot')
    })

    it('renders prefix and suffix around the body', () => {
      const w = mount(SnText, { props: { text: '9.9', prefix: '¥', suffix: '/件' } })
      expect(w.text()).toBe('¥9.9/件')
    })

    it('prefers the prefix / suffix slots over the props', () => {
      const w = mount(SnText, {
        props: { text: 'body', prefix: 'p', suffix: 's' },
        slots: { prefix: 'P!', suffix: 'S!' },
      })
      expect(w.text()).toBe('P!bodyS!')
    })
  })

  describe('type', () => {
    it('defaults to the default type', () => {
      const w = mount(SnText, { props: { text: 'x' } })
      expect(w.classes()).toContain('sn-text--default')
    })

    it('applies the type class for each semantic colour', () => {
      for (const type of ['primary', 'success', 'warning', 'error'] as const) {
        const w = mount(SnText, { props: { text: 'x', type } })
        expect(w.classes()).toContain(`sn-text--${type}`)
      }
    })

    it('forwards color as an inline override', () => {
      const w = mount(SnText, { props: { text: 'x', color: '#abcdef' } })
      expect(w.attributes('style')).toContain('color: #abcdef')
    })
  })

  describe('decoration', () => {
    it('defaults to none', () => {
      const w = mount(SnText, { props: { text: 'x' } })
      expect(w.classes()).toContain('sn-text--decoration-none')
    })

    it('applies the decoration class for each style', () => {
      for (const decoration of ['underline', 'line-through', 'overline'] as const) {
        const w = mount(SnText, { props: { text: 'x', decoration } })
        expect(w.classes()).toContain(`sn-text--decoration-${decoration}`)
      }
    })
  })

  describe('mode formatting', () => {
    it('leaves text untouched in text mode', () => {
      const w = mount(SnText, { props: { text: 'raw value' } })
      expect(w.text()).toBe('raw value')
    })

    it('masks a phone number when format is on', () => {
      const w = mount(SnText, { props: { text: '13800138000', mode: 'phone', format: true } })
      expect(w.text()).toBe('138****8000')
    })

    it('leaves a phone number intact without format', () => {
      const w = mount(SnText, { props: { text: '13800138000', mode: 'phone' } })
      expect(w.text()).toBe('13800138000')
    })

    it('masks all but the first character in name mode', () => {
      const w = mount(SnText, { props: { text: '张三丰', mode: 'name', format: true } })
      expect(w.text()).toBe('张**')
    })

    it('leaves a name intact without format', () => {
      const w = mount(SnText, { props: { text: '张三丰', mode: 'name' } })
      expect(w.text()).toBe('张三丰')
    })

    it('groups a price with thousands separators and 2 decimals', () => {
      const w = mount(SnText, { props: { text: '1288.5', mode: 'price' } })
      expect(w.text()).toBe('1,288.50')
    })

    it('keeps the sign of a negative price', () => {
      const w = mount(SnText, { props: { text: '-99', mode: 'price' } })
      expect(w.text()).toBe('-99.00')
    })

    it('normalises a date to YYYY-MM-DD', () => {
      const w = mount(SnText, { props: { text: '2024-03-05T10:00:00', mode: 'date' } })
      expect(w.text()).toBe('2024-03-05')
    })

    it('passes an unparsable date through untouched', () => {
      const w = mount(SnText, { props: { text: 'not a date', mode: 'date' } })
      expect(w.text()).toBe('not a date')
    })

    it('never leaks the raw phone digits into the DOM when masked', () => {
      const w = mount(SnText, { props: { text: '13800138000', mode: 'phone', format: true } })
      expect(w.html()).not.toContain('13800138000')
    })
  })

  describe('emphasis and sizing', () => {
    it('adds the bold class', () => {
      const w = mount(SnText, { props: { text: 'x', bold: true } })
      expect(w.classes()).toContain('sn-text--bold')
    })

    it('forwards size and lineHeight as inline styles', () => {
      const w = mount(SnText, { props: { text: 'x', size: '14px', lineHeight: '20px' } })
      const style = w.attributes('style') ?? ''
      expect(style).toContain('font-size: 14px')
      expect(style).toContain('line-height: 20px')
    })

    it('clamps the text when lines is set', () => {
      const w = mount(SnText, { props: { text: 'long text', lines: 2 } })
      expect(w.classes()).toContain('sn-text--clamped')
      expect(w.attributes('style')).toContain('-webkit-line-clamp: 2')
    })

    it('adds no clamp class without lines', () => {
      const w = mount(SnText, { props: { text: 'x' } })
      expect(w.classes()).not.toContain('sn-text--clamped')
      expect(w.attributes('style')).toBeUndefined()
    })
  })

  describe('call', () => {
    it('dials through the runtime when call is enabled', async () => {
      const calls: string[] = []
      ;(globalThis as { uni?: PhoneCallSpy }).uni = {
        makePhoneCall: ({ phoneNumber }) => calls.push(phoneNumber),
      }
      const w = mount(SnText, { props: { text: '13800138000', mode: 'phone', call: true } })
      expect(w.attributes('role')).toBe('link')
      await w.trigger('tap')
      expect(calls).toEqual(['13800138000'])
    })

    it('emits click alongside the dial action', async () => {
      ;(globalThis as { uni?: PhoneCallSpy }).uni = { makePhoneCall: () => undefined }
      const w = mount(SnText, { props: { text: '13800138000', mode: 'phone', call: true } })
      await w.trigger('tap')
      expect(w.emitted('click')).toHaveLength(1)
    })

    it('degrades to a plain click when the runtime is absent', async () => {
      const w = mount(SnText, { props: { text: '13800138000', mode: 'phone', call: true } })
      await w.trigger('tap')
      expect(w.emitted('click')).toHaveLength(1)
    })

    it('adds no call affordance outside phone mode', () => {
      const w = mount(SnText, { props: { text: 'text', call: true } })
      expect(w.classes()).not.toContain('sn-text--call')
      expect(w.attributes('role')).toBeUndefined()
    })
  })

  describe('root passthrough', () => {
    it('forwards customClass and customStyle to the root node', () => {
      const w = mount(SnText, {
        props: { text: 'x', customClass: 'my-text', customStyle: 'margin: 4px' },
      })
      expect(w.classes()).toContain('my-text')
      expect(w.attributes('style')).toContain('margin: 4px')
    })
  })
})
