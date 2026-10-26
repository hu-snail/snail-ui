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

  it('every semantic value is a resolvable var() reference or a colour literal', () => {
    const colourLiteral = /^(#[0-9a-f]{3,8}|rgba?\([\d\s,./%]+\))$/i;
    const varRef = /^var\(--[a-z0-9-]+\)$/;
    const collected: Array<{ path: string; value: string }> = [];
    function walk(value: unknown, path: string): void {
      if (typeof value === 'string') {
        collected.push({ path, value });
        return;
      }
      if (value && typeof value === 'object') {
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
          walk(v, `${path}.${k}`);
        }
      }
    }
    walk(DEFAULT_SEMANTIC_TOKENS, '');
    expect(collected.length).toBeGreaterThan(0);
    for (const { path, value } of collected) {
      if (path.startsWith('.color.')) {
        // Colours may be literals: pure white and a translucent scrim have no
        // primitive, and the ramp slots that do exist are referenced by name.
        // Every var() ref must be resolvable — resolver.test.ts asserts that
        // against the emitted binding set for both themes.
        const ok = varRef.test(value) || colourLiteral.test(value);
        expect(ok, `${path} = ${value}`).toBe(true);
        continue;
      }
      expect(value.startsWith('var(--aui-'), `${path} = ${value}`).toBe(true);
    }
  });
  it('component-relevant semantic slots exist', () => {
    expect(DEFAULT_SEMANTIC_TOKENS.radius.control).toBe('var(--aui-radius-control)');
    expect(DEFAULT_SEMANTIC_TOKENS.shadow.control).toBe('var(--aui-shadow-control)');
    expect(DEFAULT_SEMANTIC_TOKENS.size.control.md).toBe('var(--aui-size-control-md)');
  });
});
