import { describe, it, expect } from 'vitest';
import { UISchemaSchema, UI_SCHEMA_TYPE, UI_SCHEMA_VERSION } from './ui-schema.js';

const minimalValid: unknown = {
  version: '1.0.0',
  root: { type: 'card' },
};

describe('@snui/protocol — UISchemaSchema', () => {
  it('accepts a minimal valid UISchema', () => {
    const result = UISchemaSchema.safeParse(minimalValid);
    expect(result.success).toBe(true);
  });

  it('accepts optional id, state, actions, metadata', () => {
    const result = UISchemaSchema.safeParse({
      version: '1.0.0',
      id: 'login-basic',
      root: { type: 'card' },
      state: { count: 0 },
      actions: [{ id: 'submit' }],
      metadata: { author: 'team-a' },
    });
    expect(result.success).toBe(true);
  });

  it('accepts pre-release and build-metadata semver', () => {
    expect(UISchemaSchema.safeParse({ ...minimalValid, version: '1.0.0-rc.1' }).success).toBe(true);
    expect(UISchemaSchema.safeParse({ ...minimalValid, version: '1.0.0+build.7' }).success).toBe(true);
  });

  it('rejects when version is missing', () => {
    const result = UISchemaSchema.safeParse({ root: { type: 'card' } });
    expect(result.success).toBe(false);
  });

  it('rejects when version is not semver', () => {
    const result = UISchemaSchema.safeParse({ version: 'v1.0', root: { type: 'card' } });
    expect(result.success).toBe(false);
  });

  it('rejects when id is an empty string', () => {
    const result = UISchemaSchema.safeParse({ ...minimalValid, id: '' });
    expect(result.success).toBe(false);
  });

  it('rejects when actions is not an array', () => {
    const result = UISchemaSchema.safeParse({ ...minimalValid, actions: 'submit' });
    expect(result.success).toBe(false);
  });

  it('rejects when metadata is not a record', () => {
    const result = UISchemaSchema.safeParse({ ...minimalValid, metadata: 'meta' });
    expect(result.success).toBe(false);
  });

  it('accepts JSON-compatible metadata values (numbers/booleans/arrays/nested)', () => {
    const result = UISchemaSchema.safeParse({
      ...minimalValid,
      metadata: {
        n: 1,
        b: true,
        s: 'text',
        list: [1, 2, 3],
        nested: { ok: true },
        nothing: null,
      },
    });
    expect(result.success).toBe(true);
  });

  it('exposes a stable identifier prefix and current version constant', () => {
    expect(UI_SCHEMA_TYPE).toBe('aui.page');
    expect(UI_SCHEMA_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});