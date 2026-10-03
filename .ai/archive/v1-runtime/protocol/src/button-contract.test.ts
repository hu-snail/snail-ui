import { describe, it, expect } from 'vitest';
import { ButtonPropsSchema, ButtonContract } from './button-contract.js';

describe('@snui/vue-web — ButtonContract', () => {
  describe('ButtonPropsSchema', () => {
    it('accepts minimal props (variant/size default)', () => {
      const r = ButtonPropsSchema.safeParse({});
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data).toEqual({
          variant: 'primary',
          size: 'medium',
          disabled: false,
          loading: false,
          type: 'button',
        });
      }
    });

    it('accepts all documented variants', () => {
      for (const v of ['primary', 'secondary', 'danger', 'ghost'] as const) {
        expect(ButtonPropsSchema.safeParse({ variant: v }).success).toBe(true);
      }
    });

    it('accepts all documented sizes', () => {
      for (const s of ['small', 'medium', 'large'] as const) {
        expect(ButtonPropsSchema.safeParse({ size: s }).success).toBe(true);
      }
    });

    it('accepts all documented button types', () => {
      for (const t of ['button', 'submit', 'reset'] as const) {
        expect(ButtonPropsSchema.safeParse({ type: t }).success).toBe(true);
      }
    });

    it('accepts icon and text', () => {
      expect(
        ButtonPropsSchema.safeParse({ icon: 'check', text: 'Submit' }).success,
      ).toBe(true);
    });

    it('rejects an unknown variant', () => {
      expect(ButtonPropsSchema.safeParse({ variant: 'rainbow' }).success).toBe(false);
    });

    it('rejects an unknown size', () => {
      expect(ButtonPropsSchema.safeParse({ size: 'xl' }).success).toBe(false);
    });

    it('rejects an empty icon string', () => {
      expect(ButtonPropsSchema.safeParse({ icon: '' }).success).toBe(false);
    });

    it('rejects an empty text string', () => {
      expect(ButtonPropsSchema.safeParse({ text: '' }).success).toBe(false);
    });

    it('rejects unknown extra fields (strict)', () => {
      expect(ButtonPropsSchema.safeParse({ variant: 'primary', sneaky: true }).success).toBe(false);
    });
  });

  describe('ButtonContract shape (AGENTS.md §31)', () => {
    it('exposes name / version / props / events / tokens / accessibility / capabilities / ai', () => {
      expect(ButtonContract.name).toBe('button');
      expect(ButtonContract.version).toMatch(/^\d+\.\d+\.\d+/);
      expect(ButtonContract.props).toBeDefined();
      expect(ButtonContract.events).toEqual({ click: 'click' });
      expect(ButtonContract.tokens).toBeDefined();
      expect(ButtonContract.accessibility.role).toBe('button');
      expect(ButtonContract.capabilities).toContain('click');
      expect(ButtonContract.ai.patchable).toContain('variant');
      expect(ButtonContract.ai.readonly).toContain('role');
    });

    it('keyboard includes Enter and Space', () => {
      expect(ButtonContract.accessibility.keyboard).toEqual(
        expect.arrayContaining(['Enter', 'Space']),
      );
    });
  });
});