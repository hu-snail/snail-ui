<script setup lang="ts">
/**
 * sn-collapse (uni-end) — accordion / multi-panel / view-more container.
 *
 * Reference library: wot-ui `wd-collapse`
 *   (https://wot-ui.cn/component/collapse.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-collapse 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-collapse/sn-collapse.vue
 * → auto-registered as `<sn-collapse>` in any .vue that uses it.
 *
 * ## Three modes, one bound value
 *
 * `v-model` is `string[]` in normal mode, `string` in accordion mode and
 * `boolean` in view-more mode — the union `SnCollapseModelValue`. The
 * container normalises internally to "the set of open names plus a view-more
 * flag" so the emit shape stays faithful to whichever mode is active. See
 * `sn-collapse-types.ts`.
 *
 * ## Why view-more clamps instead of measuring
 *
 * `lineNum` collapses the body to N lines with `-webkit-line-clamp`, which
 * every uni target implements in CSS. Measuring the body height would need an
 * async query per panel and would jitter on font load; the CSS clamp is
 * deterministic and costs nothing at runtime.
 *
 * ## Additive props (AUI-OPT-03, AGENTS.md §112.3a — wd-collapse has neither)
 *
 *   - `card` — every panel paints its own rounded card: the container goes
 *     transparent and stacks the panels with a token gap, each item draws its
 *     radius / border / shadow from tokens (`sn-collapse-item` inherits it).
 *     Panels stop drawing the shared divider so a card never doubles up.
 *   - `iconSize` — one icon geometry for the whole family: the chevron of every
 *     panel and any title icon inherit it unless the item sets its own. Named
 *     tiers `tiny|small|medium|large|xlarge` map to `--sn-mp-icon-size-*`;
 *     numbers stay px, unknown strings pass through.
 *   - `iconColor` — one icon colour for the whole family, inherited by every
 *     panel whose own `iconColor` is unset; pass a `var(--sn-mp-color-*)` token.
 *
 * ## Icon colour / size standard
 *
 * Chevron: `--sn-mp-color-text-tertiary` at rest → `--sn-mp-color-action-primary`
 * while open. Title icons: `--sn-mp-color-text-secondary` → action-primary.
 * Geometry: one `--sn-mp-icon-size-*` length per panel (medium by default).
 * Stroke: `--sn-mp-icon-stroke-width` (2) unless an item overrides it.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 单个面板的渲染 — 用 sn-collapse-item
 *   - 内容排版 — 由使用方决定
 */

import { computed, provide, ref, toRef, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { ChevronDown } from '../sn-icon/sn-icon-set';
import {
  resolveSnCollapseIconSize,
  SN_COLLAPSE_ICON_STROKE_WIDTH,
  SN_COLLAPSE_KEY,
  type SnCollapseModelValue,
  type SnCollapseToggleAllOptions,
} from './sn-collapse-types';

defineOptions({ name: 'SnCollapse' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-collapse` 1:1 surface ───────────────────────────────── */

    /** 绑定值；普通模式为 string[]，手风琴模式为 string，查看更多模式为 boolean。 */
    modelValue?: SnCollapseModelValue;
    /** 是否开启手风琴模式（同时只开一项）。 */
    accordion?: boolean;
    /** 是否开启查看更多模式（单个内容块 + 收起行数）。 */
    viewmore?: boolean;
    /** 查看更多模式下是否启用 more 插槽。 */
    useMoreSlot?: boolean;
    /** 查看更多模式下收起显示行数。 */
    lineNum?: number;
    /** 查看更多模式下 more 插槽外部自定义类名。 */
    customMoreSlotClass?: string;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;

    /* ── additive (AUI-OPT-03, AGENTS.md §112.3a) ────────────────────────── */

    /** 卡片形态：每个面板渲染为独立圆角卡片，容器透明并以 token 间距分行。 */
    card?: boolean;
    /** 图标尺寸（面板箭头与标题图标共享）：数字按 px，档位名映射 `--sn-mp-icon-size-*`，其它字符串透传。 */
    iconSize?: string | number | undefined;
    /** 图标颜色（面板箭头与标题图标共享）：传 `var(--sn-mp-color-*)` token；面板自身设置优先。 */
    iconColor?: string;
  }>(),
  {
    modelValue: () => [] as string[],
    accordion: false,
    viewmore: false,
    useMoreSlot: false,
    lineNum: 2,
    customMoreSlotClass: '',
    customClass: '',
    customStyle: '',
    card: false,
    iconColor: '',
  },
);

const emit = defineEmits<{
  /** v-model 同步。 */
  (e: 'update:modelValue', value: SnCollapseModelValue): void;
  /** 绑定值变化时触发。 */
  (e: 'change', payload: { value: SnCollapseModelValue }): void;
}>();

defineSlots<{
  /** 面板内容或面板项列表。 */
  default?(): unknown;
  /** 查看更多模式下自定义展开收起区域。 */
  more?(scope: { expanded: boolean }): unknown;
}>();

/** Open names in normal mode (uncontrolled fallback + controlled sync). */
const innerNames = ref<string[]>(toNames(props.modelValue));
/** View-more flag (same dual mode). */
const innerViewmore = ref<boolean>(toViewmore(props.modelValue));

/** Split the union into its two internal representations. */
function toNames(value: SnCollapseModelValue): string[] {
  if (Array.isArray(value)) return [...value];
  if (typeof value === 'string') return value === '' ? [] : [value];
  return [];
}

function toViewmore(value: SnCollapseModelValue): boolean {
  return typeof value === 'boolean' ? value : false;
}

watch(
  () => props.modelValue,
  (next) => {
    innerNames.value = toNames(next);
    innerViewmore.value = toViewmore(next);
  },
);

/** Emit in the shape the active mode expects. */
function commit(nextNames: string[]): void {
  const value: SnCollapseModelValue = props.viewmore
    ? innerViewmore.value
    : props.accordion
      ? (nextNames[0] ?? '')
      : nextNames;
  emit('update:modelValue', value);
  emit('change', { value });
}

function isExpanded(name: string): boolean {
  return innerNames.value.includes(name);
}

/** Toggle one panel; accordion mode replaces the open set. */
function toggle(name: string): void {
  const next = props.accordion
    ? isExpanded(name)
      ? []
      : [name]
    : isExpanded(name)
      ? innerNames.value.filter((entry) => entry !== name)
      : [...innerNames.value, name];
  innerNames.value = next;
  commit(next);
}

/** View-more mode: flip the whole container. */
function toggleViewmore(): void {
  innerViewmore.value = !innerViewmore.value;
  commit(innerNames.value);
}

/**
 * Open or close every panel at once.
 *
 * `expanded` picks the target state; omitting it flips each panel
 * individually, which is wd-collapse's documented behaviour.
 */
function toggleAll(options: SnCollapseToggleAllOptions = {}): void {
  if (props.viewmore) {
    innerViewmore.value = options.expanded ?? !innerViewmore.value;
    commit(innerNames.value);
    return;
  }
  /*
   * `skipDisabled` keeps disabled panels at their current state (wd-collapse's
   * documented contract, same option sn-checkbox-group honours) — the open set
   * is computed from the enabled panels plus whatever disabled panels were
   * already open.
   */
  const skip = options.skipDisabled === true;
  const enabledNames = skip
    ? allNames.value.filter((name) => !disabledNames.value.has(name))
    : allNames.value;
  const openDisabledNames = skip
    ? innerNames.value.filter((name) => disabledNames.value.has(name))
    : [];
  const next =
    options.expanded === undefined
      ? innerNames.value.some((name) => !disabledNames.value.has(name))
        ? openDisabledNames
        : [...innerNames.value, ...enabledNames]
      : options.expanded
        ? [...openDisabledNames, ...enabledNames]
        : openDisabledNames;
  innerNames.value = next;
  commit(next);
}

/**
 * Names the container knows about. Items register through `isExpanded`, so the
 * container cannot enumerate them from props alone — `toggleAll(true)` therefore
 * relies on the registered list, kept in `knownNames`.
 */
const knownNames = ref<string[]>([]);
/** Registered panels whose `disabled` prop is on; `skipDisabled` skips these. */
const disabledNames = ref<ReadonlySet<string>>(new Set());

const allNames = computed(() => knownNames.value);

/** View-more open flag, exposed to the `more` slot and the items. */
const viewmoreExpanded = computed(() => innerViewmore.value);

/** Report a panel name (and its disabled state) so `toggleAll` can enumerate every panel. */
function registerName(name: string, disabled?: boolean): void {
  if (!knownNames.value.includes(name)) knownNames.value = [...knownNames.value, name];
  const nextDisabled = new Set(disabledNames.value);
  if (disabled === true) nextDisabled.add(name);
  else nextDisabled.delete(name);
  disabledNames.value = nextDisabled;
}

function unregisterName(name: string): void {
  knownNames.value = knownNames.value.filter((entry) => entry !== name);
  if (!disabledNames.value.has(name)) return;
  const nextDisabled = new Set(disabledNames.value);
  nextDisabled.delete(name);
  disabledNames.value = nextDisabled;
}

provide(SN_COLLAPSE_KEY, {
  isExpanded,
  toggle,
  accordion: toRef(props, 'accordion'),
  viewmore: toRef(props, 'viewmore'),
  lineNum: toRef(props, 'lineNum'),
  viewmoreExpanded,
  toggleViewmore,
  card: toRef(props, 'card'),
  iconSize: toRef(props, 'iconSize'),
  iconColor: toRef(props, 'iconColor'),
  registerName,
  unregisterName,
});

/** Public imperative API — mirrors wd-collapse's exposed method (§14). */
defineExpose({ toggleAll });

const rootClass = computed(() => [
  'sn-collapse',
  {
    'sn-collapse--accordion': props.accordion,
    'sn-collapse--viewmore': props.viewmore,
    'sn-collapse--card': props.card,
  },
  props.customClass,
]);

/**
 * View-more chevron geometry — one tier below the panel glyph so the control
 * never outsizes the headings it collapses (the `more` line sits at
 * `--sn-mp-font-size-sm`).
 */
const MORE_ICON_SIZE_TIER = 'var(--sn-mp-icon-size-small)';

/** View-more chevron length: the family `iconSize` override, else the tier. */
const moreIconSize = computed<string | number>(() => {
  const size = props.iconSize;
  if (size === undefined) return MORE_ICON_SIZE_TIER;
  if (typeof size === 'number') return size;
  return resolveSnCollapseIconSize(size, MORE_ICON_SIZE_TIER);
});

/** View-more chevron colour: the family `iconColor`, else the action token. */
const moreIconStyle = computed(() =>
  props.iconColor === '' ? undefined : `color: ${props.iconColor}`,
);
</script>

<template>
  <view data-snui-component="collapse" :class="rootClass" :style="customStyle || undefined">
    <slot />

    <view
      v-if="viewmore"
      :class="['sn-collapse__more', customMoreSlotClass]"
      role="button"
      :aria-expanded="viewmoreExpanded"
      hover-class="sn-collapse__more--pressed"
      @tap="toggleViewmore"
    >
      <slot name="more" :expanded="viewmoreExpanded">
        <text class="sn-collapse__more-text">{{ viewmoreExpanded ? '收起' : '展开' }}</text>
        <view :class="['sn-collapse__more-arrow', { 'sn-collapse__more-arrow--up': viewmoreExpanded }]">
          <SnIcon
            class="sn-collapse__more-chevron"
            :icon="ChevronDown"
            :size="moreIconSize"
            :stroke-width="SN_COLLAPSE_ICON_STROKE_WIDTH"
            :style="moreIconStyle"
          />
        </view>
      </slot>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-collapse {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--sn-mp-color-background-surface);
}

/* Card mode (additive): the container goes transparent and the panels stack
   with a token gap — each item paints its own chrome. */
.sn-collapse--card {
  gap: var(--sn-mp-spacing-3);
  background-color: transparent;
}

.sn-collapse__more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sn-mp-spacing-3) 0;
}

/* Press feedback rides hover-class (§116.2 — App has no :active pseudo). */
.sn-collapse__more--pressed {
  opacity: 0.7;
}

.sn-collapse__more-text {
  margin-right: var(--sn-mp-spacing-1);
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-sm);
}

/* View-more chevron: shares the panel chevron's colour token and flips through
   a class so the rotation animates on App targets too (§116.2). */
.sn-collapse__more-arrow {
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
}

.sn-collapse__more-arrow--up {
  transform: rotate(180deg);
}

.sn-collapse__more-chevron {
  color: var(--sn-mp-color-action-primary);
}
</style>
