import { describe, it, expect } from 'vitest';
import { DEFAULT_SEMANTIC_TOKENS } from './semantic.js';

describe('@snui/tokens — Semantic Tokens', () => {
  it('exposes color text/background/border/action/feedback branches', () => {
    expect(DEFAULT_SEMANTIC_TOKENS.color).toHaveProperty('text');
    expect(DEFAULT_SEMANTIC_TOKENS.color).toHaveProperty('background');
    expect(DEFAULT_SEMANTIC_TOKENS.color).toHaveProperty('border');
    expect(DEFAULT_SEMANTIC_TOKENS.color).toHaveProperty('action');
    expect(DEFAULT_SEMANTIC_TOKENS.color).toHaveProperty('feedback');
  });

  it('every semantic value is a CSS var() reference', () => {
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
    walk(DEFAULT_SEMANTIC_TOKENS);
    expect(collected.length).toBeGreaterThan(0);
    for (const v of collected) {
      expect(v.startsWith('var(--aui-')).toBe(true);
    }
  });

  it('component-relevant semantic slots exist', () => {
    expect(DEFAULT_SEMANTIC_TOKENS.radius.control).toBe('var(--aui-radius-control)');
    expect(DEFAULT_SEMANTIC_TOKENS.shadow.control).toBe('var(--aui-shadow-control)');
    expect(DEFAULT_SEMANTIC_TOKENS.size.control.md).toBe('var(--aui-size-control-md)');
  });
});