import { describe, it, expect } from 'vitest';
import {
  resolveEnvironment,
  renderStyleBlock,
  LIGHT_THEME,
  DARK_THEME,
  MODERN_STYLE,
  COMPACT_DENSITY,
  COMFORTABLE_DENSITY,
} from './index.js';
import { __internal } from './resolver.js';

describe('@snui/tokens — Resolver (Cascade)', () => {
  it('emits a flat binding list ordered primitives → semantic → component', () => {
    const env = { theme: LIGHT_THEME, style: MODERN_STYLE, density: COMFORTABLE_DENSITY };
    const bindings = resolveEnvironment(env);
    expect(bindings.length).toBeGreaterThan(0);
    for (const b of bindings) {
      expect(b.name.startsWith('--aui-')).toBe(true);
      expect(b.value.length).toBeGreaterThan(0);
    }
    const primitiveIdx = bindings.findIndex((b) => b.name === '--aui-color-blue-500');
    const semanticIdx = bindings.findIndex((b) => b.name === '--aui-color-text-primary');
    expect(primitiveIdx).toBeGreaterThanOrEqual(0);
    expect(semanticIdx).toBeGreaterThan(primitiveIdx);
  });

  it('dark theme swaps the color text values to gray-100', () => {
    const env = { theme: DARK_THEME, style: MODERN_STYLE, density: COMFORTABLE_DENSITY };
    const bindings = resolveEnvironment(env);
    const text = bindings.find((b) => b.name === '--aui-color-text-primary');
    expect(text?.value).toBe('var(--aui-color-gray-100)');
  });

  it('density.compact overrides size.control.md to 28px', () => {
    const env = { theme: LIGHT_THEME, style: MODERN_STYLE, density: COMPACT_DENSITY };
    const bindings = resolveEnvironment(env);
    const md = bindings.find((b) => b.name === '--aui-size-control-md');
    expect(md?.value).toBe('28px');
  });

  it('density.compact overrides spacing-4 to 10px', () => {
    const env = { theme: LIGHT_THEME, style: MODERN_STYLE, density: COMPACT_DENSITY };
    const bindings = resolveEnvironment(env);
    const s4 = bindings.find((b) => b.name === '--aui-spacing-4');
    expect(s4?.value).toBe('10px');
  });

  it('instance overrides win over every layer above', () => {
    const env = {
      theme: LIGHT_THEME,
      style: MODERN_STYLE,
      density: COMFORTABLE_DENSITY,
      instanceOverrides: { '--aui-button-radius': '0px' },
    };
    const bindings = resolveEnvironment(env);
    const r = bindings.find((b) => b.name === '--aui-button-radius');
    expect(r?.value).toBe('0px');
  });

  it('renders a CSS style block from bindings', () => {
    const env = { theme: LIGHT_THEME, style: MODERN_STYLE, density: COMFORTABLE_DENSITY };
    const css = renderStyleBlock(resolveEnvironment(env));
    expect(css.startsWith(':root {')).toBe(true);
    expect(css).toContain('--aui-color-blue-500: #1677ff;');
    expect(css).toContain('--aui-color-text-primary:');
  });

  it('deepMerge preserves untouched leaves', () => {
    const merged = __internal.deepMerge({ a: 1, nested: { x: 1, y: 2 } }, { nested: { x: 99 } });
    expect((merged as { nested: { x: number; y: number } }).nested.x).toBe(99);
    expect((merged as { nested: { x: number; y: number } }).nested.y).toBe(2);
  });

  it('mergeSemanticByTheme: theme.semantic override replaces leaf value', () => {
    const merged = __internal.mergeSemanticByTheme(
      { color: { text: { primary: 'A' }, background: { surface: 'B' } } } as never,
      { name: 't', semantic: { text: { primary: 'Z' } } },
    );
    expect((merged as { color: { text: { primary: string }; background: { surface: string } } }).color.text.primary).toBe('Z');
    expect((merged as { color: { text: { primary: string }; background: { surface: string } } }).color.background.surface).toBe('B');
  });
});