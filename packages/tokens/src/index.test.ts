import { describe, it, expect } from 'vitest';
import {
  DEFAULT_PRIMITIVE_TOKENS,
  DEFAULT_SEMANTIC_TOKENS,
  DEFAULT_COMPONENT_TOKENS,
  resolveEnvironment,
  LIGHT_THEME,
  MODERN_STYLE,
  COMFORTABLE_DENSITY,
} from './index.js';

describe('@snui/tokens', () => {
  it('re-exports the four token layers + resolver + axes', () => {
    expect(typeof DEFAULT_PRIMITIVE_TOKENS).toBe('object');
    expect(typeof DEFAULT_SEMANTIC_TOKENS).toBe('object');
    expect(typeof DEFAULT_COMPONENT_TOKENS).toBe('object');
    expect(typeof resolveEnvironment).toBe('function');
    expect(typeof LIGHT_THEME).toBe('object');
    expect(typeof MODERN_STYLE).toBe('object');
    expect(typeof COMFORTABLE_DENSITY).toBe('object');
  });
});