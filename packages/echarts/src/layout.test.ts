import { describe, it, expect } from 'vitest';
import {
  CHART_LAYOUT_PRESETS,
  gridBox,
  legendPlacement,
  normalizeGrid,
  resolveChartLayout,
  titlePlacement,
} from './layout';

describe('chart layout', () => {
  describe('resolveChartLayout', () => {
    it('should return the default preset when nothing is provided', () => {
      expect(resolveChartLayout(undefined)).toEqual(CHART_LAYOUT_PRESETS.default);
    });

    it('should return a named preset verbatim', () => {
      expect(resolveChartLayout('compact')).toEqual(CHART_LAYOUT_PRESETS.compact);
      expect(resolveChartLayout('minimal')).toEqual(CHART_LAYOUT_PRESETS.minimal);
    });

    it('should keep the default preset as the base for a partial config', () => {
      const layout = resolveChartLayout({ legend: { position: 'right' } });
      expect(layout.legend.position).toBe('right');
      // Untouched fields keep the default preset's values.
      expect(layout.legend.show).toBe(true);
      expect(layout.legend.align).toBe('center');
      expect(layout.padding).toBe(CHART_LAYOUT_PRESETS.default.padding);
      expect(layout.grid).toEqual(CHART_LAYOUT_PRESETS.default.grid);
    });

    it('should treat an explicitly undefined field as "not provided"', () => {
      const layout = resolveChartLayout({ legend: { show: undefined, icon: undefined } });
      expect(layout.legend.show).toBe(true);
      expect(layout.legend.icon).toBe('');
    });

    it('should apply a scalar grid padding on all four sides', () => {
      const layout = resolveChartLayout({ grid: 24 });
      expect(layout.grid).toEqual([24, 24, 24, 24]);
    });

    it('should be idempotent for a resolved layout', () => {
      const once = resolveChartLayout({ padding: 10, legend: { position: 'bottom' } });
      const twice = resolveChartLayout(once as never);
      expect(twice).toEqual(once);
    });

    it('should fall back to the default preset for an unknown preset name', () => {
      const layout = resolveChartLayout('nope' as never, 'default');
      expect(layout).toEqual(CHART_LAYOUT_PRESETS.default);
    });
  });

  describe('normalizeGrid', () => {
    it('should return undefined when no grid is given', () => {
      expect(normalizeGrid(undefined)).toBeUndefined();
    });

    it('should expand a number and a string to four sides', () => {
      expect(normalizeGrid(8)).toEqual([8, 8, 8, 8]);
      expect(normalizeGrid('1rem')).toEqual(['1rem', '1rem', '1rem', '1rem']);
    });

    it('should pass a tuple through untouched', () => {
      const tuple = [1, 2, 3, 4] as const;
      expect(normalizeGrid(tuple)).toEqual(tuple);
    });
  });

  describe('legendPlacement', () => {
    it('should place a top legend at the top with the requested alignment', () => {
      expect(legendPlacement('top', 'center')).toEqual({
        top: 0,
        left: 'center',
        orient: 'horizontal',
      });
      expect(legendPlacement('top', 'right')).toEqual({
        top: 0,
        left: 'right',
        orient: 'horizontal',
      });
    });

    it('should place a bottom legend at the bottom', () => {
      expect(legendPlacement('bottom', 'left')).toEqual({
        bottom: 0,
        left: 'left',
        orient: 'horizontal',
      });
    });

    it('should orient a side legend vertically and centre it', () => {
      expect(legendPlacement('right', 'center')).toEqual({
        right: 0,
        top: 'middle',
        orient: 'vertical',
      });
      expect(legendPlacement('left', 'center')).toEqual({
        left: 0,
        top: 'middle',
        orient: 'vertical',
      });
    });
  });

  describe('titlePlacement', () => {
    it('should anchor the title by its position', () => {
      expect(titlePlacement('left')).toEqual({ left: 'left', top: 0 });
      expect(titlePlacement('center')).toEqual({ left: 'center', top: 0 });
      expect(titlePlacement('right')).toEqual({ left: 'right', top: 0 });
    });
  });

  describe('gridBox', () => {
    it('should contain the axis labels inside the grid', () => {
      const box = gridBox(CHART_LAYOUT_PRESETS.default);
      expect(box['containLabel']).toBe(true);
      expect(box['top']).toBe(16);
      expect(box['left']).toBe(16);
    });

    it('should reserve room for a top legend', () => {
      const box = gridBox(CHART_LAYOUT_PRESETS.default, { hasLegend: true });
      expect(box['top']).toBe(16 + 28);
    });

    it('should reserve room at the bottom for a bottom legend', () => {
      const box = gridBox(CHART_LAYOUT_PRESETS.spacious, { hasLegend: true });
      expect(box['bottom']).toBe(32 + 28);
    });

    it('should reserve room on the side for a vertical legend', () => {
      const onTop = gridBox(CHART_LAYOUT_PRESETS.default, { hasLegend: true });
      // default preset legend sits on top, so no side reservation
      expect(onTop['right']).toBe(16);

      const layout = resolveChartLayout({ legend: { position: 'right' } });
      expect(gridBox(layout, { hasLegend: true })['right']).toBe(16 + 88);
    });

    it('should add room for an inner toolbox and a shown title', () => {
      const layout = resolveChartLayout({
        title: { show: true },
        toolbox: { show: true, position: 'inner', align: 'right' },
      });
      const box = gridBox(layout, { hasTitle: true, hasToolbox: true });
      expect(box['top']).toBe(16 + 32 + 24);
    });

    it('should not reserve room for a title the layout hides', () => {
      const box = gridBox(CHART_LAYOUT_PRESETS.fullscreen, { hasTitle: true, hasToolbox: true });
      // fullscreen hides the title, so only the inner toolbox is reserved.
      expect(box['top']).toBe(8 + 24);
    });

    it('should preserve a CSS length and append the extra offset', () => {
      const layout = resolveChartLayout({
        grid: ['10%', '10%', '10%', '10%'],
        legend: { position: 'top' },
      });
      const box = gridBox(layout, { hasLegend: true });
      expect(box['top']).toBe('calc(10% + 28px)');
    });
  });
});
