/**
 * Shared stream fold tests — AUI-TPL-001.
 *
 * The fold is where the real edge cases live (thinking → answer handoff,
 * interleaved reasoning, aborted mid-stream, error after partial output), and
 * both ends depend on it producing the identical transcript. Per AGENTS.md §46
 * these tests assert behaviour (the resulting transcript) rather than internal
 * bookkeeping, and per §27 they pin purity: the input message must never be
 * mutated.
 */

import { describe, expect, it } from 'vitest'
import {
  applyStreamDelta,
  createAssistantMessage,
  createSystemMessage,
  createUserMessage,
  findErrorPart,
  findTextPart,
  findThinkingPart,
  formatBytes,
  formatContextWindow,
  formatThinkingDuration,
  isActiveStatus,
  markAborted,
  markDone,
  markError,
  nextId,
  resetIdSequence,
  thinkingBudget,
  THINKING_LEVELS,
} from './stream'
import type { SnAiThinkingPart } from './types'

describe('stream fold', () => {
  describe('thinking budget', () => {
    it('maps every tier to a token budget', () => {
      expect(thinkingBudget('off')).toBe(0)
      expect(thinkingBudget('low')).toBe(1024)
      expect(thinkingBudget('medium')).toBe(4096)
      expect(thinkingBudget('high')).toBe(16384)
      expect(thinkingBudget('max')).toBe(32768)
    })

    it('orders the tiers cheapest first', () => {
      expect([...THINKING_LEVELS]).toEqual(['off', 'low', 'medium', 'high', 'max'])
    })
  })

  describe('message factories', () => {
    it('should create a queued assistant turn ready for deltas', () => {
      const message = createAssistantMessage({ now: 1000 })
      expect(message.role).toBe('assistant')
      expect(message.status).toBe('queued')
      expect(message.parts).toEqual([])
      expect(message.createdAt).toBe(1000)
    })

    it('should create a user turn carrying text then attachments', () => {
      const message = createUserMessage(
        '你好',
        [{ id: 'a1', name: 'note.txt' }],
        { now: 2000 },
      )
      expect(message.parts.map((part) => part.type)).toEqual(['text', 'attachment'])
    })

    it('should omit the text part for an attachment-only turn', () => {
      const message = createUserMessage('', [{ id: 'a1', name: 'note.txt' }])
      expect(message.parts.map((part) => part.type)).toEqual(['attachment'])
    })

    it('should create a system turn', () => {
      const message = createSystemMessage('已连接')
      expect(message.role).toBe('system')
      expect(findTextPart(message)).toBe('已连接')
    })

    it('should mint unique ids', () => {
      resetIdSequence()
      const first = nextId('t')
      const second = nextId('t')
      expect(first).not.toBe(second)
      expect(first.startsWith('t-')).toBe(true)
    })
  })

  describe('applyStreamDelta', () => {
    it('should open a reasoning block and report thinking', () => {
      const message = applyStreamDelta(createAssistantMessage(), {
        type: 'thinking',
        text: '先分析',
      })
      expect(message.status).toBe('thinking')
      expect(findThinkingPart(message)?.text).toBe('先分析')
      expect(findThinkingPart(message)?.done).toBe(false)
    })

    it('should append to the open reasoning block', () => {
      let message = createAssistantMessage()
      message = applyStreamDelta(message, { type: 'thinking', text: 'a' })
      message = applyStreamDelta(message, { type: 'thinking', text: 'b' })
      expect(message.parts).toHaveLength(1)
      expect(findThinkingPart(message)?.text).toBe('ab')
    })

    it('should close the reasoning block when the answer starts', () => {
      let message = createAssistantMessage()
      message = applyStreamDelta(message, { type: 'thinking', text: '推理' })
      message = applyStreamDelta(message, { type: 'text', text: '答案' })
      expect(findThinkingPart(message)?.done).toBe(true)
      expect(message.status).toBe('streaming')
    })

    it('should open a second reasoning block after interleaved answer text', () => {
      let message = createAssistantMessage()
      message = applyStreamDelta(message, { type: 'thinking', text: '第一段' })
      message = applyStreamDelta(message, { type: 'text', text: '答案' })
      message = applyStreamDelta(message, { type: 'thinking', text: '第二段' })
      expect(message.parts.map((part) => part.type)).toEqual(['thinking', 'text', 'thinking'])
      expect(findThinkingPart(message)?.text).toBe('第二段')
    })

    it('should record the reasoning duration when the block closes', () => {
      let message = createAssistantMessage()
      message = applyStreamDelta(message, { type: 'thinking', text: '推理' })
      message = applyStreamDelta(message, { type: 'thinking-end', durationMs: 4200 })
      expect(findThinkingPart(message)?.durationMs).toBe(4200)
      expect(findThinkingPart(message)?.done).toBe(true)
    })

    it('should append answer text into one block', () => {
      let message = createAssistantMessage()
      message = applyStreamDelta(message, { type: 'text', text: '你' })
      message = applyStreamDelta(message, { type: 'text', text: '好' })
      expect(findTextPart(message)).toBe('你好')
      expect(message.parts).toHaveLength(1)
    })

    it('should close a running tool row in place rather than appending', () => {
      let message = createAssistantMessage()
      message = applyStreamDelta(message, { type: 'tool', name: 'search', status: 'running' })
      message = applyStreamDelta(message, { type: 'tool', name: 'search', status: 'done', detail: '3 条' })
      expect(message.parts).toHaveLength(1)
      const part = message.parts[0]
      expect(part?.type === 'tool' && part.status).toBe('done')
      expect(part?.type === 'tool' && part.detail).toBe('3 条')
    })

    it('should keep separate rows for two concurrently running tools', () => {
      let message = createAssistantMessage()
      message = applyStreamDelta(message, { type: 'tool', name: 'search', status: 'running' })
      message = applyStreamDelta(message, { type: 'tool', name: 'fetch', status: 'running' })
      message = applyStreamDelta(message, { type: 'tool', name: 'search', status: 'done' })
      expect(message.parts).toHaveLength(2)
      expect(message.parts.map((part) => (part.type === 'tool' ? part.status : ''))).toEqual([
        'done',
        'running',
      ])
    })

    it('should not mutate the input message', () => {
      const message = createAssistantMessage()
      const before = JSON.stringify(message)
      applyStreamDelta(message, { type: 'text', text: 'x' })
      expect(JSON.stringify(message)).toBe(before)
      expect(message.parts).toHaveLength(0)
    })
  })

  describe('terminal transitions', () => {
    it('should mark a turn done and close an open reasoning block', () => {
      let message = createAssistantMessage()
      message = applyStreamDelta(message, { type: 'thinking', text: '推理' })
      const done = markDone(message)
      expect(done.status).toBe('done')
      expect(findThinkingPart(done)?.done).toBe(true)
    })

    it('should mark a turn aborted while preserving partial output', () => {
      let message = createAssistantMessage()
      message = applyStreamDelta(message, { type: 'text', text: '部分答案' })
      const aborted = markAborted(message)
      expect(aborted.status).toBe('aborted')
      expect(findTextPart(aborted)).toBe('部分答案')
    })

    it('should attach a structured error as an inline part', () => {
      const failed = markError(createAssistantMessage(), {
        code: 'RATE_LIMITED',
        message: '请求过于频繁',
        hint: '稍后重试',
        retryable: true,
      })
      expect(failed.status).toBe('error')
      expect(findErrorPart(failed)?.code).toBe('RATE_LIMITED')
      expect(failed.error?.code).toBe('RATE_LIMITED')
    })

    it('should replace a previous error rather than stacking failures', () => {
      let message = markError(createAssistantMessage(), { code: 'A', message: 'first' })
      message = markError(message, { code: 'B', message: 'second' })
      expect(message.parts.filter((part) => part.type === 'error')).toHaveLength(1)
      expect(findErrorPart(message)?.code).toBe('B')
    })
  })

  describe('isActiveStatus', () => {
    it('should treat queued / thinking / streaming as active', () => {
      expect(isActiveStatus('queued')).toBe(true)
      expect(isActiveStatus('thinking')).toBe(true)
      expect(isActiveStatus('streaming')).toBe(true)
    })

    it('should treat settled states as inactive', () => {
      expect(isActiveStatus('done')).toBe(false)
      expect(isActiveStatus('error')).toBe(false)
      expect(isActiveStatus('aborted')).toBe(false)
      expect(isActiveStatus('idle')).toBe(false)
      expect(isActiveStatus(undefined)).toBe(false)
    })
  })

  describe('formatters', () => {
    it('should format sub-second reasoning as one decimal', () => {
      expect(formatThinkingDuration(400)).toBe('0.4 秒')
    })

    it('should format seconds without decimals', () => {
      expect(formatThinkingDuration(12_400)).toBe('12 秒')
    })

    it('should format minutes and zero-padded seconds', () => {
      expect(formatThinkingDuration(65_000)).toBe('1 分 05 秒')
    })

    it('should return undefined while the block is still open', () => {
      expect(formatThinkingDuration(undefined)).toBeUndefined()
    })

    it('should format byte sizes across units', () => {
      expect(formatBytes(512)).toBe('512 B')
      expect(formatBytes(2048)).toBe('2.0 KB')
      expect(formatBytes(3 * 1024 * 1024)).toBe('3.0 MB')
    })

    it('should format context windows', () => {
      expect(formatContextWindow(128_000)).toBe('128K')
      expect(formatContextWindow(1_500_000)).toBe('1.5M')
      expect(formatContextWindow(undefined)).toBeUndefined()
    })
  })

  describe('findThinkingPart', () => {
    it('should return the last reasoning block', () => {
      const message = {
        ...createAssistantMessage(),
        parts: [
          { type: 'thinking', text: 'first', done: true } satisfies SnAiThinkingPart,
          { type: 'thinking', text: 'second', done: false } satisfies SnAiThinkingPart,
        ],
      }
      expect(findThinkingPart(message)?.text).toBe('second')
    })

    it('should return undefined when there is no reasoning block', () => {
      expect(findThinkingPart(createAssistantMessage())).toBeUndefined()
    })
  })
})
