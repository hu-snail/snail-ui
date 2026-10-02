import { describe, it, expect } from 'vitest';
import { UIBindingSchema } from './ui-binding.js';
import type {
  StateBinding,
  ComputedBinding,
  PropBinding,
  EventBinding,
  ExpressionBinding,
} from './ui-binding.js';

describe('@snui/protocol — UIBindingSchema (discriminated union, 5 kinds)', () => {
  describe('state binding', () => {
    it('accepts a dotted identifier path', () => {
      const b: StateBinding = { kind: 'state', path: 'local.form.email' };
      expect(UIBindingSchema.safeParse(b).success).toBe(true);
    });

    it('rejects an empty path', () => {
      expect(UIBindingSchema.safeParse({ kind: 'state', path: '' }).success).toBe(false);
    });

    it('rejects a path that is not a dotted identifier', () => {
      expect(UIBindingSchema.safeParse({ kind: 'state', path: '1bad' }).success).toBe(false);
      expect(UIBindingSchema.safeParse({ kind: 'state', path: 'has-dash' }).success).toBe(false);
      expect(UIBindingSchema.safeParse({ kind: 'state', path: 'has space' }).success).toBe(false);
    });
  });

  describe('computed binding', () => {
    it('accepts an identifier name', () => {
      const b: ComputedBinding = { kind: 'computed', name: 'totalPrice' };
      expect(UIBindingSchema.safeParse(b).success).toBe(true);
    });

    it('rejects a non-identifier name', () => {
      expect(UIBindingSchema.safeParse({ kind: 'computed', name: '1bad' }).success).toBe(false);
      expect(UIBindingSchema.safeParse({ kind: 'computed', name: 'has-dash' }).success).toBe(false);
    });
  });

  describe('prop binding', () => {
    it('accepts a props-prefixed path', () => {
      const b: PropBinding = { kind: 'prop', path: 'props.title' };
      expect(UIBindingSchema.safeParse(b).success).toBe(true);
    });

    it('rejects a non-props path', () => {
      expect(UIBindingSchema.safeParse({ kind: 'prop', path: 'state.title' }).success).toBe(false);
      expect(UIBindingSchema.safeParse({ kind: 'prop', path: 'title' }).success).toBe(false);
    });
  });

  describe('event binding', () => {
    it('accepts a known trigger', () => {
      const b: EventBinding = { kind: 'event', trigger: 'click' };
      expect(UIBindingSchema.safeParse(b).success).toBe(true);
    });

    it('rejects an unknown trigger', () => {
      expect(UIBindingSchema.safeParse({ kind: 'event', trigger: 'hover' }).success).toBe(false);
    });
  });

  describe('expression binding', () => {
    it('accepts a non-empty expression', () => {
      const b: ExpressionBinding = { kind: 'expression', expr: 'count > 0' };
      expect(UIBindingSchema.safeParse(b).success).toBe(true);
    });

    it('rejects an empty expression', () => {
      expect(UIBindingSchema.safeParse({ kind: 'expression', expr: '' }).success).toBe(false);
    });

    it('rejects an expression over 1024 chars', () => {
      const long = 'x + '.repeat(1024);
      expect(UIBindingSchema.safeParse({ kind: 'expression', expr: long }).success).toBe(false);
    });
  });

  describe('discriminated union', () => {
    it('rejects an unknown kind', () => {
      expect(UIBindingSchema.safeParse({ kind: 'unknown', value: 'x' }).success).toBe(false);
    });

    it('rejects a kind with wrong shape (e.g. state kind with `name` field)', () => {
      expect(UIBindingSchema.safeParse({ kind: 'state', name: 'anything' }).success).toBe(false);
    });

    it('rejects unknown extra fields (strict)', () => {
      expect(
        UIBindingSchema.safeParse({ kind: 'state', path: 'local.x', extra: true }).success,
      ).toBe(false);
    });
  });
});