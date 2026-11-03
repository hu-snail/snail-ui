import { describe, it, expect } from 'vitest';
import { buildChartOption, cloneOption, mergeOption, truncateLabel } from './options';
import { CHART_LAYOUT_PRESETS } from './layout';
import { BUILTIN_CHART_ICONS } from './icons';

describe('chart options', () => {
  describe('mergeOption', () => {
    it('should merge nested plain objects recursively', () => {
      const merged = mergeOption({ a: { b: 1, c: 2 } }, { a: { c: 3 } });
      expect(merged).toEqual({ a: { b: 1, c: 3 } });
    });

    it('should replace arrays instead of merging them by index', () => {
      const merged = mergeOption(
        { series: [{ type: 'line' }, { type: 'bar' }] },
        { series: [{ type: 'pie' }] },
      );
      expect(merged['series']).toEqual([{ type: 'pie' }]);
    });

    it('should ignore undefined values so a default cannot erase a base value', () => {
      const merged = mergeOption({ a: 1, b: 2 }, { a: undefined });
      expect(merged).toEqual({ a: 1, b: 2 });
    });

    it('should replace scalars', () => {
      expect(mergeOption({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
    });

    it('should return an empty object when neither side is a plain object', () => {
      expect(mergeOption(undefined, undefined)).toEqual({});
      expect(mergeOption([], [])).toEqual({});
    });
  });

  describe('cloneOption', () => {
    it('should deep-clone a nested option without sharing references', () => {
      const source = { series: [{ data: [1, 2, 3] }], xAxis: { type: 'category' } };
      const clone = cloneOption(source);
      expect(clone).toEqual(source);
      expect(clone.series).not.toBe(source.series);
      expect(clone.series[0]?.data).not.toBe(source.series[0]?.data);
    });

    it('should keep function references (formatters)', () => {
      const formatter = () => 'x';
      const clone = cloneOption({ tooltip: { formatter } });
      expect(clone.tooltip.formatter).toBe(formatter);
    });

    it('should preserve Dates', () => {
      const date = new Date(2024, 0, 1);
      const clone = cloneOption({ from: date });
      expect(clone.from).toBeInstanceOf(Date);
      expect(clone.from.getTime()).toBe(date.getTime());
      expect(clone.from).not.toBe(date);
    });

    it('should pass class instances through untouched', () => {
      class Gradient {
        readonly kind = 'gradient';
      }
      const gradient = new Gradient();
      expect(cloneOption({ color: gradient }).color).toBe(gradient);
    });

    it('should leave primitives alone', () => {
      expect(cloneOption(42)).toBe(42);
      expect(cloneOption(null)).toBeNull();
      expect(cloneOption('x')).toBe('x');
    });
  });

  describe('truncateLabel', () => {
    it('should keep a label that already fits', () => {
      expect(truncateLabel('abc', 5)).toBe('abc');
    });

    it('should shorten a long label with an ellipsis', () => {
      expect(truncateLabel('abcdefgh', 5)).toBe('abcd…');
    });

    it('should stringify a non-string value', () => {
      expect(truncateLabel(12, 5)).toBe('12');
      expect(truncateLabel(null, 5)).toBe('');
    });

    it('should do nothing for a non-positive limit', () => {
      expect(truncateLabel('abcdefgh', 0)).toBe('abcdefgh');
    });
  });

  describe('buildChartOption', () => {
    const cartesian = {
      xAxis: { type: 'category', data: ['一', '二'] },
      yAxis: { type: 'value' },
      series: [
        { type: 'line', name: 'A', data: [1, 2] },
        { type: 'bar', name: 'B', data: [3, 4] },
      ],
    };

    it('should return the default layout when no layout is given', () => {
      const built = buildChartOption({ option: cartesian as never });
      expect(built.layout).toEqual(CHART_LAYOUT_PRESETS.default);
    });

    it('should apply a grid to a cartesian chart', () => {
      const built = buildChartOption({ option: cartesian as never });
      const grid = built.option.grid as Record<string, unknown>;
      expect(grid['containLabel']).toBe(true);
    });

    it('should not apply a grid to a pie chart', () => {
      const built = buildChartOption({
        option: { series: [{ type: 'pie', data: [{ value: 1, name: 'a' }] }] } as never,
      });
      expect(built.option.grid).toBeUndefined();
      expect(built.option.xAxis).toBeUndefined();
      expect(built.option.yAxis).toBeUndefined();
    });

    it('should add a legend when the chart has more than one series', () => {
      const built = buildChartOption({ option: cartesian as never });
      const legend = built.option.legend as Record<string, unknown>;
      expect(legend['top']).toBe(0);
      expect(legend['left']).toBe('center');
    });

    it('should skip the legend for a single series', () => {
      const built = buildChartOption({
        option: { xAxis: {}, yAxis: {}, series: [{ type: 'line', data: [1] }] } as never,
      });
      expect(built.option.legend).toBeUndefined();
    });

    it('should let the caller override every derived default', () => {
      const built = buildChartOption({
        option: {
          ...cartesian,
          legend: { top: 20, left: 'left' },
          grid: { top: 40 },
        } as never,
      });
      const legend = built.option.legend as Record<string, unknown>;
      expect(legend['top']).toBe(20);
      expect(legend['left']).toBe('left');
      const grid = built.option.grid as Record<string, unknown>;
      expect(grid['top']).toBe(40);
      // The derived key the caller did not mention survives.
      expect(grid['containLabel']).toBe(true);
    });

    it('should honour a compact layout preset', () => {
      const built = buildChartOption({ option: cartesian as never, layout: 'compact' });
      expect(built.layout).toEqual(CHART_LAYOUT_PRESETS.compact);
      const axisLabel = (built.option.xAxis as Record<string, unknown>)['axisLabel'] as Record<
        string,
        unknown
      >;
      expect(axisLabel['formatter']).toBeTypeOf('function');
    });

    it('should hide the legend when the layout disables it', () => {
      const built = buildChartOption({ option: cartesian as never, layout: 'minimal' });
      expect(built.option.legend).toBeUndefined();
      const xAxis = built.option.xAxis as Record<string, unknown>;
      expect(xAxis['show']).toBe(false);
    });

    it("should default to the custom tooltip path and disable ECharts' own", () => {
      const built = buildChartOption({ option: cartesian as never });
      expect(built.customTooltip).toBe(true);
      expect(built.option.tooltip).toEqual({ show: false });
    });

    it('should switch to the native tooltip when asked', () => {
      const built = buildChartOption({
        option: cartesian as never,
        tooltip: { mode: 'native', trigger: 'axis' },
      });
      expect(built.customTooltip).toBe(false);
      const tooltip = built.option.tooltip as Record<string, unknown>;
      expect(tooltip['trigger']).toBe('axis');
      expect(tooltip['show']).toBe(true);
    });

    it('should disable the tooltip when mode is false', () => {
      const built = buildChartOption({ option: cartesian as never, tooltip: { mode: false } });
      expect(built.customTooltip).toBe(false);
      expect((built.option.tooltip as Record<string, unknown>)['show']).toBe(false);
    });

    it('should disable the tooltip when trigger is "none"', () => {
      const built = buildChartOption({ option: cartesian as never, tooltip: { trigger: 'none' } });
      expect(built.customTooltip).toBe(false);
    });

    it('should apply the icon configuration last', () => {
      const built = buildChartOption({
        option: cartesian as never,
        icons: { legend: 'line', seriesType: { bar: 'bar' } },
      });
      const legend = built.option.legend as Record<string, unknown>;
      expect(legend['icon']).toBe(`path://${BUILTIN_CHART_ICONS.line?.path ?? ''}`);
      const series = built.option.series as Array<Record<string, unknown>>;
      expect(series[1]?.['symbol']).toBe(`path://${BUILTIN_CHART_ICONS.bar?.path ?? ''}`);
    });

    it('should pass a dataZoom through the layout config', () => {
      const built = buildChartOption({
        option: { ...cartesian, dataZoom: [{}] } as never,
        layout: { dataZoom: { show: true, type: 'both' } },
      });
      const zoom = built.option.dataZoom as Array<Record<string, unknown>>;
      expect(zoom).toHaveLength(2);
      expect(zoom[0]?.['type']).toBe('inside');
      expect(zoom[1]?.['type']).toBe('slider');
    });

    it('should honour an explicit empty dataZoom array', () => {
      const built = buildChartOption({
        option: { ...cartesian, dataZoom: [] } as never,
        layout: { dataZoom: { show: true } },
      });
      // `[]` is the caller asking for no zoom window — not "nothing to tune".
      expect(built.option.dataZoom).toEqual([]);
    });

    it('should normalise `legend: false` into the form ECharts understands', () => {
      // ECharts has no `legend: false`; left as a literal it still builds a
      // legend component with its default (visible) state.
      const built = buildChartOption({ option: { ...cartesian, legend: false } as never });
      expect(built.option.legend).toEqual({ show: false });
    });

    it('should not reserve grid space for a suppressed legend', () => {
      const suppressed = buildChartOption({
        option: { ...cartesian, legend: false } as never,
      });
      const single = buildChartOption({
        option: { xAxis: {}, yAxis: {}, series: [{ type: 'line', data: [1] }] } as never,
      });
      expect(suppressed.option.grid).toEqual(single.option.grid);
    });

    it("should not modify the caller's option object", () => {
      const source = cloneOption(cartesian);
      buildChartOption({ option: source as never, icons: { legend: 'line' } });
      const legend = (source as Record<string, unknown>)['legend'];
      expect(legend).toBeUndefined();
    });

    it('should work with no option at all', () => {
      const built = buildChartOption();
      expect(built.option.grid).toBeDefined();
      expect(built.customTooltip).toBe(true);
    });
  });
});
