import { describe, it, expect } from 'vitest';
import {
  FormPropsSchema,
  FormItemPropsSchema,
  FormContract,
  FormItemContract,
  FormFieldSchema,
  FormRuleSchema,
} from './form-contract.js';

describe('@snui/protocol — FormContract', () => {
  describe('FormRuleSchema', () => {
    it('accepts required / minLength / maxLength / pattern / message', () => {
      const r = FormRuleSchema.safeParse({
        required: true,
        minLength: 1,
        maxLength: 64,
        pattern: '^[a-z]+$',
        message: 'lowercase only',
      });
      expect(r.success).toBe(true);
    });
    it('rejects unknown extra fields (strict)', () => {
      expect(
        FormRuleSchema.safeParse({ required: true, sneaky: 1 }).success,
      ).toBe(false);
    });
  });

  describe('FormFieldSchema', () => {
    it('accepts a minimal field (just prop)', () => {
      const r = FormFieldSchema.safeParse({ prop: 'email' });
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data.type).toBe('text');
        expect(r.data.disabled).toBe(false);
      }
    });
    it('rejects an empty prop', () => {
      expect(FormFieldSchema.safeParse({ prop: '' }).success).toBe(false);
    });
    it('rejects unknown extra fields', () => {
      expect(FormFieldSchema.safeParse({ prop: 'x', foo: 'bar' }).success).toBe(false);
    });
  });

  describe('FormPropsSchema', () => {
    it('accepts minimal props (defaults)', () => {
      const r = FormPropsSchema.safeParse({});
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data.layout).toBe('vertical');
        expect(r.data.disabled).toBe(false);
        expect(r.data.loading).toBe(false);
        expect(r.data.initialValues).toEqual({});
      }
    });
    it('accepts initialValues + fields array', () => {
      const r = FormPropsSchema.safeParse({
        initialValues: { email: 'a@b' },
        fields: [{ prop: 'email', label: 'Email', required: true }],
      });
      expect(r.success).toBe(true);
    });
    it('rejects unknown layout', () => {
      expect(FormPropsSchema.safeParse({ layout: 'grid' }).success).toBe(false);
    });
  });

  describe('FormItemPropsSchema', () => {
    it('accepts prop/label/required/error', () => {
      const r = FormItemPropsSchema.safeParse({
        prop: 'email',
        label: 'Email',
        required: true,
        error: 'Invalid email',
      });
      expect(r.success).toBe(true);
    });
    it('rejects an empty prop', () => {
      expect(FormItemPropsSchema.safeParse({ prop: '' }).success).toBe(false);
    });
  });

  describe('FormContract shape (AGENTS.md §31)', () => {
    it('exposes required fields', () => {
      expect(FormContract.name).toBe('form');
      expect(FormContract.version).toMatch(/^\d+\.\d+\.\d+/);
      expect(FormContract.props).toBeDefined();
      expect(FormContract.tokens).toBeDefined();
      expect(FormContract.accessibility.role).toBe('form');
      expect(FormContract.capabilities).toContain('submit');
      expect(FormContract.capabilities).toContain('reset');
      expect(FormContract.ai?.patchable).toContain('initialValues');
      expect(FormContract.ai?.readonly).toContain('role');
    });

    it('FormItemContract.name === "form-item"', () => {
      expect(FormItemContract.name).toBe('form-item');
      expect(FormItemContract.version).toMatch(/^\d+\.\d+\.\d+/);
      expect(FormItemContract.accessibility.role).toBe('group');
    });

    it('patchable fields exist in the schema', () => {
      const schemaKeys = Object.keys(FormPropsSchema.shape).sort();
      const patchable = [...(FormContract.ai?.patchable ?? [])].sort();
      for (const k of patchable) {
        expect(schemaKeys).toContain(k);
      }
      const itemKeys = Object.keys(FormItemPropsSchema.shape).sort();
      const itemPatchable = [...(FormItemContract.ai?.patchable ?? [])].sort();
      for (const k of itemPatchable) {
        expect(itemKeys).toContain(k);
      }
    });
  });
});