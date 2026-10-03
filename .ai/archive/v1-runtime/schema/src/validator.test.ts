import { describe, it, expect } from 'vitest';
import { createValidator } from './validator.js';

describe('@snui/schema — Validator', () => {
  it('accepts a minimal valid UISchema', () => {
    const r = createValidator().validate({
      version: '1.0.0',
      root: { id: 'root', type: 'card' },
    });
    expect(r.valid).toBe(true);
    expect(r.errors).toEqual([]);
  });

  it('returns value on success', () => {
    const r = createValidator().validate({
      version: '1.0.0',
      root: { id: 'r', type: 'card' },
    });
    expect(r.value).toBeDefined();
    expect(r.value!.version).toBe('1.0.0');
  });

  it('returns structured errors with path / code / hint / source', () => {
    const r = createValidator().validate({
      version: 'v1.0',
      root: { id: 'r' },
    });
    expect(r.valid).toBe(false);
    expect(r.errors.length).toBeGreaterThan(0);
    const e = r.errors[0]!;
    expect(e.code).toMatch(/^SCHEMA_/);
    expect(e.path.length).toBeGreaterThan(0);
    expect(e.severity).toBe('error');
    expect(e.source).toMatch(/schema|component|binding|action/);
  });

  it('infers component source for /root/* paths', () => {
    const r = createValidator().validate({
      version: '1.0.0',
      root: { id: 'r', type: '' },
    });
    expect(r.errors.some((e) => e.source === 'component')).toBe(true);
  });

  it('infers binding source for /bindings/* paths', () => {
    const r = createValidator().validate({
      version: '1.0.0',
      root: {
        id: 'r',
        type: 'card',
        bindings: { bad: 1 },
      },
    });
    expect(r.errors.some((e) => e.source === 'binding')).toBe(true);
  });

  it('infers action source for /actions/* paths', () => {
    const r = createValidator().validate({
      version: '1.0.0',
      root: { id: 'r', type: 'card' },
      actions: [{ bad: 'x' }],
    });
    expect(r.errors.some((e) => e.source === 'action')).toBe(true);
  });

  it('attaches a hint for unknown-key errors', () => {
    const r = createValidator().validate({
      version: '1.0.0',
      root: { id: 'r', type: 'card', sneaky: true },
    });
    expect(r.errors.some((e) => e.hint !== undefined)).toBe(true);
  });
});