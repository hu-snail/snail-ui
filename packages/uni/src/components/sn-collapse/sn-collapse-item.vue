<script setup lang="ts">
/**
 * sn-collapse-item (uni-end) — one expandable panel in a `sn-collapse`.
 *
 * Reference library: wot-ui `wd-collapse-item`
 *   (https://wot-ui.cn/component/collapse.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-collapse-item 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * Lives next to `sn-collapse.vue` so the provide/inject contract types
 * (`sn-collapse-types.ts`) stay beside both halves of the pair.
 *
 * ## beforeExpend
 *
 * The upstream prop name is `before-expend` (a typo upstream, kept verbatim so
 * the surface stays 1:1). The hook may return `boolean` or
 * `Promise<boolean>`; a rejection is treated as "do not open" rather than an
 * unhandled rejection (§83 — a node-level failure must not crash the page).
 *
 * ## Additive props (AUI-OPT-03, AGENTS.md §112.3a — wd-collapse-item has none)
 *
 * Title icon, three sources with one precedence chain (sn-cell's pattern):
 *
 *   - `titleIconData` — an inline `IconData` object; built-in set icons
 *     (`sn-icon-set`) are imported by the consumer and passed as objects, so
 *     no global registration step is needed.
 *   - `titleIconUrl` — an image URL, rendered as `<image>`.
 *   - `titleIcon` — a name forwarded to SnIcon: registry (`registerSnIcons`) →
 *     built-in catalogue (kebab-case, resolves with zero registration) →
 *     async providers (`prefix:rest`).
 *
 * Precedence: data object > image URL > name — the same order sn-cell uses.
 *
 *   - `iconSize` — chevron + title icon geometry; named tiers
 *     `tiny|small|medium|large|xlarge` map to `--sn-mp-icon-size-*`, numbers
 *     stay px, unknown strings pass through. Falls back to the container's
 *     `iconSize` and then to the family default (one glyph scale per panel).
 *   - `iconColor` — inline colour for both icons; pass a
 *     `var(--sn-mp-color-*)` token (§112.5). Falls back to the container's
 *     `iconColor`.
 *   - `iconStrokeWidth` — SVG stroke weight for both icons; defaults to the
 *     `--sn-mp-icon-stroke-width` design unit (2). An SVG presentation
 *     attribute cannot resolve `var()`, so the weight travels as a number.
 *   - `card` — per-panel card; falls back to the container's `card`.
 *
 * ## Icon colour / size standard (family-wide)
 *
 * Both states keep the same neutral colours — no action-primary highlight:
 *
 * | Slot        | Rest                            | Expanded                        |
 * | ----------- | ------------------------------- | ------------------------------- |
 * | Chevron     | `--sn-mp-color-text-tertiary`   | `--sn-mp-color-text-tertiary`   |
 * | Title icon  | `--sn-mp-color-text-secondary`  | `--sn-mp-color-text-secondary`  |
 *
 * Geometry comes from one length token per panel: `--sn-mp-icon-size-medium`
 * by default, overridable by tier name or an explicit length. The chevron stays
 * a bare glyph — no pill, no circular icon and no expanded background — so the
 * open state is carried by rotation alone.
 *
 * ## Chevron
 *
 * Always the built-in `ChevronDown` object, rotating 180° through the
 * `--expanded` class (a CSS class, not an inline transform, so App targets get
 * the same motion and the state is inspectable from the DOM).
 *
 * ## Body transition
 *
 * The body animates its **measured content height** instead of a guessed
 * `max-height`, so short and long panels share the same natural 0.24s unfold.
 * The height is read once through `uni.createSelectorQuery` (with a DOM
 * fallback on H5); when measurement is unavailable the class-based max-height
 * ceiling remains the safe fallback.
 *
 * View-more mode has two boxes instead of two states — the N-line clamp and
 * the full paragraph — and both are measured, so 展开 / 收起 animate between
 * them instead of only relabelling the control. The clamp lives on a padding-
 * free `-webkit-box` inside the padded wrapper (`-webkit-line-clamp` is inert
 * on any other element, and `overflow` clips at the padding box, which would
 * leak the next line into the gap). It also lands one transition late on
 * collapse so the text shrinks with the box rather than snapping to two lines
 * first.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 展开状态的持有 — 由 sn-collapse 持有
 *   - 内容排版 — 由使用方决定
 */

import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import { resolveUniHost } from '../../utils/uni-host';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { ChevronDown } from '../sn-icon/sn-icon-set';
import {
  resolveSnCollapseIconSize,
  SN_COLLAPSE_ICON_STROKE_WIDTH,
  SN_COLLAPSE_KEY,
  type SnCollapseItemBeforeExpand,
} from './sn-collapse-types';

defineOptions({ name: 'SnCollapseItem' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-collapse-item` 1:1 surface ──────────────────────────── */

    /** 折叠栏唯一标识符。 */
    name?: string;
    /** 折叠栏标题，支持 title 插槽覆盖。 */
    title?: string;
    /** 是否禁用该折叠栏。 */
    disabled?: boolean;
    /** 打开前拦截函数，接收 name，返回 boolean 或 Promise<boolean>。 */
    beforeExpend?: SnCollapseItemBeforeExpand | undefined;
    /** 是否显示边框。 */
    border?: boolean;
    /** 折叠栏内容容器自定义类名。 */
    customBodyClass?: string;
    /** 折叠栏内容容器自定义样式。 */
    customBodyStyle?: string;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;

    /* ── additive (AUI-OPT-03, AGENTS.md §112.3a) ────────────────────────── */

    /** 标题图标数据对象（内置图标集 / 自定义 IconData），优先级最高。 */
    titleIconData?: IconData;
    /** 标题图标名：registry（`registerSnIcons`）→ 内置目录（kebab-case）→ Provider 依次解析。 */
    titleIcon?: string;
    /** 标题图片地址：渲染为 `<image>`，优先级低于 `titleIconData`、高于 `titleIcon`。 */
    titleIconUrl?: string;
    /** 图标尺寸：数字按 px；档位名映射 `--sn-mp-icon-size-*`；未设置时继承容器。 */
    iconSize?: string | number | undefined;
    /** 图标颜色（箭头 + 标题图标）；请传 `var(--sn-mp-color-*)` token；未设置时继承容器。 */
    iconColor?: string;
    /** 图标描边宽度（箭头 + 标题图标）；默认 `--sn-mp-icon-stroke-width`（2）。 */
    iconStrokeWidth?: number | undefined;
    /** 卡片形态：该面板渲染为独立圆角卡片；未显式设置时继承 sn-collapse 的 card。 */
    card?: boolean | undefined;
  }>(),
  {
    name: '',
    title: '',
    disabled: false,
    beforeExpend: undefined,
    border: true,
    customBodyClass: '',
    customBodyStyle: '',
    customClass: '',
    customStyle: '',
    titleIcon: '',
    titleIconUrl: '',
    iconColor: '',
    iconStrokeWidth: SN_COLLAPSE_ICON_STROKE_WIDTH,
    /* Inheritance-resolving boolean: `undefined` is the "not set" marker, so the
       computed can fall back to the container. Vue would otherwise cast an
       absent boolean to `false` and make the container's `card` dead
       (sn-form-item's resolveBool contract). */
    card: undefined,
  },
);

const emit = defineEmits<{
  /** 展开状态变化时触发。 */
  (e: 'change', payload: { name: string; expanded: boolean }): void;
}>();

defineSlots<{
  /** 自定义标题区域，作用域 `{ expanded, disabled, isFirst }`。 */
  title?(scope: { expanded: boolean; disabled: boolean; isFirst: boolean }): unknown;
  /** 折叠栏内容。 */
  default?(): unknown;
}>();

const collapse = inject(SN_COLLAPSE_KEY, null);

const expanded = computed(() => collapse?.isExpanded(props.name) ?? false);
const isViewmore = computed(() => collapse?.viewmore.value ?? false);
const viewmoreExpanded = computed(() => collapse?.viewmoreExpanded.value ?? false);
/** View-more bodies stay visible; normal bodies follow the expanded flag. */
const bodyOpen = computed(() => isViewmore.value || expanded.value);

/* ── Measured height: the only way a height transition feels natural ─────── */

interface SelectorQueryLike {
  in(context?: unknown): SelectorQueryLike;
  select(selector: string): SelectorQueryLike;
  boundingClientRect(callback: (rect: unknown) => void): SelectorQueryLike;
  exec(): void;
}
interface UniHost {
  createSelectorQuery?: () => SelectorQueryLike;
}

const instance = getCurrentInstance();
const bodyInnerRef = ref<unknown>(null);

/** Normal / accordion mode: the box a panel unfolds to. */
const measuredBodyHeight = ref<number | null>(null);
/** View-more mode: the N-line box, measured while the clamp is on. */
const clampedBodyHeight = ref<number | null>(null);
/** View-more mode: the full box, measured while the clamp is off. */
const unclampedBodyHeight = ref<number | null>(null);

/** Must track the body `height` transition in the stylesheet below. */
const BODY_MOTION_MS = 240;

/**
 * View-more collapse runs in two beats: the box shrinks while the text is
 * still whole (clipped by `overflow`), and the N-line clamp only lands once
 * the box has finished moving. Clamping first would snap the paragraph to two
 * lines and then leave an empty gap shrinking behind it.
 */
const bodySettled = ref(true);
let settleTimer: ReturnType<typeof setTimeout> | null = null;

/** H5 / test fallback when no uni host measurement is available. */
function readDomHeight(): number | null {
  const target = bodyInnerRef.value as { $el?: HTMLElement } | HTMLElement | null;
  const node =
    target !== null && '$el' in target ? (target.$el ?? null) : (target as HTMLElement | null);
  const height = node?.offsetHeight;
  return typeof height === 'number' && height > 0 ? height : null;
}

/**
 * True while the paragraph box is in its N-line form. The measured inner box
 * wraps it, so a measurement taken in this state is the clamped box.
 */
const clampActive = computed(
  () =>
    isViewmore.value &&
    !viewmoreExpanded.value &&
    /* No cached clamped box yet (first collapse after mounting open): clamp at
       once so the measurement below can capture it. */
    (bodySettled.value || clampedBodyHeight.value === null),
);

/** Route a measurement to the slot that matches the state it was taken in. */
function storeBodyHeight(height: number): void {
  const px = Math.ceil(height);
  if (!isViewmore.value) {
    measuredBodyHeight.value = px;
    return;
  }
  if (clampActive.value) clampedBodyHeight.value = px;
  else unclampedBodyHeight.value = px;
}

/** Read the inner box once; the slot is static in practice, so no observer. */
function measureBodyHeight(): void {
  void nextTick(() => {
    const host = resolveUniHost<UniHost>();
    if (host?.createSelectorQuery !== undefined && instance !== null) {
      try {
        host
          .createSelectorQuery()
          .in(instance.proxy)
          .select('.sn-collapse-item__body-inner')
          .boundingClientRect((rect) => {
            const box = Array.isArray(rect) ? rect[0] : (rect as { height?: number } | null);
            const height = box?.height;
            if (typeof height === 'number' && height > 0) storeBodyHeight(height);
          })
          .exec();
      } catch {
        /* A mis-shaped host keeps the CSS max-height fallback. */
      }
    }
    const fallback = readDomHeight();
    if (fallback !== null && (isViewmore.value || measuredBodyHeight.value === null))
      storeBodyHeight(fallback);
  });
}

/**
 * View-more clamp — the shape of the paragraph box.
 *
 * `-webkit-line-clamp` only bites on the element that is itself the
 * `-webkit-box` of the paragraph. Style it on the outer body (a plain block
 * that carries the animated height) and it is a silent no-op: the paragraph
 * never clamps and 展开 / 收起 appear to do nothing. Only the line count is
 * inline here; the box geometry rides the `--clamped` modifier class so a
 * single class selector expresses it (§116.2 — no descendant selectors).
 */
const bodyInnerStyle = computed(() =>
  clampActive.value ? `-webkit-line-clamp: ${collapse?.lineNum.value ?? 2}` : undefined,
);

/** The box the body is animating to, in the current mode. */
const bodyHeightTarget = computed<number | null>(() => {
  if (!isViewmore.value) return measuredBodyHeight.value;
  /* A collapsing view-more aims straight at the cached N-line box, so the
   * text shrinks with the box instead of snapping shut first. Opening falls
   * back to that same box until the full height is known — pinning it keeps
   * the first unfold a transition instead of a jump to `height: auto`. */
  return viewmoreExpanded.value
    ? (unclampedBodyHeight.value ?? clampedBodyHeight.value)
    : clampedBodyHeight.value;
});

const bodyStyle = computed(() => {
  const parts: string[] = [];
  /* An exact height animates smoothly; without one the open class falls back
   * to a max-height ceiling. `max-height: none` clears the collapsed cap. */
  const height = bodyHeightTarget.value;
  if (bodyOpen.value && height !== null) {
    parts.push('max-height: none', `height: ${height}px`);
  }
  if (props.customBodyStyle) parts.push(props.customBodyStyle);
  return parts.length > 0 ? parts.join('; ') : undefined;
});

/** Card mode (additive): an explicit per-panel prop wins over the container. */
const effectiveCard = computed(() => props.card ?? collapse?.card.value ?? false);

/** One glyph scale per panel: own prop → container → family default token. */
const effectiveIconSize = computed<string | number>(() =>
  resolveSnCollapseIconSize(props.iconSize ?? collapse?.iconSize.value),
);

/**
 * Which title-icon source renders. Data object wins over the image URL, which
 * wins over the name — exactly the priority sn-cell documents.
 */
const titleIconSource = computed<'data' | 'url' | 'name' | 'none'>(() => {
  if (props.titleIconData !== undefined) return 'data';
  if (props.titleIconUrl !== '') return 'url';
  if (props.titleIcon !== '') return 'name';
  return 'none';
});

/** Inline colour shared by the chevron and the title icon (additive). */
const effectiveIconColor = computed(() => props.iconColor || collapse?.iconColor.value || '');

/** Inline colour style; an empty prop keeps the class-level token default. */
const iconColorStyle = computed(() =>
  effectiveIconColor.value ? `color: ${effectiveIconColor.value}` : undefined,
);

/** Size box for the image icon path, mirroring `effectiveIconSize`. */
const iconBoxStyle = computed(() => {
  const size = effectiveIconSize.value;
  const len = typeof size === 'number' ? `${size}px` : size;
  return `width: ${len}; height: ${len};`;
});

/** Runs the veto hook, treating a rejection as "stay closed". */
async function canExpand(): Promise<boolean> {
  if (!props.beforeExpend) return true;
  try {
    return await props.beforeExpend(props.name);
  } catch {
    return false;
  }
}

async function onTap(): Promise<void> {
  if (props.disabled || !collapse) return;
  /* Collapsing never needs a veto — only opening does. */
  if (!expanded.value && !(await canExpand())) return;
  collapse.toggle(props.name);
  /* `expanded` already reflects the post-toggle state, so it *is* the new one. */
  emit('change', { name: props.name, expanded: expanded.value });
}

/* The container needs the name list for `toggleAll`; report it on mount. */
onMounted(() => {
  collapse?.registerName(props.name, props.disabled);
  measureBodyHeight();
});
/* Keep the registered disabled state fresh so `skipDisabled` stays accurate. */
watch(
  () => props.disabled,
  (disabled) => collapse?.registerName(props.name, disabled),
);
/* Late slot / font layout can change the box after mount — remeasure on open.
 * Same value is a no-op, so there is no visible jump in the common case. */
watch(bodyOpen, (open) => {
  if (open) measureBodyHeight();
});
/* View-more flips between two boxes (N lines / full), and neither the open
 * state nor `bodyOpen` changes — this panel is always "open". Without this
 * watch the height stays pinned to whatever was measured on mount, which is
 * precisely why the 展开 / 收起 control looked dead. */
watch(viewmoreExpanded, () => {
  if (!isViewmore.value) return;
  bodySettled.value = false;
  measureBodyHeight();
  if (settleTimer !== null) clearTimeout(settleTimer);
  settleTimer = setTimeout(() => {
    settleTimer = null;
    bodySettled.value = true;
    /* The clamp just landed: capture the N-line box for the next collapse. */
    measureBodyHeight();
  }, BODY_MOTION_MS);
});
onBeforeUnmount(() => {
  if (settleTimer !== null) clearTimeout(settleTimer);
  collapse?.unregisterName(props.name);
});

/** Slot scope flags, narrowed to `boolean` for the template. */
const isExpandedForSlot = computed<boolean>(() => expanded.value === true);
const isDisabledForSlot = computed<boolean>(() => props.disabled === true);

const rootClass = computed(() => [
  'sn-collapse-item',
  {
    'sn-collapse-item--expanded': expanded.value,
    'sn-collapse-item--disabled': props.disabled,
    // A card owns its outline — the shared divider would double up.
    'sn-collapse-item--border': props.border && !effectiveCard.value,
    'sn-collapse-item--card': effectiveCard.value,
  },
  props.customClass,
]);
</script>

<template>
  <view data-snui-component="collapse-item" :class="rootClass" :style="customStyle || undefined">
    <view
      class="sn-collapse-item__header"
      role="button"
      :aria-expanded="expanded"
      :aria-disabled="disabled"
      :aria-label="title || undefined"
      :hover-class="disabled ? 'none' : 'sn-collapse-item__header--pressed'"
      @tap="onTap"
    >
      <view class="sn-collapse-item__title">
        <!-- Icon precedence (additive): data object > image URL > name chain. -->
        <SnIcon
          v-if="titleIconSource === 'data'"
          class="sn-collapse-item__title-icon"
          :style="iconColorStyle"
          :icon="titleIconData"
          :size="effectiveIconSize"
          :stroke-width="iconStrokeWidth"
        />
        <image
          v-else-if="titleIconSource === 'url'"
          class="sn-collapse-item__title-image"
          :src="titleIconUrl"
          mode="aspectFill"
          :style="iconBoxStyle"
          aria-hidden="true"
        />
        <SnIcon
          v-else-if="titleIconSource === 'name'"
          class="sn-collapse-item__title-icon"
          :style="iconColorStyle"
          :icon="titleIcon"
          :size="effectiveIconSize"
          :stroke-width="iconStrokeWidth"
        />

        <view class="sn-collapse-item__title-body">
          <slot
            name="title"
            :expanded="isExpandedForSlot"
            :disabled="isDisabledForSlot"
            :is-first="false"
          >
            <text class="sn-collapse-item__title-text">{{ title }}</text>
          </slot>
        </view>
      </view>
      <view class="sn-collapse-item__arrow" aria-hidden="true">
        <SnIcon
          class="sn-collapse-item__chevron"
          :icon="ChevronDown"
          :size="effectiveIconSize"
          :stroke-width="iconStrokeWidth"
          :style="iconColorStyle"
        />
      </view>
    </view>

    <view
      :class="[
        'sn-collapse-item__body',
        {
          'sn-collapse-item__body--open': bodyOpen,
          'sn-collapse-item__body--clamped': clampActive,
        },
        customBodyClass,
      ]"
      :style="bodyStyle"
      role="region"
      :aria-hidden="!bodyOpen"
    >
      <view ref="bodyInnerRef" class="sn-collapse-item__body-inner">
        <!-- The clamp box carries no padding: `overflow: hidden` clips at the
             padding box, so padding here would leak the next line into the gap. -->
        <view
          :class="[
            'sn-collapse-item__body-clamp',
            { 'sn-collapse-item__body-clamp--clamped': clampActive },
          ]"
          :style="bodyInnerStyle"
        >
          <slot />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-collapse-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--sn-mp-color-background-surface);
}

.sn-collapse-item--border {
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

/* Card mode (additive): token chrome per panel; the shared divider is already
   suppressed in the root class, so a card never doubles up with it. */
.sn-collapse-item--card {
  overflow: hidden;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-lg);
  box-shadow: var(--sn-mp-shadow-sm);
}

.sn-collapse-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  min-height: 96rpx;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  background-color: var(--sn-mp-color-background-surface);
}

/* Press feedback rides hover-class (§116.2 — App has no :active pseudo). */
.sn-collapse-item__header--pressed {
  background-color: var(--sn-mp-color-background-soft);
}

.sn-collapse-item--disabled .sn-collapse-item__header {
  opacity: 0.5;
}

.sn-collapse-item__title {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  min-width: 0;
}

/* Title icons (additive) sit in the secondary text slot and keep that neutral
   colour in both states — the chevron rotation alone signals expansion. */
.sn-collapse-item__title-icon {
  flex: 0 0 auto;
  color: var(--sn-mp-color-text-secondary);
}

/* Image icon path — the size box rides the inline style. */
.sn-collapse-item__title-image {
  display: block;
  flex: 0 0 auto;
  border-radius: var(--sn-mp-radius-sm);
}

.sn-collapse-item__title-body {
  display: flex;
  align-items: center;
  min-width: 0;
}

.sn-collapse-item__title-text {
  overflow: hidden;
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Bare chevron: the whole header is the tap target, so the arrow needs no
   pill, circle or backing — rotation alone carries the open state. */
.sn-collapse-item__arrow {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  margin-left: var(--sn-mp-spacing-2);
  transition: transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* Chevron keeps the tertiary token in both states; rotation rides a class so
   App targets get the same transition and the state stays DOM-inspectable. */
.sn-collapse-item__chevron {
  color: var(--sn-mp-color-text-tertiary);
}

.sn-collapse-item--expanded .sn-collapse-item__arrow {
  transform: rotate(180deg);
}

/* Body reveal: animate the measured content height so the curve always ends
 * exactly at the content edge — no ceiling dead-time, no rigid snap. The
 * max-height rule is only the fallback when measurement is unavailable. */
.sn-collapse-item__body {
  box-sizing: border-box;
  width: 100%;
  height: 0;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
  transform: translateY(-6rpx);
  transition:
    height 0.24s cubic-bezier(0.2, 0.8, 0.2, 1),
    max-height 0.24s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.18s ease-out,
    transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.sn-collapse-item__body--open {
  height: auto;
  max-height: var(--sn-collapse-body-max-height, 1200rpx);
  opacity: 1;
  transform: translateY(0);
}

/* Padding is always present on the measured inner box — it must already be in
 * the box we measure while collapsed, otherwise expanding adds height later and
 * the last line gets clipped. The body's height transition hides it when shut. */
.sn-collapse-item__body-inner {
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4) var(--sn-mp-spacing-4);
}

/* View-more clamp: this box becomes the paragraph's `-webkit-box`, so the line
 * count (inline, from `lineNum`) has a box to act on. It deliberately carries
 * no padding — `overflow: hidden` clips at the padding box, and a bottom
 * padding would leave the top slice of the next line visible under the gap. */
.sn-collapse-item__body-clamp {
  width: 100%;
}

.sn-collapse-item__body-clamp--clamped {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* `.sn-collapse-item__body--clamped` stays a state hook only (callers / skins
 * read it); the geometry lives on the inner modifier above. */

/* Doodle skin — heavier divider. */
.snui-skin-doodle .sn-collapse-item--border {
  border-bottom-width: 4rpx;
  border-bottom-color: var(--sn-mp-color-text-primary);
}
</style>
