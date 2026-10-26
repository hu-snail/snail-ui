import { describe, it, expect } from 'vitest';
import { InputPropsSchema, InputContract } from './input-contract.js';

describe('@snui/protocol — InputContract', () => {
  describe('InputPropsSchema', () => {
    it('accepts minimal props (defaults applied)', () => {
      const r = InputPropsSchema.safeParse({});
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data).toEqual({
          value: '',
          disabled: false,
          readonly: false,
          type: 'text',
          size: 'medium',
          clearable: false,
        });
      }
    });

    it('accepts all documented types', () => {
      for (const t of [
        'text',
        'password',
        'email',
        'number',
        'tel',
        'url',
        'search',
      ] as const) {
        expect(InputPropsSchema.safeParse({ type: t }).success).toBe(true);
      }
    });

    it('accepts all documented sizes', () => {
      for (const s of ['small', 'medium', 'large'] as const) {
        expect(InputPropsSchema.safeParse({ size: s }).success).toBe(true);
      }
    });

    it('accepts value/placeholder/disabled/readonly/clearable', () => {
      const r = InputPropsSchema.safeParse({
        value: 'hello',
        placeholder: 'Type here',
        disabled: true,
        readonly: true,
        clearable: true,
      });
      expect(r.success).toBe(true);
    });

    it('accepts maxlength/minlength/name', () => {
      const r = InputPropsSchema.safeParse({
        maxlength: 32,
        minlength: 1,
        name: 'email',
      });
      expect(r.success).toBe(true);
    });

    it('rejects an unknown type', () => {
      expect(InputPropsSchema.safeParse({ type: 'date' }).success).toBe(false);
    });

    it('rejects non-integer maxlength', () => {
      expect(InputPropsSchema.safeParse({ maxlength: 3.5 }).success).toBe(false);
    });

    it('rejects negative maxlength', () => {
      expect(InputPropsSchema.safeParse({ maxlength: -1 }).success).toBe(false);
    });

    it('rejects an empty name string', () => {
      expect(InputPropsSchema.safeParse({ name: '' }).success).toBe(false);
    });

    it('rejects unknown extra fields (strict)', () => {
      expect(
        InputPropsSchema.safeParse({ type: 'text', sneaky: true }).success,
      ).toBe(false);
    });
  });

  describe('InputContract shape (AGENTS.md §31)', () => {
    it('exposes name / version / props / events / tokens / accessibility / capabilities / ai', () => {
      expect(InputContract.name).toBe('input');
      expect(InputContract.version).toMatch(/^\d+\.\d+\.\d+/);
      expect(InputContract.props).toBeDefined();
      expect(InputContract.tokens).toBeDefined();
      expect(InputContract.accessibility.role).toBe('textbox');
      expect(InputContract.capabilities).toContain('input');
      expect(InputContract.capabilities).toContain('change');
      expect(InputContract.capabilities).toContain('focus');
      expect(InputContract.capabilities).toContain('blur');
      expect(InputContract.ai?.patchable).toContain('value');
      expect(InputContract.ai?.readonly).toContain('role');
    });

    it('events include input/change/focus/blur/clear', () => {
      expect(InputContract.events).toMatchObject({
        input: 'input',
        change: 'change',
        focus: 'focus',
        blur: 'blur',
        clear: 'click',
      });
    });

    it('keyboard includes Tab', () => {
      expect(InputContract.accessibility.keyboard).toContain('Tab');
    });

    it('runtime metadata lines up with the schema keys', () => {
      const schemaKeys = Object.keys(InputPropsSchema.shape).sort();
      const patchable = [...(InputContract.ai?.patchable ?? [])].sort();
      // Every patchable AI field must exist in the schema (no phantom fields).
      for (const k of patchable) {
        expect(schemaKeys).toContain(k);
      }
    });
  });
});