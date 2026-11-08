import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  BUILTIN_CHART_ICONS,
  DEFAULT_SERIES_TYPE_ICONS,
  applyChartIcons,
  clearChartIcons,
  getChartIconDefinition,
  listChartIconNames,
  listRegisteredChartIcons,
  registerChartIcons,
  resolveChartIcon,
  svgToPathData,
} from './icons';

describe('chart icons', () => {
  afterEach(() => {
    clearChartIcons();
    vi.restoreAllMocks();
  });

  describe('resolveChartIcon', () => {
    it('should return undefined for an empty reference', () => {
      expect(resolveChartIcon(undefined)).toBeUndefined();
      expect(resolveChartIcon('')).toBeUndefined();
      expect(resolveChartIcon('   ')).toBeUndefined();
    });

    it('should resolve a built-in name into a path:// value', () => {
      const icon = resolveChartIcon('bar');
      expect(icon).toEqual({ name: 'bar', value: `path://${BUILTIN_CHART_ICONS.bar?.path ?? ''}` });
    });

    it('should pass a ready path:// string through untouched', () => {
      const icon = resolveChartIcon('path://M0 0h10v10H0z');
      expect(icon?.value).toBe('path://M0 0h10v10H0z');
    });

    it('should wrap bare SVG path data into path://', () => {
      const icon = resolveChartIcon('M0 0h10v10H0z');
      expect(icon?.value).toBe('path://M0 0h10v10H0z');
    });

    it('should wrap an http URL into image://', () => {
      const icon = resolveChartIcon('https://example.com/icon.png');
      expect(icon?.value).toBe('image://https://example.com/icon.png');
    });

    it('should wrap a data URL into image://', () => {
      const icon = resolveChartIcon('data:image/svg+xml;base64,AAAA');
      expect(icon?.value).toBe('image://data:image/svg+xml;base64,AAAA');
    });

    it('should return undefined for an unknown name', () => {
      expect(resolveChartIcon('nope-not-an-icon')).toBeUndefined();
    });
  });

  describe('registry', () => {
    it('should register a custom icon and resolve it by name', () => {
      registerChartIcons({ custom: { path: 'M0 0h24v24H0z' } });
      expect(listRegisteredChartIcons()).toEqual(['custom']);
      expect(resolveChartIcon('custom')?.value).toBe('path://M0 0h24v24H0z');
    });

    it('should let a host icon override a built-in of the same name', () => {
      registerChartIcons({ bar: { path: 'M0 0h24v8H0z' } });
      expect(resolveChartIcon('bar')?.value).toBe('path://M0 0h24v8H0z');
    });

    it('should resolve an image definition', () => {
      registerChartIcons({ logo: { image: 'https://example.com/logo.svg' } });
      expect(resolveChartIcon('logo')?.value).toBe('image://https://example.com/logo.svg');
    });

    it('should clear host icons back to the built-in set', () => {
      registerChartIcons({ custom: { path: 'M0 0h24v24H0z' } });
      clearChartIcons();
      expect(listRegisteredChartIcons()).toEqual([]);
      expect(resolveChartIcon('custom')).toBeUndefined();
      expect(resolveChartIcon('bar')).toBeDefined();
    });

    it('should warn and resolve nothing for a definition with no source', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      registerChartIcons({ broken: {} });
      expect(resolveChartIcon('broken')).toBeUndefined();
      expect(warn).toHaveBeenCalledTimes(1);
      expect(getChartIconDefinition('broken')).toEqual({});
    });

    it('should list every built-in glyph name', () => {
      const names = listChartIconNames();
      expect(names).toContain('bar');
      expect(names).toContain('refresh');
      expect(names).toContain('download');
      expect(names.length).toBeGreaterThan(20);
    });
  });

  describe('svgToPathData', () => {
    it('should collect <path d> attributes', () => {
      const svg = '<svg><path d="M0 0h10v10H0z"/><path d="M2 2h4v4H2z"/></svg>';
      expect(svgToPathData(svg)).toBe('M0 0h10v10H0z M2 2h4v4H2z');
    });

    it('should convert a <circle> into arc commands', () => {
      const svg = '<svg><circle cx="12" cy="12" r="5"/></svg>';
      const path = svgToPathData(svg);
      expect(path).toContain('M7 12A5 5 0 0 1 17 12');
    });

    it('should convert an <ellipse> into arc commands', () => {
      const svg = '<svg><ellipse cx="12" cy="12" rx="8" ry="4"/></svg>';
      expect(svgToPathData(svg)).toContain('M4 12A8 4 0 0 1 20 12');
    });

    it('should convert a <rect> into a closed box', () => {
      const svg = '<svg><rect x="2" y="2" width="10" height="6"/></svg>';
      expect(svgToPathData(svg)).toBe('M2 2H12V8H2Z');
    });

    it('should convert a <polygon> into a closed subpath', () => {
      const svg = '<svg><polygon points="0 0, 10 0, 5 10"/></svg>';
      expect(svgToPathData(svg)).toBe('M0 0, 10 0, 5 10Z');
    });

    it('should keep a <polyline> open', () => {
      const svg = '<svg><polyline points="0 0, 10 0, 5 10"/></svg>';
      expect(svgToPathData(svg)).toBe('M0 0, 10 0, 5 10');
    });

    it('should ignore unsupported markup', () => {
      const svg = '<svg><defs><linearGradient/></defs><text>hi</text></svg>';
      expect(svgToPathData(svg)).toBe('');
    });

    it('should parse single-quoted attributes too', () => {
      const svg = "<svg><path d='M0 0h10v10H0z'/></svg>";
      expect(svgToPathData(svg)).toBe('M0 0h10v10H0z');
    });
  });

  describe('applyChartIcons', () => {
    it('should leave the option untouched when no icons are configured', () => {
      const option = { series: [{ type: 'line', data: [1, 2] }] };
      expect(applyChartIcons(option, undefined)).toBe(option);
    });

    it('should set the legend icon', () => {
      const option = applyChartIcons({ legend: { top: 0 } }, { legend: 'line' });
      const legend = option['legend'] as Record<string, unknown>;
      expect(legend['icon']).toBe(`path://${BUILTIN_CHART_ICONS.line?.path ?? ''}`);
      // The existing legend placement survives.
      expect(legend['top']).toBe(0);
    });

    it('should apply a series symbol only to series types that accept one', () => {
      const option = applyChartIcons(
        {
          series: [
            { type: 'line', data: [1] },
            { type: 'pie', data: [1] },
          ],
        },
        { symbol: 'dot' },
      );
      const series = option['series'] as Array<Record<string, unknown>>;
      expect(series[0]?.['symbol']).toBe(`path://${BUILTIN_CHART_ICONS.dot?.path ?? ''}`);
      expect(series[1]?.['symbol']).toBeUndefined();
    });

    it('should pick a per-type glyph from seriesType', () => {
      const option = applyChartIcons(
        { series: [{ type: 'line' }, { type: 'bar' }] },
        { seriesType: DEFAULT_SERIES_TYPE_ICONS },
      );
      const series = option['series'] as Array<Record<string, unknown>>;
      expect(series[0]?.['symbol']).toBe(`path://${BUILTIN_CHART_ICONS.line?.path ?? ''}`);
      expect(series[1]?.['symbol']).toBe(`path://${BUILTIN_CHART_ICONS.bar?.path ?? ''}`);
    });

    it('should set toolbox feature icons without dropping the feature config', () => {
      const option = applyChartIcons(
        {
          toolbox: {
            feature: {
              saveAsImage: { title: '保存' },
              restore: { title: '还原' },
            },
          },
        },
        { toolbox: { saveAsImage: 'download', restore: 'refresh' } },
      );
      const toolbox = option['toolbox'] as Record<string, unknown>;
      const feature = toolbox['feature'] as Record<string, Record<string, unknown>>;
      expect(feature['saveAsImage']?.['icon']).toBe(
        `path://${BUILTIN_CHART_ICONS.download?.path ?? ''}`,
      );
      expect(feature['saveAsImage']?.['title']).toBe('保存');
      expect(feature['restore']?.['icon']).toBe(
        `path://${BUILTIN_CHART_ICONS.refresh?.path ?? ''}`,
      );
    });

    it('should set the title icon', () => {
      const option = applyChartIcons({ title: { text: '趋势' } }, { title: 'trend' });
      const title = option['title'] as Record<string, unknown>;
      expect(title['icon']).toBe(`path://${BUILTIN_CHART_ICONS.trend?.path ?? ''}`);
      expect(title['text']).toBe('趋势');
    });

    it('should ignore an unresolvable icon reference', () => {
      const option = applyChartIcons({ legend: { top: 0 } }, { legend: 'does-not-exist' });
      const legend = option['legend'] as Record<string, unknown>;
      expect(legend['icon']).toBeUndefined();
    });
  });
});
