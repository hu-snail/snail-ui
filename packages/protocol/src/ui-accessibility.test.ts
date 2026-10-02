import { describe, it, expect } from 'vitest';
import { UIAccessibilitySchema, type UIAccessibility } from './ui-accessibility.js';

describe('@snui/protocol — UIAccessibilitySchema', () => {
  it('accepts an empty object (all fields optional)', () => {
    expect(UIAccessibilitySchema.safeParse({}).success).toBe(true);
  });

  it('accepts all five fields populated', () => {
    const a: UIAccessibility = {
      role: 'button',
      keyboard: ['Enter', 'Space'],
      aria: { 'aria-expanded': false, 'aria-controls': 'menu-1', 'aria-haspopup': 'menu' },
      label: 'Submit form',
      description: 'Click to submit the login form',
    };
    expect(UIAccessibilitySchema.safeParse(a).success).toBe(true);
  });

  describe('role field', () => {
    it('rejects an empty role', () => {
      expect(UIAccessibilitySchema.safeParse({ role: '' }).success).toBe(false);
    });

    it('rejects a role longer than 64 chars', () => {
      expect(UIAccessibilitySchema.safeParse({ role: 'x'.repeat(65) }).success).toBe(false);
    });
  });

  describe('keyboard field', () => {
    it('accepts every documented keyboard key', () => {
      const keys = [
        'Enter',
        'Escape',
        'Space',
        'Tab',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End',
        'PageUp',
        'PageDown',
        'Backspace',
        'Delete',
      ] as const;
      expect(UIAccessibilitySchema.safeParse({ keyboard: keys }).success).toBe(true);
    });

    it('rejects an unknown keyboard key', () => {
      expect(UIAccessibilitySchema.safeParse({ keyboard: ['F1'] }).success).toBe(false);
      expect(UIAccessibilitySchema.safeParse({ keyboard: ['enter'] }).success).toBe(false); // case-sensitive
    });

    it('rejects an empty keyboard array', () => {
      expect(UIAccessibilitySchema.safeParse({ keyboard: [] }).success).toBe(false);
    });

    it('rejects a non-array keyboard', () => {
      expect(UIAccessibilitySchema.safeParse({ keyboard: 'Enter' }).success).toBe(false);
    });
  });

  describe('aria field', () => {
    it('accepts string / boolean / number values', () => {
      expect(
        UIAccessibilitySchema.safeParse({
          aria: { s: 'text', b: true, n: 0, mix: false },
        }).success,
      ).toBe(true);
    });

    it('rejects a non-record aria value', () => {
      expect(UIAccessibilitySchema.safeParse({ aria: 'aria-thing' }).success).toBe(false);
    });

    it('rejects aria with array values', () => {
      expect(UIAccessibilitySchema.safeParse({ aria: { bad: ['x'] } }).success).toBe(false);
    });

    it('rejects aria with object values', () => {
      expect(UIAccessibilitySchema.safeParse({ aria: { bad: { nested: true } } }).success).toBe(false);
    });
  });

  describe('label field', () => {
    it('rejects an empty label', () => {
      expect(UIAccessibilitySchema.safeParse({ label: '' }).success).toBe(false);
    });

    it('rejects a label longer than 256 chars', () => {
      expect(UIAccessibilitySchema.safeParse({ label: 'x'.repeat(257) }).success).toBe(false);
    });
  });

  describe('description field', () => {
    it('rejects an empty description', () => {
      expect(UIAccessibilitySchema.safeParse({ description: '' }).success).toBe(false);
    });

    it('rejects a description longer than 1024 chars', () => {
      expect(UIAccessibilitySchema.safeParse({ description: 'x'.repeat(1025) }).success).toBe(false);
    });
  });

  describe('strict schema', () => {
    it('rejects unknown extra fields', () => {
      expect(UIAccessibilitySchema.safeParse({ role: 'button', sneaky: true }).success).toBe(false);
    });
  });
});