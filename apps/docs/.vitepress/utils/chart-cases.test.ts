/**
 * Behaviour tests for the chart case registry (the data behind
 * /echarts/<category>). Pure functions, no mounting — this is what keeps the
 * docs `test` task meaningful for the case pages.
 *
 * Covered behaviour:
 *   - defaults are the "rounded / smooth" look the library ships with;
 *   - the panel switches actually move the option keys they claim to;
 *   - stacked bars round only the top segment;
 *   - horizontal ranking rounds the right edge and swaps the axes;
 *   - the gauge hides axes/legend chrome it has no use for;
 *   - the copied snippet is valid, self-contained code (option JSON round-trips
 *     and contains no functions), so "copy config" always yields working code.
 */

import { describe, expect, it } from 'vitest';
import {
  CHART_CASES,
  buildCaseOption,
  buildCaseSnippet,
  buildCaseTooltip,
  createDefaultConfig,
  getCasesByCategory,
  getChartCase,
} from '../echarts/registry';
import type { ChartCaseConfig, ChartCaseDef, ChartCaseLabels } from '../echarts/registry';

/** Draft shape of an option built by the registry — read by key, not by type. */
type Draft = Record<string, unknown>;

function optionOf(def: ChartCaseDef, cfg: ChartCaseConfig): Draft {
  return buildCaseOption(def, cfg, def.labels.zh) as unknown as Draft;
}

function seriesOf(option: Draft): Draft[] {
  return option['series'] as Draft[];
}

function itemStyleOf(seriesEntry: Draft | undefined): Draft {
  return (seriesEntry?.['itemStyle'] ?? {}) as Draft;
}

/** Copy-paste defaults for a case. */
function cfgOf(def: ChartCaseDef, overrides: Partial<ChartCaseConfig> = {}): ChartCaseConfig {
  return { ...createDefaultConfig(def), ...overrides };
}

/** Registry order is the page order, so every case must declare both locales. */
function labelsOf(def: ChartCaseDef): { zh: ChartCaseLabels; en: ChartCaseLabels } {
  return def.labels;
}

describe('chart case registry', () => {
  it('should expose every case id exactly once', () => {
    const ids = CHART_CASES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(getChartCase(id).id).toBe(id);
  });

  it('should carry both locales for every case', () => {
    for (const def of CHART_CASES) {
      const labels = labelsOf(def);
      expect(labels.zh.categories.length).toBe(labels.en.categories.length);
      expect(labels.zh.series.length).toBe(labels.en.series.length);
      labels.zh.series.forEach((s, i) => {
        expect(s.data.length).toBe(labels.en.series[i]?.data.length);
      });
      // The option builder indexes categories against series[0], so the two
      // lengths must agree or a slice would render with an undefined value.
      if (def.type === 'pie') {
        expect(labels.zh.categories.length).toBe(labels.zh.series[0]?.data.length);
      }
    }
  });

  it('should cover all five categories referenced by the sidebar', () => {
    // Sidebar links /echarts/{line,area,bar,pie,gauge}; a category without
    // cases would render an empty page.
    const categories = ['line', 'area', 'bar', 'pie', 'gauge'] as const;
    for (const category of categories) {
      expect(getCasesByCategory(category).length).toBeGreaterThan(0);
    }
  });

  describe('buildCaseOption', () => {
    it('should default to smooth lines and a rounded look', () => {
      const def = getChartCase('line-basic');
      const series = seriesOf(optionOf(def, cfgOf(def)));
      expect(series[0]?.['smooth']).toBe(true);
      expect(series[0]?.['type']).toBe('line');
      // A line case has no fill unless it is the area category.
      expect(series[0]?.['areaStyle']).toBeUndefined();
    });

    it('should stop smoothing when the switch is off', () => {
      const def = getChartCase('line-basic');
      const series = seriesOf(optionOf(def, cfgOf(def, { smooth: false })));
      expect(series[0]?.['smooth']).toBe(false);
    });

    it('should fill areas with a translucent areaStyle instead of gradients', () => {
      const def = getChartCase('area-soft');
      const series = seriesOf(optionOf(def, cfgOf(def)));
      const areaStyle = series[0]?.['areaStyle'] as Draft;
      expect(areaStyle['opacity']).toBe(0.25);
      // JSON-safe: a gradient object could not be copied into a project.
      expect(JSON.stringify(series[0])).not.toContain('function');
    });

    it('should round bar tops on grouped bars', () => {
      const def = getChartCase('bar-group');
      const series = seriesOf(optionOf(def, cfgOf(def)));
      expect(itemStyleOf(series[0])['borderRadius']).toEqual([6, 6, 0, 0]);
    });

    it('should square every edge when rounding is off', () => {
      const def = getChartCase('bar-group');
      const series = seriesOf(optionOf(def, cfgOf(def, { rounded: false })));
      for (const entry of series) expect(itemStyleOf(entry)['borderRadius']).toBe(0);
    });

    it('should round only the topmost stacked segment', () => {
      const def = getChartCase('bar-stack');
      const series = seriesOf(optionOf(def, cfgOf(def)));
      expect(series[0]?.['stack']).toBe('total');
      expect(series[1]?.['stack']).toBe('total');
      expect(itemStyleOf(series[0])['borderRadius']).toBe(0);
      expect(itemStyleOf(series[1])['borderRadius']).toEqual([6, 6, 0, 0]);
    });

    it('should swap the axes and round the right end for horizontal ranking', () => {
      const def = getChartCase('bar-h');
      const option = optionOf(def, cfgOf(def));
      const xAxis = option['xAxis'] as Draft;
      const yAxis = option['yAxis'] as Draft;
      expect(yAxis['type']).toBe('category');
      expect(xAxis['type']).toBe('value');
      expect(itemStyleOf(seriesOf(option)[0])['borderRadius']).toEqual([0, 6, 6, 0]);
    });

    it('should map pie categories onto the first series values', () => {
      const def = getChartCase('pie-ring');
      const entry = seriesOf(optionOf(def, cfgOf(def)))[0];
      const data = entry?.['data'] as { name: string; value: number }[];
      expect(data).toHaveLength(def.labels.zh.categories.length);
      expect(data[0]?.['name']).toBe('股票');
      expect(data[0]?.['value']).toBe(484);
      expect(itemStyleOf(entry)?.['borderRadius']).toBe(8);
      // The rose variant is the one case that maps value to radius.
      const rose = seriesOf(optionOf(getChartCase('pie-rose'), cfgOf(getChartCase('pie-rose'))))[0];
      expect(rose?.['roseType']).toBe('radius');
    });

    it('should keep gauge chrome minimal and honour the full circle', () => {
      const basic = seriesOf(
        optionOf(getChartCase('gauge-basic'), cfgOf(getChartCase('gauge-basic'))),
      );
      const entry = basic[0];
      expect(entry?.['pointer']).toEqual({ show: false });
      expect((entry?.['axisTick'] as Draft)['show']).toBe(false);
      expect((entry?.['progress'] as Draft)['roundCap']).toBe(true);
      expect((entry?.['data'] as Draft[])?.[0]?.['value']).toBe(58);

      const ring = seriesOf(
        optionOf(getChartCase('gauge-progress'), cfgOf(getChartCase('gauge-progress'))),
      )[0];
      expect(ring?.['startAngle']).toBe(90);
      expect(ring?.['endAngle']).toBe(-270);
    });

    it('should express the legend switch through the documented shorthand', () => {
      const def = getChartCase('bar-group');
      // On → an explicit `{ show: true }` (single-series cases need it too);
      // off → `false`, which the wrapper normalises to `{ show: false }`.
      expect(optionOf(def, cfgOf(def))['legend']).toEqual({ show: true });
      expect(optionOf(def, cfgOf(def, { legend: false }))['legend']).toBe(false);
      // Gauge has no legend concept, so the panel must not emit the key at all.
      const gauge = getChartCase('gauge-basic');
      expect(optionOf(gauge, cfgOf(gauge))['legend']).toBeUndefined();
    });

    it('should drive the tooltip through props, not option keys', () => {
      const def = getChartCase('bar-group');
      const tooltip = buildCaseTooltip(cfgOf(def, { trigger: 'axis', precision: 2 }));
      expect(tooltip).toEqual({ trigger: 'axis', precision: 2 });
      // …and the option itself stays free of a tooltip block the wrapper owns.
      expect(optionOf(def, cfgOf(def))['tooltip']).toBeUndefined();
    });
  });

  describe('buildCaseSnippet', () => {
    it('should emit a self-contained SFC that a project can paste', () => {
      const def = getChartCase('bar-stack');
      const snippet = buildCaseSnippet(def, cfgOf(def, { trigger: 'axis' }), def.labels.en);
      expect(snippet).toContain("import { SnChart } from '@snui/echarts'");
      expect(snippet).toContain("import '@snui/echarts/styles'");
      expect(snippet).toContain('<script setup lang="ts">');
      expect(snippet).toContain('const option = {');
      // The configured state is what gets copied, not the case defaults.
      expect(snippet).toContain('"trigger": "axis"');
      expect(snippet).toContain('stack');
      // English page → English labels in the copied option.
      expect(snippet).toContain('"Cash in"');
    });

    it('should follow the UI theme when no palette slot is picked', () => {
      const def = getChartCase('line-basic');
      const snippet = buildCaseSnippet(def, cfgOf(def), def.labels.zh);
      // No `theme` prop at all → the copied chart wears the host's token
      // primary with fading tints, exactly like the live card.
      expect(snippet).not.toContain(':theme=');
      expect(snippet).not.toContain('const theme');
    });

    it('should bake picked slots and fall back to the curated colours', () => {
      const def = getChartCase('bar-stack');
      const snippet = buildCaseSnippet(
        def,
        cfgOf(def, { palette: [undefined, '#22c55e'] }),
        def.labels.en,
      );
      expect(snippet).toContain(':theme="theme"');
      expect(snippet).toContain('"#22c55e"');
      // Unpicked slot 0 keeps the case's curated colour.
      expect(snippet).toContain('"#18a058"');
      // A copied config must never carry holes.
      expect(snippet).not.toContain('undefined');
    });

    it('should keep the copied option JSON-pure', () => {
      const def = getChartCase('line-multi');
      const snippet = buildCaseSnippet(def, cfgOf(def), def.labels.zh);
      const body = snippet.slice(
        snippet.indexOf('const option = '),
        snippet.indexOf('const layout'),
      );
      const json = body.replace('const option = ', '').trim().replace(/;$/, '');
      const parsed = JSON.parse(json) as Draft;
      expect(seriesOf(parsed)).toHaveLength(2);
      expect(parsed['xAxis']).toBeDefined();
    });

    it('should omit the theme-mode attribute when following the host', () => {
      const def = getChartCase('pie-ring');
      expect(buildCaseSnippet(def, cfgOf(def), def.labels.zh)).not.toContain('theme-mode');
      expect(buildCaseSnippet(def, cfgOf(def, { themeMode: 'dark' }), def.labels.zh)).toContain(
        'theme-mode="dark"',
      );
    });
  });
});
