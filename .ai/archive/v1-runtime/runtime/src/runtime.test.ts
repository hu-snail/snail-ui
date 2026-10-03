import { describe, it, expect, vi } from 'vitest';
import type { UISchema } from '@snui/protocol';
import { LIGHT_THEME, MODERN_STYLE, COMFORTABLE_DENSITY } from '@snui/tokens';
import { createRuntime, type RuntimeComponentRegistry, type RuntimeActionRegistry, isAUIError } from './index.js';
import type { PlatformAdapter } from './platform.js';

const VALID_SCHEMA: UISchema = {
  version: '1.0.0',
  root: { id: 'r', type: 'card' },
};

const REGISTRY: RuntimeComponentRegistry = {
  resolve: (type) => (type === 'card' ? { name: 'card', version: '1.0.0' } : undefined),
  has: (type) => type === 'card',
  list: () => ['card'],
};

const ACTION_REGISTRY: RuntimeActionRegistry = {
  resolve: () => undefined,
  has: () => false,
};

const PLATFORM: PlatformAdapter = {
  id: 'web',
  capabilities: { supports: { dom: true } },
};

describe('@snui/runtime — AUIRuntime', () => {
  it('rejects an invalid schema up front', () => {
    expect(() =>
      createRuntime({
        schema: { version: 'bad', root: { id: '', type: '' } } as never,
        registry: REGISTRY,
        actionRegistry: ACTION_REGISTRY,
        tokens: { theme: LIGHT_THEME, style: MODERN_STYLE, density: COMFORTABLE_DENSITY },
        platform: PLATFORM,
      }),
    ).toThrow(expect.objectContaining({ code: 'AUI_RUNTIME_SCHEMA_INVALID' }));
  });

  it('walks create → mount → update → unmount → dispose', () => {
    const hooks = {
      onCreate: vi.fn(),
      onMount: vi.fn(),
      onUpdate: vi.fn(),
      onUnmount: vi.fn(),
    };
    const r = createRuntime({
      schema: VALID_SCHEMA,
      registry: REGISTRY,
      actionRegistry: ACTION_REGISTRY,
      tokens: { theme: LIGHT_THEME, style: MODERN_STYLE, density: COMFORTABLE_DENSITY },
      platform: PLATFORM,
      hooks,
    });
    expect(hooks.onCreate).toHaveBeenCalledTimes(1);
    expect(r.lifecycle.phase).toBe('created');

    r.mount({ tag: 'div' });
    expect(r.lifecycle.phase).toBe('mounted');
    expect(hooks.onMount).toHaveBeenCalledTimes(1);

    const result = r.update({ ...VALID_SCHEMA, root: { id: 'r2', type: 'card' } });
    expect(result.valid).toBe(true);
    expect(r.lifecycle.phase).toBe('updated');
    expect(hooks.onUpdate).toHaveBeenCalledTimes(1);

    r.unmount();
    expect(r.lifecycle.disposed).toBe(true);
    expect(hooks.onUnmount).toHaveBeenCalledTimes(1);
  });

  it('rejects double-mount', () => {
    const r = createRuntime({
      schema: VALID_SCHEMA,
      registry: REGISTRY,
      actionRegistry: ACTION_REGISTRY,
      tokens: { theme: LIGHT_THEME, style: MODERN_STYLE, density: COMFORTABLE_DENSITY },
      platform: PLATFORM,
    });
    r.mount({});
    expect(() => r.mount({})).toThrow(expect.objectContaining({ code: 'AUI_RUNTIME_ALREADY_MOUNTED' }));
  });

  it('rejects mount after dispose', () => {
    const r = createRuntime({
      schema: VALID_SCHEMA,
      registry: REGISTRY,
      actionRegistry: ACTION_REGISTRY,
      tokens: { theme: LIGHT_THEME, style: MODERN_STYLE, density: COMFORTABLE_DENSITY },
      platform: PLATFORM,
    });
    r.dispose();
    expect(() => r.mount({})).toThrow(expect.objectContaining({ code: 'AUI_RUNTIME_DISPOSED' }));
  });

  it('update() returns invalid result on bad schema', () => {
    const r = createRuntime({
      schema: VALID_SCHEMA,
      registry: REGISTRY,
      actionRegistry: ACTION_REGISTRY,
      tokens: { theme: LIGHT_THEME, style: MODERN_STYLE, density: COMFORTABLE_DENSITY },
      platform: PLATFORM,
    });
    const bad = { version: 'bad', root: { id: '', type: '' } } as unknown as UISchema;
    const result = r.update(bad);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('exposes the resolved token bindings', () => {
    const r = createRuntime({
      schema: VALID_SCHEMA,
      registry: REGISTRY,
      actionRegistry: ACTION_REGISTRY,
      tokens: { theme: LIGHT_THEME, style: MODERN_STYLE, density: COMFORTABLE_DENSITY },
      platform: PLATFORM,
    });
    expect(r.tokenBindings.length).toBeGreaterThan(0);
    expect(r.tokenBindings.some((b) => b.name === '--aui-color-blue-500')).toBe(true);
  });

  it('throws AUIError (typed) on lifecycle violations', () => {
    const r = createRuntime({
      schema: VALID_SCHEMA,
      registry: REGISTRY,
      actionRegistry: ACTION_REGISTRY,
      tokens: { theme: LIGHT_THEME, style: MODERN_STYLE, density: COMFORTABLE_DENSITY },
      platform: PLATFORM,
    });
    r.mount({});
    try {
      r.mount({});
      expect.fail('should have thrown');
    } catch (e) {
      expect(isAUIError(e)).toBe(true);
      const err = e as { code: string };
      expect(err.code).toBe('AUI_RUNTIME_ALREADY_MOUNTED');
    }
  });

  it('respects an external AbortSignal and disposes on abort', () => {
    const ac = new AbortController();
    const r = createRuntime({
      schema: VALID_SCHEMA,
      registry: REGISTRY,
      actionRegistry: ACTION_REGISTRY,
      tokens: { theme: LIGHT_THEME, style: MODERN_STYLE, density: COMFORTABLE_DENSITY },
      platform: PLATFORM,
      signal: ac.signal,
    });
    expect(r.lifecycle.disposed).toBe(false);
    ac.abort();
    expect(r.lifecycle.disposed).toBe(true);
  });
});