/**
 * The conversation engine shared by the two page-level templates.
 *
 * `SnAiChat` (the plain conversation page) and `SnAiAssistant` (the assistant,
 * assembled from the message list, the composer and the model config) need the
 * same thing in the middle: accept a composed turn, run it, fold stream deltas
 * into the transcript, keep extra submissions queued, and abort whatever is
 * still in flight when the user stops it or the page unmounts (AGENTS.md
 * §40/§41).
 *
 * It lives here rather than inside either template because that is the only way
 * the assistant can be an assembly: it mounts the message list, the composer and
 * the model config itself and shares this engine with the chat page, instead of
 * wrapping the chat page to borrow its scheduler. The two pages differ in layout
 * and in which satellites they bring — a model-config drawer, say — not in
 * scheduling, so both stay behaviourally identical by construction.
 */
import { computed, onBeforeUnmount, ref, watch, type ComputedRef, type Ref } from 'vue';
import {
  applyStreamDelta,
  createAssistantMessage,
  createUserMessage,
  markAborted,
  markDone,
  markError,
  nextId,
} from '../shared/stream';
import type { SnAiStreamDelta } from '../shared/stream';
import type {
  SnAiError,
  SnAiMessage,
  SnAiPermission,
  SnAiQueuedTurn,
  SnAiThinkingLevel,
} from '../shared/types';

/**
 * A host's turn runner. It receives the queued turn plus an AbortSignal and a
 * delta sink, and resolves once the turn is complete. Emitting deltas through
 * the sink (instead of returning a final string) is what lets reasoning, tool
 * calls, and answer text interleave the way a real stream does.
 */
export type SnAiRunTurn = (
  turn: SnAiQueuedTurn,
  context: {
    signal: AbortSignal;
    emit: (delta: SnAiStreamDelta) => void;
    messageId: string;
  },
) => Promise<void>;

/** How the engine reports back to whichever page mounted it. */
export interface AiTurnQueueHooks {
  /** The transcript changed (new turn, stream delta, or status change). */
  onMessages: (messages: SnAiMessage[]) => void;
  onTurnStart: (turn: SnAiQueuedTurn) => void;
  onTurnEnd: (payload: { turn: SnAiQueuedTurn; message: SnAiMessage }) => void;
  onError: (payload: { turn: SnAiQueuedTurn; error: SnAiError }) => void;
  /** The user asked to retry; reported before the turn is re-dispatched. */
  onRetry: (message: SnAiMessage) => void;
  onModelChange: (modelId: string) => void;
  onAgentChange: (agentId: string) => void;
}

export interface AiTurnQueueOptions {
  /** The host's transcript (the page's `messages` prop). */
  messages: () => SnAiMessage[] | undefined;
  /** The host's runner. Without one a turn fails with `NO_RUNNER`. */
  run: () => SnAiRunTurn | undefined;
  /** Whether a submission while running queues, or is dropped. */
  allowQueue: () => boolean;
  /** Whether a selection sticks to subsequent turns. */
  rememberSelection: () => boolean;
  /** Template name used in the `NO_RUNNER` hint, e.g. `SnAiChat`. */
  hostName: () => string;
  hooks: AiTurnQueueHooks;
}

export interface AiTurnQueue {
  /** The transcript to render and fold into. */
  messages: ComputedRef<SnAiMessage[]>;
  /** Turns accepted but not yet dispatched. */
  queue: Ref<SnAiQueuedTurn[]>;
  /** Whether a turn is in flight. */
  isActive: ComputedRef<boolean>;
  /** Whether the transcript is empty (drives the page's empty composition). */
  isEmpty: ComputedRef<boolean>;
  /** Selection mirrored into the composer; writable so the prompt can bind it. */
  agentId: Ref<string | undefined>;
  permission: Ref<SnAiPermission | undefined>;
  modelId: Ref<string | undefined>;
  thinkingLevel: Ref<SnAiThinkingLevel | undefined>;
  /** Accept a composed turn: run it now, or queue it behind the running one. */
  send: (turn: SnAiQueuedTurn) => void;
  /** Abort the turn in flight, keeping whatever it already produced. */
  stop: () => void;
  /** Drop a queued turn the user cancelled. */
  removeQueued: (id: string) => void;
  /** Re-dispatch the turn a failed message came from. */
  retry: (message: SnAiMessage) => void;
  /** Report a model pick to the host, remembering it when asked. */
  changeModel: (modelId: string) => void;
  /** Report an agent pick to the host, remembering it when asked. */
  changeAgent: (agentId: string) => void;
}

/**
 * Normalize anything a runner may throw into the structured error contract.
 * Per AGENTS.md §28 core errors must carry a stable code, so an unknown throw is
 * wrapped rather than surfaced raw.
 */
function toStructuredError(caught: unknown): SnAiError {
  if (caught && typeof caught === 'object' && 'code' in caught && 'message' in caught) {
    const shape = caught as { code: unknown; message: unknown; hint?: unknown };
    return {
      code: String(shape.code),
      message: String(shape.message),
      hint: typeof shape.hint === 'string' ? shape.hint : undefined,
      retryable: true,
    };
  }
  if (caught instanceof Error) {
    return { code: 'TURN_FAILED', message: caught.message, retryable: true };
  }
  return { code: 'TURN_FAILED', message: '生成失败', retryable: true };
}

export function useAiTurnQueue(options: AiTurnQueueOptions): AiTurnQueue {
  /**
   * Kept local so a host that updates `messages` asynchronously (or not at all,
   * as in a demo) cannot drop stream deltas mid-turn. Resynced whenever the host
   * replaces the prop.
   */
  const localMessages = ref<SnAiMessage[]>([...(options.messages() ?? [])]);
  watch(options.messages, (next) => {
    localMessages.value = [...(next ?? [])];
  });
  const messages = computed<SnAiMessage[]>(() => localMessages.value);

  const queue = ref<SnAiQueuedTurn[]>([]);
  const activeTurn = ref<SnAiQueuedTurn | null>(null);
  /** The controller for the in-flight turn, so `stop` can cancel it. */
  let controller: AbortController | null = null;

  const isActive = computed(() => activeTurn.value !== null);
  const isEmpty = computed(() => messages.value.length === 0);

  const agentId = ref<string | undefined>(undefined);
  const permission = ref<SnAiPermission | undefined>(undefined);
  const modelId = ref<string | undefined>(undefined);
  const thinkingLevel = ref<SnAiThinkingLevel | undefined>(undefined);

  /** Replace the transcript and notify the host. */
  function setMessages(next: SnAiMessage[]): void {
    localMessages.value = next;
    options.hooks.onMessages(next);
  }

  /** Replace one message in the transcript, preserving order. */
  function patchMessage(id: string, updater: (message: SnAiMessage) => SnAiMessage): void {
    setMessages(messages.value.map((message) => (message.id === id ? updater(message) : message)));
  }

  /**
   * Run one queued turn: append the user turn, create the assistant
   * placeholder, then hand both the placeholder id and a delta sink to the
   * host's runner.
   */
  async function dispatch(turn: SnAiQueuedTurn): Promise<void> {
    const userMessage = createUserMessage(turn.text, turn.attachments);
    const assistantMessage = createAssistantMessage({
      agentId: turn.agentId,
      modelId: turn.modelId,
    });

    activeTurn.value = turn;
    controller = new AbortController();
    setMessages([...messages.value, userMessage, assistantMessage]);
    options.hooks.onTurnStart(turn);

    const signal = controller.signal;
    const runner = options.run();
    try {
      if (!runner) {
        // No runner wired: the pages still render the turn so a docs demo or a
        // storybook can show the streaming states without a backend.
        throw Object.assign(new Error('未配置运行器'), {
          code: 'NO_RUNNER',
          hint: `给 <${options.hostName()} :run="..."> 传入运行函数后即可真实对话`,
        });
      }
      await runner(turn, {
        signal,
        messageId: assistantMessage.id,
        emit: (delta) => {
          patchMessage(assistantMessage.id, (message) => applyStreamDelta(message, delta));
        },
      });
      patchMessage(assistantMessage.id, markDone);
      options.hooks.onTurnEnd({
        turn,
        message: messages.value.find((m) => m.id === assistantMessage.id)!,
      });
    } catch (caught) {
      const aborted = signal.aborted || (caught instanceof Error && caught.name === 'AbortError');
      if (aborted) {
        patchMessage(assistantMessage.id, markAborted);
      } else {
        const error = toStructuredError(caught);
        patchMessage(assistantMessage.id, (message) => markError(message, error));
        options.hooks.onError({ turn, error });
      }
      const settled = messages.value.find((m) => m.id === assistantMessage.id);
      if (settled) options.hooks.onTurnEnd({ turn, message: settled });
    } finally {
      controller = null;
      activeTurn.value = null;
      // Drain the next queued turn, if any.
      const [next, ...rest] = queue.value;
      queue.value = rest;
      if (next) void dispatch(next);
    }
  }

  /** Accept a composed turn from the composer: run it now or enqueue it. */
  function send(turn: SnAiQueuedTurn): void {
    if (isActive.value) {
      if (!options.allowQueue()) return;
      queue.value = [...queue.value, turn];
      return;
    }
    void dispatch(turn);
  }

  function stop(): void {
    controller?.abort();
  }

  function removeQueued(id: string): void {
    queue.value = queue.value.filter((turn) => turn.id !== id);
  }

  /** The user text immediately preceding an assistant turn (retry context). */
  function findPrecedingUserText(assistantId: string): string {
    const list = messages.value;
    const index = list.findIndex((message) => message.id === assistantId);
    for (let i = index - 1; i >= 0; i -= 1) {
      const candidate = list[i];
      if (candidate?.role !== 'user') continue;
      const text = candidate.parts.find((part) => part.type === 'text');
      if (text?.type === 'text') return text.text;
    }
    return '';
  }

  /** Retry a failed turn by re-dispatching its original composition. */
  function retry(message: SnAiMessage): void {
    options.hooks.onRetry(message);
    send({
      id: nextId('sn-ai-turn'),
      text: findPrecedingUserText(message.id),
      attachments: [],
      agentId: message.agentId,
      modelId: message.modelId,
      createdAt: Date.now(),
    });
  }

  function changeModel(next: string): void {
    if (options.rememberSelection()) modelId.value = next;
    options.hooks.onModelChange(next);
  }

  function changeAgent(next: string): void {
    if (options.rememberSelection()) agentId.value = next;
    options.hooks.onAgentChange(next);
  }

  onBeforeUnmount(() => {
    // Abort whatever is still running: work must not outlive the page (§41).
    controller?.abort();
    controller = null;
  });

  return {
    messages,
    queue,
    isActive,
    isEmpty,
    agentId,
    permission,
    modelId,
    thinkingLevel,
    send,
    stop,
    removeQueued,
    retry,
    changeModel,
    changeAgent,
  };
}
