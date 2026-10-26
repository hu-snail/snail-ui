import { describe, it, expect } from 'vitest';
import { UIActionSchema, AIActionMetadataSchema, type UIAction } from './ui-action.js';

describe('@snui/protocol — UIActionSchema', () => {
  it('accepts a minimal UIAction (id + type only)', () => {
    const result = UIActionSchema.safeParse({ id: 'user.login', type: 'submit' });
    expect(result.success).toBe(true);
  });

  it('accepts optional params and ai metadata', () => {
    const a: UIAction = {
      id: 'user.login',
      type: 'submit',
      params: { email: 'x', remember: true },
      ai: {
        description: 'Trigger the user login flow',
        allowed: true,
        examples: ['user.login', 'user.login with email'],
      },
    };
    expect(UIActionSchema.safeParse(a).success).toBe(true);
  });

  describe('id field', () => {
    it('rejects empty id', () => {
      expect(UIActionSchema.safeParse({ id: '', type: 'submit' }).success).toBe(false);
    });

    it('rejects uppercase letters', () => {
      expect(UIActionSchema.safeParse({ id: 'User.Login', type: 'submit' }).success).toBe(false);
    });

    it('rejects leading digit', () => {
      expect(UIActionSchema.safeParse({ id: '1login', type: 'submit' }).success).toBe(false);
    });
  });

  describe('type field', () => {
    it('rejects uppercase letters', () => {
      expect(UIActionSchema.safeParse({ id: 'a.b', type: 'Submit' }).success).toBe(false);
    });

    it('rejects dotted names (type must be a single segment)', () => {
      expect(UIActionSchema.safeParse({ id: 'a.b', type: 'submit.form' }).success).toBe(false);
    });

    it('rejects empty type', () => {
      expect(UIActionSchema.safeParse({ id: 'a.b', type: '' }).success).toBe(false);
    });
  });

  describe('params field', () => {
    it('rejects non-record params', () => {
      expect(UIActionSchema.safeParse({ id: 'a.b', type: 'submit', params: 'oops' }).success).toBe(false);
    });

    it('accepts record<string, unknown>', () => {
      expect(
        UIActionSchema.safeParse({
          id: 'a.b',
          type: 'submit',
          params: { n: 1, b: true, s: 'x', list: [1, 2], nested: { ok: true } },
        }).success,
      ).toBe(true);
    });
  });

  describe('strict schema', () => {
    it('rejects unknown extra fields', () => {
      expect(
        UIActionSchema.safeParse({
          id: 'a.b',
          type: 'submit',
          sneaky: 'oops',
        }).success,
      ).toBe(false);
    });
  });
});

describe('@snui/protocol — AIActionMetadataSchema', () => {
  it('accepts empty metadata object', () => {
    expect(AIActionMetadataSchema.safeParse({}).success).toBe(true);
  });

  it('accepts description + allowed + examples', () => {
    expect(
      AIActionMetadataSchema.safeParse({
        description: 'Run login flow',
        allowed: true,
        examples: ['a', 'b'],
      }).success,
    ).toBe(true);
  });

  it('rejects description longer than 1024 chars', () => {
    expect(AIActionMetadataSchema.safeParse({ description: 'x'.repeat(1025) }).success).toBe(false);
  });

  it('rejects empty description', () => {
    expect(AIActionMetadataSchema.safeParse({ description: '' }).success).toBe(false);
  });

  it('rejects non-boolean allowed flag', () => {
    expect(AIActionMetadataSchema.safeParse({ allowed: 'yes' }).success).toBe(false);
  });

  it('rejects non-array examples', () => {
    expect(AIActionMetadataSchema.safeParse({ examples: 'a,b' }).success).toBe(false);
  });

  it('rejects unknown extra fields', () => {
    expect(AIActionMetadataSchema.safeParse({ description: 'x', sneaky: true }).success).toBe(false);
  });
});