/**
 * Chart case registry — the data behind the `/echarts/<category>` demo pages.
 *
 * A "case" (案例) is one live chart card with a config panel: the visitor
 * flips properties (smooth / rounded / legend / trigger / precision / layout /
 * theme mode) and palette colours, sees the chart re-render, and copies a
 * ready-to-paste SFC via `buildCaseSnippet`.
 *
 * The registry is deliberately framework-agnostic plain data + pure functions:
 * `ChartCase.vue` only binds it to `SnChart` and the form controls. That keeps
 * the option construction (`buildCaseOption`) unit-testable without mounting
 * anything (the docs vitest run covers it, see utils/chart-cases.test.ts).
 *
 * Labels are bilingual in-place (`zh` / `en` packs) so both locales render from
 * one source of truth — the docs locale picks the pack at render time.
 */

import type { SnEChartsOption, SnChartLayoutPreset } from '@snui/echarts';

/** Case family — one docs page per category, sidebar groups by these. */
export type ChartCaseCategory = 'line' | 'area' | 'bar' | 'pie' | 'gauge';

/** How the case draws. `barH` is the horizontal ranking variant of `bar`. */
export type ChartCaseType = 'line' | 'area' | 'bar' | 'barH' | 'pie' | 'gauge';

/** Bilingual label pack for one case's data. */
export interface ChartCaseLabels {
  readonly categories: readonly string[];
  readonly series: readonly { readonly name: string; readonly data: readonly number[] }[];
}

/** Config-panel state for one case — also the copy-snippet's source of truth. */
export interface ChartCaseConfig {
  readonly rounded: boolean;
  readonly smooth: boolean;
  readonly themeMode: 'auto' | 'light' | 'dark';
  readonly layout: SnChartLayoutPreset;
  readonly trigger: 'item' | 'axis';
  readonly precision: number;
  readonly legend: boolean;
  readonly palette: readonly string[];
}

/** One case definition. */
export interface ChartCaseDef {
  readonly id: string;
  readonly category: ChartCaseCategory;
  readonly type: ChartCaseType;
  readonly title: { readonly zh: string; readonly en: string };
  readonly blurb: { readonly zh: string; readonly en: string };
  /** Chart height in px. */
  readonly height: number;
  /** Stack the series (bar only). */
  readonly stack?: boolean | undefined;
  /** Full-circle progress gauge (gauge only). */
  readonly fullCircle?: boolean | undefined;
  /** Default palette — hex literals so the copied config is self-contained. */
  readonly palette: readonly string[];
  /** How many palette slots the panel lets the visitor edit (first N). */
  readonly paletteSlots: number;
  /** Gauge value. */
  readonly gaugeValue?: number | undefined;
  /** Which controls the panel shows for this type. */
  readonly supports: {
    readonly smooth: boolean;
    readonly rounded: boolean;
    readonly legend: boolean;
    readonly trigger: boolean;
  };
  readonly labels: { readonly zh: ChartCaseLabels; readonly en: ChartCaseLabels };
}

/** Quick-pick swatches shared by every palette picker in the panel. */
export const CHART_CASE_SWATCHES: readonly string[] = [
  '#2080f0',
  '#18a058',
  '#f0a020',
  '#d03050',
  '#8a5cf6',
  '#0ea5e9',
  '#36ad6a',
  '#f5713d',
];

export const CHART_CASES: readonly ChartCaseDef[] = [
  {
    id: 'line-basic',
    category: 'line',
    type: 'line',
    title: { zh: '基础折线', en: 'Basic line' },
    blurb: {
      zh: '单系列趋势，默认平滑（圆润）；切「同轴」可对比多系列。',
      en: 'One trend series, smooth by default; switch the trigger to axis to compare series.',
    },
    height: 300,
    palette: ['#2080f0'],
    paletteSlots: 1,
    supports: { smooth: true, rounded: false, legend: true, trigger: true },
    labels: {
      zh: {
        categories: ['一月', '二月', '三月', '四月', '五月', '六月'],
        series: [{ name: '新增用户', data: [820, 932, 901, 934, 1290, 1330] }],
      },
      en: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        series: [{ name: 'New users', data: [820, 932, 901, 934, 1290, 1330] }],
      },
    },
  },
  {
    id: 'line-multi',
    category: 'line',
    type: 'line',
    title: { zh: '多系列对比', en: 'Multi-series compare' },
    blurb: {
      zh: '两条折线各占一色；调色板逐槽可改。',
      en: 'Two lines, one colour each; every palette slot is editable.',
    },
    height: 300,
    palette: ['#f0a020', '#2080f0'],
    paletteSlots: 2,
    supports: { smooth: true, rounded: false, legend: true, trigger: true },
    labels: {
      zh: {
        categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        series: [
          { name: '最高气温', data: [11, 11, 15, 13, 12, 13, 10] },
          { name: '最低气温', data: [-2, 1, 2, 5, 3, 2, 0] },
        ],
      },
      en: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        series: [
          { name: 'High', data: [11, 11, 15, 13, 12, 13, 10] },
          { name: 'Low', data: [-2, 1, 2, 5, 3, 2, 0] },
        ],
      },
    },
  },
  {
    id: 'area-soft',
    category: 'area',
    type: 'area',
    title: { zh: '柔和面积', en: 'Soft area' },
    blurb: {
      zh: '面积用半透明填充（可复制、Token 友好），不依赖渐变对象。',
      en: 'The area uses a translucent fill (copyable and token-friendly), not gradient objects.',
    },
    height: 300,
    palette: ['#8a5cf6'],
    paletteSlots: 1,
    supports: { smooth: true, rounded: false, legend: true, trigger: true },
    labels: {
      zh: {
        categories: ['2月', '4月', '6月', '8月', '10月', '12月'],
        series: [{ name: '访问量', data: [320, 302, 341, 374, 390, 450] }],
      },
      en: {
        categories: ['Feb', 'Apr', 'Jun', 'Aug', 'Oct', 'Dec'],
        series: [{ name: 'Visits', data: [320, 302, 341, 374, 390, 450] }],
      },
    },
  },
  {
    id: 'area-multi',
    category: 'area',
    type: 'area',
    title: { zh: '多系列面积', en: 'Multi-series area' },
    blurb: {
      zh: '多条半透明面积叠加，适合构成趋势对比。',
      en: 'Several translucent areas stacked on one axis for composed trends.',
    },
    height: 300,
    palette: ['#2080f0', '#18a058', '#f0a020'],
    paletteSlots: 3,
    supports: { smooth: true, rounded: false, legend: true, trigger: true },
    labels: {
      zh: {
        categories: ['周一', '周二', '周三', '周四', '周五'],
        series: [
          { name: '类型 1', data: [120, 132, 101, 134, 90] },
          { name: '类型 2', data: [220, 182, 191, 234, 290] },
          { name: '类型 3', data: [150, 232, 201, 154, 190] },
        ],
      },
      en: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        series: [
          { name: 'Type 1', data: [120, 132, 101, 134, 90] },
          { name: 'Type 2', data: [220, 182, 191, 234, 290] },
          { name: 'Type 3', data: [150, 232, 201, 154, 190] },
        ],
      },
    },
  },
  {
    id: 'bar-group',
    category: 'bar',
    type: 'bar',
    title: { zh: '分组柱状', en: 'Grouped bars' },
    blurb: {
      zh: '默认圆角柱顶；关掉「圆角」对比直角效果。',
      en: 'Rounded bar tops by default; toggle rounding off to compare.',
    },
    height: 300,
    palette: ['#2080f0', '#18a058'],
    paletteSlots: 2,
    supports: { smooth: false, rounded: true, legend: true, trigger: true },
    labels: {
      zh: {
        categories: ['一月', '二月', '三月', '四月', '五月', '六月'],
        series: [
          { name: '类型 1', data: [260, 300, 240, 340, 270, 310] },
          { name: '类型 2', data: [180, 220, 200, 260, 230, 250] },
        ],
      },
      en: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        series: [
          { name: 'Type 1', data: [260, 300, 240, 340, 270, 310] },
          { name: 'Type 2', data: [180, 220, 200, 260, 230, 250] },
        ],
      },
    },
  },
  {
    id: 'bar-stack',
    category: 'bar',
    type: 'bar',
    title: { zh: '堆叠柱状', en: 'Stacked bars' },
    blurb: {
      zh: '堆叠时圆角只落在最上面一段，符合财务收支图的读法。',
      en: 'When stacked, rounding lands only on the top segment — the way revenue charts read.',
    },
    height: 320,
    stack: true,
    palette: ['#18a058', '#2080f0'],
    paletteSlots: 2,
    supports: { smooth: false, rounded: true, legend: true, trigger: true },
    labels: {
      zh: {
        categories: [
          '一月',
          '二月',
          '三月',
          '四月',
          '五月',
          '六月',
          '七月',
          '八月',
          '九月',
          '十月',
          '十一月',
          '十二月',
        ],
        series: [
          { name: '现金收入', data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330] },
          { name: '消费收入', data: [320, 302, 341, 374, 390, 450, 420, 332, 301, 334, 390, 330] },
        ],
      },
      en: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        series: [
          { name: 'Cash in', data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330] },
          { name: 'Spend', data: [320, 302, 341, 374, 390, 450, 420, 332, 301, 334, 390, 330] },
        ],
      },
    },
  },
  {
    id: 'bar-h',
    category: 'bar',
    type: 'barH',
    title: { zh: '横向条形排行', en: 'Horizontal ranking' },
    blurb: {
      zh: '类目在纵轴的排行条，圆角朝右；适合 TOP N。',
      en: 'A ranking with categories on the y-axis, rounded to the right — good for top-N lists.',
    },
    height: 300,
    palette: ['#2080f0'],
    paletteSlots: 1,
    supports: { smooth: false, rounded: true, legend: true, trigger: true },
    labels: {
      zh: {
        categories: ['哈尔滨', '呼和浩特', '上海', '北京', '深圳'],
        series: [{ name: '门店数', data: [56, 98, 186, 320, 420] }],
      },
      en: {
        categories: ['Harbin', 'Hohhot', 'Shanghai', 'Beijing', 'Shenzhen'],
        series: [{ name: 'Stores', data: [56, 98, 186, 320, 420] }],
      },
    },
  },
  {
    id: 'pie-ring',
    category: 'pie',
    type: 'pie',
    title: { zh: '环形占比', en: 'Doughnut share' },
    blurb: {
      zh: '环形 + 圆角扇区；tooltip 自带占比行。',
      en: 'A doughnut with rounded slices; the tooltip carries the share row.',
    },
    height: 320,
    palette: ['#2080f0', '#18a058', '#f0a020', '#d03050', '#8a5cf6'],
    paletteSlots: 3,
    supports: { smooth: false, rounded: true, legend: true, trigger: false },
    labels: {
      zh: {
        categories: ['股票', '基金', '债券', '现金', '其他'],
        series: [{ name: '资产配置', data: [484, 300, 234, 180, 120] }],
      },
      en: {
        categories: ['Stocks', 'Funds', 'Bonds', 'Cash', 'Other'],
        series: [{ name: 'Allocation', data: [484, 300, 234, 180, 120] }],
      },
    },
  },
  {
    id: 'pie-rose',
    category: 'pie',
    type: 'pie',
    title: { zh: '圆角玫瑰图', en: 'Rounded rose' },
    blurb: {
      zh: 'roseType 半径映射数值，扇区圆角 + 描边留缝。',
      en: 'roseType maps value to radius; rounded slices with a gap stroke.',
    },
    height: 320,
    palette: ['#8a5cf6', '#2080f0', '#18a058', '#f0a020'],
    paletteSlots: 3,
    supports: { smooth: false, rounded: true, legend: true, trigger: false },
    labels: {
      zh: {
        categories: ['品牌 A', '品牌 B', '品牌 C', '品牌 D', '品牌 E'],
        series: [{ name: '销量', data: [420, 320, 260, 200, 140] }],
      },
      en: {
        categories: ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E'],
        series: [{ name: 'Sales', data: [420, 320, 260, 200, 140] }],
      },
    },
  },
  {
    id: 'gauge-basic',
    category: 'gauge',
    type: 'gauge',
    title: { zh: '基础仪表盘', en: 'Basic gauge' },
    blurb: {
      zh: '进度弧 + 隐藏刻度，roundCap 让弧端圆润。',
      en: 'A progress arc with hidden ticks; roundCap keeps the arc ends round.',
    },
    height: 300,
    palette: ['#2080f0'],
    paletteSlots: 1,
    gaugeValue: 58,
    supports: { smooth: false, rounded: true, legend: false, trigger: false },
    labels: {
      zh: { categories: [], series: [{ name: '综合评分', data: [58] }] },
      en: { categories: [], series: [{ name: 'Score', data: [58] }] },
    },
  },
  {
    id: 'gauge-progress',
    category: 'gauge',
    type: 'gauge',
    title: { zh: '进度环', en: 'Progress ring' },
    blurb: {
      zh: '整圆进度（startAngle 90 → -270），适合健康分 / 完成度。',
      en: 'A full-circle progress (start 90 → -270) for scores and completion.',
    },
    height: 300,
    palette: ['#18a058'],
    paletteSlots: 1,
    gaugeValue: 92,
    fullCircle: true,
    supports: { smooth: false, rounded: true, legend: false, trigger: false },
    labels: {
      zh: { categories: [], series: [{ name: '完成度', data: [92] }] },
      en: { categories: [], series: [{ name: 'Completion', data: [92] }] },
    },
  },
];

/** Look up one case; throws on an unknown id so a typo fails loudly in dev. */
export function getChartCase(id: string): ChartCaseDef {
  const found = CHART_CASES.find((c) => c.id === id);
  if (!found) throw new Error(`[chart-cases] unknown case id: ${id}`);
  return found;
}

/** All cases of one category, in registry order. */
export function getCasesByCategory(category: ChartCaseCategory): readonly ChartCaseDef[] {
  return CHART_CASES.filter((c) => c.category === category);
}

/** Panel defaults for one case. */
export function createDefaultConfig(def: ChartCaseDef): ChartCaseConfig {
  return {
    rounded: true,
    smooth: true,
    themeMode: 'auto',
    layout: 'default',
    trigger: 'item',
    precision: 0,
    legend: true,
    palette: [...def.palette],
  };
}

/** Draft shape while building — plain and JSON-safe, ECharts-compatible. */
type OptionDraft = Record<string, unknown>;

/**
 * Build the ECharts option for one case under the current panel config.
 *
 * Pure: same inputs → same option. Deliberately JSON-safe (no gradient
 * objects, no formatter functions) so `buildCaseSnippet` can stringify it and
 * the copied config is exactly what renders here.
 */
export function buildCaseOption(
  def: ChartCaseDef,
  cfg: ChartCaseConfig,
  labels: ChartCaseLabels,
): SnEChartsOption {
  const radius = cfg.rounded;
  const draft: OptionDraft = {};

  // Legend: the switch maps straight onto the option. `false` is normalised to
  // `{ show: false }` by the wrapper (and stops reserving grid space); an
  // explicit `{ show: true }` keeps single-series cases (line-basic, pie)
  // showing their legend too, instead of relying on the >1-series heuristic.
  if (def.supports.legend) {
    draft['legend'] = cfg.legend ? { show: true } : false;
  }

  switch (def.type) {
    case 'line':
    case 'area': {
      draft['xAxis'] = { type: 'category', data: [...labels.categories] };
      draft['yAxis'] = { type: 'value' };
      draft['series'] = labels.series.map((s) => ({
        type: 'line',
        name: s.name,
        data: [...s.data],
        smooth: cfg.smooth,
        ...(def.type === 'area' ? { areaStyle: { opacity: 0.25 } } : {}),
      }));
      break;
    }
    case 'bar':
    case 'barH': {
      // Horizontal ranking swaps the axes: categories live on y.
      draft[def.type === 'barH' ? 'yAxis' : 'xAxis'] = {
        type: 'category',
        data: [...labels.categories],
      };
      draft[def.type === 'barH' ? 'xAxis' : 'yAxis'] = { type: 'value' };
      // Rounding follows the visual reading of the edge:
      //   - grouped bars → every bar's top edge is an outer edge, so every
      //     series rounds (a square neighbour bar would look broken);
      //   - stacked bars → only the topmost segment rounds; a rounded middle
      //     segment reads as a rendering bug;
      //   - horizontal ranking → the right end is the outer edge.
      const barRadius = def.type === 'barH' ? [0, 6, 6, 0] : [6, 6, 0, 0];
      draft['series'] = labels.series.map((s, index) => ({
        type: 'bar',
        name: s.name,
        data: [...s.data],
        ...(def.stack ? { stack: 'total' } : {}),
        itemStyle: {
          borderRadius: radius
            ? def.stack
              ? index === labels.series.length - 1
                ? barRadius
                : 0
              : barRadius
            : 0,
        },
      }));
      break;
    }
    case 'pie': {
      const values = labels.series[0]?.data ?? [];
      draft['series'] = [
        {
          type: 'pie',
          radius: ['48%', '72%'],
          ...(def.id === 'pie-rose' ? { roseType: 'radius' } : {}),
          itemStyle: { borderRadius: radius ? 8 : 0 },
          data: labels.categories.map((name, i) => ({ name, value: values[i] })),
        },
      ];
      break;
    }
    case 'gauge': {
      draft['series'] = [
        {
          type: 'gauge',
          ...(def.fullCircle ? { startAngle: 90, endAngle: -270 } : {}),
          min: 0,
          max: 100,
          progress: { show: true, width: 14, roundCap: radius },
          axisLine: { lineStyle: { width: 14 } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          pointer: { show: false },
          detail: { valueAnimation: true, offsetCenter: [0, 0], fontSize: 28 },
          data: [{ value: def.gaugeValue ?? 0, name: labels.series[0]?.name ?? '' }],
        },
      ];
      break;
    }
  }
  return draft as SnEChartsOption;
}

/**
 * The tooltip config the panel drives. Kept separate from the option because
 * it is a `SnChart` prop, not an option key — the wrapper composes it.
 */
export function buildCaseTooltip(cfg: ChartCaseConfig): Record<string, unknown> {
  return { trigger: cfg.trigger, precision: cfg.precision };
}

/**
 * The copyable, project-ready SFC for one case.
 *
 * Everything the visitor configured is baked into literal code: option,
 * theme palette, layout preset, tooltip and (when not `auto`) the theme mode.
 * Colours are literals by design — a snippet meant for another project cannot
 * rely on this docs site's token cascade.
 */
export function buildCaseSnippet(
  def: ChartCaseDef,
  cfg: ChartCaseConfig,
  labels: ChartCaseLabels,
): string {
  const option = buildCaseOption(def, cfg, labels);
  const tooltip = buildCaseTooltip(cfg);
  const lines: string[] = [
    '<script setup lang="ts">',
    "import { SnChart } from '@snui/echarts';",
    "import '@snui/echarts/styles';",
    '',
    `const option = ${JSON.stringify(option, null, 2)};`,
    '',
    `const theme = ${JSON.stringify({ palette: [...cfg.palette] }, null, 2)};`,
    `const layout = '${cfg.layout}';`,
    `const tooltip = ${JSON.stringify(tooltip, null, 2)};`,
    '</script>',
    '',
    '<template>',
    `  <SnChart`,
    '    :option="option"',
    '    :theme="theme"',
    '    :layout="layout"',
    '    :tooltip="tooltip"',
  ];
  if (cfg.themeMode !== 'auto') lines.push(`    theme-mode="${cfg.themeMode}"`);
  lines.push(`    :height="${def.height}"`);
  lines.push('  />');
  lines.push('</template>');
  return lines.join('\n');
}
