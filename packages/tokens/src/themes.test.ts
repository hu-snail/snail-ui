import { describe, it, expect } from 'vitest';
import {
  AZURE_THEME,
  CRIMSON_THEME,
  EMBER_THEME,
  FOREST_THEME,
  VIOLET_THEME,
  BUILTIN_THEMES,
  getBuiltinTheme,
  type BuiltinTheme,
} from './themes.js';
import { resolveEnvironment } from './resolver.js';
import { MODERN_STYLE, COMFORTABLE_DENSITY } from './theme.js';
import { snCssVars } from './css-vars.js';

/** Resolve a theme into a `name → value` map of the `--aui-*` bindings. */
function bindingsOf(theme: BuiltinTheme): Map<string, string> {
  const bindings = resolveEnvironment({ theme, style: MODERN_STYLE, density: COMFORTABLE_DENSITY });
  return new Map(bindings.map((b) => [b.name, b.value]));
}

describe('built-in colour themes', () => {
  it('should ship exactly five presets', () => {
    expect(BUILTIN_THEMES).toHaveLength(5);
  });

  it('should have unique kebab-case names', () => {
    const names = BUILTIN_THEMES.map((theme) => theme.name);
    expect(new Set(names).size).toBe(names.length);
    for (const name of names) {
      expect(name).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });

  it('should give every preset a label and a description', () => {
    for (const theme of BUILTIN_THEMES) {
      expect(theme.label.length, `${theme.name} label`).toBeGreaterThan(0);
      expect(theme.description.length, `${theme.name} description`).toBeGreaterThan(0);
    }
  });

  it('should resolve a distinct action colour per preset', () => {
    const primaries = BUILTIN_THEMES.map((theme) =>
      bindingsOf(theme).get('--aui-color-action-primary'),
    );
    for (const value of primaries) {
      expect(value, 'action.primary must resolve').toBeTruthy();
    }
    // Azure reuses the blue ramp the light default already points at, so it is
    // excluded from the uniqueness check; the other four must differ from each
    // other and from azure.
    const others = [FOREST_THEME, EMBER_THEME, VIOLET_THEME, CRIMSON_THEME].map((theme) =>
      bindingsOf(theme).get('--aui-color-action-primary'),
    );
    expect(new Set([primaries[0], ...others]).size).toBe(5);
  });

  it('should move the focus ring with the brand hue', () => {
    const forest = bindingsOf(FOREST_THEME);
    const crimson = bindingsOf(CRIMSON_THEME);
    expect(forest.get('--aui-color-border-focus')).not.toBe(
      crimson.get('--aui-color-border-focus'),
    );
  });

  it('should keep neutrals identical across presets', () => {
    // Only the brand hue moves; text/surfaces stay on the shared defaults so
    // contrast behaviour is audited once, not five times.
    const keys = ['--aui-color-text-primary', '--aui-color-background-surface'];
    const azure = bindingsOf(AZURE_THEME);
    for (const theme of BUILTIN_THEMES) {
      const map = bindingsOf(theme);
      for (const key of keys) {
        expect(map.get(key), `${theme.name} ${key}`).toBe(azure.get(key));
      }
    }
  });

  it('should use dark text on the amber fill to stay readable', () => {
    expect(bindingsOf(EMBER_THEME).get('--aui-color-text-on-primary')).toBe('#18181b');
    expect(bindingsOf(FOREST_THEME).get('--aui-color-text-on-primary')).toBe('#ffffff');
  });

  it('should expose a brand hex that matches the primitive ramp', () => {
    // The swatch colour must be the ramp's own 500, not a restated literal.
    const expected: Record<string, string> = {
      azure: '#1677ff',
      forest: '#22c55e',
      ember: '#f59e0b',
      violet: '#a855f7',
      crimson: '#ef4444',
    };
    for (const theme of BUILTIN_THEMES) {
      expect(theme.brand, theme.name).toBe(expected[theme.name]);
    }
  });

  it('should look a preset up by name', () => {
    expect(getBuiltinTheme('forest')).toBe(FOREST_THEME);
    expect(getBuiltinTheme('nope')).toBeUndefined();
  });
});

describe('snCssVars theme blocks', () => {
  it('should emit one attribute block per preset by default', () => {
    const css = snCssVars();
    for (const theme of BUILTIN_THEMES) {
      expect(css, theme.name).toContain(`[data-theme="${theme.name}"]`);
    }
    expect(css).toContain('[data-theme="dark"], .dark');
  });

  it('should put dark last so it wins when both attributes are set', () => {
    const css = snCssVars();
    const darkAt = css.lastIndexOf('[data-theme="dark"], .dark');
    for (const theme of BUILTIN_THEMES) {
      expect(darkAt).toBeGreaterThan(css.lastIndexOf(`[data-theme="${theme.name}"]`));
    }
  });

  it('should skip the block of a theme that is already the root theme', () => {
    const css = snCssVars({ theme: FOREST_THEME });
    expect(css).not.toContain('[data-theme="forest"]');
    // ...but the other presets are still switchable.
    expect(css).toContain('[data-theme="violet"]');
  });

  it('should honour withThemeBlocks: false', () => {
    const css = snCssVars({ withThemeBlocks: false });
    for (const theme of BUILTIN_THEMES) {
      expect(css).not.toContain(`[data-theme="${theme.name}"]`);
    }
  });
});
