import { describe, it, expect } from 'vitest';
import { UICapabilitySchema, type UICapability } from './ui-capability.js';

describe('@snui/protocol — UICapabilitySchema', () => {
  it('accepts a full capability declaration', () => {
    const cap: UICapability = {
      platform: ['web', 'h5'],
      framework: ['vue'],
      feature: 'date-picker',
      fallback: 'input',
      requires: ['web'],
    };
    expect(UICapabilitySchema.safeParse(cap).success).toBe(true);
  });

  it('accepts platform-only', () => {
    expect(UICapabilitySchema.safeParse({ platform: ['web'] }).success).toBe(true);
  });

  it('accepts framework-only', () => {
    expect(UICapabilitySchema.safeParse({ framework: ['vue'] }).success).toBe(true);
  });

  it('accepts feature-only', () => {
    expect(UICapabilitySchema.safeParse({ feature: 'date-picker' }).success).toBe(true);
  });

  it('rejects empty capability (no platform / framework / feature)', () => {
    expect(UICapabilitySchema.safeParse({}).success).toBe(false);
    expect(UICapabilitySchema.safeParse({ fallback: 'input' }).success).toBe(false);
  });

  it('rejects an unknown platform', () => {
    expect(UICapabilitySchema.safeParse({ platform: ['macos'] }).success).toBe(false);
  });

  it('rejects an unknown framework', () => {
    expect(UICapabilitySchema.safeParse({ framework: ['solid'] }).success).toBe(false);
  });

  it('rejects empty platform array', () => {
    expect(UICapabilitySchema.safeParse({ platform: [] }).success).toBe(false);
  });

  it('rejects an empty feature string', () => {
    expect(UICapabilitySchema.safeParse({ feature: '' }).success).toBe(false);
  });

  it('rejects a feature identifier longer than 64 chars', () => {
    expect(UICapabilitySchema.safeParse({ feature: 'x'.repeat(65) }).success).toBe(false);
  });

  it('rejects an empty fallback string', () => {
    expect(UICapabilitySchema.safeParse({ feature: 'x', fallback: '' }).success).toBe(false);
  });

  it('rejects requires entries longer than 64 chars', () => {
    expect(
      UICapabilitySchema.safeParse({ feature: 'x', requires: ['x'.repeat(65)] }).success,
    ).toBe(false);
  });

  it('rejects unknown extra fields (strict)', () => {
    expect(
      UICapabilitySchema.safeParse({ feature: 'x', sneaky: true }).success,
    ).toBe(false);
  });
});