<script setup lang="ts">
/**
 * sn-step (uni-end) — one step in a `sn-steps` container.
 *
 * Reference library: wot-ui `wd-step`
 *   (https://wot-ui.cn/component/steps.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-step 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * Lives next to `sn-steps.vue` so the provide/inject contract types
 * (`sn-steps-types.ts`) stay beside both halves of the pair.
 *
 * ## Status resolution
 *
 * An explicit `status` always wins. Otherwise the container's `active` index
 * decides: steps before it are `finished`, the one at it is `process`, the
 * rest are `wait`. That keeps a plain `<sn-step title="…" />` list working
 * with nothing but `:active`.
 *
 * ## Additive surface (AUI-OPT-09, AGENTS.md §112.3a — wd-step has none)
 *
 *   - `node` slot — replaces the whole indicator node, so a host can draw its
 *     own badge / avatar / shape where the step number sits. The connector
 *     line is container furniture and stays.
 *   - `content` slot — replaces the title + description region in one piece;
 *     the 1:1 `title` / `description` slots still replace one part each.
 *   - icon sources, one precedence chain (sn-cell / sn-collapse's order):
 *
 *       `iconData` (IconData object) > `iconUrl` (image → `<image>`)
 *         > `icon` (name → registry, then the built-in catalogue)
 *
 *     An unresolvable name falls through to the built-in status glyphs and the
 *     step number, so the indicator is never blank (AGENTS.md §85 — the
 *     fallback is explicit and predictable).
 *   - `iconSize` — named tiers map to `--sn-mp-icon-size-*`; the family default
 *     is `--sn-mp-icon-size-medium`, shared by every glyph in the node.
 *   - `iconColor` — inline colour for every glyph in the node; pass a
 *     `var(--sn-mp-color-*)` token (§112.5). Defaults to `currentColor`, which
 *     is what lets finished / error glyphs take their state colours.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 激活下标本身 — 由 sn-steps 持有
 *   - 连接线样式 — 由 sn-steps 的 `connector` 统一持有
 *   - 步骤间流转 — 由宿主驱动
 */

import { computed, inject, markRaw, onBeforeUnmount, onMounted, ref } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { resolveSnIconStringSync } from '../sn-icon/sn-icon-providers';
import { Check, X } from '../sn-icon/sn-icon-set';
import { nextUid } from '../../utils/uid';
import { SN_STEPS_KEY, resolveSnStepIconSize, type SnStepStatus } from './sn-steps-types';

defineOptions({ name: 'SnStep' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-step` 1:1 surface ───────────────────────────────────── */

    /** 步骤标题，不传时显示默认文案。 */
    title?: string;
    /** 步骤描述。 */
    description?: string;
    /** 步骤图标名（registry → 内置目录依次解析，未命中回退内置状态图标 / 序号）。 */
    icon?: string;
    /** 步骤状态：finished / process / error / wait（不传时由 active 推导）。 */
    status?: SnStepStatus | undefined;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;

    /* ── additive (AUI-OPT-09, AGENTS.md §112.3a) ───────────────────────── */

    /** 图标数据对象（内置图标集 / 自定义 IconData），优先级最高。 */
    iconData?: IconData | undefined;
    /** 图标图片地址：渲染为 `<image>`，优先级低于 `iconData`、高于 `icon`。 */
    iconUrl?: string;
    /** 图标尺寸：数字按 px；档位名（tiny/small/medium/large/xlarge）映射 `--sn-mp-icon-size-*`。 */
    iconSize?: string | number | undefined;
    /** 图标颜色；请传 `var(--sn-mp-color-*)` token，默认 `currentColor`（跟随节点状态色）。 */
    iconColor?: string;
  }>(),
  {
    title: '',
    description: '',
    icon: '',
    status: undefined,
    customClass: '',
    customStyle: '',
    iconUrl: '',
    iconColor: '',
  },
);

defineSlots<{
  /** 自定义步骤图标，渲染在默认节点内。 */
  icon?(): unknown;
  /** 自定义步骤标题。 */
  title?(): unknown;
  /** 自定义步骤描述。 */
  description?(): unknown;
  /** additive：完全替换默认节点（覆盖序号 / 状态图标）。 */
  node?(): unknown;
  /** additive：完全替换节点内容区（标题 + 描述）。 */
  content?(): unknown;
}>();

const steps = inject(SN_STEPS_KEY, null);

const uid = nextUid();

/** Index inside the container; `-1` until the mount hook has run. */
const stepIndex = ref(-1);

/** Resolved status: explicit prop wins, otherwise derived from `active`. */
const resolvedStatus = computed<SnStepStatus>(() => {
  if (props.status) return props.status;
  const active = steps?.active.value ?? 0;
  if (stepIndex.value < 0) return 'wait';
  if (stepIndex.value < active) return 'finished';
  if (stepIndex.value === active) return 'process';
  return 'wait';
});

const isLast = computed(() => {
  const count = steps?.stepCount.value ?? 0;
  return stepIndex.value >= 0 && stepIndex.value === count - 1;
});

const isVertical = computed(() => steps?.vertical.value ?? false);
const isDot = computed(() => steps?.dot.value ?? false);

/** `icon` name resolved through registry → built-in catalogue (sync only). */
const resolvedNameIcon = computed<IconData | undefined>(() => {
  if (props.icon === '') return undefined;
  const resolved = resolveSnIconStringSync(props.icon);
  return resolved === null ? undefined : markRaw(resolved);
});

/** Which icon source renders — data object > image URL > name (additive). */
const iconSource = computed<'data' | 'url' | 'name' | 'none'>(() => {
  if (props.iconData !== undefined) return 'data';
  if (props.iconUrl !== '') return 'url';
  if (resolvedNameIcon.value !== undefined) return 'name';
  return 'none';
});

/** One glyph scale per node: own `iconSize` → family default tier token. */
const resolvedIconSize = computed<string | number>(() => resolveSnStepIconSize(props.iconSize));

/** `currentColor` keeps the state colours; a token overrides them (§112.5). */
const resolvedIconColor = computed(() => props.iconColor || 'currentColor');

/** Size box for the image source, mirroring `resolvedIconSize`. */
const iconBoxStyle = computed(() => {
  const size = resolvedIconSize.value;
  const len = typeof size === 'number' ? `${size}px` : size;
  return `width: ${len}; height: ${len};`;
});

/**
 * Connector style owned by the container, applied as an inline `border-style`.
 *
 * The line is a real element drawn with borders (sn-divider's pattern), so
 * dashed / dotted stay pseudo-element-free on miniprogram / uvue (AGENTS.md
 * §116). `solid` needs no inline style — it is the base rule.
 */
const connectorStyle = computed<string | undefined>(() => {
  const connector = steps?.connector.value ?? 'solid';
  if (connector === 'solid') return undefined;
  return `border-top-style: ${connector}; border-left-style: ${connector};`;
});

/** Gap between the indicator and the next one — `space` overrides the default. */
const itemStyle = computed(() => {
  const space = steps?.space.value ?? '';
  if (!space) return undefined;
  return isVertical.value ? `padding-bottom: ${space}` : `width: ${space}`;
});

onMounted(() => {
  if (!steps) return;
  stepIndex.value = steps.registerStep(uid);
});
onBeforeUnmount(() => steps?.unregisterStep(uid));

const rootClass = computed(() => [
  'sn-step',
  `sn-step--${resolvedStatus.value}`,
  {
    'sn-step--last': isLast.value,
    'sn-step--vertical': isVertical.value,
    'sn-step--horizontal': !isVertical.value,
    'sn-step--dot': isDot.value,
  },
  props.customClass,
]);
</script>

<template>
  <view
    data-snui-component="step"
    :class="rootClass"
    :style="[customStyle || undefined, itemStyle]"
    role="listitem"
    :aria-current="resolvedStatus === 'process' ? 'step' : undefined"
  >
    <view class="sn-step__header">
      <!-- additive `node` slot: a custom node replaces the default indicator
           (number / status glyph) as a whole; the connector line stays. -->
      <slot name="node">
        <view class="sn-step__indicator">
          <slot name="icon">
            <!-- Icon precedence: IconData object > image URL > resolved name.
                 An unresolvable name falls through to the builtin glyphs so
                 the indicator is never blank. -->
            <SnIcon
              v-if="iconSource === 'data'"
              :icon="iconData"
              :size="resolvedIconSize"
              :color="resolvedIconColor"
            />
            <image
              v-else-if="iconSource === 'url'"
              class="sn-step__image"
              :src="iconUrl"
              mode="aspectFit"
              :style="iconBoxStyle"
              aria-hidden="true"
            />
            <SnIcon
              v-else-if="iconSource === 'name'"
              :icon="resolvedNameIcon"
              :size="resolvedIconSize"
              :color="resolvedIconColor"
            />
            <SnIcon
              v-else-if="resolvedStatus === 'finished'"
              :icon="Check"
              :size="resolvedIconSize"
              :color="resolvedIconColor"
            />
            <SnIcon
              v-else-if="resolvedStatus === 'error'"
              :icon="X"
              :size="resolvedIconSize"
              :color="resolvedIconColor"
            />
            <text v-else class="sn-step__number">
              {{ stepIndex + 1 }}
            </text>
          </slot>
        </view>
      </slot>
      <view
        v-if="!isLast && !isDot"
        class="sn-step__line"
        :style="connectorStyle"
        aria-hidden="true"
      />
    </view>

    <view class="sn-step__content">
      <!-- additive `content` slot: replaces title + description in one piece. -->
      <slot name="content">
        <view class="sn-step__title-row">
          <slot name="title">
            <text class="sn-step__title">{{ title }}</text>
          </slot>
        </view>
        <slot name="description">
          <text v-if="description" class="sn-step__description">{{ description }}</text>
        </slot>
      </slot>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-step {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  box-sizing: border-box;
  min-width: 0;
}

.sn-step--horizontal {
  align-items: center;
}

.sn-step--vertical {
  flex-direction: row;
  align-items: flex-start;
}

.sn-step__header {
  display: flex;
  align-items: center;
  width: 100%;
}

.sn-step--vertical .sn-step__header {
  flex-direction: column;
  width: auto;
  height: 100%;
}

.sn-step__indicator {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-surface);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-step--dot .sn-step__indicator {
  width: 16rpx;
  height: 16rpx;
  border: none;
  background-color: var(--sn-mp-color-border-default);
}

.sn-step--finished .sn-step__indicator {
  border-color: var(--sn-mp-color-action-primary);
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-step--process .sn-step__indicator {
  border-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-action-primary);
}

.sn-step--error .sn-step__indicator {
  border-color: var(--sn-mp-color-feedback-danger);
  background-color: var(--sn-mp-color-feedback-danger);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-step--dot.sn-step--finished .sn-step__indicator,
.sn-step--dot.sn-step--process .sn-step__indicator {
  background-color: var(--sn-mp-color-action-primary);
}

.sn-step--dot.sn-step--error .sn-step__indicator {
  background-color: var(--sn-mp-color-feedback-danger);
}

.sn-step__number {
  color: inherit;
  font-size: inherit;
  line-height: 1;
}

/* Image icon source (additive): sized by the same tier as the vector glyphs
 * (the box comes from the inline style, one scale per node). */
.sn-step__image {
  display: block;
}

/**
 * Connector line — a real element drawn with borders, not a background fill:
 * the container's `connector` value is applied as an inline `border-style`
 * (solid / dashed / dotted), which keeps miniprogram / uvue away from
 * pseudo-elements (AGENTS.md §116). Every border declaration is a longhand so
 * the uni-x descendant flattening keeps its fallback value when a rule only
 * applies inside `.sn-step--vertical`.
 */
.sn-step__line {
  flex: 1 1 auto;
  height: 0;
  border-color: var(--sn-mp-color-border-default);
  border-top-width: 2rpx;
  border-top-style: solid;
  border-left-width: 0;
  border-left-style: solid;
}

.sn-step--vertical .sn-step__line {
  width: 0;
  height: 100%;
  min-height: 40rpx;
  border-top-width: 0;
  border-left-width: 2rpx;
}

.sn-step--finished .sn-step__line {
  border-color: var(--sn-mp-color-action-primary);
}

.sn-step__content {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
  min-width: 0;
  padding: var(--sn-mp-spacing-2) 0;
}

.sn-step--vertical .sn-step__content {
  padding: 0 0 var(--sn-mp-spacing-5) var(--sn-mp-spacing-3);
}

.sn-step__title-row {
  display: flex;
  align-items: center;
  min-width: 0;
}

.sn-step__title {
  overflow: hidden;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-md);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sn-step--process .sn-step__title {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}

.sn-step--error .sn-step__title {
  color: var(--sn-mp-color-feedback-danger);
}

.sn-step__description {
  overflow: hidden;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}

/* Doodle skin — heavier indicator ring. */
.snui-skin-doodle .sn-step__indicator {
  border-width: 4rpx;
}
</style>
