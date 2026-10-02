import { describe, it, expect } from 'vitest';
import { UIEventBindingSchema, type UIEventBinding } from './ui-event-binding.js';

describe('@snui/protocol — UIEventBindingSchema', () => {
  it('accepts a trigger + dotted action id', () => {
    const b: UIEventBinding = { trigger: 'click', action: 'user.login' };
    expect(UIEventBindingSchema.safeParse(b).success).toBe(true);
  });

  it('accepts every documented trigger', () => {
    const triggers = ['click', 'change', 'input', 'submit', 'focus', 'blur', 'mount', 'unmount'] as const;
    for (const trigger of triggers) {
      expect(UIEventBindingSchema.safeParse({ trigger, action: 'a.b' }).success).toBe(true);
    }
  });

  it('rejects an empty action id', () => {
    expect(UIEventBindingSchema.safeParse({ trigger: 'click', action: '' }).success).toBe(false);
  });

  it('rejects an action id with uppercase letters', () => {
    expect(UIEventBindingSchema.safeParse({ trigger: 'click', action: 'User.Login' }).success).toBe(false);
  });

  it('rejects an action id starting with a digit', () => {
    expect(UIEventBindingSchema.safeParse({ trigger: 'click', action: '1click' }).success).toBe(false);
  });

  it('rejects an unknown trigger', () => {
    expect(UIEventBindingSchema.safeParse({ trigger: 'hover', action: 'a.b' }).success).toBe(false);
  });

  it('rejects unknown extra fields (strict)', () => {
    expect(
      UIEventBindingSchema.safeParse({ trigger: 'click', action: 'a.b', extra: true }).success,
    ).toBe(false);
  });
});