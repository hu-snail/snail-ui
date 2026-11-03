import { describe, it, expect } from 'vitest';
import {
  buildNativeTooltipOption,
  buildTooltipModel,
  deriveExtraRows,
  formatNativeTooltipText,
  formatNumber,
  formatPercent,
  formatTooltipValue,
} from './tooltip';
import type { SnChartTooltipItem } from './types';

/** Item-trigger param, shaped like ECharts' own payload. */
const itemParam = {
  componentType: 'series',
  seriesType: 'pie',
  seriesName: '访问来源',
  seriesIndex: 0,
  dataIndex: 1,
  name: '搜索引擎',
  value: 1048,
  color: '#1677ff',
  percent: 42.5,
  data: { value: 1048, owner: 'alice' },
};

/** Axis-trigger params, shaped like ECharts' own payload. */
const axisParams = [
  {
    componentType: 'series',
    seriesType: 'line',
    seriesName: '本周',
    seriesIndex: 0,
    dataIndex: 2,
    axisValue: '周三',
    axisValueLabel: '周三',
    value: 120,
    color: '#1677ff',
  },
  {
    componentType: 'series',
    seriesType: 'line',
    seriesName: '上周',
    seriesIndex: 1,
    dataIndex: 2,
    axisValue: '周三',
    axisValueLabel: '周三',
    value: 90,
    color: '#10b981',
  },
];

describe('chart tooltip', () => {
  describe('buildTooltipModel', () => {
    it('should return null for an empty payload', () => {
      expect(buildTooltipModel(undefined)).toBeNull();
      expect(buildTooltipModel(null)).toBeNull();
      expect(buildTooltipModel([])).toBeNull();
      expect(buildTooltipModel('nope')).toBeNull();
    });

    it('should build a single-item model from an item-trigger param', () => {
      const model = buildTooltipModel(itemParam);
      expect(model).not.toBeNull();
      expect(model?.label).toBe('搜索引擎');
      expect(model?.items).toHaveLength(1);
      const item = model?.items[0];
      expect(item?.seriesName).toBe('访问来源');
      expect(item?.value).toBe(1048);
      expect(item?.color).toBe('#1677ff');
      expect(item?.percent).toBe(42.5);
      // Defaults: marker / series name / value / label on, percent off.
      expect(model?.showMarker).toBe(true);
      expect(model?.showSeriesName).toBe(true);
      expect(model?.showValue).toBe(true);
      expect(model?.showLabel).toBe(true);
      expect(model?.showPercent).toBe(false);
    });

    it('should build a multi-row model from axis-trigger params', () => {
      const model = buildTooltipModel(axisParams);
      expect(model?.label).toBe('周三');
      expect(model?.items).toHaveLength(2);
      expect(model?.items[0]?.seriesName).toBe('本周');
      expect(model?.items[1]?.seriesName).toBe('上周');
    });

    it('should honour the display switches', () => {
      const model = buildTooltipModel(itemParam, {
        showMarker: false,
        showSeriesName: false,
        showValue: false,
        showLabel: false,
        showPercent: true,
        footer: '总计 2048',
        width: 200,
      });
      expect(model?.showMarker).toBe(false);
      expect(model?.showSeriesName).toBe(false);
      expect(model?.showValue).toBe(false);
      expect(model?.showLabel).toBe(false);
      expect(model?.showPercent).toBe(true);
      expect(model?.footer).toBe('总计 2048');
      expect(model?.width).toBe(200);
    });

    it('should let a labelFormatter override the heading', () => {
      const model = buildTooltipModel(itemParam, {
        labelFormatter: (label, items) => `${label} (${items.length})`,
      });
      expect(model?.label).toBe('搜索引擎 (1)');
    });

    it('should resolve a gradient colour from its first colour stop', () => {
      const model = buildTooltipModel({
        ...itemParam,
        color: { colorStops: [{ color: '#f00' }, { color: '#00f' }] },
      });
      expect(model?.items[0]?.color).toBe('#f00');
    });

    it('should fall back to transparent when the colour is not resolvable', () => {
      const model = buildTooltipModel({ ...itemParam, color: { colorStops: [] } });
      expect(model?.items[0]?.color).toBe('transparent');
    });

    it('should keep the extraRows it was given', () => {
      const model = buildTooltipModel(itemParam, {
        extraRows: [{ label: '负责人', value: 'alice' }],
      });
      expect(model?.extraRows).toEqual([{ label: '负责人', value: 'alice' }]);
    });
  });

  describe('formatTooltipValue', () => {
    it('should group thousands for integers', () => {
      expect(formatTooltipValue(1234567)).toBe('1,234,567');
    });

    it('should keep at most two decimals for fractions', () => {
      expect(formatTooltipValue(1234.567)).toBe('1,234.57');
    });

    it('should apply the precision option', () => {
      expect(formatTooltipValue(1.2345, { precision: 2 })).toBe('1.23');
      expect(formatTooltipValue(12, { precision: 1 })).toBe('12.0');
    });

    it('should clamp an out-of-range precision instead of throwing', () => {
      // `toFixed` throws a RangeError above 100; a bad config value must not
      // crash the render path.
      expect(() => formatTooltipValue(1.23456789, { precision: 500 })).not.toThrow();
      expect(formatTooltipValue(1.23456789, { precision: 500 })).toBe((1.23456789).toFixed(20));
      expect(formatTooltipValue(1.5, { precision: -3 })).toBe('2');
      expect(formatTooltipValue(1.5, { precision: Number.NaN })).toBe('2');
    });

    it('should cap a fractional precision the way ECharts does', () => {
      expect(formatTooltipValue(1.23456, { precision: 3.9 })).toBe('1.235');
    });

    it('should let a valueFormatter win over precision', () => {
      const formatted = formatTooltipValue(12, {
        precision: 1,
        valueFormatter: (value) => `¥${String(value)}`,
      });
      expect(formatted).toBe('¥12');
    });

    it('should join array values', () => {
      expect(formatTooltipValue([1, 2])).toBe('1 / 2');
    });

    it('should hand a whole array to a valueFormatter in one call, with the item', () => {
      const item: SnChartTooltipItem = {
        seriesName: 'Series A',
        seriesIndex: 0,
        dataIndex: 3,
        value: [1, 2],
        color: '#1677ff',
      };
      const seen: unknown[] = [];
      const formatted = formatTooltipValue(
        [1, 2],
        {
          valueFormatter: (value, ctx) => {
            seen.push(value);
            return `${ctx.seriesName}: ${Array.isArray(value) ? value.join(' / ') : String(value)}`;
          },
        },
        item,
      );
      // The formatter owns the value shape: it is called once for the array,
      // not once per element, and it always sees the item context.
      expect(formatted).toBe('Series A: 1 / 2');
      expect(seen).toEqual([[1, 2]]);
    });

    it('should unwrap an object with a value field', () => {
      expect(formatTooltipValue({ value: 42 })).toBe('42');
    });

    it('should render empty for null and undefined', () => {
      expect(formatTooltipValue(null)).toBe('');
      expect(formatTooltipValue(undefined)).toBe('');
    });

    it('should pass strings through verbatim', () => {
      expect(formatTooltipValue('12%')).toBe('12%');
    });
  });

  describe('formatNumber / formatPercent', () => {
    it('should leave non-finite numbers alone', () => {
      expect(formatNumber(Number.NaN)).toBe('NaN');
      expect(formatNumber(Number.POSITIVE_INFINITY)).toBe('Infinity');
    });

    it('should render a percent with one decimal', () => {
      expect(formatPercent(42.5)).toBe('42.5%');
      expect(formatPercent(undefined)).toBe('');
      expect(formatPercent(Number.NaN)).toBe('');
    });
  });

  describe('buildNativeTooltipOption', () => {
    it('should disable the tooltip when mode is false', () => {
      expect(buildNativeTooltipOption({ mode: false })).toEqual({ show: false });
    });

    it('should default to an item trigger', () => {
      const option = buildNativeTooltipOption(undefined);
      expect(option['trigger']).toBe('item');
      expect(option['show']).toBe(true);
      expect(option['confine']).toBe(true);
    });

    it('should honour trigger "axis" and "none"', () => {
      expect(buildNativeTooltipOption({ mode: 'native', trigger: 'axis' })['trigger']).toBe('axis');
      expect(buildNativeTooltipOption({ mode: 'native', trigger: 'none' })['show']).toBe(false);
    });

    it('should merge nativeOverrides last', () => {
      const option = buildNativeTooltipOption({
        mode: 'native',
        nativeOverrides: { confine: false, extraCssText: 'max-width:300px' },
      });
      expect(option['confine']).toBe(false);
      expect(option['extraCssText']).toBe('max-width:300px');
    });
  });

  describe('formatNativeTooltipText escaping', () => {
    // Regression: ECharts renders an HTML tooltip via `innerHTML`, so a
    // category name coming from data used to be executable markup.
    it('should escape markup coming from chart data', () => {
      const text = formatNativeTooltipText({
        seriesName: '<img src=x onerror=alert(1)>',
        name: '<script>alert(2)</script>',
        value: '<b>12</b>',
      });
      expect(text).not.toContain('<img');
      expect(text).not.toContain('<script');
      expect(text).not.toContain('<b>');
      expect(text).toContain('&lt;img');
      expect(text).toContain('&lt;script');
    });

    it('should escape the label and extra rows too', () => {
      const text = formatNativeTooltipText(axisParams, {
        labelFormatter: () => '<i>title</i>',
        extraRows: [{ label: '<em>k</em>', value: '<u>v</u>' }],
      });
      expect(text).toContain('&lt;i&gt;title&lt;/i&gt;');
      expect(text).toContain('&lt;em&gt;k&lt;/em&gt;: &lt;u&gt;v&lt;/u&gt;');
    });

    it('should keep an html footer verbatim when html is on', () => {
      const text = formatNativeTooltipText(itemParam, { footer: '<b>ok</b>', html: true });
      expect(text).toContain('<b>ok</b>');
    });

    it('should escape a footer when html is off', () => {
      const text = formatNativeTooltipText(itemParam, { footer: '<b>ok</b>' });
      expect(text).toContain('&lt;b&gt;ok&lt;/b&gt;');
    });
  });

  describe('formatNativeTooltipText', () => {
    it('should render a heading plus one line per series', () => {
      const text = formatNativeTooltipText(axisParams);
      expect(text.split('\n')).toEqual(['周三', '本周: 120', '上周: 90']);
    });

    it('should skip the heading when showLabel is false', () => {
      const text = formatNativeTooltipText(itemParam, { showLabel: false });
      expect(text).toBe('访问来源: 1,048');
    });

    it('should include percent and footer when asked', () => {
      const text = formatNativeTooltipText(itemParam, { showPercent: true, footer: '总计' });
      expect(text).toBe('搜索引擎\n访问来源: 1,048: 42.5%\n总计');
    });

    it('should return an empty string for an empty payload', () => {
      expect(formatNativeTooltipText(undefined)).toBe('');
    });
  });

  describe('deriveExtraRows', () => {
    const items: SnChartTooltipItem[] = [
      {
        seriesName: '访问来源',
        seriesIndex: 0,
        dataIndex: 0,
        value: 1048,
        color: '#1677ff',
        data: { value: 1048, owner: 'alice', region: '华东' },
      },
    ];

    it('should derive rows for the requested keys', () => {
      expect(deriveExtraRows(items, ['owner', 'region'])).toEqual([
        { label: 'owner', value: 'alice' },
        { label: 'region', value: '华东' },
      ]);
    });

    it('should skip keys that are missing or nested objects', () => {
      const rows = deriveExtraRows(items, ['owner', 'missing', 'nested']);
      expect(rows).toEqual([{ label: 'owner', value: 'alice' }]);
    });

    it('should return nothing without keys or without a data object', () => {
      expect(deriveExtraRows(items, undefined)).toEqual([]);
      expect(deriveExtraRows(items, [])).toEqual([]);
      expect(deriveExtraRows([], ['owner'])).toEqual([]);
      expect(
        deriveExtraRows(
          [{ seriesName: '', seriesIndex: 0, dataIndex: 0, value: 1, color: '#000' }],
          ['owner'],
        ),
      ).toEqual([]);
    });
  });
});
