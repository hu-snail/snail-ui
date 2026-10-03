import { describe, it, expect } from 'vitest';
import { DEFAULT_PRIMITIVE_TOKENS } from './primitive.js';

describe('@snui/tokens — Primitive Tokens', () => {
  it('exposes the seven required primitive categories', () => {
    expect(DEFAULT_PRIMITIVE_TOKENS).toHaveProperty('color');
    expect(DEFAULT_PRIMITIVE_TOKENS).toHaveProperty('spacing');
    expect(DEFAULT_PRIMITIVE_TOKENS).toHaveProperty('radius');
    expect(DEFAULT_PRIMITIVE_TOKENS).toHaveProperty('font');
    expect(DEFAULT_PRIMITIVE_TOKENS).toHaveProperty('shadow');
    expect(DEFAULT_PRIMITIVE_TOKENS).toHaveProperty('motion');
    expect(DEFAULT_PRIMITIVE_TOKENS).toHaveProperty('size');
  });

  it('color scales follow a 50–950 ramp', () => {
    const ramps = Object.keys(DEFAULT_PRIMITIVE_TOKENS.color.blue);
    expect(ramps).toEqual(['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']);
  });

  it('spacing follows an 8pt rhythm at the wider steps', () => {
    expect(DEFAULT_PRIMITIVE_TOKENS.spacing['4']).toBe('12px');
    expect(DEFAULT_PRIMITIVE_TOKENS.spacing['5']).toBe('16px');
    expect(DEFAULT_PRIMITIVE_TOKENS.spacing['8']).toBe('24px');
  });

  it('motion exposes duration + easing', () => {
    expect(DEFAULT_PRIMITIVE_TOKENS.motion.duration.base).toMatch(/^\d+ms$/);
    expect(DEFAULT_PRIMITIVE_TOKENS.motion.easing.standard).toMatch(/cubic-bezier/);
  });

  it('size exposes control + icon scale groups', () => {
    expect(DEFAULT_PRIMITIVE_TOKENS.size.control.md).toBe('32px');
    expect(DEFAULT_PRIMITIVE_TOKENS.size.icon.md).toBe('16px');
  });
});