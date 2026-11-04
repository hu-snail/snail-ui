import { describe, it, expect, afterEach } from 'vitest';
import {
  CHART_FALLBACK_COLORS,
  CHART_TOKEN_ALIASES,
  buildChartCssVariables,
  buildChartPalette,
  buildChartTheme,
  buildTintRamp,
  detectThemeMode,
  resolveTokenColors,
  tintColor,
} from './theme';

describe('chart theme', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');
  });

  describe('buildChartPalette', () => {
    it('should start with the primary token in tokens mode (literal ramp is unresolved)', () => {
      const palette = buildChartPalette('tokens', 'light');
      expect(palette[0]).toBe(`var(${CHART_TOKEN_ALIASES.primary})`);
      // Without resolved literals the rest of the cycle stays token-based too.
      expect(palette[1]).toBe(`var(${CHART_TOKEN_ALIASES.success})`);
      expect(palette.length).toBeGreaterThan(5);
    });

    it('should build the primary tint ramp from resolved literals', () => {
      const palette = buildChartPalette('resolved', 'light');
      const primary = CHART_FALLBACK_COLORS.light.primary;
      expect(palette[0]).toBe(primary);
      // Slot 1+ are lighter steps of the *same hue* — the default palette
      // fades the primary instead of importing a rainbow.
      expect(palette[1]).toMatch(/^#/);
      expect(palette[1]).not.toBe(primary);
      expect(palette[1]).toBe(tintColor(primary, 0.72 / 11));
      for (let i = 1; i < 5; i += 1) {
        expect(palette[i]).toBe(tintColor(primary, (0.72 / 11) * i));
      }
    });

    it('should honour an explicit brand colour at slot 0 and tint from it', () => {
      const palette = buildChartPalette('tokens', 'light', { colorPrimary: '#ff5a00' });
      expect(palette[0]).toBe('#ff5a00');
      expect(palette[1]).toBe(tintColor('#ff5a00', 0.72 / 11));
      expect(palette[1]).not.toBe('#ff5a00');
    });

    it('should replace the whole cycle when a palette is supplied', () => {
      const palette = buildChartPalette('tokens', 'light', { palette: ['#111', '#222'] });
      expect(palette).toEqual(['#111', '#222']);
    });

    it('should use the dark primary anchor in dark mode', () => {
      const palette = buildChartPalette('resolved', 'dark');
      expect(palette[0]).toBe(CHART_FALLBACK_COLORS.dark.primary);
      expect(palette[1]).toBe(tintColor(palette[0] ?? '#000000', 0.72 / 11));
    });

    it('should keep literal semantic overrides in the cycle', () => {
      const palette = buildChartPalette('resolved', 'light', {
        colorSuccess: '#00aa88',
        colorDanger: '#dd2233',
      });
      expect(palette).toContain('#00aa88');
      expect(palette).toContain('#dd2233');
    });

    it('should degrade to token slots when the primary is unresolved', () => {
      // `var()` primaries cannot be tinted, so the cycle falls back to tokens
      // instead of producing a ramp of identical, unresolvable strings.
      const palette = buildChartPalette('tokens', 'light', { colorPrimary: 'var(--brand)' });
      expect(palette[0]).toBe('var(--brand)');
      expect(palette[1]).toBe(`var(${CHART_TOKEN_ALIASES.success})`);
    });
  });

  describe('tintColor / buildTintRamp', () => {
    it('should tint a hex colour toward white', () => {
      expect(tintColor('#000000', 0)).toBe('#000000');
      expect(tintColor('#000000', 1)).toBe('#ffffff');
      expect(tintColor('#ff0000', 0.5)).toBe('#ff8080');
      expect(tintColor('#336699', 0.25)).toBe('#668cb3');
    });

    it('should accept 3-digit hex and pass non-hex values through', () => {
      expect(tintColor('#f00', 0.5)).toBe('#ff8080');
      expect(tintColor('var(--x)', 0.5)).toBe('var(--x)');
      expect(tintColor('not-a-color', 0.5)).toBe('not-a-color');
    });

    it('should build a monotonic ramp starting at the primary', () => {
      const ramp = buildTintRamp('#1677ff', 6);
      expect(ramp).toHaveLength(6);
      expect(ramp[0]).toBe('#1677ff');
      for (let i = 1; i < ramp.length; i += 1) {
        const previous = Number.parseInt((ramp[i - 1] ?? '#000000').slice(1, 3), 16);
        const current = Number.parseInt((ramp[i] ?? '#000000').slice(1, 3), 16);
        expect(current).toBeGreaterThanOrEqual(previous);
        expect(ramp[i]).toMatch(/^#[0-9a-f]{6}$/i);
      }
      // The last slot must actually be lighter — a ramp that never fades is
      // indistinguishable from a monochrome cycle.
      expect(ramp[ramp.length - 1]).not.toBe(ramp[0]);
    });

    it('should return the primary alone for a single-slot ramp', () => {
      expect(buildTintRamp('#1677ff', 1)).toEqual(['#1677ff']);
      expect(buildTintRamp('#1677ff', 0)).toEqual(['#1677ff']);
    });
  });

  describe('buildChartTheme', () => {
    it('should emit token references by default in token mode', () => {
      const theme = buildChartTheme({ config: { colorSource: 'tokens' } });
      const color = theme['color'] as string[];
      expect(color[0]).toBe(`var(${CHART_TOKEN_ALIASES.primary})`);
      const textStyle = theme['textStyle'] as Record<string, unknown>;
      expect(textStyle['color']).toBe(`var(${CHART_TOKEN_ALIASES.textPrimary})`);
    });

    it('should resolve literal colours in resolved mode without a DOM', () => {
      const theme = buildChartTheme({ config: { colorSource: 'resolved' }, mode: 'light' });
      const color = theme['color'] as string[];
      expect(color[0]).toBe(CHART_FALLBACK_COLORS.light.primary);
    });

    it('should prefer caller-supplied colours over every other source', () => {
      const theme = buildChartTheme({
        config: {
          colorSource: 'tokens',
          colorPrimary: '#123456',
          textColor: '#0f0f0f',
          fontFamily: 'Inter, sans-serif',
          fontSize: 14,
        },
      });
      const color = theme['color'] as string[];
      expect(color[0]).toBe('#123456');
      const textStyle = theme['textStyle'] as Record<string, unknown>;
      expect(textStyle['color']).toBe('#0f0f0f');
      expect(textStyle['fontFamily']).toBe('Inter, sans-serif');
      expect(textStyle['fontSize']).toBe(14);
    });

    it('should keep the plot background transparent unless asked for one', () => {
      const theme = buildChartTheme({ mode: 'light' });
      expect(theme['backgroundColor']).toBe('transparent');
      const painted = buildChartTheme({ config: { backgroundColor: '#000000' }, mode: 'light' });
      expect(painted['backgroundColor']).toBe('#000000');
    });

    it('should merge themeOverrides one level deep without dropping siblings', () => {
      const theme = buildChartTheme({
        config: { themeOverrides: { legend: { itemGap: 4 } } },
      });
      const legend = theme['legend'] as Record<string, unknown>;
      expect(legend['itemGap']).toBe(4);
      // The sibling keys the override did not mention survive.
      expect(legend['itemWidth']).toBe(12);
      expect(legend['itemHeight']).toBe(8);
      const textStyle = legend['textStyle'] as Record<string, unknown>;
      expect(textStyle['fontSize']).toBe(12);
    });

    it('should merge themeOverrides recursively so nested siblings survive', () => {
      const theme = buildChartTheme({
        config: { themeOverrides: { legend: { textStyle: { color: '#ff0000' } } } },
      });
      const legend = theme['legend'] as Record<string, unknown>;
      const textStyle = legend['textStyle'] as Record<string, unknown>;
      expect(textStyle['color']).toBe('#ff0000');
      // Nested siblings the override did not mention are still there — a
      // one-level merge would have replaced the whole `textStyle` block.
      expect(textStyle['fontSize']).toBe(12);
      expect(legend['itemWidth']).toBe(12);
    });

    it('should not let an undefined override erase a theme key', () => {
      const theme = buildChartTheme({
        config: { themeOverrides: { legend: { itemGap: undefined } } },
      });
      const legend = theme['legend'] as Record<string, unknown>;
      expect(legend['itemGap']).toBeDefined();
      expect(legend['itemWidth']).toBe(12);
    });

    it('should expose the semantic colour block for downstream consumers', () => {
      const theme = buildChartTheme({ config: { colorSource: 'tokens' } });
      const semantic = theme['snSemantic'] as Record<string, string>;
      expect(semantic['primary']).toBe(`var(${CHART_TOKEN_ALIASES.primary})`);
      // The surface follows the token cascade in token mode, so a host whose
      // surface token differs from this package's fallback still gets a
      // matching DOM tooltip (§34 — no literal colours in component styling).
      expect(semantic['surface']).toBe(`var(${CHART_TOKEN_ALIASES.surface})`);
    });
  });

  describe('buildChartCssVariables', () => {
    it('should map the semantic block onto --sn-chart-* variables', () => {
      const theme = buildChartTheme({ config: { colorSource: 'tokens' } });
      const vars = buildChartCssVariables(theme);
      expect(vars['--sn-chart-color-primary']).toBe(`var(${CHART_TOKEN_ALIASES.primary})`);
      expect(vars['--sn-chart-color-text']).toBe(`var(${CHART_TOKEN_ALIASES.textPrimary})`);
      expect(Object.keys(vars).length).toBe(9);
    });

    it('should return an empty map when the theme carries no semantic block', () => {
      expect(buildChartCssVariables({})).toEqual({});
    });
  });

  describe('detectThemeMode', () => {
    it('should read data-theme="dark" off the document element', () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      expect(detectThemeMode()).toBe('dark');
    });

    it('should treat data-theme="light" as an explicit light override', () => {
      document.documentElement.setAttribute('data-theme', 'light');
      expect(detectThemeMode()).toBe('light');
    });

    it('should recognise the .dark class hook', () => {
      document.documentElement.classList.add('dark');
      expect(detectThemeMode()).toBe('dark');
    });
  });

  describe('resolveTokenColors', () => {
    it('should return null when there is no DOM document', () => {
      expect(resolveTokenColors(null)).toBeNull();
    });

    it('should fall back to token defaults when the variables are unset', () => {
      const resolved = resolveTokenColors(document);
      expect(resolved).not.toBeNull();
      expect(resolved?.primary).toBe(CHART_FALLBACK_COLORS.light.primary);
    });
  });
});
