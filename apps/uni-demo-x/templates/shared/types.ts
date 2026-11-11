/**
 * Shared AI template contracts — consumed by both the web and uni templates.
 *
 * Per AGENTS.md §16/§17 the schema layer sits below the renderer, so the
 * message / stream / selection vocabulary lives here as pure data and types:
 * no Vue imports, no DOM access. Templates on either end render this same
 * contract, which is what keeps `SnAiChat` (web) and `sn-ai-chat` (uni)
 * behaviourally identical while their markup stays end-specific.
 *
 * Per AGENTS.md §13: `interface` for object contracts, `type` for unions.
 */

/** Who produced a message. */
export type SnAiRole = 'user' | 'assistant' | 'system';

/**
 * Lifecycle of an assistant reply. Drives which affordances the message
 * module renders (spinner, stop button, retry button, copy button).
 *
 *   idle      → nothing requested yet (user / system messages rest here)
 *   queued    → accepted but waiting for the previous turn to finish
 *   thinking  → model is emitting reasoning tokens only
 *   streaming → model is emitting answer tokens
 *   done      → turn completed normally
 *   error     → turn failed; `error` carries the structured detail
 *   aborted   → user stopped the turn before completion
 */
export type SnAiMessageStatus =
  'idle' | 'queued' | 'thinking' | 'streaming' | 'done' | 'error' | 'aborted';

/** A structured failure attached to a message or a part. */
export interface SnAiError {
  /** Stable, searchable code (AGENTS.md §29). e.g. `RATE_LIMITED`. */
  code: string;
  /** Human-readable detail shown in the error card. */
  message: string;
  /** Optional remediation hint rendered under the message. */
  hint?: string | undefined;
  /** Whether the message module should offer a retry affordance. */
  retryable?: boolean | undefined;
  /** Upstream service that produced the failure, for diagnostics. */
  source?: string | undefined;
}

/** Reference to a file the user attached to a turn. */
export interface SnAiAttachment {
  /** Stable identifier — also the key used to remove the attachment. */
  id: string;
  /** Display name (usually the original filename). */
  name: string;
  /** Byte size, rendered through `formatBytes` in the prompt template. */
  size?: number | undefined;
  /** MIME type, used to pick the icon shown on the chip. */
  mime?: string | undefined;
  /** Preview URL for image attachments. */
  url?: string | undefined;
  /** Upload lifecycle; `error` renders the chip in a failure state. */
  status?: 'pending' | 'uploading' | 'done' | 'error' | undefined;
}

/** Reasoning block emitted before (or alongside) the answer. */
export interface SnAiThinkingPart {
  type: 'thinking';
  /** Reasoning text, appended to as the stream advances. */
  text: string;
  /**
   * Wall-clock milliseconds spent reasoning. `undefined` while still
   * thinking; set when the reasoning block closes.
   */
  durationMs?: number | undefined;
  /** Whether the reasoning block has finished emitting. */
  done: boolean;
}

/** Answer text — the primary streamed content. */
export interface SnAiTextPart {
  type: 'text';
  /** Answer text, appended to as the stream advances. */
  text: string;
}

/** A tool / function call the model invoked mid-turn. */
export interface SnAiToolPart {
  type: 'tool';
  /** Tool name as reported by the runtime. */
  name: string;
  /** Call lifecycle. `running` renders a spinner on the row. */
  status: 'running' | 'done' | 'error';
  /** Short human-readable detail (arguments summary or result preview). */
  detail?: string | undefined;
}

/** A file carried inside the conversation itself (user upload echo). */
export interface SnAiAttachmentPart {
  type: 'attachment';
  attachment: SnAiAttachment;
}

/** A failure rendered inline in the transcript. */
export interface SnAiErrorPart {
  type: 'error';
  error: SnAiError;
}

/** Any block that can appear inside a message body. */
export type SnAiMessagePart =
  SnAiThinkingPart | SnAiTextPart | SnAiToolPart | SnAiAttachmentPart | SnAiErrorPart;

/** One turn in the transcript. */
export interface SnAiMessage {
  /** Stable identifier; also the `v-for` key and the stream target. */
  id: string;
  role: SnAiRole;
  /** Body blocks in render order. */
  parts: SnAiMessagePart[];
  /** Lifecycle state. Defaults to `idle` when omitted. */
  status?: SnAiMessageStatus | undefined;
  /** Creation timestamp (epoch ms). */
  createdAt?: number | undefined;
  /** Last-updated timestamp (epoch ms) — advanced by stream deltas. */
  updatedAt?: number | undefined;
  /** Agent that produced (or will produce) this turn. */
  agentId?: string | undefined;
  /** Model that produced (or will produce) this turn. */
  modelId?: string | undefined;
  /** Turn-level failure, mirrored into an `error` part for rendering. */
  error?: SnAiError | undefined;
}

/** Selectable agent (system prompt preset) offered by the prompt toolbar. */
export interface SnAiAgent {
  id: string;
  name: string;
  /** One-line capability summary shown under the name in the menu. */
  description?: string | undefined;
  /** Icon component rendered as the menu row's leading glyph. */
  icon?: unknown;
  /** Whether the agent can run tools / browse. Rendered as a menu badge. */
  capabilities?: string[] | undefined;
  /** Disabled agents render greyed out and cannot be picked. */
  disabled?: boolean | undefined;
}

/**
 * Permission scope for the turn — how much autonomy the model has.
 * Ordered from least to most autonomous so the UI can render a graded scale.
 */
export type SnAiPermission = 'read-only' | 'ask' | 'auto-edit' | 'full-access';

/** Permission option presented in the prompt toolbar menu. */
export interface SnAiPermissionOption {
  value: SnAiPermission;
  label: string;
  description?: string | undefined;
  /** Warning tone for the most permissive scopes. */
  tone?: 'default' | 'warning' | undefined;
}

/**
 * Reasoning budget tier. Maps to provider-specific thinking-token budgets;
 * `off` disables reasoning entirely.
 */
export type SnAiThinkingLevel = 'off' | 'low' | 'medium' | 'high' | 'max';

/** Model offered by the model picker. */
export interface SnAiModel {
  id: string;
  /** Display name, e.g. the model's marketing label. */
  name: string;
  /** Owning vendor id — joins back to `SnAiVendor`. */
  vendorId?: string | undefined;
  /** Short capability tags rendered as chips in the picker. */
  tags?: string[] | undefined;
  /** Whether the model accepts a reasoning budget. */
  supportsThinking?: boolean | undefined;
  /** Whether the model accepts image / file input. */
  supportsVision?: boolean | undefined;
  /** Context window in tokens, shown as secondary metadata. */
  contextWindow?: number | undefined;
  disabled?: boolean | undefined;
}

/** A model provider (OpenAI, Anthropic, a self-hosted gateway, …). */
export interface SnAiVendor {
  id: string;
  name: string;
  /** Base URL of the API endpoint. Editable in the config page. */
  baseUrl?: string | undefined;
  /** Models offered by this vendor. */
  models?: SnAiModel[] | undefined;
  /** Marks a user-defined vendor (renders a "custom" badge + delete action). */
  custom?: boolean | undefined;
  /** Whether the vendor currently has a usable credential stored. */
  hasCredential?: boolean | undefined;
  /** Icon component rendered as the vendor card's leading glyph. */
  icon?: unknown;
}

/** Tunable generation parameters edited on the model config page. */
export interface SnAiModelParams {
  /** Sampling temperature. */
  temperature?: number | undefined;
  /** Nucleus sampling threshold. */
  topP?: number | undefined;
  /** Maximum answer tokens. */
  maxTokens?: number | undefined;
  /** Reasoning budget tier (only meaningful for reasoning-capable models). */
  thinkingLevel?: SnAiThinkingLevel | undefined;
  /** Whether the vendor should stream the response. */
  stream?: boolean | undefined;
}

/** A turn the user has composed but not yet dispatched. */
export interface SnAiQueuedTurn {
  id: string;
  /** Prompt text. */
  text: string;
  /** Attachments captured with the prompt. */
  attachments: SnAiAttachment[];
  /** Agent selected at queue time. */
  agentId?: string | undefined;
  /** Permission scope selected at queue time. */
  permission?: SnAiPermission | undefined;
  /** Model selected at queue time. */
  modelId?: string | undefined;
  /** Reasoning budget selected at queue time. */
  thinkingLevel?: SnAiThinkingLevel | undefined;
  /** Enqueue timestamp (epoch ms). */
  createdAt: number;
}
