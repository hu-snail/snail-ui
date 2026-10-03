import { describe, it, expect } from 'vitest';
import { DEFAULT_COMPONENT_TOKENS } from './component.js';

describe('@snui/tokens — Component Tokens', () => {
  it('exposes button / input / card component shapes', () => {
    expect(DEFAULT_COMPONENT_TOKENS).toHaveProperty('button');
    expect(DEFAULT_COMPONENT_TOKENS).toHaveProperty('input');
    expect(DEFAULT_COMPONENT_TOKENS).toHaveProperty('card');
  });

  it('every component token has a non-empty string value', () => {
    const collected: Array<[string, string]> = [];
    function walk(prefix: string, value: unknown): void {
      if (typeof value === 'string') {
        collected.push([prefix, value]);
        return;
      }
      if (value && typeof value === 'object') {
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
          walk(`${prefix}.${k}`, v);
        }
      }
    }
    walk('button', DEFAULT_COMPONENT_TOKENS.button);
    walk('input', DEFAULT_COMPONENT_TOKENS.input);
    walk('card', DEFAULT_COMPONENT_TOKENS.card);
    expect(collected.length).toBeGreaterThan(0);
    for (const [path, val] of collected) {
      expect(val.length, `${path} should be non-empty`).toBeGreaterThan(0);
    }
  });

  it('button tokens include size and radius slots', () => {
    expect(DEFAULT_COMPONENT_TOKENS.button.heightTiny).toBeTruthy();
    expect(DEFAULT_COMPONENT_TOKENS.button.heightSmall).toBeTruthy();
    expect(DEFAULT_COMPONENT_TOKENS.button.heightMedium).toBeTruthy();
    expect(DEFAULT_COMPONENT_TOKENS.button.heightLarge).toBeTruthy();
    expect(DEFAULT_COMPONENT_TOKENS.button.radius).toBeTruthy();
    expect(DEFAULT_COMPONENT_TOKENS.button.fontSize).toBeTruthy();
  });

  it('input tokens include height slots', () => {
    expect(DEFAULT_COMPONENT_TOKENS.input.heightSmall).toBeTruthy();
    expect(DEFAULT_COMPONENT_TOKENS.input.heightMedium).toBeTruthy();
    expect(DEFAULT_COMPONENT_TOKENS.input.heightLarge).toBeTruthy();
    expect(DEFAULT_COMPONENT_TOKENS.input.radius).toBeTruthy();
  });

  it('card tokens include padding / radius / shadow', () => {
    expect(DEFAULT_COMPONENT_TOKENS.card.padding).toBeTruthy();
    expect(DEFAULT_COMPONENT_TOKENS.card.radius).toBeTruthy();
    expect(DEFAULT_COMPONENT_TOKENS.card.shadow).toBeTruthy();
  });
});