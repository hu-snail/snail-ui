<script setup lang="ts">
/**
 * SnHomeSceneDemo — 首页「场景案例」里 **组件场景**卡的内容。
 *
 * 对应设计稿的六块（表单综合套件 / 日期时间选择器 / 资产与指标统计 /
 * 色彩调配引擎 / 列表拖拽与看板流 / 可视化分析图表），外加两个扩展场景
 * （视频播放器 / 轮播横幅）。
 *
 * 所有交互控件都是真实组件，一张不手写模拟：
 *   - 表单      → SnInput / SnRadioGroup / SnCheckboxGroup / SnInputNumber / SnButton
 *   - 日期时间  → SnDatePicker（真实日期选择器 + 快捷预设）/ SnTimePicker
 *   - 资产指标  → SnStatistic / SnSlider / SnTag / SnButton
 *   - 色彩      → SnColorPicker（内嵌面板）/ SnProgress
 *   - 看板拖拽  → SnDragSort（真实 HTML5 DnD + 键盘移动，手柄拖拽）
 *   - 图表      → SnChart（@snui/echarts，真实 ECharts 双曲线，复用站点图表注册表）
 *   - 视频      → SnVideoPlayer
 *   - 轮播      → SnCarousel（数据驱动 slides）
 * 因此切换 Style Pack 会即时换肤、站点暗色自动跟随 —— 组件内部只读
 * `--sn-web-*` token，本文件的局部样式也一律走同一套 token。
 *
 * 唯一手绘的是「微折线」这类纯装饰图形（占位性插画），线条取 token 主色。
 */
import { computed, h, ref } from 'vue';
import { useData } from 'vitepress';
import { SnChart } from '@snui/echarts';
import {
  SnButton,
  SnCarousel,
  SnCheckbox,
  SnCheckboxGroup,
  SnColorPicker,
  SnDataTable,
  SnDatePicker,
  SnDragSort,
  SnInput,
  SnInputNumber,
  SnProgress,
  SnRadio,
  SnRadioGroup,
  SnSlider,
  SnStatistic,
  SnTag,
  SnTimePicker,
  SnVideoPlayer,
} from '@snui/vue-web';
import {
  buildCaseOption,
  buildCaseTooltip,
  createDefaultConfig,
  getChartCase,
} from '../echarts/registry';
import { caseCopy } from '../utils/home-cases';

const props = defineProps<{ id: string }>();

const { lang } = useData();
const isEn = computed(() => lang.value === 'en-US');
const t = computed(() => caseCopy(isEn.value ? 'en' : 'zh'));

/** 字典值是 `string | (…args) => string`，取纯文本用这个收口。 */
const txt = (key: string): string => String(t.value[key] ?? '');

/* ── #01 表单综合套件 ── */
const domain = ref('studio-snail');
const hostMode = ref<string | number | boolean>('cloud');
const syncAbilities = ref<Array<string | number | boolean>>(['figma', 'mcp']);
const tokenQuota = ref(4096);

/* ── #04 日期时间选择器 ── */
const DAY = 24 * 60 * 60 * 1000;
/** 固定基准日：SSR 与客户端一致（水合安全）；快捷预设的取值是惰性函数，
 *  点击时才读当前时间，因此不会带进渲染结果。 */
const BASE_DAY = new Date('2025-06-15T00:00:00').getTime();
const dayStart = (): number => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
const dateValue = ref<number | null>(BASE_DAY);
const rangeValue = ref<[number, number] | null>([BASE_DAY, BASE_DAY + 6 * DAY]);
const timeValue = ref<number | null>(BASE_DAY + 14.5 * 60 * 60 * 1000);
const dateShortcuts = computed(() =>
  [txt('presetToday'), txt('presetYesterday'), txt('preset7d'), txt('preset30d')].map(
    (label, i) => ({
      label,
      value: (): number => dayStart() - [0, 1, 6, 29][i] * DAY,
    }),
  ),
);

/* ── #02 资产与指标统计 ── */
const assetRatio = ref(58);

/* ── #05 色彩调配引擎 ── */
const brandColor = ref('#3B82F6');
const swatches = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'];

/* ── 数据表格（扩展场景：真实 SnDataTable） ── */
/** 状态徽标：列定义用 `render` 返回真实 SnTag（表格没有列插槽）。 */
const tableColumns = computed(() => {
  const status = [
    { label: txt('statusDone'), type: 'success' as const },
    { label: txt('statusDoing'), type: 'info' as const },
    { label: txt('statusTodo'), type: 'warning' as const },
  ];
  return [
    { title: txt('colTask'), key: 'task' },
    { title: txt('colOwner'), key: 'owner', width: 72 },
    {
      title: txt('colStatus'),
      key: 'status',
      width: 86,
      render: (row: Record<string, unknown>) => {
        const i = Number(row.keyIndex ?? 0);
        return h(
          SnTag,
          { size: 'small', round: true, type: status[i]?.type ?? 'default' },
          () => status[i]?.label ?? '',
        );
      },
    },
  ];
});
const tableRows = computed(() =>
  [txt('tableRow1'), txt('tableRow2'), txt('tableRow3')].map((task, i) => ({
    key: `row-${i}`,
    keyIndex: i,
    task,
    owner: txt('tableOwner'),
  })),
);

/* ── #12 列表拖拽与看板流（真实 SnDragSort） ── */
const kanbanTasks = computed(() => [
  {
    key: 'design-token-pipeline',
    title: txt('kanbanTask1Title'),
    meta: txt('kanbanTask1Meta'),
    tag: txt('kanbanProg'),
    type: 'primary' as const,
  },
  {
    key: 'error-monitoring',
    title: txt('kanbanTask2Title'),
    meta: txt('kanbanTask2Meta'),
    tag: txt('kanbanReview'),
    type: 'default' as const,
  },
  {
    key: 'onboarding-flow',
    title: 'Redesign onboarding flow',
    meta: 'Revamp the 3-step onboarding',
    tag: txt('kanbanTodo'),
    type: 'error' as const,
  },
]);

/* ── #03 可视化分析图表（真实 SnChart / ECharts） ── */
const chartDef = getChartCase('line-multi');
/** `trigger: 'axis'` —— 整列都能触发（设计稿的拟态 tooltip 气泡），
 *  默认的 `'item'` 要精确命中折线上的点，卡片这么小几乎点不到。
 *  注意 tooltip 是 SnChart 的独立 prop（不进 option），见模板 `:tooltip`。 */
const chartCfg = { ...createDefaultConfig(chartDef), legend: false, trigger: 'axis' as const };
const chartTooltip = buildCaseTooltip(chartCfg);
/** 语言中立的日期轴（与设计稿 tooltip 的 04-18 同形），系列名走双语字典。 */
const chartLabels = computed(() => ({
  categories: ['04-14', '04-15', '04-16', '04-17', '04-18', '04-19', '04-20'],
  series: [
    { name: txt('chartActual'), data: [3120, 3480, 3260, 4020, 4812, 4460, 5100] },
    { name: txt('chartBase'), data: [2980, 3050, 3120, 3400, 3950, 4100, 4280] },
  ],
}));
const chartOption = computed(() => buildCaseOption(chartDef, chartCfg, chartLabels.value));

/* ── 视频播放器（扩展场景） ── */
const VIDEO_SRC =
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4';
const VIDEO_POSTER = 'https://picsum.photos/seed/snui-video-cover/800/450';

/* ── 轮播（扩展场景） ── */
const slidePhotos = [
  'https://picsum.photos/seed/snui-carousel-1/800/400',
  'https://picsum.photos/seed/snui-carousel-2/800/400',
  'https://picsum.photos/seed/snui-carousel-3/800/400',
];
const carouselSlides = computed(() =>
  [1, 2, 3].map((n, i) => ({
    type: 'image' as const,
    src: slidePhotos[i],
    alt: txt(`carouselSlide${n}`),
    title: txt(`carouselSlide${n}`),
    description: txt(`carouselSlide${n}Desc`),
  })),
);
</script>

<template>
  <!-- ─────────── #01 表单综合套件 ─────────── -->
  <div v-if="props.id === 'form'" class="sn-scene">
    <!-- 复合输入：前后缀用 SnInput 的左右插槽 -->
    <div class="sn-scene__field">
      <span class="sn-scene__field-head">
        <span class="sn-scene__label">{{ t.domainLabel }}</span>
        <span class="sn-scene__ok">● {{ t.domainOk }}</span>
      </span>
      <div class="sn-scene__affix">
        <span class="sn-scene__affix-text">https://</span>
        <SnInput v-model="domain" size="small" :aria-label="txt('domainLabel')" />
        <span class="sn-scene__affix-text">.aui.design</span>
      </div>
    </div>

    <!-- 云端/私有：真实 SnRadioGroup（单选） -->
    <div class="sn-scene__field">
      <span class="sn-scene__label">{{ t.hostLabel }}</span>
      <SnRadioGroup v-model="hostMode" size="small" :options="[]">
        <SnRadio value="cloud" :label="txt('hostCloud')" size="small" />
        <SnRadio value="private" :label="txt('hostPrivate')" size="small" />
      </SnRadioGroup>
    </div>

    <!-- 复选 + 步进器：真实 SnCheckboxGroup / SnInputNumber -->
    <div class="sn-scene__grid2">
      <div class="sn-scene__panel">
        <span class="sn-scene__panel-head">
          <span class="sn-scene__label">{{ t.syncLabel }}</span>
          <span class="sn-scene__link">{{ t.selectAll }}</span>
        </span>
        <SnCheckboxGroup v-model="syncAbilities" size="small">
          <SnCheckbox value="figma" :label="txt('syncFigma')" size="small" />
          <SnCheckbox value="mcp" :label="txt('syncMcp')" size="small" />
        </SnCheckboxGroup>
      </div>
      <div class="sn-scene__panel">
        <span class="sn-scene__label">{{ t.quotaLabel }}</span>
        <SnInputNumber
          v-model="tokenQuota"
          size="small"
          :step="512"
          :min="512"
          :max="32768"
          show-button
          :aria-label="txt('quotaLabel')"
        />
        <span class="sn-scene__hint">{{ t.quotaStep }}</span>
      </div>
    </div>

    <div class="sn-scene__actions">
      <SnButton type="primary" size="small" block>{{ t.saveConfig }}</SnButton>
      <SnButton size="small">{{ t.reset }}</SnButton>
    </div>
  </div>

  <!-- ─────────── #04 日期时间选择器（真实 SnDatePicker） ─────────── -->
  <div v-else-if="props.id === 'datetime'" class="sn-scene">
    <!-- 单日 + 区间：真实 SnDatePicker，快捷预设走组件自带 shortcuts -->
    <div class="sn-scene__field">
      <span class="sn-scene__label">{{ t.timeLabel }}</span>
      <SnDatePicker
        v-model="dateValue"
        size="small"
        clearable
        :shortcuts="dateShortcuts"
        shortcuts-position="left"
        :aria-label="txt('timeLabel')"
      />
    </div>

    <div class="sn-scene__field">
      <span class="sn-scene__label">{{ t.statLabel }}</span>
      <SnDatePicker
        v-model="rangeValue"
        type="daterange"
        size="small"
        clearable
        :start-placeholder="txt('presetToday')"
        :end-placeholder="txt('preset30d')"
      />
    </div>

    <div class="sn-scene__time-row">
      <SnTimePicker
        v-model="timeValue"
        size="small"
        format="HH:mm"
        :aria-label="txt('timeLabel')"
      />
      <SnButton type="primary" size="small">{{ t.confirm }}</SnButton>
    </div>
  </div>

  <!-- ─────────── #02 资产与指标统计 ─────────── -->
  <div v-else-if="props.id === 'stats'" class="sn-scene">
    <div class="sn-scene__stat-card">
      <span class="sn-scene__stat-head">
        <span class="sn-scene__label">{{ t.statLabel }}</span>
        <SnTag size="small" round type="success">↑ 3.5%</SnTag>
      </span>
      <SnStatistic value="2,441" tabular-nums />
      <!-- 装饰性微折线（线条取 token 主色） -->
      <svg
        class="sn-scene__spark"
        viewBox="0 0 130 50"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 0,42 Q 20,38 35,40 T 60,25 T 85,28 T 105,12 T 130,8"
          fill="none"
          stroke="var(--sn-web-color-action-primary, #1677ff)"
          stroke-width="2.5"
          stroke-linecap="round"
        />
      </svg>
    </div>

    <div class="sn-scene__ratio">
      <span class="sn-scene__field-head">
        <span class="sn-scene__label">{{ t.ratioLabel }}</span>
        <span class="sn-scene__hint">{{ t.ratioValue }}</span>
      </span>
      <SnSlider v-model="assetRatio" :min="0" :max="100" :step="1" />
    </div>

    <div class="sn-scene__actions">
      <SnButton size="small" block>{{ t.transfer }}</SnButton>
      <SnButton size="small" block>{{ t.withdraw }}</SnButton>
      <SnButton type="primary" size="small" block>{{ t.deepAnalyze }}</SnButton>
    </div>
  </div>

  <!-- ─────────── 数据表格（扩展场景：真实 SnDataTable） ─────────── -->
  <div v-else-if="props.id === 'table'" class="sn-scene">
    <div class="sn-scene__field-head">
      <span class="sn-scene__label">{{ t.tableLabel }}</span>
      <span class="sn-scene__hint">{{ t.tableCount }}</span>
    </div>
    <SnDataTable
      :columns="tableColumns"
      :data="tableRows"
      size="small"
      :bordered="false"
      :bottom-bordered="false"
      :pagination="false"
      :row-key="(row: Record<string, unknown>) => String(row.key)"
    />
  </div>

  <!-- ─────────── #05 色彩调配引擎 ─────────── -->
  <div v-else-if="props.id === 'color'" class="sn-scene">
    <!-- 真实 SnColorPicker 内嵌面板（panelOnly）；SV 尺寸收到卡片尺度 -->
    <div class="sn-scene__color-panel">
      <SnColorPicker v-model="brandColor" panel-only size="small" :swatches="swatches" />
    </div>
    <div class="sn-scene__color-foot">
      <span class="sn-scene__mono">{{ brandColor.toUpperCase() }}</span>
      <span class="sn-scene__swatches">
        <span
          v-for="c in swatches"
          :key="c"
          class="sn-scene__swatch"
          :style="{ background: c }"
          :aria-label="c"
        />
      </span>
    </div>
    <SnProgress :percentage="76" :height="6" :show-indicator="false" />
  </div>

  <!-- ─────────── #12 列表拖拽与看板流（真实 SnDragSort） ─────────── -->
  <div v-else-if="props.id === 'kanban'" class="sn-scene">
    <!-- 浮起主卡（设计稿的 Kanban 悬浮卡） -->
    <div class="sn-scene__kanban-hero">
      <span class="sn-scene__kanban-head">
        <span class="sn-scene__kanban-title">Redesign onboarding flow</span>
        <SnTag size="small" round type="error">{{ t.kanbanTodo }}</SnTag>
      </span>
      <p class="sn-scene__kanban-desc">Revamp the 3-step onboarding to reduce drop-off rate</p>
      <span class="sn-scene__kanban-meta">
        <span>💬 5</span>
        <span>📎 2</span>
        <span class="sn-scene__kanban-avatar" />
      </span>
    </div>

    <!-- 真实 SnDragSort：手柄拖拽（HTML5 DnD）+ 键盘上下移动 -->
    <SnDragSort v-model="kanbanTasks" handle direction="vertical" class="sn-scene__drag">
      <template #item="{ item }">
        <span class="sn-scene__kanban-body">
          <span class="sn-scene__kanban-title">{{ item.title }}</span>
          <span class="sn-scene__hint">{{ item.meta }}</span>
        </span>
        <SnTag size="small" round :type="item.type">{{ item.tag }}</SnTag>
      </template>
    </SnDragSort>
  </div>

  <!-- ─────────── #03 可视化分析图表（真实 SnChart） ─────────── -->
  <div v-else-if="props.id === 'chart'" class="sn-scene">
    <div class="sn-scene__chart-head">
      <span class="sn-scene__legend">
        <span class="sn-scene__legend-dot" />
        {{ t.chartActual }}
        <span class="sn-scene__legend-dot sn-scene__legend-dot--muted" />
        {{ t.chartBase }}
      </span>
      <SnTag size="small" round type="primary">{{ t.chartWeek }}</SnTag>
    </div>

    <!-- ECharts（@snui/echarts）：平滑双曲线 + 拟态 tooltip，配色走站点 token -->
    <div class="sn-scene__chart">
      <ClientOnly>
        <SnChart
          :option="chartOption"
          :height="158"
          :not-merge="true"
          theme-mode="auto"
          :tooltip="chartTooltip"
          :aria-label="txt('chartWeek')"
        />
        <template #fallback>
          <div class="sn-scene__chart-skeleton" />
        </template>
      </ClientOnly>
    </div>

    <div class="sn-scene__stat-row">
      <SnStatistic :label="txt('chartActual')" value="4,812" tabular-nums />
      <SnStatistic :label="txt('chartBase')" value="3,950" tabular-nums />
    </div>
  </div>

  <!-- ─────────── 视频播放器（扩展场景） ─────────── -->
  <div v-else-if="props.id === 'video'" class="sn-scene">
    <div class="sn-scene__video">
      <SnVideoPlayer
        :src="VIDEO_SRC"
        :poster="VIDEO_POSTER"
        :title="txt('videoCap')"
        muted
        loop
        preload="metadata"
      />
    </div>
    <div class="sn-scene__video-meta">
      <span class="sn-scene__label">{{ t.videoCap }}</span>
      <span class="sn-scene__video-tags">
        <SnTag size="small" round>{{ t.videoSpeed }}</SnTag>
        <SnTag size="small" round type="info">{{ t.videoTip }}</SnTag>
      </span>
    </div>
  </div>

  <!-- ─────────── 轮播（扩展场景） ─────────── -->
  <div v-else-if="props.id === 'carousel'" class="sn-scene">
    <div class="sn-scene__carousel">
      <SnCarousel
        :options="carouselSlides"
        autoplay
        draggable
        :interval="1800"
        dot-placement="bottom"
        show-arrow
        style="height: 100%"
      />
    </div>
    <div class="sn-scene__carousel-foot">
      <span class="sn-scene__label">{{ t.carouselFoot }}</span>
      <SnTag size="small" round type="warning">3 slides</SnTag>
    </div>
  </div>
</template>

<style scoped>
/* 全部取色走 token（--sn-web-*）：换肤 / 暗色自动跟随。 */
.sn-scene {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  color: var(--sn-web-color-text-primary, #09090b);
}

/* ── 通用件 ── */
.sn-scene__label {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--sn-web-color-text-secondary, #71717a);
}
.sn-scene__hint {
  font-size: 10.5px;
  line-height: 1.45;
  color: var(--sn-web-color-text-tertiary, #a1a1aa);
}
.sn-scene__mono {
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 11px;
  font-weight: 700;
}
.sn-scene__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sn-scene__field-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.sn-scene__ok {
  font-size: 10.5px;
  color: var(--sn-web-color-feedback-success, #22c55e);
}
.sn-scene__link {
  font-size: 10.5px;
  color: var(--sn-web-color-action-primary, #1677ff);
}
.sn-scene__grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.sn-scene__panel {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 9px;
  border: 1px solid var(--sn-web-color-border-subtle, #e4e4e7);
  border-radius: 12px;
  background: var(--sn-web-color-background-subtle, #f4f4f5);
}
.sn-scene__panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.sn-scene__actions {
  display: flex;
  gap: 8px;
}
.sn-scene__actions :deep(.sn-button) {
  flex: 1;
}

/* ── #01 复合输入前后缀 ── */
.sn-scene__affix {
  display: flex;
  align-items: center;
  gap: 4px;
}
.sn-scene__affix :deep(.sn-input) {
  flex: 1;
}
.sn-scene__affix-text {
  flex-shrink: 0;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 11px;
  color: var(--sn-web-color-text-tertiary, #a1a1aa);
}

/* ── #04 日期时间：表单件拉满整宽 ── */
.sn-scene__field :deep(.sn-date-picker),
.sn-scene__time-row :deep(.sn-time-picker) {
  width: 100%;
}
.sn-scene__time-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sn-scene__time-row :deep(.sn-time-picker) {
  flex: 1;
}

/* ── #02 资产与指标 ── */
.sn-scene__stat-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 11px;
  border: 1px solid var(--sn-web-color-border-subtle, #e4e4e7);
  border-radius: 12px;
  background: var(--sn-web-color-background-surface, #ffffff);
}
.sn-scene__stat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.sn-scene__spark {
  width: 100%;
  height: 40px;
}
.sn-scene__ratio {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* ── #05 色彩 ── */
.sn-scene__color-panel {
  /* 组件面板默认按整页尺度（SV 区 180px）；卡片里收小，贴合设计稿比例。 */
  --sn-web-color-picker-sv-size: 104px;
  padding: 9px;
  border: 1px solid var(--sn-web-color-border-subtle, #e4e4e7);
  border-radius: 12px;
  background: var(--sn-web-color-background-surface, #ffffff);
}
.sn-scene__color-panel :deep(.sn-color-picker) {
  width: 100%;
}
.sn-scene__color-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.sn-scene__swatches {
  display: flex;
  gap: 6px;
}
.sn-scene__swatch {
  width: 18px;
  height: 18px;
  border: 1px solid var(--sn-web-color-border-subtle, #e4e4e7);
  border-radius: 50%;
}

/* ── #12 看板 ── */
.sn-scene__kanban-hero {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 11px;
  border: 1px solid var(--sn-web-color-border-subtle, #e4e4e7);
  border-radius: 14px;
  background: var(--sn-web-color-background-surface, #ffffff);
  box-shadow: 0 8px 20px -10px rgb(15 23 42 / 0.18);
  transform: rotate(-0.5deg);
}
.sn-scene__kanban-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.sn-scene__drag {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sn-scene__drag :deep(.sn-drag-sort__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 11px;
  border: 1px solid var(--sn-web-color-border-subtle, #e4e4e7);
  border-radius: 12px;
  background: var(--sn-web-color-background-subtle, #f4f4f5);
}
.sn-scene__drag :deep(.sn-drag-sort__item--dragging) {
  border-color: color-mix(in srgb, var(--sn-web-color-action-primary, #1677ff) 45%, transparent);
  background: var(--sn-web-color-background-surface, #ffffff);
}
.sn-scene__drag :deep(.sn-drag-sort__handle) {
  color: var(--sn-web-color-text-tertiary, #a1a1aa);
}
.sn-scene__drag :deep(.sn-drag-sort__content) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex: 1;
  min-width: 0;
}
.sn-scene__kanban-body {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.sn-scene__kanban-title {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--sn-web-color-text-primary, #09090b);
}
.sn-scene__kanban-desc {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--sn-web-color-text-tertiary, #a1a1aa);
}
.sn-scene__kanban-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 5px;
  border-top: 1px solid var(--sn-web-color-border-subtle, #e4e4e7);
  font-size: 10.5px;
  color: var(--sn-web-color-text-tertiary, #a1a1aa);
}
.sn-scene__kanban-avatar {
  width: 18px;
  height: 18px;
  margin-left: auto;
  border-radius: 50%;
  background: linear-gradient(135deg, #22d3ee, #3b82f6);
}

/* ── #03 图表 ── */
.sn-scene__chart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.sn-scene__legend {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--sn-web-color-text-secondary, #71717a);
}
.sn-scene__legend-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--sn-web-color-action-primary, #1677ff);
}
.sn-scene__legend-dot--muted {
  margin-left: 6px;
  background: color-mix(in srgb, var(--sn-web-color-action-primary, #1677ff) 45%, transparent);
}
.sn-scene__chart {
  width: 100%;
}
.sn-scene__chart-skeleton {
  height: 158px;
  border-radius: 12px;
  background: var(--sn-web-color-background-subtle, #f4f4f5);
}
.sn-scene__stat-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--sn-web-color-border-subtle, #e4e4e7);
}

/* ── 视频播放器 ── */
.sn-scene__video {
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
}
.sn-scene__video :deep(.sn-video-player) {
  width: 100%;
}
.sn-scene__video-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.sn-scene__video-tags {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* ── 轮播 ── */
.sn-scene__carousel {
  height: 168px;
  overflow: hidden;
  border-radius: 12px;
}
.sn-scene__carousel-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
</style>
