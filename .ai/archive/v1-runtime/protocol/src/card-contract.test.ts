import { describe, it, expect } from 'vitest';
import { CardPropsSchema, CardContract } from './card-contract.js';

describe('@snui/protocol — CardContract', () => {
  describe('CardPropsSchema', () => {
    it('accepts minimal props (defaults applied)', () => {
      const r = CardPropsSchema.safeParse({});
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data).toEqual({
          variant: 'default',
          padding: 'md',
          bordered: true,
          shadow: false,
        });
      }
    });

    it('accepts title/description/variant/padding/bordered/shadow', () => {
      const r = CardPropsSchema.safeParse({
        title: 'Order #1024',
        description: 'Placed today',
        variant: 'elevated',
        padding: 'lg',
        bordered: false,
        shadow: true,
      });
      expect(r.success).toBe(true);
    });

    it('rejects an unknown variant', () => {
      expect(CardPropsSchema.safeParse({ variant: 'neon' }).success).toBe(false);
    });

    it('rejects an unknown padding', () => {
      expect(CardPropsSchema.safeParse({ padding: 'xl' }).success).toBe(false);
    });

    it('rejects unknown extra fields (strict)', () => {
      expect(
        CardPropsSchema.safeParse({ title: 'x', sneaky: 1 }).success,
      ).toBe(false);
    });
  });

  describe('CardContract shape (AGENTS.md §31)', () => {
    it('exposes required fields', () => {
      expect(CardContract.name).toBe('card');
      expect(CardContract.version).toMatch(/^\d+\.\d+\.\d+/);
      expect(CardContract.props).toBeDefined();
      expect(CardContract.tokens).toBeDefined();
      expect(CardContract.accessibility.role).toBe('region');
      expect(CardContract.capabilities).toEqual([]);
      expect(CardContract.ai?.patchable).toContain('title');
      expect(CardContract.ai?.readonly).toContain('role');
    });

    it('patchable fields exist in the schema', () => {
      const schemaKeys = Object.keys(CardPropsSchema.shape).sort();
      const patchable = [...(CardContract.ai?.patchable ?? [])].sort();
      for (const k of patchable) {
        expect(schemaKeys).toContain(k);
      }
    });
  });
});