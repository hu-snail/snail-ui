import { describe, it, expect, afterEach } from 'vitest';
import {
  CHART_FALLBACK_COLORS,
  CHART_TOKEN_ALIASES,
  buildChartCssVariables,
  buildChartPalette,
  buildChartTheme,
  detectThemeMode,
  resolveTokenColors,
} from './theme';

describe('chart theme', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');
  });

  describe('buildChartPalette', () => {
    it('should start with the semantic colours in token mode', () => {
      const palette = buildChartPalette('tokens', 'light');
      expect(palette[0]).toBe(`var(${CHART_TOKEN_ALIASES.primary})`);
      expect(palette[1]).toBe(`var(${CHART_TOKEN_ALIASES.success})`);
      expect(palette[2]).toBe(`var(${CHART_TOKEN_ALIASES.warning})`);
      expect(palette[3]).toBe(`var(${CHART_TOKEN_ALIASES.danger})`);
      expect(palette[4]).toBe(`var(${CHART_TOKEN_ALIASES.info})`);
      expect(palette.length).toBeGreaterThan(5);
    });

    it('should fall back to literal token defaults in resolved mode', () => {
      const palette = buildChartPalette('resolved', 'light');
      expect(palette[0]).toBe(CHART_FALLBACK_COLORS.light.primary);
      expect(palette[1]).toBe(CHART_FALLBACK_COLORS.light.success);
    });

    it('should honour an explicit brand colour at slot 0', () => {
      const palette = buildChartPalette('tokens', 'light', { colorPrimary: '#ff5a00' });
      expect(palette[0]).toBe('#ff5a00');
    });

    it('should replace the whole cycle when a palette is supplied', () => {
      const palette = buildChartPalette('tokens', 'light', { palette: ['#111', '#222'] });
      expect(palette).toEqual(['#111', '#222']);
    });

    it('should use dark fallbacks in dark mode', () => {
      const palette = buildChartPalette('resolved', 'dark');
      expect(palette[3]).toBe(CHART_FALLBACK_COLORS.dark.danger);
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
