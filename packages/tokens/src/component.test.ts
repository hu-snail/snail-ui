import { describe, it, expect } from 'vitest';
import { DEFAULT_COMPONENT_TOKENS } from './component.js';

describe('@snui/tokens — Component Tokens', () => {
  it('exposes button / input / card component shapes', () => {
    expect(DEFAULT_COMPONENT_TOKENS).toHaveProperty('button');
    expect(DEFAULT_COMPONENT_TOKENS).toHaveProperty('input');
    expect(DEFAULT_COMPONENT_TOKENS).toHaveProperty('card');
  });

  it('button height is wired through semantic size slots', () => {
    expect(DEFAULT_COMPONENT_TOKENS.button.heightMd).toBe('var(--aui-size-control-md)');
    expect(DEFAULT_COMPONENT_TOKENS.button.heightLg).toBe('var(--aui-size-control-lg)');
  });

  it('every component token value is a CSS var() reference', () => {
    const collected: string[] = [];
    function walk(value: unknown): void {
      if (typeof value === 'string') {
        collected.push(value);
        return;
      }
      if (value && typeof value === 'object') {
        for (const v of Object.values(value as Record<string, unknown>)) walk(v);
      }
    }
    walk(DEFAULT_COMPONENT_TOKENS);
    for (const v of collected) expect(v.startsWith('var(--aui-')).toBe(true);
  });
});