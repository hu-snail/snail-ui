/**
 * SnAiPrompt behaviour tests — AUI-TPL-001.
 *
 * Covers the composer rules that are easy to get wrong: the send/stop swap,
 * the empty-draft guard, Enter vs Shift+Enter, the queued-turn payload, the
 * attachment panel, the reasoning slider, and the pending queue rendering.
 */

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SnAiPrompt from './SnAiPrompt.vue'
import { THINKING_LEVELS } from '../shared/stream'

const models = [
  {
    id: 'm-fast',
    name: 'Fast',
    supportsThinking: false,
    contextWindow: 128_000,
  },
  {
    id: 'm-deep',
    name: 'Deep',
    supportsThinking: true,
    contextWindow: 1_500_000,
  },
]

describe('SnAiPrompt', () => {
  describe('send guard', () => {
    it('should disable send while the draft is empty', () => {
      const wrapper = mount(SnAiPrompt, { props: { modelValue: '' } })
      expect(wrapper.find('.sn-ai-prompt__primary').attributes('disabled')).toBeDefined()
    })

    it('should enable send once the draft has text', () => {
      const wrapper = mount(SnAiPrompt, { props: { modelValue: '你好' } })
      expect(wrapper.find('.sn-ai-prompt__primary').attributes('disabled')).toBeUndefined()
    })

    it('should enable send with an attachment even when the draft is empty', () => {
      const wrapper = mount(SnAiPrompt, {
        props: { modelValue: '', attachments: [{ id: 'a1', name: 'a.png' }] },
      })
      expect(wrapper.find('.sn-ai-prompt__primary').attributes('disabled')).toBeUndefined()
    })

    it('should disable the whole composer when disabled', () => {
      const wrapper = mount(SnAiPrompt, { props: { modelValue: '你好', disabled: true } })
      expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
      expect(wrapper.find('.sn-ai-prompt__primary').attributes('disabled')).toBeDefined()
    })
  })

  describe('send payload', () => {
    it('should emit a fully populated turn and clear the draft', async () => {
      const wrapper = mount(SnAiPrompt, {
        props: {
          modelValue: '  解释一下  ',
          attachments: [{ id: 'a1', name: 'a.png' }],
          modelId: 'm-deep',
          thinkingLevel: 'high',
          permission: 'ask',
        },
      })
      await wrapper.find('.sn-ai-prompt__primary').trigger('click')

      const turn = wrapper.emitted('send')?.[0]?.[0] as Record<string, unknown>
      expect(turn.text).toBe('解释一下')
      expect(turn.modelId).toBe('m-deep')
      expect(turn.thinkingLevel).toBe('high')
      expect(turn.permission).toBe('ask')
      expect((turn.attachments as unknown[]).length).toBe(1)
      expect(typeof turn.createdAt).toBe('number')
      expect(typeof turn.id).toBe('string')

      // Draft and attachments are handed off to the host, not kept locally.
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
      expect(wrapper.emitted('update:attachments')?.[0]).toEqual([[]])
    })

    it('should send on Enter and keep a newline on Shift+Enter', async () => {
      const wrapper = mount(SnAiPrompt, { props: { modelValue: '你好' } })
      const textarea = wrapper.find('textarea')

      await textarea.trigger('keydown', { key: 'Enter', shiftKey: true })
      expect(wrapper.emitted('send')).toBeUndefined()

      await textarea.trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('send')).toHaveLength(1)
    })

    it('should ignore Enter during an IME composition', async () => {
      const wrapper = mount(SnAiPrompt, { props: { modelValue: '你好' } })
      await wrapper.find('textarea').trigger('keydown', { key: 'Enter', isComposing: true })
      expect(wrapper.emitted('send')).toBeUndefined()
    })

    it('should emit the typed value on input', async () => {
      const wrapper = mount(SnAiPrompt, { props: { modelValue: '' } })
      const textarea = wrapper.find('textarea')
      ;(textarea.element as HTMLTextAreaElement).value = '新内容'
      await textarea.trigger('input')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['新内容'])
    })
  })

  describe('stop affordance', () => {
    it('should swap send for stop while a turn is active', async () => {
      const wrapper = mount(SnAiPrompt, { props: { modelValue: '你好', active: true } })
      const button = wrapper.find('.sn-ai-prompt__primary')
      expect(button.attributes('aria-label')).toBe('停止生成')
      expect(button.classes()).toContain('sn-ai-prompt__primary--stop')

      await button.trigger('click')
      expect(wrapper.emitted('stop')).toHaveLength(1)
      expect(wrapper.emitted('send')).toBeUndefined()
    })
  })

  describe('attachment panel', () => {
    it('should toggle the panel and keep aria-expanded in sync', async () => {
      const wrapper = mount(SnAiPrompt)
      const trigger = wrapper.find('.sn-ai-prompt__tool')
      expect(trigger.attributes('aria-expanded')).toBe('false')

      await trigger.trigger('click')
      expect(wrapper.find('.sn-ai-prompt__attach-panel').exists()).toBe(true)
      expect(wrapper.find('.sn-ai-prompt__tool').attributes('aria-expanded')).toBe('true')
    })

    it('should emit attach with the picked files', async () => {
      const wrapper = mount(SnAiPrompt)
      const input = wrapper.find('input[type="file"]')
      const file = new File(['x'], 'note.txt', { type: 'text/plain' })
      Object.defineProperty(input.element, 'files', { value: [file], configurable: true })
      await input.trigger('change')
      expect(wrapper.emitted('attach')?.[0]?.[0]).toEqual([file])
    })

    it('should render attachment chips with size and a remove action', async () => {
      const wrapper = mount(SnAiPrompt, {
        props: {
          modelValue: '',
          attachments: [{ id: 'a1', name: 'report.pdf', size: 2048, mime: 'application/pdf' }],
        },
      })
      expect(wrapper.text()).toContain('report.pdf')
      expect(wrapper.text()).toContain('2.0 KB')

      await wrapper.find('.sn-ai-prompt__chip-remove').trigger('click')
      expect(wrapper.emitted('update:attachments')?.[0]).toEqual([[]])
    })

    it('should flag a failed attachment chip', () => {
      const wrapper = mount(SnAiPrompt, {
        props: {
          attachments: [{ id: 'a1', name: 'bad.bin', status: 'error' }],
        },
      })
      expect(wrapper.find('.sn-ai-prompt__chip--error').exists()).toBe(true)
    })
  })

  describe('reasoning slider', () => {

  describe('paste and preview', () => {
    /** Minimal clipboardData stand-in: happy-dom cannot construct one. */
    function clipboardOf(files: File[]): { items: { kind: string; getAsFile: () => File }[] } {
      return { items: files.map((file) => ({ kind: 'file', getAsFile: () => file })) }
    }

    function paste(wrapper: ReturnType<typeof mount>, clipboardData: unknown): Event {
      const event = new Event('paste', { bubbles: true, cancelable: true })
      Object.defineProperty(event, 'clipboardData', { value: clipboardData })
      wrapper.find('textarea').element.dispatchEvent(event)
      return event
    }

    it('should attach a pasted image and swallow the default insert', () => {
      const wrapper = mount(SnAiPrompt)
      const file = new File(['x'], 'shot.png', { type: 'image/png' })

      const event = paste(wrapper, clipboardOf([file]))

      expect(wrapper.emitted('attach')?.[0]?.[0]).toEqual([file])
      expect(event.defaultPrevented).toBe(true)
    })

    it('should leave a text-only paste to the textarea', () => {
      const wrapper = mount(SnAiPrompt)

      const event = paste(wrapper, { items: [{ kind: 'string', getAsFile: () => null }] })

      expect(wrapper.emitted('attach')).toBeUndefined()
      expect(event.defaultPrevented).toBe(false)
    })

    it('should preview an image attachment through the image lightbox', () => {
      const wrapper = mount(SnAiPrompt, {
        props: {
          attachments: [{ id: 'a1', name: 'shot.png', mime: 'image/png', url: 'blob:shot' }],
        },
      })

      const thumb = wrapper.findComponent({ name: 'SnImage' })
      expect(thumb.exists()).toBe(true)
      expect(thumb.props('src')).toBe('blob:shot')
      expect(thumb.props('alt')).toBe('shot.png')
    })

    it('should link-preview a non-image attachment', () => {
      const wrapper = mount(SnAiPrompt, {
        props: {
          attachments: [{ id: 'a1', name: 'report.pdf', mime: 'application/pdf', url: '/r.pdf' }],
        },
      })

      const anchor = wrapper.find('.sn-ai-prompt__chip-preview')
      expect(anchor.attributes('href')).toBe('/r.pdf')
      expect(anchor.attributes('target')).toBe('_blank')
      expect(anchor.attributes('rel')).toBe('noopener noreferrer')
    })

    it('should keep a plain glyph while an attachment has no preview url', () => {
      const wrapper = mount(SnAiPrompt, {
        props: { attachments: [{ id: 'a1', name: 'still-uploading.bin' }] },
      })

      expect(wrapper.find('.sn-ai-prompt__chip-preview').exists()).toBe(false)
      expect(wrapper.findComponent({ name: 'SnImage' }).exists()).toBe(false)
      expect(wrapper.text()).toContain('still-uploading.bin')
    })
  })
    it('should show the tier label with its token budget', () => {
      const wrapper = mount(SnAiPrompt, {
        props: { models, modelId: 'm-deep', thinkingLevel: 'medium' },
      })
      expect(wrapper.text()).toContain('中等')
      expect(wrapper.text()).toContain('4096 tokens')
    })

    it('should hide the slider when the picked model cannot reason', () => {
      const wrapper = mount(SnAiPrompt, {
        props: { models, modelId: 'm-fast', thinkingLevel: 'high' },
      })
      expect(wrapper.find('.sn-ai-prompt__thinking').exists()).toBe(false)
    })

    it('should hide the slider when showThinking is false', () => {
      const wrapper = mount(SnAiPrompt, {
        props: { models, modelId: 'm-deep', showThinking: false },
      })
      expect(wrapper.find('.sn-ai-prompt__thinking').exists()).toBe(false)
    })

    it('should map the slider index back to a tier', async () => {
      const wrapper = mount(SnAiPrompt, {
        props: { models, modelId: 'm-deep', thinkingLevel: 'off' },
      })
      const slider = wrapper.findComponent({ name: 'SnSlider' })
      const index = THINKING_LEVELS.indexOf('high')
      slider.vm.$emit('update:model-value', index)
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('update:thinkingLevel')?.[0]).toEqual(['high'])
    })
  })

  describe('selectors', () => {
    it('should list agents and skip disabled ones', async () => {
      const wrapper = mount(SnAiPrompt, {
        props: {
          agents: [
            { id: 'a1', name: '代码助手' },
            { id: 'a2', name: '禁用助手', disabled: true },
          ],
        },
      })
      const dropdown = wrapper.findAllComponents({ name: 'SnDropdown' })[0]
      expect(dropdown.props('options')).toEqual([
        { key: 'a1', label: '代码助手', disabled: false },
        { key: 'a2', label: '禁用助手', disabled: true },
      ])

      dropdown.vm.$emit('select', 'a1')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('update:agentId')?.[0]).toEqual(['a1'])
    })

    it('should show the model label with its context window', () => {
      const wrapper = mount(SnAiPrompt, { props: { models, modelId: 'm-deep' } })
      expect(wrapper.text()).toContain('Deep')
    })

    it('should default to the four standard permission scopes', () => {
      const wrapper = mount(SnAiPrompt)
      const dropdowns = wrapper.findAllComponents({ name: 'SnDropdown' })
      const permission = dropdowns.find((dropdown) =>
        JSON.stringify(dropdown.props('options')).includes('full-access'),
      )
      expect(permission).toBeTruthy()
    })

    it('should emit the picked permission', async () => {
      const wrapper = mount(SnAiPrompt)
      const dropdowns = wrapper.findAllComponents({ name: 'SnDropdown' })
      const permission = dropdowns.find((dropdown) =>
        JSON.stringify(dropdown.props('options')).includes('full-access'),
      )
      permission?.vm.$emit('select', 'full-access')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('update:permission')?.[0]).toEqual(['full-access'])
    })
  })

  describe('pending queue', () => {
    const queued = [
      {
        id: 'q1',
        text: '第一条排队的消息',
        attachments: [],
        createdAt: 1,
      },
      {
        id: 'q2',
        text: '第二条排队的消息',
        attachments: [{ id: 'a1', name: 'a.png' }],
        createdAt: 2,
      },
    ]

    it('should render each queued turn with its index', () => {
      const wrapper = mount(SnAiPrompt, { props: { queued } })
      expect(wrapper.findAll('.sn-ai-prompt__queue-item')).toHaveLength(2)
      expect(wrapper.text()).toContain('第一条排队的消息')
      expect(wrapper.text()).toContain('1 个附件')
    })

    it('should emit remove-queued with the turn id', async () => {
      const wrapper = mount(SnAiPrompt, { props: { queued } })
      await wrapper.find('.sn-ai-prompt__queue-remove').trigger('click')
      expect(wrapper.emitted('remove-queued')?.[0]).toEqual(['q1'])
    })

    it('should hide the queue when showQueue is false', () => {
      const wrapper = mount(SnAiPrompt, { props: { queued, showQueue: false } })
      expect(wrapper.find('.sn-ai-prompt__queue').exists()).toBe(false)
    })

    it('should truncate a long queued preview', () => {
      const wrapper = mount(SnAiPrompt, {
        props: {
          queued: [{ id: 'q1', text: 'x'.repeat(120), attachments: [], createdAt: 1 }],
        },
      })
      expect(wrapper.text()).toContain('…')
    })
  })
})
