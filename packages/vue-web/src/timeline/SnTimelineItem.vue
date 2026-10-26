<script setup lang="ts">
/**
 * SnTimelineItem — one entry of a `<SnTimeline>` (AUI-WEB-DD-020).
 *
 * Reference library: naive-ui `n-timeline-item`
 *   (https://www.naiveui.com/zh-CN/light/components/timeline)
 * Per AGENTS.md §112, props + slots mirror n-timeline-item 1:1:
 *   time / title / content / color / line-type / type;
 *   slots: default (content) / icon / footer (time) / header (title).
 *
 * Node rendering: the `icon` slot replaces the circle node; a `color`
 * prop overrides the node ring border color (or icon color). Semantic
 * `type` colors resolve to full-strength `--sn-web-color-feedback-*`
 * tokens (the color-mix tint pattern applies to tinted fills — the
 * reference ring is a solid 2px border).
 *
 * Documented divergences (not §112 violations):
 *   - Rendered outside a `<SnTimeline>` the item degrades with the
 *     default layout config; the reference throws in dev.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnTimelineItem type="success" title="成功" content="已发布" time="2018-04-03 20:46" />
 *   <SnTimelineItem line-type="dashed" content="等待中" />
 */

import { computed, inject } from 'vue'
import {
  SN_TIMELINE_INJECTION_KEY,
  type SnTimelineLineType,
  type SnTimelineItemType,
} from './timeline-context'

defineOptions({ name: 'SnTimelineItem' })

const props = withDefaults(
  defineProps<{
    /** Meta line under the content; the `footer` slot overrides it. */
    time?: string | number
    /** Entry title; the `header` slot overrides it. */
    title?: string
    /** Entry body text; the `default` slot overrides it. */
    content?: string
    /** Custom node color (any CSS color) — overrides the type color. */
    color?: string
    /** Rail segment style after this node. */
    lineType?: SnTimelineLineType
    /** Semantic node color. */
    type?: SnTimelineItemType
  }>(),
  {
    lineType: 'default',
    type: 'default',
  },
)

defineSlots<{
  /** Entry body content. */
  default?(): unknown
  /** Custom node icon — replaces the circle node. */
  icon?(): unknown
  /** Meta line — overrides the `time` prop. */
  footer?(): unknown
  /** Entry title — overrides the `title` prop. */
  header?(): unknown
}>()

const timeline = inject(SN_TIMELINE_INJECTION_KEY, undefined)
const horizontal = computed(() => timeline?.horizontal.value ?? false)

const nodeStyle = computed<Record<string, string> | undefined>(() => {
  return props.color ? { borderColor: props.color } : undefined
})

const iconStyle = computed<Record<string, string> | undefined>(() => {
  return props.color ? { color: props.color } : undefined
})
</script>

<template>
  <div
    class="sn-timeline-item"
    :class="[
      `sn-timeline-item--${type}-type`,
      `sn-timeline-item--${lineType}-line-type`,
      horizontal ? 'sn-timeline-item--horizontal' : '',
    ]"
  >
    <div class="sn-timeline-item__timeline" aria-hidden="true">
      <div class="sn-timeline-item__line" />
      <div
        v-if="$slots.icon"
        class="sn-timeline-item__icon"
        :style="iconStyle"
      >
        <slot name="icon" />
      </div>
      <div
        v-else
        class="sn-timeline-item__circle"
        :style="nodeStyle"
      />
    </div>
    <div class="sn-timeline-item__content">
      <div v-if="title || $slots.header" class="sn-timeline-item__title">
        <slot v-if="$slots.header" name="header" />
        <template v-else>{{ title }}</template>
      </div>
      <div v-if="content || $slots.default" class="sn-timeline-item__body">
        <slot v-if="$slots.default" />
        <template v-else>{{ content }}</template>
      </div>
      <div v-if="time || $slots.footer" class="sn-timeline-item__meta">
        <slot v-if="$slots.footer" name="footer" />
        <template v-else>{{ time }}</template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-timeline-item {
  position: relative;
}

/* ---------- Semantic node colors (full-strength, ring style) ---------- */

.sn-timeline-item--default-type {
  --sn-timeline-node-color: var(--sn-web-color-text-tertiary);
}

.sn-timeline-item--success-type {
  --sn-timeline-node-color: var(--sn-web-color-feedback-success);
}

.sn-timeline-item--info-type {
  --sn-timeline-node-color: var(--sn-web-color-feedback-info);
}

.sn-timeline-item--warning-type {
  --sn-timeline-node-color: var(--sn-web-color-feedback-warning);
}

.sn-timeline-item--error-type {
  --sn-timeline-node-color: var(--sn-web-color-feedback-danger);
}

/* ---------- Rail geometry (vertical) ---------- */

.sn-timeline-item__timeline {
  width: calc(var(--sn-timeline-icon-size) + 12px);
  position: absolute;
  top: calc(var(--sn-timeline-title-font-size) * 1.25 / 2 - var(--sn-timeline-icon-size) / 2);
  height: 100%;
}

.sn-timeline--left-placement .sn-timeline-item__timeline {
  left: 0;
}

.sn-timeline--right-placement .sn-timeline-item__timeline {
  right: 0;
  width: var(--sn-timeline-icon-size);
}

.sn-timeline--left-placement .sn-timeline-item__content {
  margin-left: calc(var(--sn-timeline-icon-size) + 12px);
}

.sn-timeline--right-placement .sn-timeline-item__content {
  text-align: right;
  margin-right: calc(var(--sn-timeline-icon-size) + 12px);
}

.sn-timeline-item__circle {
  border: 2px solid var(--sn-timeline-node-color);
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
  width: var(--sn-timeline-icon-size);
  height: var(--sn-timeline-icon-size);
  border-radius: var(--sn-timeline-icon-size);
  box-sizing: border-box;
}

.sn-timeline-item__icon {
  color: var(--sn-timeline-node-color);
  font-size: var(--sn-timeline-icon-size);
  height: var(--sn-timeline-icon-size);
  width: var(--sn-timeline-icon-size);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sn-timeline-item__line {
  transition: background-color 0.3s ease;
  position: absolute;
  top: var(--sn-timeline-icon-size);
  left: calc(var(--sn-timeline-icon-size) / 2 - 1px);
  bottom: 0;
  width: 2px;
  background-color: var(--sn-timeline-line-color);
}

/* Dashed rail (reference dashed gradient pattern). */
.sn-timeline-item--dashed-line-type .sn-timeline-item__line {
  background-color: transparent;
  background-image: linear-gradient(
    180deg,
    var(--sn-timeline-line-color),
    var(--sn-timeline-line-color) 50%,
    transparent 50%,
    transparent 100%
  );
  background-size: 1px 10px;
}

/* The last entry draws no rail. */
.sn-timeline-item:last-child .sn-timeline-item__line {
  display: none;
}

/* ---------- Content ---------- */

.sn-timeline-item__title {
  margin: var(--sn-timeline-title-margin);
  font-size: var(--sn-timeline-title-font-size);
  transition: color 0.3s ease;
  font-weight: 500;
  color: var(--sn-web-color-text-primary);
}

.sn-timeline-item__body {
  transition: color 0.3s ease;
  font-size: 14px;
  color: var(--sn-web-color-text-secondary);
}

.sn-timeline-item__meta {
  transition: color 0.3s ease;
  font-size: 12px;
  margin-top: 6px;
  margin-bottom: 20px;
  color: var(--sn-web-color-text-tertiary);
}

.sn-timeline-item:last-child .sn-timeline-item__meta {
  margin-bottom: 0;
}

/* ---------- Horizontal rail ---------- */

.sn-timeline--horizontal .sn-timeline-item {
  flex-shrink: 0;
  padding-right: 40px;
}

.sn-timeline--horizontal .sn-timeline-item__content {
  margin-top: calc(var(--sn-timeline-icon-size) + 12px);
}

.sn-timeline--horizontal .sn-timeline-item__meta {
  margin-top: 6px;
  margin-bottom: 0;
}

.sn-timeline--horizontal .sn-timeline-item__timeline {
  width: 100%;
  height: calc(var(--sn-timeline-icon-size) + 12px);
}

.sn-timeline--horizontal .sn-timeline-item__line {
  left: var(--sn-timeline-icon-size);
  top: calc(var(--sn-timeline-icon-size) / 2 - 1px);
  right: 0;
  width: unset;
  height: 2px;
}

.sn-timeline--horizontal .sn-timeline-item--dashed-line-type .sn-timeline-item__line {
  background-image: linear-gradient(
    90deg,
    var(--sn-timeline-line-color),
    var(--sn-timeline-line-color) 50%,
    transparent 50%,
    transparent 100%
  );
  background-size: 10px 1px;
}
</style>
