/**
 * Shared AI stream fold — pure functions that turn stream deltas into the
 * `SnAiMessage` transcript contract.
 *
 * Why this lives outside the components: both ends must fold the exact same
 * delta sequence into the exact same transcript, and the fold is the part with
 * real edge cases (thinking→answer handoff, aborted mid-stream, error after
 * partial output). Keeping it as pure data-in / data-out lets the templates
 * stay thin renderers and lets one test suite pin the behaviour for both ends
 * (AGENTS.md §46: test behaviour, not implementation detail).
 *
 * Every function here is deterministic and side-effect free; none of them
 * mutate their input (AGENTS.md §27 normalize must be pure + idempotent).
 */

import type {
  SnAiAttachment,
  SnAiError,
  SnAiMessage,
  SnAiMessagePart,
  SnAiMessageStatus,
  SnAiPermissionOption,
  SnAiThinkingLevel,
  SnAiThinkingPart,
  SnAiToolPart,
} from './types'

/** Reasoning budget in tokens for each thinking tier. */
const THINKING_BUDGETS: Readonly<Record<SnAiThinkingLevel, number>> = {
  off: 0,
  low: 1024,
  medium: 4096,
  high: 16384,
  max: 32768,
}

/** Map a thinking tier to its token budget. */
export function thinkingBudget(level: SnAiThinkingLevel): number {
  return THINKING_BUDGETS[level]
}

/** Ordered tiers, cheapest first — drives the slider in the prompt toolbar. */
export const THINKING_LEVELS: ReadonlyArray<SnAiThinkingLevel> = [
  'off',
  'low',
  'medium',
  'high',
  'max',
]

/** Default permission options offered by the prompt toolbar. */
export const DEFAULT_PERMISSION_OPTIONS: ReadonlyArray<SnAiPermissionOption> = [
  {
    value: 'read-only',
    label: '只读',
    description: '仅阅读上下文，不产生任何写入',
  },
  {
    value: 'ask',
    label: '每次询问',
    description: '写操作前先请求确认',
  },
  {
    value: 'auto-edit',
    label: '自动编辑',
    description: '文件改动自动应用，危险操作仍会询问',
  },
  {
    value: 'full-access',
    label: '完全授权',
    description: '无需确认，可执行任意工具调用',
    tone: 'warning',
  },
]

/** Id generator — monotonic within a session, collision-free across templates. */
let idSeq = 0
export function nextId(prefix = 'sn-ai'): string {
  idSeq += 1
  return `${prefix}-${idSeq}`
}

/** Reset the id sequence. Test-only seam so ids stay assertable. */
export function resetIdSequence(): void {
  idSeq = 0
}

/** An empty assistant turn that is ready to receive stream deltas. */
export function createAssistantMessage(options?: {
  id?: string | undefined
  agentId?: string | undefined
  modelId?: string | undefined
  now?: number | undefined
}): SnAiMessage {
  const now = options?.now ?? Date.now()
  return {
    id: options?.id ?? nextId('sn-ai-assistant'),
    role: 'assistant',
    parts: [],
    status: 'queued',
    createdAt: now,
    updatedAt: now,
    agentId: options?.agentId,
    modelId: options?.modelId,
  }
}

/** A user turn built from the prompt's text + attachments. */
export function createUserMessage(
  text: string,
  attachments: ReadonlyArray<SnAiAttachment> = [],
  options?: { id?: string | undefined; now?: number | undefined },
): SnAiMessage {
  const now = options?.now ?? Date.now()
  const parts: SnAiMessagePart[] = []
  if (text) parts.push({ type: 'text', text })
  for (const attachment of attachments) {
    parts.push({ type: 'attachment', attachment })
  }
  return {
    id: options?.id ?? nextId('sn-ai-user'),
    role: 'user',
    parts,
    status: 'idle',
    createdAt: now,
    updatedAt: now,
  }
}

/** A system / notice turn. */
export function createSystemMessage(
  text: string,
  options?: { id?: string | undefined; now?: number | undefined },
): SnAiMessage {
  const now = options?.now ?? Date.now()
  return {
    id: options?.id ?? nextId('sn-ai-system'),
    role: 'system',
    parts: [{ type: 'text', text }],
    status: 'idle',
    createdAt: now,
    updatedAt: now,
  }
}

/** A delta arriving from the model stream. */
export type SnAiStreamDelta =
  | { type: 'thinking'; text: string }
  | { type: 'text'; text: string }
  | { type: 'tool'; name: string; status: SnAiToolPart['status']; detail?: string | undefined }
  | { type: 'thinking-end'; durationMs?: number | undefined }

/** Index of the last part of a given type, or -1. */
function lastIndexOfType(parts: ReadonlyArray<SnAiMessagePart>, type: string): number {
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    if (parts[i]?.type === type) return i
  }
  return -1
}

/** Index of a running tool part by name, or -1. */
function indexOfRunningTool(parts: ReadonlyArray<SnAiMessagePart>, name: string): number {
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    const part = parts[i]
    if (part?.type === 'tool' && part.name === name && part.status === 'running') return i
  }
  return -1
}

/**
 * Fold one delta into a message, returning a new message.
 *
 * Handoff rules:
 *   - The first delta of any kind moves the turn out of `queued`.
 *   - A `thinking` delta that follows answer text opens a *new* reasoning
 *     block (models legitimately interleave), rather than appending to the
 *     already-closed one.
 *   - A `text` delta never reopens a closed reasoning block.
 *   - A `tool` delta with status `running` opens a row; the matching
 *     non-running delta closes that same row in place, preserving order.
 */
export function applyStreamDelta(message: SnAiMessage, delta: SnAiStreamDelta): SnAiMessage {
  const parts = [...message.parts]
  let status: SnAiMessageStatus = message.status ?? 'idle'

  if (delta.type === 'thinking') {
    const lastText = lastIndexOfType(parts, 'text')
    const lastThinking = lastIndexOfType(parts, 'thinking')
    // Reopen only when there is no reasoning block yet, or answer text has
    // been emitted since the last one (interleaved reasoning).
    if (lastThinking === -1 || lastThinking < lastText) {
      parts.push({ type: 'thinking', text: delta.text, done: false } satisfies SnAiThinkingPart)
    } else {
      const existing = parts[lastThinking] as SnAiThinkingPart
      parts[lastThinking] = { ...existing, text: existing.text + delta.text }
    }
    status = 'thinking'
  } else if (delta.type === 'thinking-end') {
    const index = lastIndexOfType(parts, 'thinking')
    if (index !== -1) {
      const existing = parts[index] as SnAiThinkingPart
      parts[index] = { ...existing, done: true, durationMs: delta.durationMs }
    }
    // Reasoning may have closed before any answer arrives; stay in `thinking`
    // until real output lands so the UI does not flash "done".
    if (status === 'thinking') status = 'thinking'
  } else if (delta.type === 'text') {
    const lastThinking = lastIndexOfType(parts, 'thinking')
    if (lastThinking !== -1 && !(parts[lastThinking] as SnAiThinkingPart).done) {
      // Answer text implicitly closes an open reasoning block.
      const existing = parts[lastThinking] as SnAiThinkingPart
      parts[lastThinking] = { ...existing, done: true }
    }
    const lastText = lastIndexOfType(parts, 'text')
    if (lastText !== -1) {
      const existing = parts[lastText] as SnAiTextPartLike
      parts[lastText] = { ...existing, text: existing.text + delta.text }
    } else {
      parts.push({ type: 'text', text: delta.text })
    }
    status = 'streaming'
  } else {
    const index = indexOfRunningTool(parts, delta.name)
    if (index !== -1) {
      const existing = parts[index] as SnAiToolPart
      parts[index] = { ...existing, status: delta.status, detail: delta.detail ?? existing.detail }
    } else {
      parts.push({
        type: 'tool',
        name: delta.name,
        status: delta.status,
        detail: delta.detail,
      })
    }
    if (status === 'queued') status = 'thinking'
  }

  return { ...message, parts, status, updatedAt: Date.now() }
}

/** Narrowing helper for the text-part spread above. */
interface SnAiTextPartLike {
  type: 'text'
  text: string
}

/** Mark a turn complete. */
export function markDone(message: SnAiMessage): SnAiMessage {
  const parts = message.parts.map((part) =>
    part.type === 'thinking' && !part.done ? { ...part, done: true } : part,
  )
  return { ...message, parts, status: 'done', updatedAt: Date.now() }
}

/** Mark a turn aborted by the user, preserving whatever streamed. */
export function markAborted(message: SnAiMessage): SnAiMessage {
  const parts = message.parts.map((part) =>
    part.type === 'thinking' && !part.done ? { ...part, done: true } : part,
  )
  return { ...message, parts, status: 'aborted', updatedAt: Date.now() }
}

/** Attach a failure to a turn and mirror it into an inline error part. */
export function markError(message: SnAiMessage, error: SnAiError): SnAiMessage {
  const parts: SnAiMessagePart[] = message.parts.filter((part) => part.type !== 'error')
  parts.push({ type: 'error', error })
  return { ...message, parts, status: 'error', error, updatedAt: Date.now() }
}

/** Whether a turn is still receiving output (drives stop vs send affordance). */
export function isActiveStatus(status: SnAiMessageStatus | undefined): boolean {
  return status === 'queued' || status === 'thinking' || status === 'streaming'
}

/** The reasoning block of a message, if any (last one wins). */
export function findThinkingPart(message: SnAiMessage): SnAiThinkingPart | undefined {
  const index = lastIndexOfType(message.parts, 'thinking')
  return index === -1 ? undefined : (message.parts[index] as SnAiThinkingPart)
}

/** The answer text of a message, if any (last block wins). */
export function findTextPart(message: SnAiMessage): string | undefined {
  const index = lastIndexOfType(message.parts, 'text')
  return index === -1 ? undefined : (message.parts[index] as SnAiTextPartLike).text
}

/** The inline error of a message, if any. */
export function findErrorPart(message: SnAiMessage): SnAiError | undefined {
  const part = message.parts.find((p) => p.type === 'error')
  return part?.type === 'error' ? part.error : undefined
}

/**
 * Human-readable reasoning duration.
 *   < 1s   → "0.4 秒"
 *   < 60s  → "12 秒"
 *   ≥ 60s  → "1 分 05 秒"
 * Returns undefined while the block is still open.
 */
export function formatThinkingDuration(durationMs: number | undefined): string | undefined {
  if (durationMs === undefined || durationMs < 0) return undefined
  if (durationMs < 1000) return `${(durationMs / 1000).toFixed(1)} 秒`
  if (durationMs < 60_000) return `${Math.round(durationMs / 1000)} 秒`
  const minutes = Math.floor(durationMs / 60_000)
  const seconds = Math.round((durationMs % 60_000) / 1000)
  return `${minutes} 分 ${String(seconds).padStart(2, '0')} 秒`
}

/** Human-readable byte size for attachment chips. */
export function formatBytes(size: number | undefined): string | undefined {
  if (size === undefined || size < 0) return undefined
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

/** Human-readable context window, e.g. `200K` / `1.5M`. */
export function formatContextWindow(tokens: number | undefined): string | undefined {
  if (tokens === undefined || tokens <= 0) return undefined
  if (tokens < 1000) return String(tokens)
  if (tokens < 1_000_000) return `${Math.round(tokens / 1000)}K`
  return `${(tokens / 1_000_000).toFixed(1)}M`
}
