<script setup lang="ts">
/**
 * ChartCase — one live chart card with a config panel (per the /echarts/<category>
 * demo pages).
 *
 * Layout: title + blurb, the live `SnChart`, then the panel: property controls
 * (theme mode / layout / trigger / precision / legend / smooth / rounded) and
 * palette colour pickers, plus 复制配置 — one click copies a project-ready SFC
 * built by `buildCaseSnippet` from the *current* panel state.
 *
 * Why `not-merge`: the panel flips whole shapes (legend on/off, layout presets).
 * A merged `setOption` would leave the previous shape's keys behind — legend
 * toggled off could never come back. Full replacement keeps the preview honest;
 * ECharts re-animates from the new option, which is what a reader expects while
 * tuning.
 *
 * The chart itself is wrapped in ClientOnly (echarts needs a real canvas and a
 * real `getComputedStyle` cascade); the panel below is plain Vue and SSRs fine.
 */
import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import { useData } from 'vitepress';
import { SnChart } from '@snui/echarts';
import {
  SnButton,
  SnColorPicker,
  SnInputNumber,
  SnRadioGroup,
  SnSelect,
  SnSwitch,
} from '@snui/vue-web';
import {
  CHART_CASE_SWATCHES,
  buildCaseOption,
  buildCaseSnippet,
  buildCaseTooltip,
  createDefaultConfig,
  getChartCase,
  resolveCasePalette,
} from '../echarts/registry';
import type { ChartCaseConfig } from '../echarts/registry';

const props = defineProps<{
  /** Case id in the registry (`line-basic`, `bar-stack`, …). */
  id: string;
}>();

const def = getChartCase(props.id);

const { lang } = useData();
const isEn = computed(() => lang.value === 'en-US');

/** Bilingual chrome — data labels come from the registry's label packs. */
const t = computed(() =>
  isEn.value
    ? {
        config: 'Config',
        copy: 'Copy config',
        copied: 'Copied',
        reset: 'Reset',
        themeMode: 'Theme mode',
        auto: 'Auto',
        light: 'Light',
        dark: 'Dark',
        layout: 'Layout',
        trigger: 'Trigger',
        item: 'Item',
        axis: 'Axis',
        precision: 'Decimals',
        legend: 'Legend',
        smooth: 'Smooth',
        rounded: 'Rounded',
        palette: 'Palette',
      }
    : {
        config: '配置面板',
        copy: '复制配置',
        copied: '已复制',
        reset: '重置',
        themeMode: '主题模式',
        auto: '自动',
        light: '浅色',
        dark: '深色',
        layout: '布局预设',
        trigger: '触发方式',
        item: '逐项',
        axis: '同轴',
        precision: '小数位',
        legend: '图例',
        smooth: '平滑',
        rounded: '圆角',
        palette: '主题色',
      },
);

const cfg = reactive<ChartCaseConfig>(createDefaultConfig(def));

const labels = computed(() => (isEn.value ? def.labels.en : def.labels.zh));
const title = computed(() => (isEn.value ? def.title.en : def.title.zh));
const blurb = computed(() => (isEn.value ? def.blurb.en : def.blurb.zh));

const option = computed(() => buildCaseOption(def, cfg, labels.value));
/**
 * Theme prop for the chart.
 *
 * No slot picked → `{}`: the chart follows the UI library's theme — token
 * primary + fading tints — and re-renders when the host re-themes. Any picked
 * slot turns into an explicit `theme.palette` (unpicked slots fall back to the
 * case's curated colours).
 */
const theme = computed(() => {
  const palette = resolveCasePalette(def, cfg);
  return palette ? { palette } : {};
});
const tooltipCfg = computed(() => buildCaseTooltip(cfg));

const themeModeOptions = computed(() => [
  { label: t.value.auto, value: 'auto' },
  { label: t.value.light, value: 'light' },
  { label: t.value.dark, value: 'dark' },
]);
const triggerOptions = computed(() => [
  { label: t.value.item, value: 'item' },
  { label: t.value.axis, value: 'axis' },
]);
const layoutOptions = ['default', 'compact', 'spacious', 'fullscreen', 'minimal'];

/** Editable palette slots (capped by the case's series count at definition). */
const paletteSlots = computed(() => def.paletteSlots);

/** Normalise a picker emission: `null` (cleared) means "follow the theme". */
function pickPalette(slot: number, value: string | null): void {
  cfg.palette[slot - 1] = value ?? undefined;
}

function resetConfig(): void {
  Object.assign(cfg, createDefaultConfig(def));
}

const copied = ref(false);
let copyTimer: ReturnType<typeof setTimeout> | undefined;

onBeforeUnmount(() => {
  if (copyTimer !== undefined) clearTimeout(copyTimer);
});

async function copyConfig(): Promise<void> {
  const snippet = buildCaseSnippet(def, cfg, labels.value);
  try {
    await copyText(snippet);
    copied.value = true;
    if (copyTimer !== undefined) clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copied.value = false;
    }, 1600);
  } catch {
    // Clipboard unavailable (permissions / non-secure context) — fail quietly;
    // the panel still works, nothing is half-copied.
  }
}

/** Clipboard write with a legacy `execCommand` fallback for http contexts. */
async function copyText(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}
</script>

<template>
  <section :id="def.id" class="sn-chart-case">
    <header class="sn-chart-case__head">
      <div class="sn-chart-case__heading">
        <h3 class="sn-chart-case__title">{{ title }}</h3>
        <p class="sn-chart-case__blurb">{{ blurb }}</p>
      </div>
      <div class="sn-chart-case__actions">
        <SnButton size="small" @click="resetConfig">{{ t.reset }}</SnButton>
        <SnButton size="small" type="primary" @click="copyConfig">
          {{ copied ? t.copied : t.copy }}
        </SnButton>
      </div>
    </header>

    <div class="sn-chart-case__chart">
      <ClientOnly>
        <SnChart
          :option="option"
          :theme="theme"
          :theme-mode="cfg.themeMode"
          :layout="cfg.layout"
          :tooltip="tooltipCfg"
          :height="def.height"
          :not-merge="true"
          :aria-label="title"
        />
        <template #fallback>
          <div class="sn-chart-case__loading" :style="{ height: `${def.height}px` }" />
        </template>
      </ClientOnly>
    </div>

    <div class="sn-chart-case__panel" role="group" :aria-label="t.config">
      <div class="sn-chart-case__row">
        <span class="sn-chart-case__label">{{ t.themeMode }}</span>
        <SnRadioGroup v-model="cfg.themeMode" size="small" button :options="themeModeOptions" />
      </div>
      <div class="sn-chart-case__row">
        <span class="sn-chart-case__label">{{ t.layout }}</span>
        <SnSelect v-model="cfg.layout" :options="layoutOptions" />
      </div>
      <div v-if="def.supports.trigger" class="sn-chart-case__row">
        <span class="sn-chart-case__label">{{ t.trigger }}</span>
        <SnRadioGroup v-model="cfg.trigger" size="small" button :options="triggerOptions" />
      </div>
      <div class="sn-chart-case__row">
        <span class="sn-chart-case__label">{{ t.precision }}</span>
        <SnInputNumber v-model="cfg.precision" size="small" :min="0" :max="4" />
      </div>
      <div v-if="def.supports.legend" class="sn-chart-case__row">
        <span class="sn-chart-case__label">{{ t.legend }}</span>
        <SnSwitch v-model="cfg.legend" />
      </div>
      <div v-if="def.supports.smooth" class="sn-chart-case__row">
        <span class="sn-chart-case__label">{{ t.smooth }}</span>
        <SnSwitch v-model="cfg.smooth" />
      </div>
      <div v-if="def.supports.rounded" class="sn-chart-case__row">
        <span class="sn-chart-case__label">{{ t.rounded }}</span>
        <SnSwitch v-model="cfg.rounded" />
      </div>
      <div class="sn-chart-case__row sn-chart-case__row--wide">
        <span class="sn-chart-case__label">{{ t.palette }}</span>
        <div class="sn-chart-case__swatches">
          <SnColorPicker
            v-for="slot in paletteSlots"
            :key="slot"
            :model-value="cfg.palette[slot - 1] ?? null"
            size="small"
            :swatches="[...CHART_CASE_SWATCHES]"
            :aria-label="`${t.palette} ${slot}`"
            @update:model-value="(value) => pickPalette(slot, value)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sn-chart-case {
  margin: 20px 0;
  scroll-margin-top: 80px;
  padding: 16px 16px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
}

.sn-chart-case__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.sn-chart-case__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}

.sn-chart-case__blurb {
  margin: 2px 0 0;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--vp-c-text-3);
}

.sn-chart-case__actions {
  display: inline-flex;
  flex: none;
  gap: 8px;
}

.sn-chart-case__loading {
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

/* Panel: label + control rows that flow into columns on wide screens. */
.sn-chart-case__panel {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 10px 24px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--vp-c-divider);
}

.sn-chart-case__row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 32px;
}

.sn-chart-case__row--wide {
  grid-column: 1 / -1;
}

.sn-chart-case__label {
  flex: none;
  width: 58px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.sn-chart-case__swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
