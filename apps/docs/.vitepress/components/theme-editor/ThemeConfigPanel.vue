<script setup lang="ts">
/**
 * ThemeConfigPanel — 主题编辑器左侧配置栏。
 *
 * 布局对照 veanui 主题编辑器：视口分段（Web / uni-app x） → 明暗模式 →
 * 调色板 / 主色 / 辅助色 / 强调色 / 碳色 → 反馈色 → 尺寸 / 间距 →
 * 字体（无衬线 / 衬线 / 等宽 / 标题）→ 圆角 / 边框透明度 / 表面风格 → 重置。
 *
 * ## 控件一律用 `@snui/vue-web` 自己的组件
 *
 * 面板是「设计系统的调试台」，它本身就应该由被调试的那套组件构成：
 * `SnColorPicker`（取色 + 色板 + 面板）、`SnSelect`（枚举）、
 * `SnInputNumber`（精确数值）、`SnSlider`（连续值）、`SnRadioGroup`（模式）、
 * `SnButton`（动作）。这样面板的观感、键盘行为、焦点环与组件文档完全一致，
 * 也顺带验证了这些组件在真实组合下的表现。
 *
 * ## 面板的视觉不走被编辑的主题
 *
 * 配置栏用 `--vp-c-*`（站点 chrome）而不是 `--sn-web-*`：用户把品牌色改成
 * 任何值，面板本身都必须保持可读、可辨认。预览区才反映主题。
 */

import { computed } from 'vue';
import { ChevronsUpDown, RotateCcw, Sparkles } from 'lucide-vue-next';
import {
  SnButton,
  SnColorPicker,
  SnInputNumber,
  SnRadioGroup,
  SnSelect,
  SnSlider,
  SnSwitch,
} from '@snui/vue-web';
import type { SnRadioOption, SnSelectOption } from '@snui/vue-web';
import { buildRamp, normalizeHex } from '../../utils/theme-editor/palette';
import {
  FONT_OPTIONS,
  PALETTE_NAMES,
  SIZE_OPTIONS,
  SPACING_OPTIONS,
  type PaletteName,
  type SizeName,
  type SpacingName,
  type ThemeEditorConfig,
  type ThemeMode,
} from '../../utils/theme-editor/vars';
import { allPacks, packToConfigPatch } from '../../utils/theme-editor/library';
import { PRESETS, type ThemePreset } from '../../utils/theme-editor/state';

/** 编辑器视口。`web` 渲染真实 web 组件；`uni` 渲染手机模拟器。 */
export type ThemeEnd = 'web' | 'uni';

interface Props {
  config: ThemeEditorConfig;
  end: ThemeEnd;
  /** 配置是否偏离站点默认（决定重置按钮可用性）。 */
  dirty?: boolean;
  /** 英文界面。 */
  english?: boolean;
}
const props = withDefaults(defineProps<Props>(), { dirty: false, english: false });

const emit = defineEmits<{
  (e: 'update:config', patch: Partial<ThemeEditorConfig>): void;
  (e: 'update:end', value: ThemeEnd): void;
  (e: 'reset'): void;
}>();

const t = (zh: string, en: string): string => (props.english ? en : zh);

// ─── 分段 / 模式 / 枚举 ────────────────────────────────────────────────────

const endOptions = computed<SnRadioOption[]>(() => [
  { label: 'Web', value: 'web' },
  { label: 'uni-app x', value: 'uni' },
]);

const modeOptions = computed<SnRadioOption[]>(() => [
  { label: t('浅色', 'Light'), value: 'light' },
  { label: t('深色', 'Dark'), value: 'dark' },
  { label: t('跟随', 'Auto'), value: 'auto' },
]);

const paletteOptions: SnSelectOption[] = PALETTE_NAMES.map((name) => ({
  label: name,
  value: name,
}));

const sizeOptions: SnSelectOption[] = SIZE_OPTIONS.map((o) => ({ label: o.label, value: o.value }));
const spacingOptions: SnSelectOption[] = SPACING_OPTIONS.map((o) => ({
  label: o.label,
  value: o.value,
}));
const fontOptions: SnSelectOption[] = FONT_OPTIONS.map((o) => ({
  label: o.label,
  value: o.value,
}));

/** 反馈色槽位（顺序即 UI 顺序）。 */
const feedbackSlots = computed<Array<{ key: keyof ThemeEditorConfig['feedback']; label: string }>>(
  () => [
    { key: 'danger', label: t('危险', 'Danger') },
    { key: 'success', label: t('成功', 'Success') },
    { key: 'warning', label: t('警告', 'Warning') },
    { key: 'info', label: t('信息', 'Info') },
  ],
);

/** 字体槽位。 */
const fontSlots = computed<Array<{ key: keyof ThemeEditorConfig['fonts']; label: string }>>(() => [
  { key: 'sans', label: t('无衬线', 'Sans') },
  { key: 'serif', label: t('衬线', 'Serif') },
  { key: 'mono', label: t('等宽', 'Mono') },
  { key: 'heading', label: t('标题', 'Heading') },
]);

/** 主色三档（主色控件旁的色带预览）。 */
const brandSwatches = computed<string[]>(() => {
  const ramp = buildRamp(props.config.brand);
  return [ramp[500], ramp[600], ramp[900]];
});

/** 调色板三档（基础色控件旁）。 */
const paletteSwatches = computed<string[]>(() => {
  const ramp = buildRamp(
    {
      zinc: '#71717a',
      slate: '#64748b',
      stone: '#78716c',
      neutral: '#737373',
      gray: '#6b7280',
    }[props.config.palette],
  );
  return [ramp[200], ramp[400], ramp[700]];
});

/** 每个取色器的预设色板（给出常用值，减少取色成本）。 */
const SWATCHES = [
  '#ff4d24',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#0ea5e9',
  '#2563eb',
  '#7c3aed',
  '#ec4899',
  '#ef4444',
  '#27272a',
  '#71717a',
  '#e5e5e5',
];

/**
 * 内置主题 = `@snui/style-packs` 的官方 Pack（default / ios / doodle / dark）。
 *
 * 每张卡显示 Pack 主色 + 一句话描述；点击后把 Pack 的 theme/style 反推回
 * 编辑器槽位（见 `packToConfigPatch`），在此基础上继续自定义。
 */
const BUILT_IN_PACKS = allPacks.map((pack) => ({
  name: pack.name,
  label: pack.label,
  description: pack.description ?? '',
  // Pack 主色：theme.semantic.action.primary（default / dark 包没有显式
  // theme 覆盖时回退到库默认蓝）。
  color: pack.theme?.semantic?.action?.primary ?? '#1677ff',
}));

function applyBuiltIn(packName: string): void {
  const patch = packToConfigPatch(packName);
  if (patch) update(patch);
}

function update(patch: Partial<ThemeEditorConfig>): void {
  emit('update:config', patch);
}

/** 色值提交：归一化后再下发，避免半截输入污染预览。 */
function commitColor(key: 'brand' | 'secondary' | 'accent' | 'carbon', raw: string | null): void {
  if (!raw) return;
  update({ [key]: normalizeHex(raw, props.config[key]) } as Partial<ThemeEditorConfig>);
}

function commitFeedback(key: keyof ThemeEditorConfig['feedback'], raw: string | null): void {
  if (!raw) return;
  update({ feedback: { [key]: normalizeHex(raw, props.config.feedback[key]) } });
}

function commitFont(key: keyof ThemeEditorConfig['fonts'], raw: string | number | null): void {
  if (raw === null) return;
  update({ fonts: { [key]: String(raw) } });
}

function onEnd(value: unknown): void {
  if (value === 'web' || value === 'uni') emit('update:end', value);
}

function onMode(value: unknown): void {
  if (value === 'light' || value === 'dark' || value === 'auto') {
    update({ mode: value as ThemeMode });
  }
}

function onPalette(value: unknown): void {
  update({ palette: value as PaletteName });
}

function onSize(value: unknown): void {
  update({ size: value as SizeName });
}

function onSpacing(value: unknown): void {
  update({ spacing: value as SpacingName });
}

function onRadius(value: number | [number, number] | null): void {
  if (typeof value === 'number') update({ radius: Number(value.toFixed(3)) });
}

function onBorderAlpha(value: number | [number, number] | null): void {
  if (typeof value === 'number') update({ borderAlpha: Math.round(value) });
}

function onPreset(preset: ThemePreset): void {
  update({ brand: preset.brand, palette: preset.palette, radius: preset.radius });
}
</script>

<template>
  <aside class="sn-theme-panel" :class="{ 'is-en': english }">
    <!-- 视口分段：两端共用一份配置，切换只决定「预览哪一端」 -->
    <div class="sn-theme-panel__section">
      <div class="sn-theme-panel__label">{{ t('预览端', 'Preview end') }}</div>
      <SnRadioGroup
        button
        size="small"
        name="sn-theme-end"
        class="sn-theme-panel__wide"
        :model-value="end"
        :options="endOptions"
        :aria-label="t('预览端', 'Preview end')"
        @update:model-value="onEnd"
      />
    </div>

    <!-- 主题风格：官方内置主题 + 品牌预设，合并为一个菜单（需求：主题风格合并成一个菜单） -->
    <div class="sn-theme-panel__section">
      <div class="sn-theme-panel__label">
        <Sparkles :size="12" />
        {{ t('主题风格', 'Theme styles') }}
      </div>
      <!-- 官方内置主题（@snui/style-packs），点选后在其上继续自定义 -->
      <div class="sn-theme-panel__packs">
        <button
          v-for="pack in BUILT_IN_PACKS"
          :key="pack.name"
          type="button"
          class="sn-theme-panel__pack"
          :title="pack.description"
          @click="applyBuiltIn(pack.name)"
        >
          <span class="sn-theme-panel__pack-dot" :style="{ background: pack.color }" />
          <span class="sn-theme-panel__pack-text">
            <strong>{{ pack.label }}</strong>
            <small>{{ pack.description }}</small>
          </span>
        </button>
      </div>
      <!-- 品牌预设（快捷品牌色组合） -->
      <div class="sn-theme-panel__presets">
        <button
          v-for="preset in PRESETS"
          :key="preset.name"
          type="button"
          class="sn-theme-panel__preset"
          :class="{ 'is-active': config.brand === preset.brand }"
          :title="preset.label"
          @click="onPreset(preset)"
        >
          <span class="sn-theme-panel__preset-dot" :style="{ background: preset.brand }" />
          {{ preset.label }}
        </button>
      </div>
    </div>

    <!-- 模式 -->
    <div class="sn-theme-panel__section">
      <div class="sn-theme-panel__label">{{ t('模式', 'Mode') }}</div>
      <SnRadioGroup
        button
        size="small"
        name="sn-theme-mode"
        class="sn-theme-panel__wide"
        :model-value="config.mode"
        :options="modeOptions"
        :aria-label="t('模式', 'Mode')"
        @update:model-value="onMode"
      />
    </div>

    <!-- 调色板 -->
    <div class="sn-theme-panel__section">
      <div class="sn-theme-panel__label">{{ t('调色板', 'Palette') }}</div>

      <div class="sn-theme-panel__row">
        <span class="sn-theme-panel__row-label">{{ t('基础色', 'Base') }}</span>
        <div class="sn-theme-panel__control">
          <span class="sn-theme-panel__dots" aria-hidden="true">
            <span
              v-for="(c, i) in paletteSwatches"
              :key="i"
              class="sn-theme-panel__dot"
              :style="{ background: c }"
            />
          </span>
          <SnSelect
            size="small"
            :value="config.palette"
            :options="paletteOptions"
            :aria-label="t('基础色', 'Base colour')"
            @update:model-value="onPalette"
          />
          <ChevronsUpDown :size="12" class="sn-theme-panel__chevron" />
        </div>
      </div>

      <div class="sn-theme-panel__row">
        <span class="sn-theme-panel__row-label">{{ t('主色', 'Primary') }}</span>
        <div class="sn-theme-panel__control sn-theme-panel__control--color">
          <span class="sn-theme-panel__dots" aria-hidden="true">
            <span
              v-for="(c, i) in brandSwatches"
              :key="i"
              class="sn-theme-panel__dot"
              :style="{ background: c }"
            />
          </span>
          <SnColorPicker
            size="small"
            :model-value="config.brand"
            :swatches="SWATCHES"
            :aria-label="t('主色', 'Primary colour')"
            @update:model-value="commitColor('brand', $event)"
          />
        </div>
      </div>

      <div class="sn-theme-panel__row">
        <span class="sn-theme-panel__row-label">{{ t('辅助色', 'Secondary') }}</span>
        <div class="sn-theme-panel__control sn-theme-panel__control--color">
          <SnColorPicker
            size="small"
            :model-value="config.secondary"
            :swatches="SWATCHES"
            :aria-label="t('辅助色', 'Secondary colour')"
            @update:model-value="commitColor('secondary', $event)"
          />
        </div>
      </div>

      <div class="sn-theme-panel__row">
        <span class="sn-theme-panel__row-label">{{ t('强调色', 'Accent') }}</span>
        <div class="sn-theme-panel__control sn-theme-panel__control--color">
          <SnColorPicker
            size="small"
            :model-value="config.accent"
            :swatches="SWATCHES"
            :aria-label="t('强调色', 'Accent colour')"
            @update:model-value="commitColor('accent', $event)"
          />
        </div>
      </div>

      <div class="sn-theme-panel__row">
        <span class="sn-theme-panel__row-label">{{ t('碳色', 'Carbon') }}</span>
        <div class="sn-theme-panel__control sn-theme-panel__control--color">
          <SnColorPicker
            size="small"
            :model-value="config.carbon"
            :swatches="SWATCHES"
            :aria-label="t('碳色', 'Carbon colour')"
            @update:model-value="commitColor('carbon', $event)"
          />
        </div>
      </div>
    </div>

    <!-- 反馈色 -->
    <div class="sn-theme-panel__section">
      <div class="sn-theme-panel__label">{{ t('反馈', 'Feedback') }}</div>
      <div v-for="slot in feedbackSlots" :key="slot.key" class="sn-theme-panel__row">
        <span class="sn-theme-panel__row-label">{{ slot.label }}</span>
        <div class="sn-theme-panel__control sn-theme-panel__control--color">
          <SnColorPicker
            size="small"
            :model-value="config.feedback[slot.key]"
            :swatches="SWATCHES"
            :aria-label="slot.label"
            @update:model-value="commitFeedback(slot.key, $event)"
          />
        </div>
      </div>
    </div>

    <!-- 尺寸 / 间距 -->
    <div class="sn-theme-panel__section">
      <div class="sn-theme-panel__row">
        <span class="sn-theme-panel__row-label">{{ t('尺寸', 'Size') }}</span>
        <div class="sn-theme-panel__control">
          <SnSelect
            size="small"
            :value="config.size"
            :options="sizeOptions"
            :aria-label="t('尺寸', 'Size')"
            @update:model-value="onSize"
          />
          <ChevronsUpDown :size="12" class="sn-theme-panel__chevron" />
        </div>
      </div>

      <div class="sn-theme-panel__row">
        <span class="sn-theme-panel__row-label">{{ t('间距', 'Spacing') }}</span>
        <div class="sn-theme-panel__control">
          <SnSelect
            size="small"
            :value="config.spacing"
            :options="spacingOptions"
            :aria-label="t('间距', 'Spacing')"
            @update:model-value="onSpacing"
          />
          <ChevronsUpDown :size="12" class="sn-theme-panel__chevron" />
        </div>
      </div>
    </div>

    <!-- 字体 -->
    <div class="sn-theme-panel__section">
      <div class="sn-theme-panel__label">{{ t('字体', 'Fonts') }}</div>
      <div v-for="slot in fontSlots" :key="slot.key" class="sn-theme-panel__row">
        <span class="sn-theme-panel__row-label">{{ slot.label }}</span>
        <div class="sn-theme-panel__control">
          <SnSelect
            size="small"
            :value="config.fonts[slot.key]"
            :options="fontOptions"
            :aria-label="slot.label"
            @update:model-value="(v: unknown) => commitFont(slot.key, v as string)"
          />
          <ChevronsUpDown :size="12" class="sn-theme-panel__chevron" />
        </div>
      </div>
    </div>

    <!-- 形状 -->
    <div class="sn-theme-panel__section">
      <div class="sn-theme-panel__slider-row">
        <span class="sn-theme-panel__row-label">{{ t('圆角', 'Radius') }}</span>
        <div class="sn-theme-panel__slider">
          <SnSlider
            :model-value="config.radius"
            :min="0"
            :max="1.5"
            :step="0.025"
            :aria-label="t('圆角', 'Radius')"
            @update:model-value="onRadius"
          />
        </div>
        <span class="sn-theme-panel__slider-value">{{ config.radius }}rem</span>
      </div>

      <div class="sn-theme-panel__slider-row">
        <span class="sn-theme-panel__row-label">{{ t('边框透明度', 'Border alpha') }}</span>
        <div class="sn-theme-panel__slider">
          <SnSlider
            :model-value="config.borderAlpha"
            :min="0"
            :max="100"
            :step="1"
            :aria-label="t('边框透明度', 'Border alpha')"
            @update:model-value="onBorderAlpha"
          />
        </div>
        <span class="sn-theme-panel__slider-value">{{ config.borderAlpha }}%</span>
      </div>

      <div class="sn-theme-panel__row">
        <span class="sn-theme-panel__row-label">{{ t('表面风格', 'Surface') }}</span>
        <div class="sn-theme-panel__control sn-theme-panel__control--switch">
          <span class="sn-theme-panel__switch-label">
            {{ config.surface === 'layered' ? t('层叠', 'Layered') : t('扁平', 'Flat') }}
          </span>
          <SnSwitch
            size="small"
            :model-value="config.surface === 'layered'"
            :checked-value="true"
            :unchecked-value="false"
            :aria-label="t('表面风格', 'Surface style')"
            @update:model-value="
              (v: unknown) => update({ surface: v === true ? 'layered' : 'flat' })
            "
          />
        </div>
      </div>
    </div>

    <!-- 重置 -->
    <SnButton
      class="sn-theme-panel__reset"
      size="small"
      type="error"
      ghost
      block
      :disabled="!dirty"
      @click="emit('reset')"
    >
      <template #icon><RotateCcw :size="13" /></template>
      {{ t('重置为站点默认', 'Reset to site default') }}
    </SnButton>
  </aside>
</template>

<style scoped>
/*
 * 面板本身用站点 chrome token（--vp-c-*），不用被编辑的 --sn-web-*：
 * 无论用户把品牌色改成什么，配置栏都要保持可读、可辨认。
 */
.sn-theme-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  font-size: 13px;
  color: var(--vp-c-text-1);
}

.sn-theme-panel__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.sn-theme-panel__section:last-of-type {
  border-bottom: 0;
  padding-bottom: 0;
}

.sn-theme-panel__label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

/* 让分组里的 RadioGroup / Select 铺满整行 */
.sn-theme-panel__wide {
  width: 100%;
}

/* ── 行：左标签 + 右控件 ── */
.sn-theme-panel__row {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
}
.sn-theme-panel.is-en .sn-theme-panel__row {
  grid-template-columns: 104px minmax(0, 1fr);
}

.sn-theme-panel__row-label {
  font-size: 12.5px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 控件外壳：统一高度与描边，内部组件去掉自己的边框 */
.sn-theme-panel__control {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  height: 34px;
  padding: 0 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  transition: border-color 0.15s;
}
.sn-theme-panel__control:hover,
.sn-theme-panel__control:focus-within {
  border-color: var(--vp-c-brand-1);
}

.sn-theme-panel__control--color {
  gap: 4px;
  padding-left: 6px;
}
.sn-theme-panel__control--switch {
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 6px;
}

.sn-theme-panel__switch-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

/* SnSelect 自带边框 → 在外壳里隐去，由外壳负责视觉边界 */
.sn-theme-panel__control :deep(.sn-select) {
  flex: 1 1 auto;
  min-width: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  padding-left: 0;
  padding-right: 18px;
}
.sn-theme-panel__control :deep(.sn-select__input),
.sn-theme-panel__control :deep(.sn-select__trigger) {
  border: 0;
  background: transparent;
  box-shadow: none;
}

/* SnColorPicker 的触发器本身就是色块，压缩到外壳高度 */
.sn-theme-panel__control--color :deep(.sn-color-picker) {
  flex: 1 1 auto;
  min-width: 0;
}
.sn-theme-panel__control--color :deep(.sn-color-picker__trigger) {
  height: 26px;
  min-height: 26px;
  border: 0;
  background: transparent;
  box-shadow: none;
  padding: 0;
  width: 100%;
  justify-content: flex-start;
}

.sn-theme-panel__dots {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  flex: 0 0 auto;
}
.sn-theme-panel__dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 1px solid rgba(15, 23, 42, 0.14);
}

.sn-theme-panel__chevron {
  position: absolute;
  right: 8px;
  color: var(--vp-c-text-3);
  pointer-events: none;
}

/* ── 内置主题（官方 Pack 卡） ── */
.sn-theme-panel__packs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.sn-theme-panel__pack {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  padding: 8px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 9px;
  background: var(--vp-c-bg);
  cursor: pointer;
  text-align: left;
  transition:
    border-color 0.15s,
    background 0.15s;
}
.sn-theme-panel__pack:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
.sn-theme-panel__pack-dot {
  width: 12px;
  height: 12px;
  margin-top: 2px;
  border-radius: 50%;
  border: 1px solid rgba(15, 23, 42, 0.12);
  flex: 0 0 auto;
}
.sn-theme-panel__pack-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.sn-theme-panel__pack-text strong {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.sn-theme-panel__pack-text small {
  font-size: 10.5px;
  line-height: 1.4;
  color: var(--vp-c-text-3);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── 预设 ── */
.sn-theme-panel__presets {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.sn-theme-panel__preset {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 11.5px;
  cursor: pointer;
  transition:
    border-color 0.15s,
    color 0.15s;
}
.sn-theme-panel__preset:hover,
.sn-theme-panel__preset.is-active {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}
.sn-theme-panel__preset-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

/* ── 滑杆 ── */
.sn-theme-panel__slider-row {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr) 54px;
  align-items: center;
  gap: 8px;
}
.sn-theme-panel.is-en .sn-theme-panel__slider-row {
  grid-template-columns: 104px minmax(0, 1fr) 54px;
}
.sn-theme-panel__slider {
  min-width: 0;
}
.sn-theme-panel__slider-value {
  font-size: 11.5px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono, monospace);
  text-align: right;
}

.sn-theme-panel__reset {
  margin-top: 2px;
}

@media (max-width: 720px) {
  .sn-theme-panel__row,
  .sn-theme-panel__slider-row {
    grid-template-columns: 76px minmax(0, 1fr) 48px;
  }
}
</style>
