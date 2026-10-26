import { describe, it, expect, vi } from 'vitest';
import { createActionRegistry, type ActionContext, type AppBridgeLike } from './index.js';
import { isAUIError } from './error.js';

const NOOP_BRIDGE: AppBridgeLike = {};
function buildCtx(overrides: Partial<ActionContext> = {}): ActionContext {
  return {
    state: {},
    props: {},
    bridge: NOOP_BRIDGE,
    signal: new AbortController().signal,
    ...overrides,
  };
}

describe('@snui/runtime — ActionRegistry', () => {
  it('register + resolve + has + remove + list', () => {
    const r = createActionRegistry();
    const handler = vi.fn();
    r.register('submit-form', handler);
    expect(r.has('submit-form')).toBe(true);
    expect(r.resolve('submit-form')?.handle).toBe(handler);
    expect(r.list()).toEqual(['submit-form']);
    expect(r.remove('submit-form')).toBe(true);
    expect(r.has('submit-form')).toBe(false);
  });

  it('rejects non-kebab action id', () => {
    const r = createActionRegistry();
    try {
      r.register('SubmitForm', () => {});
      expect.fail('should have thrown');
    } catch (e) {
      expect(isAUIError(e)).toBe(true);
      expect((e as { code: string }).code).toBe('AUI_ACTION_INVALID_ID');
    }
  });

  it('execute invokes the right handler with merged params', async () => {
    const r = createActionRegistry();
    const handler = vi.fn().mockReturnValue({ ok: true });
    r.register('do-thing', handler, { version: '1.2.3' });
    const result = await r.execute({
      action: { id: 'do-thing', type: 'state', params: { a: 1 } },
      context: buildCtx({ state: { count: 5 } }),
      args: { b: 2 },
    });
    expect(result).toEqual({ ok: true });
    expect(handler).toHaveBeenCalledTimes(1);
    const call = handler.mock.calls[0]!;
    const ctx = call[0] as ActionContext;
    const params = call[1] as { a: number; b: number };
    expect(ctx.state).toEqual({ count: 5 });
    expect(params).toEqual({ a: 1, b: 2 });
  });

  it('execute returns AUI_ACTION_NOT_REGISTERED for missing handlers', async () => {
    const r = createActionRegistry();
    try {
      await r.execute({
        action: { id: 'nope', type: 'state' },
        context: buildCtx(),
      });
      expect.fail('should have thrown');
    } catch (e) {
      expect(isAUIError(e)).toBe(true);
      expect((e as { code: string }).code).toBe('AUI_ACTION_NOT_REGISTERED');
    }
  });

  it('execute wraps synchronous throws as AUI_ACTION_HANDLER_THREW', async () => {
    const r = createActionRegistry();
    r.register('boom', () => {
      throw new Error('nope');
    });
    try {
      await r.execute({ action: { id: 'boom', type: 'state' }, context: buildCtx() });
      expect.fail('should have thrown');
    } catch (e) {
      expect(isAUIError(e)).toBe(true);
      expect((e as { code: string }).code).toBe('AUI_ACTION_HANDLER_THREW');
    }
  });

  it('execute wraps async rejections as AUI_ACTION_HANDLER_REJECTED', async () => {
    const r = createActionRegistry();
    r.register('boom-async', async () => {
      throw new Error('async nope');
    });
    try {
      await r.execute({ action: { id: 'boom-async', type: 'state' }, context: buildCtx() });
      expect.fail('should have thrown');
    } catch (e) {
      expect(isAUIError(e)).toBe(true);
      expect((e as { code: string }).code).toBe('AUI_ACTION_HANDLER_REJECTED');
    }
  });

  it('execute honors AbortSignal — already aborted → AUI_ACTION_ABORTED', async () => {
    const r = createActionRegistry();
    const handler = vi.fn();
    r.register('check-abort', handler);
    const ac = new AbortController();
    ac.abort();
    try {
      await r.execute({ action: { id: 'check-abort', type: 'state' }, context: buildCtx({ signal: ac.signal }) });
      expect.fail('should have thrown');
    } catch (e) {
      expect(isAUIError(e)).toBe(true);
      expect((e as { code: string }).code).toBe('AUI_ACTION_ABORTED');
    }
    expect(handler).not.toHaveBeenCalled();
  });
});