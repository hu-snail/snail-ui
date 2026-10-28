<script setup lang="ts">
/**
 * SnTimelineItem — one entry of a `<SnTimeline>` (AUI-WEB-DD-020).
 *
 * Reference libraries: naive-ui `n-timeline-item` (props/slots mirror,
 * §112) plus arco-design node/label features (`dot-color` / `dot-type` /
 * `dot` slot / `label` / `position`), documented divergences.
 *
 * Layout: the item is a grid — `[opposite][rail][main]` columns in a
 * vertical timeline and the transposed rows in a horizontal one. The rail
 * cell holds the node (dot / icon / circle) and the line; the `main` cell
 * holds the content plus, in `label-position="same"`, the inline label;
 * the `opposite` cell holds the label in the default `relative` position.
 * The content side (and, under `alternate`, the parity flip) is computed
 * from the container config and emitted as `--side-*` classes.
 *
 * Node rendering priority: `dot` slot > `icon` slot > circle. A
 * `dot-color` (or legacy `color`) overrides the semantic `type` color
 * through the `--sn-timeline-node-color` custom property.
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
 *   <SnTimelineItem label="2017-03-10" title="里程碑" />
 */

import { computed, inject, onBeforeUnmount, useSlots } from 'vue';
import {
  SN_TIMELINE_INJECTION_KEY,
  type SnTimelineDotType,
  type SnTimelineItemSide,
  type SnTimelineItemPosition,
  type SnTimelineLineType,
  type SnTimelineItemType,
} from './timeline-context';

defineOptions({ name: 'SnTimelineItem' });

const props = withDefaults(
  defineProps<{
    /** Meta line under the content; the `footer` slot overrides it. */
    time?: string | number;
    /** Entry title; the `header` slot overrides it. */
    title?: string;
    /** Entry body text; the `default` slot overrides it. */
    content?: string;
    /** Custom node color (any CSS color) — overrides the type color. Legacy alias of `dot-color`. */
    color?: string;
    /** Custom node color (any CSS color). Wins over `color`. */
    dotColor?: string;
    /** Node fill style: filled dot (`solid`, default) or ring (`hollow`). */
    dotType?: SnTimelineDotType;
    /** Rail segment style after this node. */
    lineType?: SnTimelineLineType;
    /** Semantic node color. */
    type?: SnTimelineItemType;
    /**
     * Label text (e.g. a date) rendered per the container `label-position`;
     * the `label` slot overrides it.
     */
    label?: string;
    /**
     * Fix the content side inside `mode="alternate"` (vertical: left /
     * right, horizontal: top / bottom); without it the side alternates by
     * item index.
     */
    position?: SnTimelineItemPosition;
  }>(),
  {
    lineType: 'default',
    type: 'default',
    dotType: 'solid',
  },
);

defineSlots<{
  /** Entry body content. */
  default?(): unknown;
  /** Custom node icon — replaces the circle node (the `dot` slot wins). */
  icon?(): unknown;
  /** Full custom node DOM — wins over the `icon` slot and the circle. */
  dot?(): unknown;
  /** Label text — overrides the `label` prop. */
  label?(): unknown;
  /** Meta line — overrides the `time` prop. */
  footer?(): unknown;
  /** Entry title — overrides the `header` prop. */
  header?(): unknown;
}>();

const slots = useSlots();

const timeline = inject(SN_TIMELINE_INJECTION_KEY, undefined);
const registration = timeline?.registerItem();
if (registration) {
  onBeforeUnmount(() => {
    registration.unregister();
  });
}
const index = computed(() => registration?.index.value ?? 0);

const isHorizontal = computed(() => timeline?.direction.value === 'horizontal');
const mode = computed(() => timeline?.mode.value ?? 'left');
const labelPosition = computed(() => timeline?.labelPosition.value ?? 'relative');

/**
 * Side of the axis this item's content sits on. `alternate` flips by item
 * index (first item on the default side: right for vertical, bottom for
 * horizontal); an explicit `position` fixes the side.
 */
const side = computed<SnTimelineItemSide>(() => {
  const pos = props.position;
  if (mode.value === 'alternate') {
    if (isHorizontal.value) {
      if (pos === 'top') return 'top';
      if (pos === 'bottom') return 'bottom';
      return index.value % 2 === 0 ? 'bottom' : 'top';
    }
    if (pos === 'left') return 'left';
    if (pos === 'right') return 'right';
    return index.value % 2 === 0 ? 'right' : 'left';
  }
  if (isHorizontal.value) return mode.value === 'bottom' ? 'top' : 'bottom';
  return mode.value === 'right' ? 'left' : 'right';
});

const hasLabel = computed(() => props.label !== undefined || slots.label !== undefined);
const showOppositeLabel = computed(() => labelPosition.value === 'relative' && hasLabel.value);
const showInlineLabel = computed(() => labelPosition.value === 'same' && hasLabel.value);

const effectiveColor = computed(() => props.dotColor ?? props.color);

const nodeStyle = computed<Record<string, string> | undefined>(() => {
  return effectiveColor.value ? { '--sn-timeline-node-color': effectiveColor.value } : undefined;
});

const iconStyle = computed<Record<string, string> | undefined>(() => {
  return effectiveColor.value ? { color: effectiveColor.value } : undefined;
});
</script>

<template>
  <div
    class="sn-timeline-item"
    :class="[
      `sn-timeline-item--${type}-type`,
      `sn-timeline-item--${lineType}-line-type`,
      `sn-timeline-item--${dotType}-dot`,
      `sn-timeline-item--side-${side}`,
      position ? `sn-timeline-item--position-${position}` : '',
      isHorizontal ? 'sn-timeline-item--horizontal' : '',
    ]"
  >
    <div v-if="showOppositeLabel" class="sn-timeline-item__opposite">
      <slot name="label">{{ label }}</slot>
    </div>
    <div class="sn-timeline-item__timeline" aria-hidden="true">
      <div class="sn-timeline-item__line" />
      <div v-if="$slots.dot" class="sn-timeline-item__dot">
        <slot name="dot" />
      </div>
      <div v-else-if="$slots.icon" class="sn-timeline-item__icon" :style="iconStyle">
        <slot name="icon" />
      </div>
      <div v-else class="sn-timeline-item__circle" :style="nodeStyle" />
    </div>
    <div class="sn-timeline-item__main">
      <div v-if="showInlineLabel" class="sn-timeline-item__label">
        <slot name="label">{{ label }}</slot>
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
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`).
 *
 * Keep every rule at the top level (no CSS nesting): nesting the sheet
 * inside `.sn-timeline-item { … }` turned each selector into a descendant
 * selector, so `display: grid` and the mode templates never matched and the
 * items collapsed into a stack. */

.sn-timeline-item {
  position: relative;
  display: grid;
  /* Degraded default (item outside a timeline): rail hugs the left like
   * mode="left". Container mode classes override the columns and the side
   * classes always override the areas; the fallbacks keep a standalone
   * item sized without the container's custom properties. */
  grid-template-columns:
    auto
    var(--sn-timeline-rail-w, calc(var(--sn-timeline-icon-size, 14px) + 12px)) 1fr;
  grid-template-areas: 'opposite rail main';
}

/* ---------- Vertical column templates (left / right / alternate) ---------- */

.sn-timeline--mode-left .sn-timeline-item {
  grid-template-columns:
    auto
    var(--sn-timeline-rail-w, calc(var(--sn-timeline-icon-size, 14px) + 12px)) 1fr;
}

.sn-timeline--mode-right .sn-timeline-item {
  grid-template-columns:
    1fr
    var(--sn-timeline-rail-w, calc(var(--sn-timeline-icon-size, 14px) + 12px)) auto;
}

.sn-timeline--mode-alternate .sn-timeline-item {
  grid-template-columns:
    1fr
    var(--sn-timeline-rail-w, calc(var(--sn-timeline-icon-size, 14px) + 12px)) 1fr;
}

/* Content side per item — the railless half of the row. */
.sn-timeline-item--side-right {
  grid-template-areas: 'opposite rail main';
}

.sn-timeline-item--side-left {
  grid-template-areas: 'main rail opposite';
}

/* ---------- Item cells ---------- */

.sn-timeline-item__opposite {
  grid-area: opposite;
  min-width: 0;
}

.sn-timeline-item__timeline {
  grid-area: rail;
  position: relative;
  min-width: 0;
}

.sn-timeline-item__main {
  grid-area: main;
  min-width: 0;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

/* The label hugs the rail: on the content's right it leads, on the left it
 * trails (row-reverse); horizontally it sits between the rail and the
 * content (column) or under the content (column-reverse). */
.sn-timeline-item--side-left .sn-timeline-item__main {
  flex-direction: row-reverse;
  text-align: right;
}

.sn-timeline-item--side-right .sn-timeline-item__opposite {
  text-align: right;
}

.sn-timeline-item--side-left .sn-timeline-item__opposite {
  text-align: left;
}

/* Vertical: one label column width for every item keeps the rail perfectly
 * straight (an `auto` column sizes per item, so uneven label widths — e.g.
 * "2017-03-10" vs "2020-09-30" — would stagger the axis). Horizontal labels
 * sit in their own row and need no gutter. */
.sn-timeline--vertical .sn-timeline-item__opposite {
  width: var(--sn-timeline-label-w, 108px);
  overflow-wrap: break-word;
}

/* ---------- Semantic node colors (full-strength) ---------- */

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

/* ---------- Rail cell: node + line ---------- */

.sn-timeline-item__circle {
  position: absolute;
  left: var(--sn-timeline-axis, calc(var(--sn-timeline-icon-size, 14px) / 2));
  top: var(--sn-timeline-node-top, calc(8.75px - var(--sn-timeline-icon-size, 14px) / 2));
  transform: translateX(-50%);
  width: var(--sn-timeline-icon-size, 14px);
  height: var(--sn-timeline-icon-size, 14px);
  border: 2px solid var(--sn-timeline-node-color);
  border-radius: 50%;
  box-sizing: border-box;
  background-color: var(--sn-web-color-background-surface);
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}

/* solid (default): a filled dot half the icon edge, centered on the axis. */
.sn-timeline-item--solid-dot .sn-timeline-item__circle {
  width: calc(var(--sn-timeline-icon-size, 14px) * 0.5);
  height: calc(var(--sn-timeline-icon-size, 14px) * 0.5);
  top: calc(
    var(--sn-timeline-node-top, calc(8.75px - var(--sn-timeline-icon-size, 14px) / 2)) +
      var(--sn-timeline-icon-size, 14px) * 0.25
  );
  border: none;
  background-color: var(--sn-timeline-node-color);
}

.sn-timeline-item__icon,
.sn-timeline-item__dot {
  position: absolute;
  left: var(--sn-timeline-axis, calc(var(--sn-timeline-icon-size, 14px) / 2));
  top: var(--sn-timeline-node-top, calc(8.75px - var(--sn-timeline-icon-size, 14px) / 2));
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sn-timeline-item__icon {
  color: var(--sn-timeline-node-color);
  font-size: var(--sn-timeline-icon-size, 14px);
  height: var(--sn-timeline-icon-size, 14px);
  width: var(--sn-timeline-icon-size, 14px);
}

.sn-timeline-item__line {
  position: absolute;
  left: calc(var(--sn-timeline-axis, calc(var(--sn-timeline-icon-size, 14px) / 2)) - 1px);
  top: calc(
    var(--sn-timeline-node-top, calc(8.75px - var(--sn-timeline-icon-size, 14px) / 2)) +
      var(--sn-timeline-icon-size, 14px)
  );
  bottom: 0;
  width: 2px;
  background-color: var(--sn-timeline-line-color);
  transition: background-color 0.3s ease;
}

/* The last entry draws no rail — no dangling segment under the final node. */
.sn-timeline-item:last-child .sn-timeline-item__line {
  display: none;
}

/* Dashed / dotted rails (gradient patterns). */
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

.sn-timeline-item--dotted-line-type .sn-timeline-item__line {
  background-color: transparent;
  background-image: linear-gradient(
    180deg,
    var(--sn-timeline-line-color) 0 2px,
    transparent 2px 6px
  );
  background-size: 2px 6px;
}

/* ---------- Horizontal: the same cells transposed into rows ---------- */

.sn-timeline--horizontal .sn-timeline-item {
  flex-shrink: 0;
  /* One column; the mode row templates place opposite/rail/main. Declared
   * after the vertical mode templates so it wins the equal-specificity race
   * (mode-alternate applies to both directions). */
  grid-template-columns: minmax(0, 1fr);
}

.sn-timeline--horizontal.sn-timeline--mode-top .sn-timeline-item {
  grid-template-rows:
    auto var(--sn-timeline-rail-h, calc(var(--sn-timeline-icon-size) + 12px)) 1fr;
}

.sn-timeline--horizontal.sn-timeline--mode-bottom .sn-timeline-item {
  grid-template-rows:
    1fr var(--sn-timeline-rail-h, calc(var(--sn-timeline-icon-size) + 12px)) auto;
}

.sn-timeline--horizontal.sn-timeline--mode-alternate .sn-timeline-item {
  grid-template-rows:
    1fr var(--sn-timeline-rail-h, calc(var(--sn-timeline-icon-size) + 12px)) 1fr;
}

.sn-timeline--horizontal .sn-timeline-item--side-bottom {
  grid-template-areas:
    'opposite'
    'rail'
    'main';
}

.sn-timeline--horizontal .sn-timeline-item--side-top {
  grid-template-areas:
    'main'
    'rail'
    'opposite';
}

/* The cross-axis label row keeps one line box in horizontal mode so the rail
 * band lands on the same y whether or not an item has a label. */
.sn-timeline--horizontal .sn-timeline-item__opposite {
  min-height: var(--sn-timeline-h-label-h, 18px);
}

.sn-timeline--horizontal .sn-timeline-item__main {
  flex-direction: column;
}

.sn-timeline--horizontal .sn-timeline-item--side-top .sn-timeline-item__main {
  flex-direction: column-reverse;
}

/* ---------- Horizontal rail geometry ---------- */

.sn-timeline--horizontal .sn-timeline-item__circle {
  left: calc(var(--sn-timeline-icon-size) / 2);
  top: var(--sn-timeline-axis-y);
  transform: translate(-50%, -50%);
}

.sn-timeline--horizontal .sn-timeline-item--solid-dot .sn-timeline-item__circle {
  top: var(--sn-timeline-axis-y);
}

.sn-timeline--horizontal .sn-timeline-item__icon,
.sn-timeline--horizontal .sn-timeline-item__dot {
  left: calc(var(--sn-timeline-icon-size) / 2);
  top: var(--sn-timeline-axis-y);
  transform: translate(-50%, -50%);
}

/* The line bridges the column gap so segments connect node to node. */
.sn-timeline--horizontal .sn-timeline-item__line {
  left: var(--sn-timeline-icon-size);
  right: calc(-1 * var(--sn-timeline-gap, 40px));
  top: calc(var(--sn-timeline-axis-y) - 1px);
  bottom: auto;
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

.sn-timeline--horizontal .sn-timeline-item--dotted-line-type .sn-timeline-item__line {
  background-image: linear-gradient(
    90deg,
    var(--sn-timeline-line-color) 0 2px,
    transparent 2px 6px
  );
  background-size: 6px 2px;
}

/* ---------- Content ---------- */

.sn-timeline-item__label {
  flex: none;
  font-size: 12px;
  line-height: 1.25;
  color: var(--sn-web-color-text-tertiary);
  /* Align the 12px label with the 14/16px title line. */
  padding-top: 2px;
}

.sn-timeline-item__opposite {
  font-size: 12px;
  line-height: 1.25;
  color: var(--sn-web-color-text-tertiary);
  padding-top: 2px;
}

.sn-timeline-item__content {
  min-width: 0;
}

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
</style>
