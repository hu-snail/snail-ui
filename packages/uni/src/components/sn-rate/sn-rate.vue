<script setup lang="ts">
/**
 * sn-rate (uni-end) — star rating with half-star support.
 *
 * Reference library: wot-ui `wd-rate`
 *   (https://wot-ui.cn/component/rate.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-rate 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-rate/sn-rate.vue
 * → auto-registered as `<sn-rate>` in any .vue that uses it.
 *
 * ## Half stars
 *
 * wot-ui renders a half icon through an icon-font glyph. The uni-end icon
 * layer ships lucide path data only (AGENTS.md §113 forbids emoji), so a half
 * star is the same full glyph clipped to 50% width by an `overflow: hidden`
 * wrapper. Same visual result, no extra glyph needed.
 *
 * ## Colors
 *
 * `color` / `activeColor` are user-supplied CSS colors forwarded as inline
 * custom properties. When unset, the component falls back to `--sn-mp-*`
 * tokens only — no light literal fallback (CONTRIBUTING §6).
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 分数文案 / 评价标签 — 由宿主渲染
 *   - 表单校验 — 用 sn-form-item
 */

import { computed, markRaw } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { resolveIconByName } from '../sn-icon/sn-icon-registry';
import { Star as StarIcon } from '../sn-icon/sn-icon-set';

defineOptions({ name: 'SnRate' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-rate` 1:1 surface ────────────────────────────────────── */

    /** Current score (`v-model`); `null` = nothing selected. */
    modelValue?: number | null;
    /** Number of icons. */
    num?: number;
    /** Read-only — the icons render but do not react to taps. */
    readonly?: boolean;
    /** Icon size. A number is treated as a px design value. */
    size?: string | number | undefined;
    /** Gap between icons. A number is treated as an rpx design value. */
    space?: string | number | undefined;
    /** Inactive icon color (CSS color). Empty = token default. */
    color?: string;
    /** Active icon color — a single color or one per icon. */
    activeColor?: string | string[];
    /** Inactive icon name (registry-resolved), default `star`. */
    icon?: string;
    /** Active icon name (registry-resolved), default `star`. */
    activeIcon?: string;
    /** Icon class prefix (wd-rate parity; informational on the uni end). */
    iconPrefix?: string;
    /** Treat `icon` / `activeIcon` as CSS class names instead of icon names. */
    cssIcon?: boolean | string;
    /** Disables every icon. */
    disabled?: boolean;
    /** Allow half-star selection. */
    allowHalf?: boolean;
    /** Tapping the current score clears it back to `null`. */
    clearable?: boolean;
    /** Stretch the icons across the full row width. */
    block?: boolean;
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the root node. */
    customStyle?: string;
  }>(),
  {
    modelValue: null,
    num: 5,
    readonly: false,
    size: undefined,
    space: undefined,
    color: '',
    activeColor: '',
    icon: 'star',
    activeIcon: 'star',
    iconPrefix: '',
    cssIcon: false,
    disabled: false,
    allowHalf: false,
    clearable: false,
    block: false,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void;
  (e: 'change', payload: { value: number | null }): void;
}>();

/* ── Icon resolution ───────────────────────────────────────────────────── */

/** Fallback glyph — the lucide `Star` shortcut shipped with `sn-icon-set`. */
const fallbackStar = markRaw(StarIcon);

/**
 * Resolve a prop icon name through the registry, falling back to the bundled
 * star so the component never renders an empty box. Per AGENTS.md §113 icons
 * must come from `sn-icon` — emoji are forbidden.
 */
function resolveIcon(name: string): IconData {
  const found = resolveIconByName(name);
  return found ?? fallbackStar;
}

const inactiveIconData = computed<IconData>(() => resolveIcon(props.icon));
const activeIconData = computed<IconData>(() => resolveIcon(props.activeIcon));

/** Icon size (sn-icon accepts a px number or any CSS length). */
const iconSize = computed<number | string>(() => {
  if (props.size === undefined || props.size === '') return 32;
  return props.size;
});

const useCssIcon = computed(() => props.cssIcon !== false && props.cssIcon !== '');

/* ── Value maths ───────────────────────────────────────────────────────── */

const count = computed(() => Math.max(Math.floor(props.num), 1));
const score = computed<number>(() => {
  const value = props.modelValue;
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), count.value);
});

const isInteractive = computed(() => !props.disabled && !props.readonly);

/** Active color for one index (supports the per-icon array form). */
function activeColorAt(index: number): string {
  const value = props.activeColor;
  if (Array.isArray(value)) return value[index] ?? value[value.length - 1] ?? '';
  return value;
}

/** State of one icon: full, half or empty. */
function stateAt(index: number): 'full' | 'half' | 'empty' {
  const remaining = score.value - index;
  if (remaining >= 1) return 'full';
  if (remaining >= 0.5) return 'half';
  return 'empty';
}

const rootClass = computed(() => [
  'sn-rate',
  {
    'sn-rate--disabled': props.disabled,
    'sn-rate--readonly': props.readonly,
    'sn-rate--block': props.block,
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  const vars: string[] = [];
  if (props.color) vars.push(`--sn-rate-inactive-color: ${props.color}`);
  if (props.activeColor && !Array.isArray(props.activeColor)) {
    vars.push(`--sn-rate-active-color: ${props.activeColor}`);
  }
  if (props.space !== undefined && props.space !== '') {
    const gap = typeof props.space === 'number' ? `${props.space * 2}rpx` : props.space;
    vars.push(`--sn-rate-item-space: ${gap}`);
  }
  const base = vars.join('; ');
  if (!props.customStyle) return base;
  return base ? `${base}; ${props.customStyle}` : props.customStyle;
});

function commit(value: number | null): void {
  if (!isInteractive.value) return;
  emit('update:modelValue', value);
  emit('change', { value });
}

/** Tap handler — with `allowHalf` the left half of an icon counts as 0.5. */
function onIconTap(index: number, event: Event): void {
  if (!isInteractive.value) return;
  let half = false;
  if (props.allowHalf) {
    const detail = event as unknown as {
      detail?: { x?: number };
      clientX?: number;
      target?: { getBoundingClientRect?: () => { left: number; width: number } };
    };
    const rect = detail.target?.getBoundingClientRect?.();
    const x = detail.detail?.x ?? detail.clientX ?? 0;
    if (rect && rect.width > 0) half = (x - rect.left) / rect.width < 0.5;
  }
  const next = index + (half ? 0.5 : 1);
  if (props.clearable && next === score.value) {
    commit(null);
    return;
  }
  commit(next);
}

const ariaLabel = computed(() => `rating ${score.value} of ${count.value}`);
</script>

<template>
  <view
    :class="rootClass"
    :style="rootStyle"
    :data-snui-component="'rate'"
    role="slider"
    :aria-label="ariaLabel"
    :aria-valuemin="0"
    :aria-valuemax="count"
    :aria-valuenow="score"
    :aria-readonly="readonly ? 'true' : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <view
      v-for="index in count"
      :key="index"
      class="sn-rate__item"
      role="button"
      :aria-label="`rate ${index}`"
      :aria-pressed="stateAt(index - 1) === 'empty' ? 'false' : 'true'"
      :tabindex="isInteractive ? 0 : -1"
      @tap="onIconTap(index - 1, $event)"
    >
      <!-- Inactive plate: shown alone for an empty icon, and as the
           background half for a half-selected one. -->
      <view
        v-if="stateAt(index - 1) !== 'full'"
        :class="[
          'sn-rate__glyph',
          'sn-rate__glyph--inactive',
          { 'sn-rate__glyph--css': useCssIcon },
        ]"
        :style="color ? { color } : undefined"
        aria-hidden="true"
      >
        <view v-if="useCssIcon" :class="icon" />
        <SnIcon v-else :icon="inactiveIconData" :size="iconSize" />
      </view>

      <!-- Active plate: full width for a full icon, clipped to 50% for half. -->
      <view
        v-if="stateAt(index - 1) !== 'empty'"
        :class="[
          'sn-rate__glyph',
          'sn-rate__glyph--active',
          {
            'sn-rate__glyph--css': useCssIcon,
            'sn-rate__glyph--half': stateAt(index - 1) === 'half',
          },
        ]"
        :style="activeColorAt(index - 1) ? { color: activeColorAt(index - 1) } : undefined"
        aria-hidden="true"
      >
        <view v-if="useCssIcon" :class="activeIcon" />
        <SnIcon v-else :icon="activeIconData" :size="iconSize" />
      </view>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-rate {
  display: inline-flex;
  align-items: center;
  gap: var(--sn-rate-item-space, var(--sn-mp-spacing-2));
  font-family: inherit;
}

.sn-rate--block {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.sn-rate--disabled,
.sn-rate--readonly {
  opacity: 0.6;
}

.sn-rate__item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.sn-rate__glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.sn-rate__glyph--active {
  color: var(--sn-rate-active-color, var(--sn-mp-color-feedback-warning));
}

.sn-rate__glyph--inactive {
  color: var(--sn-rate-inactive-color, var(--sn-mp-color-text-disabled));
}

/* Half star — the active plate is clipped to the left 50% of the item and
 * overlaid on the inactive plate underneath. */
.sn-rate__glyph--half {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 50%;
  overflow: hidden;
  justify-content: flex-start;
}

/* CSS-icon mode (wd-rate `css-icon`): the glyph is an icon-font class. */
.sn-rate__glyph--css {
  width: 1em;
  height: 1em;
  font-size: 32rpx;
}

/* Doodle skin — a slight hand-drawn tilt per star. */
.snui-skin-doodle .sn-rate__item {
  transform: rotate(-3deg);
}
</style>
