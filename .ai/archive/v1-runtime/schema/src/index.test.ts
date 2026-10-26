import { describe, it, expect } from 'vitest';
import { CURRENT_SCHEMA_VERSION, createValidator, createNormalizer } from './index.js';

describe('@snui/schema', () => {
  it('exports a semver schema version constant', () => {
    expect(CURRENT_SCHEMA_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('re-exports validator + normalizer + version entry points', () => {
    expect(typeof createValidator).toBe('function');
    expect(typeof createNormalizer).toBe('function');
  });
});