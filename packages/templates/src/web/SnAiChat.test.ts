/**
 * SnAiChat behaviour tests — AUI-TPL-001.
 *
 * The page owns the turn scheduler, so this suite pins the scheduling contract
 * rather than markup: a turn runs immediately when idle, extra submissions
 * queue behind it and drain in order, stop aborts, a thrown runner surfaces a
 * structured error, and unmounting aborts whatever is still running
 * (AGENTS.md §40/§41).
 */

import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SnAiChat from './SnAiChat.vue';
import type { SnAiRunTurn } from './SnAiChat.vue';
import type { SnAiMessage } from '../shared/types';

/** Build a runner that emits a scripted delta sequence and resolves. */
function scriptedRunner(
  deltas: Parameters<SnAiRunTurn>[1]['emit'] extends (d: infer D) => void ? D[] : never,
) {
  return vi.fn<SnAiRunTurn>(async (_turn, context) => {
    for (const delta of deltas) context.emit(delta);
  });
}

function mountChat(run?: SnAiRunTurn) {
  return mount(SnAiChat, {
    props: { messages: [] as SnAiMessage[], run },
  });
}

describe('SnAiChat', () => {
  describe('scheduling', () => {
    it('should run a turn immediately when idle', async () => {
      const run = scriptedRunner([{ type: 'text', text: '答案' }]);
      const wrapper = mountChat(run);
      wrapper.findComponent({ name: 'SnAiPrompt' }).vm.$emit('send', {
        id: 't1',
        text: '问题',
        attachments: [],
        createdAt: 1,
      });
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(run).toHaveBeenCalledTimes(1);
      const transcript = wrapper.emitted('update:messages')?.at(-1)?.[0] as SnAiMessage[];
      expect(transcript.map((message) => message.role)).toEqual(['user', 'assistant']);
      expect(transcript[1]?.parts[0]).toEqual({ type: 'text', text: '答案' });
      expect(transcript[1]?.status).toBe('done');
    });

    it('should queue a second turn while one is running', async () => {
      let release: (() => void) | undefined;
      const run = vi.fn<SnAiRunTurn>(
        () =>
          new Promise<void>((resolve) => {
            release = resolve;
          }),
      );
      const wrapper = mountChat(run);
      const prompt = wrapper.findComponent({ name: 'SnAiPrompt' });

      prompt.vm.$emit('send', { id: 't1', text: '第一', attachments: [], createdAt: 1 });
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(run).toHaveBeenCalledTimes(1);

      prompt.vm.$emit('send', { id: 't2', text: '第二', attachments: [], createdAt: 2 });
      await wrapper.vm.$nextTick();
      // The second turn is queued, not started.
      expect(run).toHaveBeenCalledTimes(1);
      expect(prompt.props('queued')).toHaveLength(1);

      release?.();
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(run).toHaveBeenCalledTimes(2);
    });

    it('should drop extra submissions when queueing is disabled', async () => {
      const run = vi.fn<SnAiRunTurn>(() => new Promise<void>(() => {}));
      const wrapper = mount(SnAiChat, {
        props: { messages: [] as SnAiMessage[], run, allowQueue: false },
      });
      const prompt = wrapper.findComponent({ name: 'SnAiPrompt' });
      prompt.vm.$emit('send', { id: 't1', text: '第一', attachments: [], createdAt: 1 });
      await new Promise((resolve) => setTimeout(resolve, 0));
      prompt.vm.$emit('send', { id: 't2', text: '第二', attachments: [], createdAt: 2 });
      await wrapper.vm.$nextTick();
      expect(prompt.props('queued')).toHaveLength(0);
    });

    it('should remove a queued turn on request', async () => {
      const run = vi.fn<SnAiRunTurn>(() => new Promise<void>(() => {}));
      const wrapper = mountChat(run);
      const prompt = wrapper.findComponent({ name: 'SnAiPrompt' });
      prompt.vm.$emit('send', { id: 't1', text: '第一', attachments: [], createdAt: 1 });
      await new Promise((resolve) => setTimeout(resolve, 0));
      prompt.vm.$emit('send', { id: 't2', text: '第二', attachments: [], createdAt: 2 });
      await wrapper.vm.$nextTick();

      prompt.vm.$emit('remove-queued', 't2');
      await wrapper.vm.$nextTick();
      expect(prompt.props('queued')).toHaveLength(0);
    });

    it('should report active state to the prompt while running', async () => {
      const run = vi.fn<SnAiRunTurn>(() => new Promise<void>(() => {}));
      const wrapper = mountChat(run);
      const prompt = wrapper.findComponent({ name: 'SnAiPrompt' });
      expect(prompt.props('active')).toBe(false);

      prompt.vm.$emit('send', { id: 't1', text: '问题', attachments: [], createdAt: 1 });
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(prompt.props('active')).toBe(true);
    });
  });

  describe('stream folding', () => {
    it('should fold reasoning then answer into the assistant turn', async () => {
      const run = scriptedRunner([
        { type: 'thinking', text: '先分析' },
        { type: 'thinking-end', durationMs: 1200 },
        { type: 'text', text: '结论' },
      ]);
      const wrapper = mountChat(run);
      wrapper.findComponent({ name: 'SnAiPrompt' }).vm.$emit('send', {
        id: 't1',
        text: '问题',
        attachments: [],
        createdAt: 1,
      });
      await new Promise((resolve) => setTimeout(resolve, 0));

      const transcript = wrapper.emitted('update:messages')?.at(-1)?.[0] as SnAiMessage[];
      const assistant = transcript[1];
      expect(assistant?.parts.map((part) => part.type)).toEqual(['thinking', 'text']);
      expect(assistant?.status).toBe('done');
    });

    it('should emit turn-start and turn-end around a successful turn', async () => {
      const run = scriptedRunner([{ type: 'text', text: '答案' }]);
      const wrapper = mountChat(run);
      wrapper.findComponent({ name: 'SnAiPrompt' }).vm.$emit('send', {
        id: 't1',
        text: '问题',
        attachments: [],
        createdAt: 1,
      });
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(wrapper.emitted('turn-start')?.[0]?.[0]).toMatchObject({ id: 't1' });
      expect(wrapper.emitted('turn-end')).toHaveLength(1);
    });
  });

  describe('stop', () => {
    it('should abort the running turn and mark it aborted', async () => {
      const run = vi.fn<SnAiRunTurn>(
        (_turn, context) =>
          new Promise<void>((_resolve, reject) => {
            context.signal.addEventListener('abort', () => {
              reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
            });
          }),
      );
      const wrapper = mountChat(run);
      const prompt = wrapper.findComponent({ name: 'SnAiPrompt' });
      prompt.vm.$emit('send', { id: 't1', text: '问题', attachments: [], createdAt: 1 });
      await new Promise((resolve) => setTimeout(resolve, 0));

      prompt.vm.$emit('stop');
      await new Promise((resolve) => setTimeout(resolve, 0));

      const transcript = wrapper.emitted('update:messages')?.at(-1)?.[0] as SnAiMessage[];
      expect(transcript[1]?.status).toBe('aborted');
    });

    it('should abort an in-flight turn when the page unmounts', async () => {
      let captured: AbortSignal | undefined;
      const run = vi.fn<SnAiRunTurn>((_turn, context) => {
        captured = context.signal;
        return new Promise<void>(() => {});
      });
      const wrapper = mountChat(run);
      wrapper.findComponent({ name: 'SnAiPrompt' }).vm.$emit('send', {
        id: 't1',
        text: '问题',
        attachments: [],
        createdAt: 1,
      });
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(captured?.aborted).toBe(false);
      wrapper.unmount();
      expect(captured?.aborted).toBe(true);
    });
  });

  describe('failure handling', () => {
    it('should surface a structured error from the runner', async () => {
      const run = vi.fn<SnAiRunTurn>(async () => {
        throw Object.assign(new Error('请求过于频繁'), {
          code: 'RATE_LIMITED',
          hint: '稍后重试',
        });
      });
      const wrapper = mountChat(run);
      wrapper.findComponent({ name: 'SnAiPrompt' }).vm.$emit('send', {
        id: 't1',
        text: '问题',
        attachments: [],
        createdAt: 1,
      });
      await new Promise((resolve) => setTimeout(resolve, 0));

      const payload = wrapper.emitted('error')?.[0]?.[0] as {
        error: { code: string; hint?: string };
      };
      expect(payload.error.code).toBe('RATE_LIMITED');
      expect(payload.error.hint).toBe('稍后重试');

      const transcript = wrapper.emitted('update:messages')?.at(-1)?.[0] as SnAiMessage[];
      expect(transcript[1]?.status).toBe('error');
    });

    it('should wrap an unlabelled failure into the structured contract', async () => {
      const run = vi.fn<SnAiRunTurn>(async () => {
        throw new Error('网络中断');
      });
      const wrapper = mountChat(run);
      wrapper.findComponent({ name: 'SnAiPrompt' }).vm.$emit('send', {
        id: 't1',
        text: '问题',
        attachments: [],
        createdAt: 1,
      });
      await new Promise((resolve) => setTimeout(resolve, 0));

      const payload = wrapper.emitted('error')?.[0]?.[0] as { error: { code: string } };
      expect(payload.error.code).toBe('TURN_FAILED');
    });

    it('should fail the turn with NO_RUNNER when no runner is wired', async () => {
      const wrapper = mountChat(undefined);
      wrapper.findComponent({ name: 'SnAiPrompt' }).vm.$emit('send', {
        id: 't1',
        text: '问题',
        attachments: [],
        createdAt: 1,
      });
      await new Promise((resolve) => setTimeout(resolve, 0));

      const payload = wrapper.emitted('error')?.[0]?.[0] as { error: { code: string } };
      expect(payload.error.code).toBe('NO_RUNNER');
    });

    it('should drain the queue after a failed turn', async () => {
      const run = vi
        .fn<SnAiRunTurn>()
        .mockRejectedValueOnce(new Error('第一次失败'))
        .mockResolvedValueOnce(undefined);
      const wrapper = mountChat(run);
      const prompt = wrapper.findComponent({ name: 'SnAiPrompt' });

      prompt.vm.$emit('send', { id: 't1', text: '第一', attachments: [], createdAt: 1 });
      await new Promise((resolve) => setTimeout(resolve, 0));
      prompt.vm.$emit('send', { id: 't2', text: '第二', attachments: [], createdAt: 2 });
      await new Promise((resolve) => setTimeout(resolve, 0));
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(run).toHaveBeenCalledTimes(2);
    });
  });

  describe('composition', () => {
    it('should render the header with title and subtitle', () => {
      const wrapper = mount(SnAiChat, { props: { title: 'AI 助手', subtitle: '随时提问' } });
      expect(wrapper.text()).toContain('AI 助手');
      expect(wrapper.text()).toContain('随时提问');
    });

    it('should hide the header when showHeader is false', () => {
      const wrapper = mount(SnAiChat, { props: { showHeader: false } });
      expect(wrapper.find('.sn-ai-chat__header').exists()).toBe(false);
    });

    it('should pass the loading state down to the transcript', () => {
      const wrapper = mount(SnAiChat, { props: { loading: true } });
      expect(wrapper.findComponent({ name: 'SnAiMessageList' }).props('loading')).toBe(true);
    });

    it('should forward the selected model to the prompt', async () => {
      const wrapper = mount(SnAiChat, { props: { models: [{ id: 'm1', name: 'Deep' }] } });
      const prompt = wrapper.findComponent({ name: 'SnAiPrompt' });
      prompt.vm.$emit('update:model-id', 'm1');
      await wrapper.vm.$nextTick();
      expect(prompt.props('modelId')).toBe('m1');
      expect(wrapper.emitted('update:modelId')?.[0]).toEqual(['m1']);
    });

    it('should retry a failed turn by re-dispatching its preceding prompt', async () => {
      const run = scriptedRunner([{ type: 'text', text: '答案' }]);
      const messages: SnAiMessage[] = [
        { id: 'u1', role: 'user', parts: [{ type: 'text', text: '原始问题' }], status: 'idle' },
        {
          id: 'a1',
          role: 'assistant',
          parts: [{ type: 'error', error: { code: 'X', message: '失败' } }],
          status: 'error',
        },
      ];
      const wrapper = mount(SnAiChat, { props: { messages, run } });
      wrapper.findComponent({ name: 'SnAiMessageList' }).vm.$emit('retry', messages[1]);
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(wrapper.emitted('retry')).toHaveLength(1);
      expect(run).toHaveBeenCalledTimes(1);
      const turn = run.mock.calls[0]?.[0];
      expect(turn?.text).toBe('原始问题');
    });
  });
});
