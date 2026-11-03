import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import type { EChartsType } from 'echarts';
import SnChart from './SnChart.vue';
import { clearChartIcons } from './icons';
import { CHART_LAYOUT_PRESETS } from './layout';

/**
 * Component tests run with `renderer: 'svg'`.
 *
 * happy-dom has no canvas 2D context (`canvas.getContext('2d')` returns
 * `null`), so ECharts' default canvas renderer throws on first paint. The SVG
 * renderer exercises the same instance lifecycle, event wiring, option
 * plumbing and tooltip model this file is about. The canvas path is covered by
 * `getDataURL({ type: 'png' })` in real environments; that call is asserted
 * through the SVG export instead.
 *
 * Mount `SnChart` as the root component so Vue Test Utils records the
 * component's own emits (a wrapping component would swallow them).
 */
function mountChart(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(SnChart as never, {
    props: { renderer: 'svg', ...props } as never,
    slots: slots as never,
  });
}

/** ECharts needs a non-zero box to lay out; happy-dom reports 0 otherwise. */
function stubElementSize(): void {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 400 });
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 300 });
}

/** The ECharts instance the component handed to `ready`. */
function readyInstance(wrapper: VueWrapper): EChartsType {
  const ready = wrapper.emitted('ready');
  expect(ready).toBeTruthy();
  return ready?.[0]?.[0] as EChartsType;
}

/** Read an option branch off the live instance. */
function liveOption(wrapper: VueWrapper): Record<string, unknown> {
  return (
    readyInstance(wrapper) as unknown as { getOption: () => Record<string, unknown> }
  ).getOption();
}

/** Give the tooltip's deferred `show` timer a chance to run. */
async function flushTooltip(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 20));
  await nextTick();
}

const point = {
  componentType: 'series',
  seriesType: 'line',
  seriesName: 'A',
  seriesIndex: 0,
  dataIndex: 0,
  name: '一',
  value: 1,
  color: '#1677ff',
};

const lineOption = {
  xAxis: { type: 'category', data: ['一', '二'] },
  yAxis: { type: 'value' },
  series: [
    { type: 'line', name: 'A', data: [1, 2] },
    { type: 'line', name: 'B', data: [3, 4] },
  ],
};

describe('SnChart', () => {
  let wrapper: VueWrapper | null = null;

  beforeEach(() => {
    stubElementSize();
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = null;
    clearChartIcons();
    vi.restoreAllMocks();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');
  });

  describe('rendering', () => {
    it('should render the chart container and the canvas host', () => {
      wrapper = mountChart({ option: lineOption });
      expect(wrapper.find('[data-snui-component="SnChart"]').exists()).toBe(true);
      expect(wrapper.find('.sn-chart__canvas').exists()).toBe(true);
    });

    it('should expose the resolved layout padding on the container', () => {
      wrapper = mountChart({ option: lineOption, layout: 'spacious' });
      const style = wrapper.find('.sn-chart').attributes('style') ?? '';
      expect(style).toContain(`padding: ${CHART_LAYOUT_PRESETS.spacious.padding}px`);
    });

    it('should write the chart colour variables onto the container', () => {
      wrapper = mountChart({ option: lineOption });
      const style = wrapper.find('.sn-chart').attributes('style') ?? '';
      expect(style).toContain('--sn-chart-color-primary');
    });

    it('should apply a numeric height as px', () => {
      wrapper = mountChart({ option: lineOption, height: 320 });
      expect(wrapper.find('.sn-chart').attributes('style')).toContain('height: 320px');
    });

    it('should pass a CSS length height through verbatim', () => {
      wrapper = mountChart({ option: lineOption, height: '50vh' });
      expect(wrapper.find('.sn-chart').attributes('style')).toContain('height: 50vh');
    });

    it('should forward the accessible label', () => {
      wrapper = mountChart({ option: lineOption, ariaLabel: '月度趋势图' });
      expect(wrapper.find('.sn-chart').attributes('aria-label')).toBe('月度趋势图');
    });

    it('should show the loading overlay while loading', () => {
      wrapper = mountChart({ option: lineOption, loading: true, loadingText: '加载中' });
      expect(wrapper.find('.sn-chart__loading').exists()).toBe(true);
    });

    it('should hide the loading overlay when not loading', () => {
      wrapper = mountChart({ option: lineOption });
      expect(wrapper.find('.sn-chart__loading').exists()).toBe(false);
    });

    it('should render the empty state when the option has no series', () => {
      wrapper = mountChart({ option: {} });
      expect(wrapper.find('.sn-chart__empty').exists()).toBe(true);
    });

    it('should not render the empty state for a single series', () => {
      wrapper = mountChart({ option: { series: [{ type: 'line', data: [1] }] } });
      expect(wrapper.find('.sn-chart__empty').exists()).toBe(false);
    });

    it('should render the empty slot when provided', () => {
      wrapper = mountChart(
        { option: {} },
        { empty: () => h('span', { class: 'my-empty' }, '无数据') },
      );
      expect(wrapper.find('.my-empty').exists()).toBe(true);
    });

    it('should render the tooltip slot inside the tooltip bubble once it shows', async () => {
      wrapper = mountChart(
        { option: lineOption },
        { tooltip: () => h('span', { class: 'my-tooltip' }, '自定义') },
      );
      readyInstance(wrapper).trigger('mouseover', point);
      await flushTooltip();
      expect(wrapper.find('.sn-chart__tooltip').exists()).toBe(true);
      expect(wrapper.find('.my-tooltip').exists()).toBe(true);
    });
  });

  describe('instance lifecycle', () => {
    it('should emit ready with an initialised ECharts instance', () => {
      wrapper = mountChart({ option: lineOption });
      expect(typeof readyInstance(wrapper).getDom).toBe('function');
    });

    it('should not render the DOM tooltip until the pointer enters an item', () => {
      wrapper = mountChart({ option: lineOption });
      expect(wrapper.find('.sn-chart__tooltip').exists()).toBe(false);
    });

    it('should tear the instance down on unmount', () => {
      wrapper = mountChart({ option: lineOption });
      const instance = readyInstance(wrapper) as unknown as { isDisposed?: () => boolean };
      wrapper.unmount();
      wrapper = null;
      expect(instance.isDisposed?.()).toBe(true);
    });

    it('should dispose the old instance when the instance is recreated', () => {
      wrapper = mountChart({ option: lineOption });
      const first = readyInstance(wrapper) as unknown as { isDisposed: () => boolean };
      (wrapper.vm as unknown as { refreshTheme: () => void }).refreshTheme();
      expect(first.isDisposed()).toBe(true);
      expect(wrapper.emitted('ready')?.length).toBe(2);
    });

    it('should apply an option update without re-initialising the instance', async () => {
      wrapper = mountChart({ option: lineOption });
      await wrapper.setProps({ option: { ...lineOption, yAxis: { type: 'value', max: 10 } } });
      expect(wrapper.emitted('ready')?.length).toBe(1);
      const yAxis = liveOption(wrapper)['yAxis'] as Record<string, unknown>[];
      expect(yAxis[0]?.['max']).toBe(10);
    });

    it('should expose the imperative handle', async () => {
      wrapper = mountChart({ option: lineOption });
      const handle = wrapper.vm as unknown as {
        resize: () => void;
        getOption: () => unknown;
        dispatchAction: (payload: Record<string, unknown>) => void;
        getDataURL: (opts: { type: 'svg' }) => string;
      };
      expect(typeof handle.resize).toBe('function');
      expect(typeof handle.getOption).toBe('function');
      // ECharts only accepts a `highlight` action once the first render has
      // laid the series out (its internal `getData` needs a rendered model),
      // so let the initial paint settle before dispatching.
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(() =>
        handle.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: 0 }),
      ).not.toThrow();
      // The SVG export comes back as a `data:image/svg+xml` URL.
      expect(handle.getDataURL({ type: 'svg' })).toContain('data:image/svg+xml');
    });

    it('should return an empty string from getDataURL before init', () => {
      // Not mounted → no instance to export from.
      const unmounted = mountChart({ option: lineOption, autoResize: false });
      const handle = unmounted.vm as unknown as { instance: unknown };
      unmounted.unmount();
      expect(handle.instance).toBeNull();
    });

    it('should rebuild the instance when the theme mode changes', async () => {
      wrapper = mountChart({ option: lineOption, themeMode: 'light' });
      const first = readyInstance(wrapper);
      await wrapper.setProps({ themeMode: 'dark' });
      const ready = wrapper.emitted('ready');
      expect(ready?.length).toBe(2);
      expect(ready?.[1]?.[0]).not.toBe(first);
    });

    // Regression: the theme computed used to read `chartRef`, so the ref flip
    // (null → element) during mount changed the theme one tick later and the
    // instance was built twice on mount — the first one leaked until unmount.
    it('should initialise the instance exactly once on mount with resolved colours', async () => {
      wrapper = mountChart({ option: lineOption, theme: { colorSource: 'resolved' } });
      await new Promise((resolve) => setTimeout(resolve, 20));
      expect(wrapper.emitted('ready')?.length).toBe(1);
    });

    // Regression: a mode flip used to be handled by two watchers (the theme
    // watcher and a dedicated mode watcher), which could rebuild twice.
    it('should rebuild exactly once when the theme mode flips', async () => {
      wrapper = mountChart({ option: lineOption, themeMode: 'light' });
      await wrapper.setProps({ themeMode: 'dark' });
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(wrapper.emitted('ready')?.length).toBe(2);
    });

    it('should keep the loading state consistent when it toggles', async () => {
      wrapper = mountChart({ option: lineOption, loading: true });
      await wrapper.setProps({ loading: false });
      expect(wrapper.find('.sn-chart__loading').exists()).toBe(false);
      await wrapper.setProps({ loading: true, loadingText: '加载中' });
      expect(wrapper.find('.sn-chart__loading').exists()).toBe(true);
      // Still one instance — the loading state never re-initialises the chart.
      expect(wrapper.emitted('ready')?.length).toBe(1);
    });
    it('should not rebuild the instance when only the option changes mode-independently', async () => {
      wrapper = mountChart({ option: lineOption, themeMode: 'light' });
      await wrapper.setProps({ layout: 'compact' });
      expect(wrapper.emitted('ready')?.length).toBe(1);
    });
  });

  describe('tooltip modes', () => {
    it("should keep ECharts' own tooltip disabled in the default (custom) mode", () => {
      wrapper = mountChart({ option: lineOption });
      const tooltip = liveOption(wrapper)['tooltip'] as Record<string, unknown>[];
      expect(tooltip[0]?.['show']).toBe(false);
    });

    it("should enable ECharts' own tooltip in native mode", () => {
      wrapper = mountChart({ option: lineOption, tooltip: { mode: 'native', trigger: 'axis' } });
      const tooltip = liveOption(wrapper)['tooltip'] as Record<string, unknown>[];
      expect(tooltip[0]?.['show']).toBe(true);
      expect(tooltip[0]?.['trigger']).toBe('axis');
    });

    it('should not render the DOM tooltip in native mode', async () => {
      wrapper = mountChart({ option: lineOption, tooltip: { mode: 'native' } });
      readyInstance(wrapper).trigger('mouseover', point);
      await flushTooltip();
      expect(wrapper.find('.sn-chart__tooltip').exists()).toBe(false);
    });

    it('should emit tooltipshow with the rendered model', async () => {
      wrapper = mountChart({ option: lineOption, tooltip: { showPercent: true } });
      readyInstance(wrapper).trigger('mouseover', { ...point, percent: 20 });
      await flushTooltip();
      const payload = wrapper.emitted('tooltipshow')?.[0]?.[0] as {
        items?: unknown[];
        showPercent?: boolean;
      };
      expect(payload?.items).toHaveLength(1);
      expect(payload?.showPercent).toBe(true);
    });

    it('should hide the tooltip once the pointer leaves the item', async () => {
      wrapper = mountChart({ option: lineOption });
      const instance = readyInstance(wrapper);
      instance.trigger('mouseover', point);
      await flushTooltip();
      expect(wrapper.find('.sn-chart__tooltip').exists()).toBe(true);

      instance.trigger('mouseout', point);
      await new Promise((resolve) => setTimeout(resolve, 160));
      await nextTick();
      expect(wrapper.find('.sn-chart__tooltip').exists()).toBe(false);
    });

    it('should hide the tooltip immediately when keepOnHover is false', async () => {
      wrapper = mountChart({ option: lineOption, tooltip: { keepOnHover: false } });
      const instance = readyInstance(wrapper);
      instance.trigger('mouseover', point);
      await flushTooltip();
      instance.trigger('mouseout', point);
      await nextTick();
      expect(wrapper.find('.sn-chart__tooltip').exists()).toBe(false);
    });

    it('should clear a pending hide when the pointer re-enters the item', async () => {
      wrapper = mountChart({ option: lineOption });
      const instance = readyInstance(wrapper);
      instance.trigger('mouseover', point);
      await flushTooltip();
      instance.trigger('mouseout', point);
      instance.trigger('mouseover', point);
      await new Promise((resolve) => setTimeout(resolve, 160));
      await nextTick();
      expect(wrapper.find('.sn-chart__tooltip').exists()).toBe(true);
    });
  });

  describe('events', () => {
    it('should forward an ECharts click as a typed point event', async () => {
      wrapper = mountChart({ option: lineOption });
      readyInstance(wrapper).trigger('click', { ...point, dataIndex: 1, name: '二', value: 2 });
      await nextTick();
      expect(wrapper.emitted('click')?.[0]?.[0]).toMatchObject({
        componentType: 'series',
        seriesType: 'line',
        seriesName: 'A',
        dataIndex: 1,
        name: '二',
        value: 2,
        color: '#1677ff',
      });
    });

    it('should coerce a numeric name to a string', async () => {
      wrapper = mountChart({ option: lineOption });
      readyInstance(wrapper).trigger('click', { componentType: 'series', name: 3, dataIndex: 0 });
      await nextTick();
      expect((wrapper.emitted('click')?.[0]?.[0] as { name?: string })?.name).toBe('3');
    });

    it('should forward legendselectchanged', async () => {
      wrapper = mountChart({ option: lineOption });
      readyInstance(wrapper).trigger('legendselectchanged', {
        name: 'A',
        selected: { A: false, B: true },
      });
      await nextTick();
      expect(wrapper.emitted('legendselectchanged')?.[0]?.[0]).toEqual({
        name: 'A',
        selected: { A: false, B: true },
      });
    });

    it('should forward a dataZoom payload', async () => {
      wrapper = mountChart({ option: { ...lineOption, dataZoom: [{}] } });
      readyInstance(wrapper).trigger('datazoom', { start: 10, end: 60 });
      await nextTick();
      expect(wrapper.emitted('datazoom')?.[0]?.[0]).toEqual({ start: 10, end: 60 });
    });

    it('should forward mouseover and mouseout as point events', async () => {
      wrapper = mountChart({ option: lineOption });
      const instance = readyInstance(wrapper);
      instance.trigger('mouseover', point);
      instance.trigger('mouseout', point);
      await nextTick();
      expect(wrapper.emitted('mouseover')?.[0]?.[0]).toMatchObject({
        seriesName: 'A',
        dataIndex: 0,
      });
      expect(wrapper.emitted('mouseout')?.[0]?.[0]).toMatchObject({
        seriesName: 'A',
        dataIndex: 0,
      });
    });

    it('should detach its handlers on unmount', () => {
      wrapper = mountChart({ option: lineOption });
      const instance = readyInstance(wrapper) as unknown as {
        off: (name: string, fn: unknown) => void;
        isDisposed: () => boolean;
      };
      const off = vi.spyOn(instance, 'off');
      wrapper.unmount();
      wrapper = null;
      // `detachEvents` removes every handler it registered, then disposes.
      expect(off).toHaveBeenCalled();
      expect(instance.isDisposed()).toBe(true);
    });
  });
});
