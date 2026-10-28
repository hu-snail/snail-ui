import { describe, it, expect, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnHeatmap from './SnHeatmap.vue';
import {
  buildHeatmapMatrix,
  buildLoadingMatrix,
  buildMonthLabels,
  buildWeekLabels,
  calcLevel,
  normalizeHeatmapData,
} from './heatmap-utils';
import type { SnHeatmapDataItem } from './heatmap-utils';

/** Local timestamp for a calendar day (month is 0-based). */
function day(year: number, month0: number, date: number): number {
  return new Date(year, month0, date).getTime();
}

/** Mount SnHeatmap through a wrapper component, mirroring real usage. */
function mountHeatmap(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnHeatmap },
      setup() {
        return () => h(SnHeatmap, props as never, slots as never);
      },
    }),
  );
}

describe('SnHeatmap utils', () => {
  describe('calcLevel', () => {
    it('should map zero, negative and null values to level 0', () => {
      expect(calcLevel(0, 10)).toBe(0);
      expect(calcLevel(-3, 10)).toBe(0);
      expect(calcLevel(null, 10)).toBe(0);
      expect(calcLevel(undefined, 10)).toBe(0);
    });

    it('should map any value to level 0 when the max is zero', () => {
      expect(calcLevel(5, 0)).toBe(0);
    });

    it('should bucket values across five levels', () => {
      expect(calcLevel(10, 10)).toBe(4);
      expect(calcLevel(11, 10)).toBe(4);
      expect(calcLevel(5, 10)).toBe(2);
      expect(calcLevel(2, 10)).toBe(1);
    });

    it('should spread levels across a custom palette size', () => {
      expect(calcLevel(10, 10, 3)).toBe(2);
      expect(calcLevel(5, 10, 3)).toBe(1);
    });
  });

  describe('normalizeHeatmapData', () => {
    it('should fill one whole week around a single mid-week item', () => {
      const data: SnHeatmapDataItem[] = [{ timestamp: day(2026, 2, 3), value: 5 }];
      const out = normalizeHeatmapData(data, 0, false);
      // 2026-03-03 is a Tuesday → Mon 03-02 … Sun 03-08.
      expect(out).toHaveLength(7);
      expect(out[0]).toEqual({ timestamp: day(2026, 2, 2), value: null });
      expect(out[1]).toEqual({ timestamp: day(2026, 2, 3), value: 5 });
      expect(out[6]).toEqual({ timestamp: day(2026, 2, 8), value: null });
    });

    it('should fill leading blanks with 0 when fillCalendarLeading is set', () => {
      const data: SnHeatmapDataItem[] = [{ timestamp: day(2026, 2, 3), value: 5 }];
      const out = normalizeHeatmapData(data, 0, true);
      expect(out[0]?.value).toBe(0);
    });

    it('should fill in-range gaps with 0 and out-of-range days with null', () => {
      const data: SnHeatmapDataItem[] = [
        { timestamp: day(2026, 2, 2), value: 1 },
        { timestamp: day(2026, 2, 15), value: 2 },
      ];
      const out = normalizeHeatmapData(data, 0, false);
      // Mon 03-02 … Sun 03-15 (03-15 is itself a Sunday, so the range is 14 days).
      expect(out).toHaveLength(14);
      expect(out[0]?.value).toBe(1);
      expect(out[1]?.value).toBe(0);
      expect(out[13]?.value).toBe(2);
      expect(out[2]?.timestamp).toBe(day(2026, 2, 4));
    });

    it('should sort unsorted input', () => {
      const data: SnHeatmapDataItem[] = [
        { timestamp: day(2026, 2, 15), value: 2 },
        { timestamp: day(2026, 2, 2), value: 1 },
      ];
      const out = normalizeHeatmapData(data, 0, false);
      expect(out[0]?.value).toBe(1);
      expect(out[out.length - 1]?.timestamp).toBe(day(2026, 2, 15));
    });

    it('should honor a Sunday week start (firstDayOfWeek 6)', () => {
      const data: SnHeatmapDataItem[] = [{ timestamp: day(2026, 2, 3), value: 5 }];
      const out = normalizeHeatmapData(data, 6, false);
      // Week starts Sunday 03-01.
      expect(out[0]).toEqual({ timestamp: day(2026, 2, 1), value: null });
      expect(out).toHaveLength(7);
    });

    it('should return an empty array for empty input', () => {
      expect(normalizeHeatmapData([], 0, false)).toEqual([]);
    });
  });

  describe('buildHeatmapMatrix', () => {
    it('should lay out rows by weekday and columns by week', () => {
      const data: SnHeatmapDataItem[] = [
        { timestamp: day(2026, 2, 2), value: 1 },
        { timestamp: day(2026, 2, 8), value: 2 },
        { timestamp: day(2026, 2, 9), value: 3 },
      ];
      const matrix = buildHeatmapMatrix(data, 0);
      expect(matrix).toHaveLength(7);
      expect(matrix[0]?.[0]).toMatchObject({ rowIndex: 0, colIndex: 0, value: 1 });
      expect(matrix[6]?.[0]).toMatchObject({ rowIndex: 6, colIndex: 0, value: 2 });
      expect(matrix[0]?.[1]).toMatchObject({ rowIndex: 0, colIndex: 1, value: 3 });
      expect(matrix[1]?.[0]).toBeNull();
    });

    it('should return an empty matrix for empty input', () => {
      expect(buildHeatmapMatrix([], 0)).toEqual([]);
    });
  });

  describe('buildLoadingMatrix', () => {
    it('should build a 7 × 53 skeleton of zero-value cells', () => {
      const matrix = buildLoadingMatrix(0);
      expect(matrix).toHaveLength(7);
      expect(matrix[0]).toHaveLength(53);
      expect(matrix[6]?.[52]?.value).toBe(0);
    });
  });

  describe('buildWeekLabels', () => {
    it('should start at Monday and show all seven labels by default', () => {
      const labels = buildWeekLabels(0);
      expect(labels.map((l) => l.label)).toEqual(['一', '二', '三', '四', '五', '六', '日']);
      expect(labels.every((l) => l.visible)).toBe(true);
    });

    it('should rotate for a Sunday start', () => {
      expect(buildWeekLabels(6).map((l) => l.label)[0]).toBe('日');
    });
  });

  describe('buildMonthLabels', () => {
    it('should merge columns per month and drop short months', () => {
      // 2026-03-01 (Sunday) … 2026-04-30 → cols: Mar × 6 weeks, Apr × 4.
      const data: SnHeatmapDataItem[] = [
        { timestamp: day(2026, 2, 1), value: 1 },
        { timestamp: day(2026, 3, 30), value: 1 },
      ];
      const labels = buildMonthLabels(buildHeatmapMatrix(normalizeHeatmapData(data, 0, false), 0));
      expect(labels).toEqual([
        { name: '3月', colSpan: 6 },
        { name: '4月', colSpan: 4 },
      ]);
    });

    it('should drop months covering fewer than three weeks', () => {
      const data: SnHeatmapDataItem[] = [
        { timestamp: day(2026, 3, 10), value: 1 },
        { timestamp: day(2026, 3, 15), value: 1 },
      ];
      const labels = buildMonthLabels(buildHeatmapMatrix(normalizeHeatmapData(data, 0, false), 0));
      expect(labels).toEqual([]);
    });

    it('should return nothing for an empty matrix', () => {
      expect(buildMonthLabels([])).toEqual([]);
    });
  });
});

describe('SnHeatmap (AUI-WEB-DD-008)', () => {
  it('should expose the component root with the BEM class and marker', () => {
    const w = mountHeatmap();
    expect(w.find('.sn-heatmap').exists()).toBe(true);
    expect(w.find('[data-snui-component="heatmap"]').exists()).toBe(true);
  });

  it('should render seven rows with week labels and the indicator by default', () => {
    const w = mountHeatmap();
    expect(w.findAll('tbody tr')).toHaveLength(7);
    const labels = w.findAll('.sn-heatmap__week-label-cell');
    expect(labels[0]?.text()).toBe('一');
    expect(labels[1]?.text()).toBe('二');
    expect(labels[6]?.text()).toBe('日');
    expect(w.findAll('.sn-heatmap__swatch')).toHaveLength(5);
    expect(w.text()).toContain('少');
    expect(w.text()).toContain('多');
  });

  it('should render no rects for empty data', () => {
    const w = mountHeatmap({ data: [] });
    expect(w.findAll('.sn-heatmap__rect')).toHaveLength(0);
  });

  it('should color cells by value level and blank null cells', () => {
    const data: SnHeatmapDataItem[] = [
      { timestamp: day(2026, 2, 4), value: 10 },
      { timestamp: day(2026, 2, 5), value: 5 },
      { timestamp: day(2026, 2, 6), value: 2 },
      { timestamp: day(2026, 2, 7), value: 0 },
    ];
    const w = mountHeatmap({ data });
    // Week Mon 03-02 … Sun 03-08: two leading nulls, then rects.
    const empties = w.findAll('.sn-heatmap__empty-cell');
    expect(empties.length).toBeGreaterThanOrEqual(2);
    expect(w.find('.sn-heatmap__rect--level-4').exists()).toBe(true);
    expect(w.find('.sn-heatmap__rect--level-2').exists()).toBe(true);
    expect(w.find('.sn-heatmap__rect--level-1').exists()).toBe(true);
    expect(w.find('.sn-heatmap__rect--level-0').exists()).toBe(true);
  });

  it('should produce the same layout for unsorted input', () => {
    const forward: SnHeatmapDataItem[] = [
      { timestamp: day(2026, 2, 2), value: 1 },
      { timestamp: day(2026, 2, 9), value: 2 },
    ];
    const backward = [...forward].reverse();
    const a = mountHeatmap({ data: forward }).findAll('.sn-heatmap__rect');
    const b = mountHeatmap({ data: backward }).findAll('.sn-heatmap__rect');
    expect(a).toHaveLength(b.length);
    expect(a[0]?.classes()).toEqual(b[0]?.classes());
  });

  it('should size the grid to two weeks of data', () => {
    const data: SnHeatmapDataItem[] = [
      { timestamp: day(2026, 2, 2), value: 1 },
      { timestamp: day(2026, 2, 9), value: 2 },
    ];
    const w = mountHeatmap({ data });
    // 7 rows × 2 cols of day cells.
    expect(w.findAll('.sn-heatmap__day-cell')).toHaveLength(14);
  });

  it('should not render tooltip wrappers or native titles by default', () => {
    // Detailed tooltip behavior is covered in the dedicated describe below
    // (teleport + timer conventions, mirroring SnTooltip.test.ts).
    const data: SnHeatmapDataItem[] = [{ timestamp: day(2026, 2, 2), value: 3 }];
    const w = mountHeatmap({ data });
    expect(w.find('.sn-tooltip-trigger').exists()).toBe(false);
    expect(w.find('.sn-heatmap__rect').attributes('title')).toBeUndefined();
  });

  it('should render the 7 × 53 loading skeleton', () => {
    const w = mountHeatmap({ loading: true });
    const rects = w.findAll('.sn-heatmap__rect--loading');
    expect(rects).toHaveLength(7 * 53);
    expect(w.findAll('tbody tr')).toHaveLength(7);
  });

  it('should render loadingData with loading classes', () => {
    // A full week so every gap-filled cell stays in range (rects, not blanks).
    const data: SnHeatmapDataItem[] = [
      { timestamp: day(2026, 2, 2), value: 3 },
      { timestamp: day(2026, 2, 8), value: 0 },
    ];
    const w = mountHeatmap({ loading: true, loadingData: data });
    const rects = w.findAll('.sn-heatmap__rect--loading');
    expect(rects.length).toBe(7);
    expect(rects[0]?.classes()).toContain('sn-heatmap__rect--level-0');
  });

  it('should hide the indicator when showColorIndicator is off', () => {
    const w = mountHeatmap({ showColorIndicator: false });
    expect(w.findAll('.sn-heatmap__swatch')).toHaveLength(0);
  });

  it('should hide week and month labels on request', () => {
    const w = mountHeatmap({ showWeekLabels: false, showMonthLabels: false });
    expect(w.find('.sn-heatmap__week-label-cell').exists()).toBe(false);
    expect(w.find('.sn-heatmap__month-label-cell').exists()).toBe(false);
  });

  it('should render month labels with col spans', () => {
    const data: SnHeatmapDataItem[] = [
      { timestamp: day(2026, 2, 1), value: 1 },
      { timestamp: day(2026, 3, 30), value: 1 },
    ];
    const w = mountHeatmap({ data });
    const monthCells = w.findAll('.sn-heatmap__month-label-cell');
    expect(monthCells).toHaveLength(2);
    expect(monthCells[0]?.text()).toBe('3月');
    expect(monthCells[0]?.attributes('colspan')).toBe('6');
    expect(monthCells[1]?.text()).toBe('4月');
    expect(monthCells[1]?.attributes('colspan')).toBe('4');
  });

  it('should apply size and color theme modifier classes', () => {
    for (const size of ['small', 'medium', 'large'] as const) {
      const w = mountHeatmap({ size });
      expect(w.find('.sn-heatmap').classes()).toContain(`sn-heatmap--${size}`);
    }
    const w = mountHeatmap({ colorTheme: 'blue' });
    expect(w.find('.sn-heatmap').classes()).toContain('sn-heatmap--theme-blue');
  });

  it('should forward xGap / yGap as spacing custom properties', () => {
    const w = mountHeatmap({ xGap: 8, yGap: 12 });
    const style = w.find('.sn-heatmap').attributes('style') ?? '';
    // happy-dom serializes custom properties with a space after the colon.
    expect(style).toMatch(/--sn-heatmap-x-gap:\s*8px/);
    expect(style).toMatch(/--sn-heatmap-y-gap:\s*12px/);
  });

  it('should apply custom active colors via inline background', () => {
    const data: SnHeatmapDataItem[] = [{ timestamp: day(2026, 2, 2), value: 10 }];
    const w = mountHeatmap({ data, activeColors: ['#aabbcc', '#112233'] });
    const rect = w.find('.sn-heatmap__rect');
    expect(rect.classes()).toContain('sn-heatmap__rect--level-2');
    expect(rect.attributes('style')).toContain('#112233');
  });

  it('should apply a custom minimum color for zero values', () => {
    const data: SnHeatmapDataItem[] = [{ timestamp: day(2026, 2, 2), value: 0 }];
    const w = mountHeatmap({ data, minimumColor: '#ededed' });
    expect(w.find('.sn-heatmap__rect').attributes('style')).toContain('#ededed');
  });

  it('should render the footer and indicator slots', () => {
    const w = mountHeatmap(
      {},
      {
        footer: () => '左侧信息',
        indicator: () => '自定义指示',
      },
    );
    expect(w.find('.sn-heatmap__footer-slot').text()).toBe('左侧信息');
    expect(w.text()).toContain('自定义指示');
    expect(w.findAll('.sn-heatmap__swatch')).toHaveLength(0);
  });

  it('should render the indicator text slot overrides', () => {
    const w = mountHeatmap(
      {},
      {
        'indicator-leading-text': () => '较少',
        'indicator-trailing-text': () => '较多',
      },
    );
    expect(w.text()).toContain('较少');
    expect(w.text()).toContain('较多');
  });
});

describe('SnHeatmap tooltip (n-heatmap `tooltip` parity)', () => {
  /** One full week (Mon 2026-03-02 … Sun 2026-03-08) → one rect per day. */
  const week: SnHeatmapDataItem[] = Array.from({ length: 7 }, (_, i) => ({
    timestamp: day(2026, 2, 2 + i),
    value: i === 0 ? 3 : 0,
  }));

  /** Attached mount: hover tooltips teleport to document.body. */
  function mountTooltipHeatmap(
    props: Record<string, unknown>,
    slots: Record<string, unknown> = {},
  ): VueWrapper {
    return mount(
      defineComponent({
        components: { SnHeatmap },
        setup() {
          return () => h(SnHeatmap, props as never, slots as never);
        },
      }),
      { attachTo: document.body },
    );
  }

  let active: VueWrapper | null = null;

  afterEach(() => {
    active?.unmount();
    active = null;
    // Tear down any Teleport nodes that survived the test.
    document.body.querySelectorAll('.sn-tooltip').forEach((el) => el.remove());
  });

  /** Hover the rect of the given day index and wait past the open delay. */
  async function hoverRect(index: number, waitMs = 150): Promise<HTMLElement> {
    const triggers = active!.findAll('.sn-tooltip-trigger');
    await triggers[index]!.trigger('mouseenter');
    await new Promise((r) => setTimeout(r, waitMs));
    const pop = document.body.querySelector('.sn-tooltip') as HTMLElement | null;
    expect(pop).not.toBeNull();
    return pop!;
  }

  it('should render no SnTooltip instances at all when tooltip is false', () => {
    active = mountTooltipHeatmap({ data: week });
    expect(active.findAll('.sn-tooltip-trigger')).toHaveLength(0);
    expect(document.body.querySelector('.sn-tooltip')).toBeNull();
  });

  it('should show the default date + value content on hover when tooltip is true', async () => {
    active = mountTooltipHeatmap({ data: week, tooltip: true });
    // 7 rects, each wrapped in a hover tooltip trigger.
    expect(active.findAll('.sn-tooltip-trigger')).toHaveLength(7);
    const pop = await hoverRect(0);
    expect(pop.textContent).toContain('2026-03-02：3');
  });

  it('should render the tooltip slot content with the cell DayRect params', async () => {
    let seen: Record<string, unknown> | null = null;
    active = mountTooltipHeatmap(
      { data: week, tooltip: true },
      {
        tooltip: (day: Record<string, unknown>) => {
          seen = day;
          return h('span', { class: 'custom-tip' }, `自定义 ${String(day.value)}`);
        },
      },
    );
    const pop = await hoverRect(0);
    expect(pop.querySelector('.custom-tip')?.textContent).toBe('自定义 3');
    // DayRect shape, 1:1 with the reference interface.
    expect(seen).toMatchObject({
      timestamp: day(2026, 2, 2),
      value: 3,
      dayOfWeek: 1, // Monday = 1 (0 = Sunday, reference convention)
      rowIndex: 0,
      colIndex: 0,
    });
    expect(typeof seen!.color).toBe('string');
  });

  it('should forward the tooltip config placement and delay', async () => {
    active = mountTooltipHeatmap({
      data: week,
      tooltip: { placement: 'bottom', delay: 0 },
    });
    const pop = await hoverRect(0, 10);
    // SnTooltip marks the popover with the requested placement class.
    expect(pop.classList).toContain('sn-tooltip--bottom');
  });

  it('should forward the tooltip config showArrow toggle when the slot is absent', async () => {
    active = mountTooltipHeatmap({
      data: week,
      tooltip: { placement: 'bottom', showArrow: false, delay: 0 },
    });
    const pop = await hoverRect(0, 10);
    // The default date + value text still renders without a slot.
    expect(pop.textContent).toContain('2026-03-02：3');
    // showArrow: false removes the arrow from the bubble.
    expect(pop.querySelector('.sn-tooltip__arrow')).toBeNull();
  });

  it('should suppress tooltips while loading (reference Rect parity)', () => {
    active = mountTooltipHeatmap({
      data: week,
      loadingData: week,
      tooltip: true,
      loading: true,
    });
    expect(active.findAll('.sn-tooltip-trigger')).toHaveLength(0);
    expect(active.findAll('.sn-heatmap__rect--loading')).toHaveLength(7);
  });
});
