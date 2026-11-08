<script setup lang="ts">
/**
 * ProWorkbench — 通用「工作台」统计页（布局无关，供各布局风格复用）。
 *
 * 参考稿是一张金融仪表盘（Finexis）：左上一张高亮的账户卡 + 一张「收入 / 支出」
 * 中性卡，右侧是交易记录表；下方是资金流水（面积 + 折线）与收入来源（环形）。
 *
 * ## 为什么放在布局包而不是页面里
 *
 * 三种布局（standard / classic / aurora）需要**同一份工作台**来演示「布局只负
 * 责壳、内容可以换」。放在这里，布局 demo 与宿主都能直接用它当起始页 —— 布局
 * 风格之间切换时，内容一像素不变，只有壳在变。
 *
 * ## 布局无关（这就是「通用」的含义）
 *
 * - 不假设任何壳的 class / 尺寸 / 背景：整块用 grid + 自己的 token 排布；
 * - 不假设色板来自壳：所有颜色都是 `--sn-pro-workbench-*` 钩子，默认 `--sn-web-*`
 *   token；壳（或宿主）可以整体改色而不用碰组件；
 * - 不假设数据来源：全部走 props，包内无请求 / 无 store / 无业务口径；
 * - 不假设图表库可用：`#chart` / `#income` 插槽可整替，缺 `@snui/echarts` 时宿主
 *   换掉即可（本包把它声明为 dependency，正常安装时无需关心）。
 *
 * ## 边界（ADR-0006）
 *
 * 只做「展示 + emit」：报告 / 转账 / 收款 / 周期 / 点行都只 emit，行为在宿主。
 *
 * 用法：
 *   <ProWorkbench :kpis="kpis" :money-flow="flow" :income-sources="sources"
 *                  :transactions="rows" @action="…" @range-change="…" />
 */
import { computed, ref } from 'vue';
import { ArrowDownRight, ArrowUpRight, Minus, Plus } from 'lucide-vue-next';
import { SnChart } from '@snui/echarts';
import type { SnEChartsOption } from '@snui/echarts';
import type {
  ProWorkbenchIncomeSource,
  ProWorkbenchKpi,
  ProWorkbenchKpiAction,
  ProWorkbenchMoneyFlow,
  ProWorkbenchTransaction,
  ProWorkbenchTransactionStatus,
} from './sn-pro-workbench-types';

defineOptions({ name: 'ProWorkbench' });

const props = withDefaults(
  defineProps<{
    /** Page heading. */
    title?: string | undefined;
    /** Secondary line under the heading. */
    subtitle?: string | undefined;
    /** KPI cards (rendered in order; the first one is the highlighted account card). */
    kpis?: ProWorkbenchKpi[] | undefined;
    /** Money-flow series (area + line). */
    moneyFlow?: ProWorkbenchMoneyFlow | undefined;
    /** Income breakdown (ring). */
    incomeSources?: ProWorkbenchIncomeSource[] | undefined;
    /** Transaction rows. */
    transactions?: ProWorkbenchTransaction[] | undefined;
    /** Selected period label of the flow chart. Omitted → the workbench keeps it internally. */
    flowRange?: string | undefined;
    /** Period options offered by the flow chart's select. */
    rangeOptions?: string[] | undefined;
    /** Copy of the primary heading action. */
    primaryActionText?: string | undefined;
    /** Copy of the secondary heading action. */
    secondaryActionText?: string | undefined;
    /** Heading of the flow chart. */
    flowTitle?: string | undefined;
    /** Heading of the income chart. */
    incomeTitle?: string | undefined;
    /** Heading of the transaction table. */
    transactionsTitle?: string | undefined;
    /** Table column copy — time / amount / category / status. */
    transactionsColumns?: string[] | undefined;
    /** Empty copy of the transaction table. */
    transactionsEmptyText?: string | undefined;
    /**
     * Render the built-in heading band. Set `false` when the surrounding shell
     * already prints the page title (the aurora style has its own title band), so
     * the page never shows the same heading twice.
     */
    showHeading?: boolean | undefined;
    /** Chart height in px (the flow chart; the ring uses it too). */
    chartHeight?: number | undefined;
  }>(),
  {
    title: '工作台',
    subtitle: '这里是今天的关键指标概览。',
    kpis: () => [],
    moneyFlow: undefined,
    incomeSources: () => [],
    transactions: () => [],
    // No default for `flowRange`: a default would make the select look
    // controlled forever and freeze the internal state (see `activeRange`).
    flowRange: undefined,
    rangeOptions: () => ['年度', '季度', '月度'],
    primaryActionText: '添加钱包',
    secondaryActionText: '创建报告',
    flowTitle: '资金流水',
    incomeTitle: '收入来源',
    transactionsTitle: '交易记录',
    transactionsColumns: () => ['时间', '金额', '分类', '状态'],
    transactionsEmptyText: '暂无交易记录',
    showHeading: true,
    chartHeight: 260,
  },
);

const emit = defineEmits<{
  /** A heading action was pressed (`primary` = 主行动, `secondary` = 次行动). */
  (e: 'action', kind: 'primary' | 'secondary'): void;
  /** A pill inside the accent KPI card was pressed. */
  (e: 'kpi-action', kpi: ProWorkbenchKpi, action: ProWorkbenchKpiAction): void;
  /** The flow chart's period select changed. */
  (e: 'range-change', range: string): void;
  /** A KPI card was activated (drill-down is the host's job). */
  (e: 'kpi-select', key: string | number, kpi: ProWorkbenchKpi): void;
  /** A transaction row was activated. */
  (e: 'transaction-select', key: string | number, row: ProWorkbenchTransaction): void;
}>();

defineSlots<{
  /** Extra title-band tools, after the built-in actions. */
  actions?(): unknown;
  /** KPI band replacement. */
  kpi?(): unknown;
  /** Money-flow chart replacement. */
  chart?(): unknown;
  /** Income-source chart replacement. */
  income?(): unknown;
  /** Transaction table replacement. */
  transactions?(): unknown;
}>();

// ── Heading ──────────────────────────────────────────────────────────────
/** The accent card is positional (the first KPI), so the rest are neutral. */
const accentKpi = computed<ProWorkbenchKpi | undefined>(() => props.kpis[0]);
const restKpis = computed<ProWorkbenchKpi[]>(() => props.kpis.slice(1));

// ── Money flow chart ─────────────────────────────────────────────────────
/**
 * Selected period. Controlled when the host passes `flowRange`; otherwise the
 * component owns it and starts on the first offered option.
 */
const innerRange = ref(props.flowRange ?? props.rangeOptions[0] ?? '');
const activeRange = computed(() => props.flowRange ?? innerRange.value);

function selectRange(range: string): void {
  innerRange.value = range;
  emit('range-change', range);
}

/**
 * Workbench chart palette — the reference's teal / periwinkle pair.
 *
 * The colours are **data**, not component styling: a chart theme cannot resolve
 * `var(--sn-web-*)` (zrender paints into a canvas, where a CSS variable is not
 * a colour), so the workbench pins its two series explicitly and passes
 * `colorSource: 'resolved'` to the chart. A host that wants the token palette
 * instead only has to replace these two hooks — or drop the whole chart into
 * the `#chart` slot.
 */
const FLOW_INCOME_COLOR = '#54bdb7';
const FLOW_EXPENSE_COLOR = '#8fa9e8';

/**
 * Two series over one category axis: 收入 as a filled area, 支出 as a thin line —
 * the reference's "wave" look.
 */
const flowOption = computed<SnEChartsOption>(() => {
  const flow = props.moneyFlow;
  if (flow === undefined) return {};
  return {
    color: [FLOW_INCOME_COLOR, FLOW_EXPENSE_COLOR],
    grid: { left: 0, right: 8, top: 20, bottom: 0, containLabel: true },
    legend: { show: false },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: flow.labels,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitNumber: 4,
      axisLabel: { fontSize: 11 },
    },
    series: [
      {
        type: 'line',
        name: flow.incomeName ?? '收入',
        smooth: true,
        showSymbol: false,
        areaStyle: { opacity: 0.22 },
        lineStyle: { width: 2, color: FLOW_INCOME_COLOR },
        itemStyle: { color: FLOW_INCOME_COLOR },
        emphasis: { focus: 'series' },
        data: flow.income,
      },
      {
        type: 'line',
        name: flow.expenseName ?? '支出',
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color: FLOW_EXPENSE_COLOR },
        itemStyle: { color: FLOW_EXPENSE_COLOR },
        emphasis: { focus: 'series' },
        data: flow.expense,
      },
    ],
  };
});

/** Legend shown above the flow chart — the series names, in order. */
const flowLegend = computed(() => [
  { key: 'income', label: props.moneyFlow?.incomeName ?? '收入' },
  { key: 'expense', label: props.moneyFlow?.expenseName ?? '支出' },
]);

/**
 * Chart theme handed to `SnChart`.
 *
 * `colorSource: 'resolved'` is deliberate: the chart paints into a canvas with
 * zrender, which cannot resolve a CSS custom property. Left on the default
 * ('tokens'), every axis / grid colour arrives as `var(--sn-web-...)` and
 * zrender silently keeps its black default — the chart renders, but all black.
 * The resolved source reads the same tokens off the document and passes
 * literals, so the workbench still follows the host's theme.
 */
const chartTheme = { colorSource: 'resolved' } as const;

// ── Income ring ──────────────────────────────────────────────────────────
/** Ring palette — teal ramp, matching the reference's single-hue donut. */
const INCOME_RING_COLORS = ['#3fae9f', '#7fd0c5', '#cdeae5'];

const incomeOption = computed<SnEChartsOption>(() => {
  if (props.incomeSources.length === 0) return {};
  return {
    color: [...INCOME_RING_COLORS],
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['52%', '78%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: { borderWidth: 3, borderColor: 'transparent' },
        label: { show: false },
        labelLine: { show: false },
        data: props.incomeSources.map((item) => ({ name: item.label, value: item.value })),
      },
    ],
  };
});

/** Percentage of the largest slice — the ring's centre figure in the reference. */
const topIncomeShare = computed(() => {
  const total = props.incomeSources.reduce((sum, item) => sum + item.value, 0);
  if (total <= 0) return 0;
  const max = Math.max(...props.incomeSources.map((item) => item.value));
  return Math.round((max / total) * 100);
});

// ── Transaction status ───────────────────────────────────────────────────
/** Built-in status copy (the layout is i18n-free: props override, zh defaults). */
const STATUS_TEXT: Record<ProWorkbenchTransactionStatus, string> = {
  success: '成功',
  failed: '失败',
  pending: '处理中',
};

function statusText(row: ProWorkbenchTransaction): string {
  return row.statusText ?? STATUS_TEXT[row.status];
}

// ── Emit helpers ─────────────────────────────────────────────────────────
function onKpi(index: number, kpi: ProWorkbenchKpi): void {
  emit('kpi-select', kpi.key ?? index, kpi);
}

function onKpiAction(kpi: ProWorkbenchKpi, action: ProWorkbenchKpiAction): void {
  emit('kpi-action', kpi, action);
}

function onTransaction(row: ProWorkbenchTransaction): void {
  emit('transaction-select', row.key, row);
}
</script>

<template>
  <section class="sn-pro-workbench">
    <!-- ── Heading ───────────────────────────────────────────────────── -->
    <header v-if="props.showHeading" class="sn-pro-workbench__head">
      <div class="sn-pro-workbench__heading">
        <h2 class="sn-pro-workbench__title">{{ props.title }}</h2>
        <p v-if="props.subtitle !== ''" class="sn-pro-workbench__subtitle">{{ props.subtitle }}</p>
      </div>

      <div class="sn-pro-workbench__head-actions">
        <slot name="actions">
          <button type="button" class="sn-pro-workbench__btn" @click="emit('action', 'secondary')">
            {{ props.secondaryActionText }}
          </button>
          <button
            type="button"
            class="sn-pro-workbench__btn sn-pro-workbench__btn--primary"
            @click="emit('action', 'primary')"
          >
            <Plus :size="15" aria-hidden="true" />
            {{ props.primaryActionText }}
          </button>
        </slot>
      </div>
    </header>

    <!-- ── Top grid: account card + neutral KPIs | transactions ──────── -->
    <div class="sn-pro-workbench__top">
      <slot name="kpi">
        <div class="sn-pro-workbench__kpis">
          <article
            v-if="accentKpi !== undefined"
            class="sn-pro-workbench__kpi sn-pro-workbench__kpi--accent"
            role="button"
            tabindex="0"
            :aria-label="`${accentKpi.label} ${accentKpi.value}`"
            @click="onKpi(0, accentKpi)"
            @keydown.enter="onKpi(0, accentKpi)"
          >
            <div class="sn-pro-workbench__kpi-top">
              <p class="sn-pro-workbench__kpi-label">{{ accentKpi.label }}</p>
            </div>
            <p class="sn-pro-workbench__kpi-value">{{ accentKpi.value }}</p>

            <p v-if="accentKpi.delta !== undefined" class="sn-pro-workbench__kpi-trend">
              <span
                class="sn-pro-workbench__kpi-delta"
                :class="`sn-pro-workbench__kpi-delta--${accentKpi.trend ?? 'flat'}`"
              >
                {{ accentKpi.delta }}
                <ArrowUpRight v-if="accentKpi.trend === 'up'" :size="12" aria-hidden="true" />
                <ArrowDownRight
                  v-else-if="accentKpi.trend === 'down'"
                  :size="12"
                  aria-hidden="true"
                />
                <Minus v-else :size="12" aria-hidden="true" />
              </span>
              <span v-if="accentKpi.hint" class="sn-pro-workbench__kpi-hint">{{
                accentKpi.hint
              }}</span>
            </p>

            <div v-if="(accentKpi.actions?.length ?? 0) > 0" class="sn-pro-workbench__kpi-actions">
              <button
                v-for="action in accentKpi.actions"
                :key="action.key"
                type="button"
                class="sn-pro-workbench__kpi-btn"
                @click.stop="onKpiAction(accentKpi, action)"
              >
                {{ action.label }}
              </button>
            </div>

            <div v-if="(accentKpi.stats?.length ?? 0) > 0" class="sn-pro-workbench__kpi-stats">
              <div
                v-for="stat in accentKpi.stats"
                :key="stat.key"
                class="sn-pro-workbench__kpi-stat"
              >
                <p class="sn-pro-workbench__kpi-stat-label">{{ stat.label }}</p>
                <p class="sn-pro-workbench__kpi-stat-value">{{ stat.value }}</p>
              </div>
            </div>

            <p v-if="accentKpi.footNote" class="sn-pro-workbench__kpi-foot">
              {{ accentKpi.footNote }}
            </p>
          </article>

          <div class="sn-pro-workbench__kpi-col">
            <article
              v-for="(kpi, index) in restKpis"
              :key="kpi.key ?? index"
              class="sn-pro-workbench__kpi sn-pro-workbench__kpi--plain"
              role="button"
              tabindex="0"
              :aria-label="`${kpi.label} ${kpi.value}`"
              @click="onKpi(index + 1, kpi)"
              @keydown.enter="onKpi(index + 1, kpi)"
            >
              <div class="sn-pro-workbench__kpi-top">
                <p class="sn-pro-workbench__kpi-label">{{ kpi.label }}</p>
              </div>
              <p class="sn-pro-workbench__kpi-value">{{ kpi.value }}</p>
              <p v-if="kpi.delta !== undefined" class="sn-pro-workbench__kpi-trend">
                <span
                  class="sn-pro-workbench__kpi-delta"
                  :class="`sn-pro-workbench__kpi-delta--${kpi.trend ?? 'flat'}`"
                >
                  {{ kpi.delta }}
                  <ArrowUpRight v-if="kpi.trend === 'up'" :size="12" aria-hidden="true" />
                  <ArrowDownRight v-else-if="kpi.trend === 'down'" :size="12" aria-hidden="true" />
                  <Minus v-else :size="12" aria-hidden="true" />
                </span>
                <span v-if="kpi.hint" class="sn-pro-workbench__kpi-hint">{{ kpi.hint }}</span>
              </p>
            </article>
          </div>
        </div>
      </slot>

      <section class="sn-pro-workbench__card sn-pro-workbench__card--table">
        <header class="sn-pro-workbench__card-head">
          <h3 class="sn-pro-workbench__card-title">{{ props.transactionsTitle }}</h3>
        </header>

        <slot name="transactions">
          <table v-if="props.transactions.length > 0" class="sn-pro-workbench__table">
            <thead>
              <tr>
                <th v-for="column in props.transactionsColumns" :key="column" scope="col">
                  {{ column }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in props.transactions"
                :key="row.key"
                tabindex="0"
                @click="onTransaction(row)"
                @keydown.enter="onTransaction(row)"
              >
                <td class="sn-pro-workbench__cell-time">{{ row.time }}</td>
                <td class="sn-pro-workbench__cell-amount">{{ row.amount }}</td>
                <td>{{ row.category }}</td>
                <td>
                  <span
                    class="sn-pro-workbench__status"
                    :class="`sn-pro-workbench__status--${row.status}`"
                  >
                    <span class="sn-pro-workbench__status-dot" aria-hidden="true" />
                    {{ statusText(row) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else class="sn-pro-workbench__empty">{{ props.transactionsEmptyText }}</p>
        </slot>
      </section>
    </div>

    <!-- ── Bottom grid: money flow | income ring ─────────────────────── -->
    <div class="sn-pro-workbench__bottom">
      <section class="sn-pro-workbench__card sn-pro-workbench__card--flow">
        <header class="sn-pro-workbench__card-head">
          <h3 class="sn-pro-workbench__card-title">{{ props.flowTitle }}</h3>
          <div class="sn-pro-workbench__card-tools">
            <ul class="sn-pro-workbench__legend-inline">
              <li
                v-for="item in flowLegend"
                :key="item.key"
                class="sn-pro-workbench__legend-inline-item"
              >
                <span
                  class="sn-pro-workbench__legend-dot"
                  :class="`sn-pro-workbench__legend-dot--${item.key}`"
                  aria-hidden="true"
                />
                {{ item.label }}
              </li>
            </ul>

            <div class="sn-pro-workbench__segmented" role="group" aria-label="周期">
              <button
                v-for="range in props.rangeOptions"
                :key="range"
                type="button"
                class="sn-pro-workbench__range"
                :class="{ 'sn-pro-workbench__range--on': range === activeRange }"
                :aria-pressed="range === activeRange"
                @click="selectRange(range)"
              >
                {{ range }}
              </button>
            </div>
          </div>
        </header>

        <div class="sn-pro-workbench__chart">
          <slot name="chart">
            <SnChart
              v-if="props.moneyFlow !== undefined"
              :option="flowOption"
              :theme="chartTheme"
              :height="props.chartHeight"
              layout="compact"
              :aria-label="props.flowTitle"
            />
          </slot>
        </div>
      </section>

      <section class="sn-pro-workbench__card sn-pro-workbench__card--income">
        <header class="sn-pro-workbench__card-head">
          <h3 class="sn-pro-workbench__card-title">{{ props.incomeTitle }}</h3>
        </header>

        <div class="sn-pro-workbench__ring">
          <slot name="income">
            <template v-if="props.incomeSources.length > 0">
              <SnChart
                :option="incomeOption"
                :theme="chartTheme"
                :height="props.chartHeight"
                layout="compact"
                :aria-label="props.incomeTitle"
              />
              <div class="sn-pro-workbench__ring-centre">
                <span class="sn-pro-workbench__ring-value">{{ topIncomeShare }}%</span>
              </div>
            </template>
          </slot>
        </div>

        <ul class="sn-pro-workbench__legend">
          <li
            v-for="item in props.incomeSources"
            :key="item.key"
            class="sn-pro-workbench__legend-item"
          >
            <span class="sn-pro-workbench__legend-label">{{ item.label }}</span>
            <span class="sn-pro-workbench__legend-value">{{ item.display ?? item.value }}</span>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>

<style scoped>
/*
 * Every colour is a shell-level hook with a token/`color-mix()` default, so a
 * layout (or an ancestor) can re-point the whole workbench without touching it.
 */
.sn-pro-workbench {
  --sn-pro-workbench-surface: var(--sn-web-color-background-elevated);
  /* Card surface. Default = opaque token surface; a glass shell (aurora)
   * re-points these two to make every module a floating pane, so module
   * boundaries stay visible instead of blurring into one slab. */
  --sn-pro-workbench-card: var(--sn-pro-workbench-surface);
  --sn-pro-workbench-card-border: transparent;
  --sn-pro-workbench-card-blur: none;
  --sn-pro-workbench-card-shadow: none;
  --sn-pro-workbench-soft: var(--sn-web-color-background-subtle);
  --sn-pro-workbench-border: var(--sn-web-color-border-subtle);
  --sn-pro-workbench-ink: #23203c;
  --sn-pro-workbench-accent: #4fb3ae;
  --sn-pro-workbench-accent-ink: #0b3b38;
  --sn-pro-workbench-radius: 18px;

  display: flex;
  flex-direction: column;
  gap: var(--sn-web-spacing-4);
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
}

/* ── Heading ───────────────────────────────────────────────────────────── */
.sn-pro-workbench__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sn-web-spacing-4);
  flex-wrap: wrap;
}

.sn-pro-workbench__heading {
  min-width: 0;
}

.sn-pro-workbench__title {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--sn-web-color-text-primary);
}

.sn-pro-workbench__subtitle {
  margin: 6px 0 0;
  color: var(--sn-web-color-text-tertiary);
  font-size: var(--sn-web-font-size-sm);
}

.sn-pro-workbench__head-actions {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
  flex-shrink: 0;
}

.sn-pro-workbench__btn {
  display: inline-flex;
  align-items: center;
  gap: var(--sn-web-spacing-1);
  height: 34px;
  padding: 0 16px;
  border: 1px solid var(--sn-pro-workbench-border);
  border-radius: 999px;
  background: transparent;
  color: var(--sn-web-color-text-secondary);
  font-size: var(--sn-web-font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    color 160ms ease,
    background-color 160ms ease;
}

.sn-pro-workbench__btn:hover {
  border-color: var(--sn-pro-workbench-ink);
  color: var(--sn-web-color-text-primary);
}

.sn-pro-workbench__btn--primary {
  border-color: transparent;
  background: var(--sn-pro-workbench-accent);
  color: #ffffff;
  font-weight: 600;
}

.sn-pro-workbench__btn--primary:hover {
  border-color: transparent;
  background: color-mix(in srgb, var(--sn-pro-workbench-accent) 88%, var(--sn-pro-workbench-ink));
  color: #ffffff;
}

.sn-pro-workbench__btn:focus-visible,
.sn-pro-workbench__kpi:focus-visible,
.sn-pro-workbench__range:focus-visible,
.sn-pro-workbench__kpi-btn:focus-visible,
.sn-pro-workbench__table tbody tr:focus-visible {
  outline: 2px solid var(--sn-pro-workbench-ink);
  outline-offset: 2px;
}

/* ── Grids ─────────────────────────────────────────────────────────────── */
/*
 * Top grid mirrors the reference: the KPI cluster keeps the left ~2/3 and the
 * transaction list the right ~1/3. `minmax(0, …)` is what stops the table's
 * `nowrap` cells from pushing the grid wider than the panel.
 */
.sn-pro-workbench__top {
  display: grid;
  grid-template-columns: minmax(0, 1.9fr) minmax(0, 1fr);
  gap: var(--sn-web-spacing-3);
  align-items: start;
}

.sn-pro-workbench__bottom {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: var(--sn-web-spacing-3);
  align-items: start;
}

@media (max-width: 1080px) {
  .sn-pro-workbench__top,
  .sn-pro-workbench__bottom {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* ── KPI band ──────────────────────────────────────────────────────────── */
.sn-pro-workbench__kpis {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: var(--sn-web-spacing-3);
  align-items: stretch;
}

/* The neutral column stacks 收入 / 支出 in one card, like the reference. */
.sn-pro-workbench__kpi-col {
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-spacing-3);
  box-sizing: border-box;
  min-width: 0;
  /*
   * Stretch to the account card's height so both top cards share one baseline,
   * and push the two rows apart so the taller column reads as one balanced card
   * rather than a short card with dead space under it.
   */
  justify-content: space-between;
  height: 100%;
  padding: var(--sn-web-spacing-4) var(--sn-web-spacing-5);
  border: 1px solid var(--sn-pro-workbench-card-border);
  border-radius: var(--sn-pro-workbench-radius);
  background: var(--sn-pro-workbench-soft);
  backdrop-filter: var(--sn-pro-workbench-card-blur);
  -webkit-backdrop-filter: var(--sn-pro-workbench-card-blur);
  box-shadow: var(--sn-pro-workbench-card-shadow);
}

.sn-pro-workbench__kpis > .sn-pro-workbench__kpi--plain {
  padding: var(--sn-web-spacing-4) var(--sn-web-spacing-5);
  border-radius: var(--sn-pro-workbench-radius);
  background: var(--sn-pro-workbench-soft);
}

.sn-pro-workbench__kpi {
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-sizing: border-box;
  min-width: 0;
  border-radius: var(--sn-pro-workbench-radius);
  cursor: pointer;
}

/* The first KPI is the highlighted account card of the reference. */
.sn-pro-workbench__kpi--accent {
  padding: var(--sn-web-spacing-4) var(--sn-web-spacing-5);
  background: linear-gradient(158deg, #7fd2cc 0%, #54bdb7 46%, #2f9f99 100%);
  color: var(--sn-pro-workbench-accent-ink);
  box-shadow: 0 16px 34px -26px rgba(17, 94, 89, 0.9);
}

.sn-pro-workbench__kpi--accent:hover {
  background: linear-gradient(158deg, #78cec8 0%, #4fb9b2 46%, #2b9a94 100%);
}

.sn-pro-workbench__kpi-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sn-pro-workbench__kpi-label {
  margin: 0;
  color: var(--sn-web-color-text-tertiary);
  font-size: 12px;
  font-weight: 600;
}

.sn-pro-workbench__kpi--accent .sn-pro-workbench__kpi-label {
  color: rgba(6, 48, 45, 0.72);
}

.sn-pro-workbench__kpi-value {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--sn-web-color-text-primary);
}

.sn-pro-workbench__kpi--accent .sn-pro-workbench__kpi-value {
  color: #06312e;
}

.sn-pro-workbench__kpi-trend {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
  margin: 0;
  font-size: 12px;
}

.sn-pro-workbench__kpi-delta {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(6, 48, 45, 0.16);
  color: #06312e;
  font-weight: 700;
}

.sn-pro-workbench__kpi-delta--up {
  background: color-mix(in srgb, #2f7d24 18%, transparent);
  color: #25601c;
}

.sn-pro-workbench__kpi--accent .sn-pro-workbench__kpi-delta--up {
  background: #ffffff;
  color: #0b3b38;
}

.sn-pro-workbench__kpi-delta--down {
  background: color-mix(in srgb, #c2452f 18%, transparent);
  color: #a33522;
}

.sn-pro-workbench__kpi-hint {
  color: var(--sn-web-color-text-tertiary);
}

.sn-pro-workbench__kpi--accent .sn-pro-workbench__kpi-hint {
  color: rgba(6, 48, 45, 0.62);
}

.sn-pro-workbench__kpi-actions {
  display: flex;
  gap: var(--sn-web-spacing-2);
  margin-top: var(--sn-web-spacing-2);
}

/* Pills in the accent card: white + ink, exactly like the reference. */
.sn-pro-workbench__kpi-btn {
  flex: 1 1 0;
  height: 34px;
  padding: 0 14px;
  border: 1px solid rgba(6, 48, 45, 0.2);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.28);
  color: #06312e;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 160ms ease;
}

.sn-pro-workbench__kpi-btn:hover {
  background: rgba(255, 255, 255, 0.56);
}

/* Secondary figures (总收益 / 利率) sit on a tinted footer strip. */
.sn-pro-workbench__kpi-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--sn-web-spacing-3);
  margin-top: var(--sn-web-spacing-2);
  padding-top: var(--sn-web-spacing-3);
  border-top: 1px solid rgba(6, 48, 45, 0.16);
}

.sn-pro-workbench__kpi-stat {
  min-width: 0;
}

.sn-pro-workbench__kpi-stat-label {
  margin: 0;
  color: rgba(6, 48, 45, 0.66);
  font-size: 11px;
  font-weight: 600;
}

.sn-pro-workbench__kpi-stat-value {
  margin: 2px 0 0;
  color: #06312e;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.sn-pro-workbench__kpi-foot {
  margin: var(--sn-web-spacing-2) 0 0;
  color: rgba(6, 48, 45, 0.55);
  font-size: 11px;
}

/* ── Cards ─────────────────────────────────────────────────────────────── */
.sn-pro-workbench__card {
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-spacing-2);
  box-sizing: border-box;
  min-width: 0;
  padding: var(--sn-web-spacing-4) var(--sn-web-spacing-5);
  border: 1px solid var(--sn-pro-workbench-card-border);
  border-radius: var(--sn-pro-workbench-radius);
  background: var(--sn-pro-workbench-card);
  backdrop-filter: var(--sn-pro-workbench-card-blur);
  -webkit-backdrop-filter: var(--sn-pro-workbench-card-blur);
  box-shadow: var(--sn-pro-workbench-card-shadow);
}

.sn-pro-workbench__card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sn-web-spacing-3);
  flex-wrap: wrap;
  min-height: 30px;
}

.sn-pro-workbench__card-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--sn-web-color-text-primary);
}

.sn-pro-workbench__card-tools {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-3);
  flex-wrap: wrap;
}

/* Inline legend of the flow chart (收入 / 支出). */
.sn-pro-workbench__legend-inline {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.sn-pro-workbench__legend-inline-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--sn-web-color-text-tertiary);
  font-size: 12px;
  white-space: nowrap;
}

.sn-pro-workbench__legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.sn-pro-workbench__legend-dot--income {
  background: #54bdb7;
}

.sn-pro-workbench__legend-dot--expense {
  background: #7fa6e8;
}

/* Segmented period switch (年度 / 季度 / 月度). */
.sn-pro-workbench__segmented {
  display: inline-flex;
  gap: 2px;
  padding: 2px;
  border-radius: 999px;
  background: var(--sn-pro-workbench-soft);
}

.sn-pro-workbench__range {
  height: 26px;
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--sn-web-color-text-tertiary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.sn-pro-workbench__range--on {
  background: var(--sn-pro-workbench-surface);
  color: var(--sn-web-color-text-primary);
  box-shadow: 0 1px 2px rgba(24, 24, 46, 0.08);
}

.sn-pro-workbench__chart {
  min-width: 0;
}

/* ── Income ring ───────────────────────────────────────────────────────── */
.sn-pro-workbench__ring {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.sn-pro-workbench__ring-centre {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  pointer-events: none;
}

.sn-pro-workbench__ring-value {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--sn-web-color-text-primary);
}

.sn-pro-workbench__legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: var(--sn-web-spacing-3);
  margin: 0;
  padding: var(--sn-web-spacing-3) 0 0;
  border-top: 1px solid var(--sn-pro-workbench-border);
  list-style: none;
}

.sn-pro-workbench__legend-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.sn-pro-workbench__legend-label {
  color: var(--sn-web-color-text-tertiary);
  font-size: 11px;
}

.sn-pro-workbench__legend-value {
  color: var(--sn-web-color-text-primary);
  font-size: 13px;
  font-weight: 700;
}

/* ── Transactions ──────────────────────────────────────────────────────── */
.sn-pro-workbench__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.sn-pro-workbench__table th {
  padding: 8px 0;
  color: var(--sn-web-color-text-tertiary);
  font-size: 11px;
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
}

.sn-pro-workbench__table td {
  padding: 11px 0;
  border-top: 1px solid var(--sn-pro-workbench-border);
  color: var(--sn-web-color-text-primary);
  white-space: nowrap;
}

.sn-pro-workbench__table tbody tr {
  cursor: pointer;
}

.sn-pro-workbench__table tbody tr:hover {
  background: var(--sn-pro-workbench-soft);
}

.sn-pro-workbench__cell-time {
  color: var(--sn-web-color-text-tertiary);
}

.sn-pro-workbench__cell-amount {
  font-weight: 600;
}

/* Status: colored dot + label, not a filled badge (the reference's look). */
.sn-pro-workbench__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
}

.sn-pro-workbench__status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.sn-pro-workbench__status--success {
  color: #2f7d24;
}

.sn-pro-workbench__status--success .sn-pro-workbench__status-dot {
  background: #4bbf3f;
}

.sn-pro-workbench__status--failed {
  color: #b23b2a;
}

.sn-pro-workbench__status--failed .sn-pro-workbench__status-dot {
  background: #e05742;
}

.sn-pro-workbench__status--pending {
  color: var(--sn-web-color-text-secondary);
}

.sn-pro-workbench__status--pending .sn-pro-workbench__status-dot {
  background: currentColor;
}

.sn-pro-workbench__empty {
  margin: 0;
  padding: var(--sn-web-spacing-4) 0;
  color: var(--sn-web-color-text-tertiary);
  font-size: 12px;
}
</style>
