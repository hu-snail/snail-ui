<script setup lang="ts">
/**
 * SnStatistic — web-end statistic display (AUI-WEB-DD-016).
 *
 * Reference library: naive-ui `n-statistic`
 *   (https://www.naiveui.com/zh-CN/light/components/statistic)
 * Per AGENTS.md §112, props + semantics mirror n-statistic 1:1:
 *   label / value / tabular-nums. Slots: default (value) / label /
 *   prefix / suffix. No events.
 *
 * Documented divergences (not §112 violations):
 *   - Theme values are mapped to web tokens: naive labelTextColor
 *     (textColor3) → --sn-web-color-text-tertiary; value/prefix/suffix
 *     textColor (textColor2) → --sn-web-color-text-secondary. Font sizes
 *     keep the naive theme metrics (label 14px, value 24px, value margin
 *     -top 4px, prefix/suffix gutters 4px per src/statistic cssr).
 *   - No config-provider / RTL integration (web-end v3 has no provider
 *     yet); locale-dependent rendering does not apply here.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnStatistic label="统计数据" :value="99" />
 *   <SnStatistic label="活跃用户" tabular-nums>1,234,123</SnStatistic>
 *   <SnStatistic label="余额" :value="99">
 *     <template #prefix>￥</template>
 *     <template #suffix>/ 100</template>
 *   </SnStatistic>
 */

defineOptions({ name: 'SnStatistic' });

withDefaults(
  defineProps<{
    /** Label shown above the value. Mirrors n-statistic `label`. */
    label?: string | undefined;
    /** Statistic value; when set it takes precedence over the default slot. Mirrors n-statistic `value`. */
    value?: string | number | undefined;
    /** Render digits with equal widths (font-variant-numeric: tabular-nums). Mirrors n-statistic `tabularNums`. */
    tabularNums?: boolean;
  }>(),
  {
    label: undefined,
    value: undefined,
    tabularNums: false,
  },
);

defineSlots<{
  /** Value content — used only when `value` is not passed. Mirrors n-statistic `default`. */
  default?(): unknown;
  /** Label — used only when `label` is not passed. Mirrors n-statistic `label`. */
  label?(): unknown;
  /** Prefix rendered before the value content. Mirrors n-statistic `prefix`. */
  prefix?(): unknown;
  /** Suffix rendered after the value content. Mirrors n-statistic `suffix`. */
  suffix?(): unknown;
}>();
</script>

<template>
  <div data-snui-component="statistic" class="sn-statistic">
    <div v-if="label !== undefined || $slots.label" class="sn-statistic__label">
      <template v-if="label">{{ label }}</template>
      <slot v-else name="label" />
    </div>
    <div
      class="sn-statistic__value"
      :style="tabularNums ? { fontVariantNumeric: 'tabular-nums' } : undefined"
    >
      <span v-if="$slots.prefix" class="sn-statistic__prefix"><slot name="prefix" /></span>
      <span v-if="value !== undefined" class="sn-statistic__content">{{ value }}</span>
      <span v-else-if="$slots.default" class="sn-statistic__content"><slot /></span>
      <span v-if="$slots.suffix" class="sn-statistic__suffix"><slot name="suffix" /></span>
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

/* Metrics mirror naive src/statistic/src/styles/index.cssr.ts +
 * styles/light.ts: label fontSize/fontWeight/textColor3, value 24px /
 * fontWeight / textColor2, value margin-top 4px, prefix/suffix 4px gutters. */

.sn-statistic__label {
  font-size: 14px;
  font-weight: 400;
  color: var(--sn-web-color-text-tertiary);
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-statistic__value {
  margin-top: 4px;
  font-weight: 400;
}

.sn-statistic__prefix,
.sn-statistic__content,
.sn-statistic__suffix {
  font-size: 24px;
  color: var(--sn-web-color-text-secondary);
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-statistic__prefix {
  margin: 0 4px 0 0;
}

.sn-statistic__suffix {
  margin: 0 0 0 4px;
}
</style>
