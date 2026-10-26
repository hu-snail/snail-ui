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

  it('emits kebab-case semantic names that match the consumer-facing CSS', () => {
    const env = { theme: LIGHT_THEME, style: MODERN_STYLE, density: COMFORTABLE_DENSITY };
    const names = resolveEnvironment(env).map((b) => b.name);
    // Regression: semantic keys were emitted verbatim, so multi-word tokens came
    // out as `--aui-color-action-primaryHover` — a name no consumer reads, which
    // made every runtime theme override for those tokens a silent no-op.
    expect(names).toContain('--aui-color-action-primary-hover');
    expect(names).toContain('--aui-color-action-secondary-hover');
    expect(names).toContain('--aui-color-feedback-danger-hover');
    expect(names).toContain('--aui-color-text-on-primary');
    expect(names.filter((name) => /[A-Z]/.test(name))).toEqual([]);
  });

  it('emits resolvable colour values in both themes', () => {
    for (const theme of [LIGHT_THEME, DARK_THEME]) {
      const bindings = resolveEnvironment({
        theme,
        style: MODERN_STYLE,
        density: COMFORTABLE_DENSITY,
      });
      const names = new Set(bindings.map((b) => b.name));
      const value = (name: string): string | undefined =>
        bindings.find((b) => b.name === name)?.value;
      for (const binding of bindings.filter((b) => b.name.startsWith('--aui-color-'))) {
        // Regression: the light theme restated every semantic token as
        // `var(--aui-color-text-primary)` — a cycle — and some entries pointed at
        // names only the static stylesheet defines (`--aui-color-bg-surface`), so
        // the runtime snippet rendered as invalid CSS.
        for (const match of binding.value.matchAll(/var\((--[a-z0-9-]+)\)/g)) {
          const ref = match[1] as string;
          expect(binding.name === ref, `${binding.name} references itself`).toBe(false);
          expect(names.has(ref), `${binding.name} references unemitted ${ref}`).toBe(true);
        }
      }
      if (theme.name === 'dark') {
        expect(value('--aui-color-text-primary')).toBe('#fafafa');
        expect(value('--aui-color-text-secondary')).toBe('#a1a1aa');
        expect(value('--aui-color-background-surface')).toBe('#09090b');
        expect(value('--aui-color-border-default')).toBe('#27272a');
        // The accent stays blue in both themes, so text on it stays light.
        expect(value('--aui-color-text-on-primary')).toBe('#ffffff');
      } else {
        expect(value('--aui-color-text-primary')).toBe('var(--aui-color-gray-950)');
        expect(value('--aui-color-text-secondary')).toBe('var(--aui-color-gray-500)');
        expect(value('--aui-color-background-surface')).toBe('#ffffff');
        expect(value('--aui-color-border-default')).toBe('var(--aui-color-gray-200)');
        expect(value('--aui-color-text-on-primary')).toBe('#ffffff');
      }
    }
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
    expect(
      (merged as { color: { text: { primary: string }; background: { surface: string } } }).color
        .text.primary,
    ).toBe('Z');
    expect(
      (merged as { color: { text: { primary: string }; background: { surface: string } } }).color
        .background.surface,
    ).toBe('B');
  });
});
