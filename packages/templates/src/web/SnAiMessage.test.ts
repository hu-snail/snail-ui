/**
 * SnAiMessage + SnAiThinking behaviour tests — AUI-TPL-001.
 *
 * Per AGENTS.md §46 these assert what the user sees for each lifecycle state,
 * not internal flags: the reasoning disclosure, the streaming caret, the tool
 * row, the attachment chip, the error card with retry, and the aborted notice.
 */

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SnAiMessage from './SnAiMessage.vue'
import SnAiThinking from './SnAiThinking.vue'
import { createAssistantMessage, applyStreamDelta, markAborted, markDone, markError } from '../shared/stream'
import type { SnAiMessage as SnAiMessageData } from '../shared/types'

function assistantWith(
  deltas: Parameters<typeof applyStreamDelta>[1][],
): SnAiMessageData {
  return deltas.reduce<SnAiMessageData>(
    (message, delta) => applyStreamDelta(message, delta),
    createAssistantMessage({ id: 'm1' }),
  )
}

describe('SnAiThinking', () => {
  it('should label the block 思考中 while streaming and expand it', () => {
    const wrapper = mount(SnAiThinking, {
      props: { part: { type: 'thinking', text: '推理中', done: false } },
    })
    expect(wrapper.text()).toContain('思考中')
    expect(wrapper.find('.sn-ai-thinking__body').attributes('style') ?? '').not.toContain('display: none')
  })

  it('should collapse the block and show the duration once closed', () => {
    const wrapper = mount(SnAiThinking, {
      props: { part: { type: 'thinking', text: '推理', done: true, durationMs: 4200 } },
    })
    expect(wrapper.text()).toContain('已思考 4 秒')
    expect(wrapper.find('.sn-ai-thinking__body').attributes('style') ?? '').toContain('display: none')
  })

  it('should emit toggle when the header is clicked', async () => {
    const wrapper = mount(SnAiThinking, {
      props: { part: { type: 'thinking', text: '推理', done: true, durationMs: 1000 } },
    })
    await wrapper.find('.sn-ai-thinking__header').trigger('click')
    expect(wrapper.emitted('toggle')?.[0]).toEqual([true])
  })

  it('should expose aria-expanded reflecting the body state', () => {
    const open = mount(SnAiThinking, {
      props: { part: { type: 'thinking', text: 'x', done: false } },
    })
    expect(open.find('.sn-ai-thinking__header').attributes('aria-expanded')).toBe('true')

    const closed = mount(SnAiThinking, {
      props: { part: { type: 'thinking', text: 'x', done: true, durationMs: 100 } },
    })
    expect(closed.find('.sn-ai-thinking__header').attributes('aria-expanded')).toBe('false')
  })
})

describe('SnAiMessage', () => {
  it('should render the answer text of a finished assistant turn', () => {
    const message = markDone(
      assistantWith([{ type: 'text', text: '你好，有什么可以帮你？' }]),
    )
    const wrapper = mount(SnAiMessage, { props: { message } })
    expect(wrapper.text()).toContain('你好，有什么可以帮你？')
  })

  it('should show the streaming caret only while streaming', () => {
    const streaming = assistantWith([{ type: 'text', text: '生成中' }])
    const streamingWrapper = mount(SnAiMessage, { props: { message: streaming } })
    expect(streamingWrapper.find('.sn-ai-message__caret').exists()).toBe(true)

    const done = markDone(streaming)
    const doneWrapper = mount(SnAiMessage, { props: { message: done } })
    expect(doneWrapper.find('.sn-ai-message__caret').exists()).toBe(false)
  })

  it('should render the queued waiting line', () => {
    const wrapper = mount(SnAiMessage, { props: { message: createAssistantMessage() } })
    expect(wrapper.text()).toContain('排队中')
  })

  it('should render the reasoning block for a thinking turn', () => {
    const message = assistantWith([{ type: 'thinking', text: '让我想想' }])
    const wrapper = mount(SnAiMessage, { props: { message } })
    expect(wrapper.find('.sn-ai-thinking').exists()).toBe(true)
    expect(wrapper.text()).toContain('思考中')
  })

  it('should hide the reasoning block after completion when showThinking is false', () => {
    const message = markDone(assistantWith([{ type: 'thinking', text: '推理' }]))
    const wrapper = mount(SnAiMessage, {
      props: { message, showThinking: false },
    })
    expect(wrapper.find('.sn-ai-thinking').exists()).toBe(false)
  })

  it('should render a tool row with its status label', () => {
    const message = assistantWith([{ type: 'tool', name: 'search', status: 'running' }])
    const wrapper = mount(SnAiMessage, { props: { message } })
    expect(wrapper.text()).toContain('search')
    expect(wrapper.text()).toContain('执行中')
  })

  it('should render an attachment chip with its size', () => {
    const message: SnAiMessageData = {
      id: 'u1',
      role: 'user',
      parts: [{ type: 'attachment', attachment: { id: 'a1', name: 'report.pdf', size: 2048, mime: 'application/pdf' } }],
      status: 'idle',
    }
    const wrapper = mount(SnAiMessage, { props: { message } })
    expect(wrapper.text()).toContain('report.pdf')
    expect(wrapper.text()).toContain('2.0 KB')
  })

  it('should render the error card with code, hint and retry', () => {
    const message = markError(assistantWith([]), {
      code: 'RATE_LIMITED',
      message: '请求过于频繁',
      hint: '稍后重试',
      retryable: true,
    })
    const wrapper = mount(SnAiMessage, { props: { message } })
    expect(wrapper.text()).toContain('请求过于频繁')
    expect(wrapper.text()).toContain('RATE_LIMITED')
    expect(wrapper.text()).toContain('稍后重试')
    expect(wrapper.find('.sn-ai-message__error-retry').exists()).toBe(true)
  })

  it('should not offer retry when the failure is not retryable', () => {
    const message = markError(assistantWith([]), {
      code: 'BAD_REQUEST',
      message: '参数错误',
      retryable: false,
    })
    const wrapper = mount(SnAiMessage, { props: { message } })
    expect(wrapper.find('.sn-ai-message__error-retry').exists()).toBe(false)
  })

  it('should emit retry with the message when the retry button is clicked', async () => {
    const message = markError(assistantWith([]), { code: 'X', message: '失败', retryable: true })
    const wrapper = mount(SnAiMessage, { props: { message } })
    await wrapper.find('.sn-ai-message__error-retry').trigger('click')
    expect(wrapper.emitted('retry')?.[0]).toEqual([message])
  })

  it('should show the aborted notice and keep partial output', () => {
    const message = markAborted(assistantWith([{ type: 'text', text: '部分内容' }]))
    const wrapper = mount(SnAiMessage, { props: { message } })
    expect(wrapper.text()).toContain('已停止生成')
    expect(wrapper.text()).toContain('部分内容')
  })

  it('should offer copy on a finished assistant turn', async () => {
    const message = markDone(assistantWith([{ type: 'text', text: '答案' }]))
    const wrapper = mount(SnAiMessage, { props: { message } })
    const copy = wrapper.find('.sn-ai-message__action')
    expect(copy.exists()).toBe(true)
    await copy.trigger('click')
    expect(wrapper.emitted('copy')?.[0]).toEqual([message])
  })

  it('should render the copied confirmation when copied is true', () => {
    const message = markDone(assistantWith([{ type: 'text', text: '答案' }]))
    const wrapper = mount(SnAiMessage, { props: { message, copied: true } })
    expect(wrapper.text()).toContain('已复制')
  })

  it('should not offer copy on a user turn', () => {
    const message: SnAiMessageData = {
      id: 'u1',
      role: 'user',
      parts: [{ type: 'text', text: '你好' }],
      status: 'idle',
    }
    const wrapper = mount(SnAiMessage, { props: { message } })
    expect(wrapper.find('.sn-ai-message__action').exists()).toBe(false)
  })

  it('should mark the row with its role and status for styling hooks', () => {
    const wrapper = mount(SnAiMessage, {
      props: { message: { ...createAssistantMessage(), status: 'streaming' } },
    })
    expect(wrapper.classes()).toContain('sn-ai-message--assistant')
    expect(wrapper.attributes('data-status')).toBe('streaming')
  })
})
