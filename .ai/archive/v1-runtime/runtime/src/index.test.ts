import { describe, it, expect } from 'vitest';
import {
  AUI_RUNTIME_VERSION,
  createRuntime,
  createLifecycleTracker,
  createAUIError,
  isAUIError,
} from './index.js';
import type { UISchema } from '@snui/protocol';
import { LIGHT_THEME, MODERN_STYLE, COMFORTABLE_DENSITY } from '@snui/tokens';

const VALID: UISchema = {
  version: '1.0.0',
  root: { id: 'r', type: 'card' },
};

describe('@snui/runtime', () => {
  it('exports a semver runtime version constant', () => {
    expect(AUI_RUNTIME_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('re-exports createRuntime + createLifecycleTracker + createAUIError + isAUIError', () => {
    expect(typeof createRuntime).toBe('function');
    expect(typeof createLifecycleTracker).toBe('function');
    expect(typeof createAUIError).toBe('function');
    expect(typeof isAUIError).toBe('function');
  });

  it('can mount + dispose the full stack', () => {
    const r = createRuntime({
      schema: VALID,
      registry: {
        resolve: () => undefined,
        has: () => false,
        list: () => [],
      },
      actionRegistry: {
        resolve: () => undefined,
        has: () => false,
      },
      tokens: { theme: LIGHT_THEME, style: MODERN_STYLE, density: COMFORTABLE_DENSITY },
      platform: { id: 'web', capabilities: { supports: {} } },
    });
    r.mount({});
    expect(r.lifecycle.phase).toBe('mounted');
    r.unmount();
    expect(r.lifecycle.disposed).toBe(true);
  });
});