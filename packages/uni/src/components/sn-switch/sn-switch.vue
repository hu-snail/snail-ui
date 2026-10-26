<script setup lang="ts">
/**
 * sn-switch (uni-end) — on/off toggle for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-switch`
 *   (https://wot-ui.cn/component/switch.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-switch 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-switch/sn-switch.vue
 * → auto-registered as `<sn-switch>` in any .vue that uses it.
 *
 * The value model matches wd-switch: `activeValue` (default `true`) and
 * `inactiveValue` (default `false`) map arbitrary `boolean | string | number`
 * payloads onto the rail state, so string / numeric flags work 1:1.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 业务开关（权限 / 状态持久化）— 由宿主 action 处理
 *   - 校验信息展示 — 用 sn-form-item
 */

import { computed, markRaw, ref, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { resolveIconByName } from '../sn-icon/sn-icon-registry';
import { Check as CheckIcon, X as XIcon } from '../sn-icon/sn-icon-set';

defineOptions({ name: 'SnSwitch' });

/** Payload accepted by `v-model` / `activeValue` / `inactiveValue`. */
type SnSwitchValue = boolean | string | number;

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-switch` 1:1 surface ─────────────────────────────────── */

    /** Bound value — compared against `activeValue` / `inactiveValue`. */
    modelValue?: SnSwitchValue;
    /** Disables interaction and dims the rail. */
    disabled?: boolean;
    /** Knob icon while inactive (registry-resolved via sn-icon). */
    inactiveActionIcon?: string;
    /** Knob icon while active (registry-resolved via sn-icon). */
    activeActionIcon?: string;
    /** Rail icon while active — overrides `activeText`. */
    activeIcon?: string;
    /** Rail icon while inactive — overrides `inactiveText`. */
    inactiveIcon?: string;
    /** CSS class prefix used for icon lookup (wd-switch parity, informational). */
    classPrefix?: string;
    /** When `true`, `inactiveActionIcon` is a CSS class name, not an icon name. */
    inactiveActionCssIcon?: boolean | string;
    /** When `true`, `activeActionIcon` is a CSS class name, not an icon name. */
    activeActionCssIcon?: boolean | string;
    /** When `true`, `activeIcon` is a CSS class name, not an icon name. */
    activeCssIcon?: boolean | string;
    /** When `true`, `inactiveIcon` is a CSS class name, not an icon name. */
    inactiveCssIcon?: boolean | string;
    /** Label shown inside the rail while active. */
    activeText?: string;
    /** Label shown inside the rail while inactive. */
    inactiveText?: string;
    /** Value that means "on". Compared by strict equality. */
    activeValue?: SnSwitchValue;
    /** Value that means "off". Compared by strict equality. */
    inactiveValue?: SnSwitchValue;
    /** Active rail color (user CSS color; falls back to the token default). */
    activeColor?: string;
    /** Inactive rail color (user CSS color; falls back to the token default). */
    inactiveColor?: string;
    /** Rail size — a number is treated as an rpx design value. */
    size?: string | number | undefined;
    /** Rail shape. */
    shape?: 'round' | 'square';
    /** Shows a spinner in the knob and blocks interaction while pending. */
    loading?: boolean;
    /**
     * Loading indicator config — mirrors wot-ui `loading-props`.
     *
     * Only `color` / `size` are consumed by this component's spinner; extra
     * keys are accepted so a config written for wd-switch still type-checks.
     */
    loadingProps?:
      | {
          color?: string;
          size?: number | string;
          [key: string]: unknown;
        }
      | undefined;
    /**
     * Async guard — return `false` (or resolve `false`) to veto the toggle.
     * wd-switch's `beforeChange` contract, used for confirm dialogs /
     * server-side permission checks.
     */
    beforeChange?: (() => boolean | Promise<boolean>) | undefined;
    /** Class on the root wrapper. */
    customClass?: string;
    /** Inline style on the root wrapper. */
    customStyle?: string;
  }>(),
  {
    modelValue: false,
    disabled: false,
    inactiveActionIcon: '',
    activeActionIcon: '',
    activeIcon: '',
    inactiveIcon: '',
    classPrefix: 'wd-icon',
    inactiveActionCssIcon: false,
    activeActionCssIcon: false,
    activeCssIcon: false,
    inactiveCssIcon: false,
    activeText: '',
    inactiveText: '',
    activeValue: true,
    inactiveValue: false,
    activeColor: '',
    inactiveColor: '',
    size: undefined,
    shape: 'round',
    loading: false,
    loadingProps: undefined,
    beforeChange: undefined,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model sync — payload is `activeValue` / `inactiveValue`. */
  (e: 'update:modelValue', value: SnSwitchValue): void;
  /** Fired after a successful toggle (post `beforeChange`). */
  (e: 'change', value: SnSwitchValue): void;
}>();

/** Whether the bound value currently means "on". */
const isChecked = computed(() => props.modelValue === props.activeValue);

/** Local pending flag so an async `beforeChange` cannot double-fire. */
const isPending = ref(false);

/** Blocks the toggle: disabled, pending, or a running `beforeChange`. */
const isBlocked = computed(() => props.disabled || props.loading || isPending.value);

/** Keep the pending flag honest if the parent flips `loading` mid-flight. */
watch(
  () => props.loading,
  (loading) => {
    if (!loading) isPending.value = false;
  },
);

/** Knob / rail glyphs — always SnIcon, never emoji (§113). */
const checkIcon = markRaw(CheckIcon);
const closeIcon = markRaw(XIcon);
/**
 * Knob glyph. wd-switch names its icons (`activeActionIcon` /
 * `inactiveActionIcon`) and resolves them through the icon registry; when
 * `*CssIcon` is on, the same string is used as a CSS class instead (handled
 * by `actionIconClass`). Falls back to Check / X so the knob always shows a
 * real SVG glyph rather than an emoji (§113).
 */
const actionIcon = computed<IconData | null>(() => {
  const name = isChecked.value ? props.activeActionIcon : props.inactiveActionIcon;
  const cssMode = isChecked.value ? props.activeActionCssIcon : props.inactiveActionCssIcon;
  if (!name || cssMode) return null;
  const icon = resolveIconByName(name);
  return icon ? markRaw(icon) : null;
});

/**
 * CSS-class mode knob glyph — when the matching `*CssIcon` flag is on, the
 * same string is a class name rather than a registry key.
 */
const actionIconClass = computed(() => {
  if (isChecked.value) {
    return props.activeActionCssIcon && props.activeActionIcon ? props.activeActionIcon : '';
  }
  return props.inactiveActionCssIcon && props.inactiveActionIcon ? props.inactiveActionIcon : '';
});
/** Rail label: text wins unless an icon (name or CSS class) replaces it. */
const railText = computed(() => {
  if (isChecked.value) {
    return props.activeIcon || props.activeCssIcon ? '' : props.activeText;
  }
  return props.inactiveIcon || props.inactiveCssIcon ? '' : props.inactiveText;
});

const railIconClass = computed(() => {
  if (isChecked.value) return props.activeCssIcon ? props.activeIcon : '';
  return props.inactiveCssIcon ? props.inactiveIcon : '';
});

/**
 * Rail colors — `activeColor` / `inactiveColor` are user CSS colors applied
 * inline on top of the `--sn-mp-*` token defaults (wd-switch parity).
 * `size` accepts a raw CSS length or a number interpreted as rpx design units.
 */
const railStyle = computed(() => {
  const style: Record<string, string> = {};
  const color = isChecked.value ? props.activeColor : props.inactiveColor;
  if (color) style.backgroundColor = color;
  if (props.size !== undefined) {
    const length = typeof props.size === 'number' ? `${props.size}rpx` : props.size;
    style.width = length;
    style.height = `calc(${length} * 0.55)`;
  }
  return Object.keys(style).length > 0 ? style : undefined;
});

/**
 * Perform the toggle. `beforeChange` may be async; a rejected promise or a
 * `false` result aborts without emitting (§39 — errors are handled, not
 * swallowed silently into a half-applied state).
 */
async function toggle(): Promise<void> {
  if (isBlocked.value) return;
  if (props.beforeChange) {
    isPending.value = true;
    let allowed = false;
    try {
      allowed = await props.beforeChange();
    } catch {
      allowed = false;
    } finally {
      isPending.value = false;
    }
    if (!allowed) return;
  }
  const next = isChecked.value ? props.inactiveValue : props.activeValue;
  emit('update:modelValue', next);
  emit('change', next);
}

function onTap(): void {
  void toggle();
}

const classList = computed(() => [
  'sn-switch',
  `sn-switch--${props.shape}`,
  {
    'sn-switch--checked': isChecked.value,
    'sn-switch--disabled': props.disabled,
    'sn-switch--loading': props.loading || isPending.value,
    'sn-switch--with-rail-text': railText.value.length > 0,
  },
  props.customClass,
]);

const wrapperStyle = computed(() => props.customStyle || undefined);
</script>

<template>
  <view
    :class="classList"
    :style="wrapperStyle"
    :data-snui-component="'switch'"
    :data-shape="shape"
    role="switch"
    :aria-checked="isChecked ? 'true' : 'false'"
    :aria-disabled="disabled ? 'true' : undefined"
    :tabindex="isBlocked ? -1 : 0"
    @tap="onTap"
  >
    <view class="sn-switch__rail" :style="railStyle">
      <view class="sn-switch__inner">
        <text v-if="railText" class="sn-switch__rail-text">{{ railText }}</text>
        <view
          v-else-if="railIconClass"
          :class="['sn-switch__rail-icon', railIconClass]"
          aria-hidden="true"
        />

        <view class="sn-switch__action">
          <view v-if="loading || isPending" class="sn-switch__spinner" aria-hidden="true" />
          <view
            v-else-if="actionIconClass"
            :class="['sn-switch__action-icon', actionIconClass]"
            aria-hidden="true"
          />
          <SnIcon v-else-if="actionIcon" :icon="actionIcon" :size="20" />
          <SnIcon v-else :icon="isChecked ? checkIcon : closeIcon" :size="20" />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
/**
 * Geometry in rpx. Every color resolves through a real `--sn-mp-*` token —
 * no literal hex, no light-only `var()` fallback, so `.sn-theme-dark` flips
 * the rail and the knob together.
 */
.sn-switch {
  display: inline-flex;
  align-items: center;
  font-family: inherit;
  cursor: pointer;
  box-sizing: border-box;
}

.sn-switch__rail {
  display: inline-flex;
  align-items: center;
  width: 104rpx;
  height: 56rpx;
  padding: 4rpx;
  background-color: var(--sn-mp-color-control-unchecked);
  box-sizing: border-box;
  transition: background-color 0.3s ease-out;
}

.sn-switch--round .sn-switch__rail {
  border-radius: var(--sn-mp-radius-full);
}
.sn-switch--square .sn-switch__rail {
  border-radius: var(--sn-mp-radius-sm);
}

.sn-switch--checked .sn-switch__rail {
  background-color: var(--sn-mp-color-action-primary);
}

.sn-switch__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  gap: 4rpx;
}

/* Rail label — sits inside the track opposite the knob. */
.sn-switch__rail-text {
  font-size: var(--sn-mp-font-size-xs);
  line-height: 1;
  color: var(--sn-mp-color-text-on-primary);
  padding: 0 4rpx;
  white-space: nowrap;
}

.sn-switch__rail-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24rpx;
  height: 24rpx;
  color: var(--sn-mp-color-text-on-primary);
}

/* Knob. */
.sn-switch__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  flex: 0 0 auto;
  background-color: var(--sn-mp-color-control-knob);
  color: var(--sn-mp-color-action-primary);
  box-sizing: border-box;
  transition:
    transform 0.3s ease-out,
    color 0.3s ease-out;
}

.sn-switch--round .sn-switch__action {
  border-radius: 50%;
}
.sn-switch--square .sn-switch__action {
  border-radius: var(--sn-mp-radius-xs);
}

/* The knob slides to the opposite end when active. */
.sn-switch--checked .sn-switch__action {
  transform: translateX(0);
}
.sn-switch:not(.sn-switch--checked) .sn-switch__action {
  order: 2;
}

.sn-switch__action-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24rpx;
  height: 24rpx;
}

/* Loading spinner — pure CSS ring so no extra dependency is needed. */
.sn-switch__spinner {
  width: 24rpx;
  height: 24rpx;
  border: 3rpx solid var(--sn-mp-color-border-subtle);
  border-top-color: var(--sn-mp-color-action-primary);
  border-radius: 50%;
  animation: sn-switch-spin 0.8s linear infinite;
}

@keyframes sn-switch-spin {
  to {
    transform: rotate(360deg);
  }
}

.sn-switch--disabled,
.sn-switch--loading {
  cursor: not-allowed;
}
.sn-switch--disabled {
  opacity: 0.5;
}

/* Doodle skin — hand-drawn rail + offset shadow. */
.snui-skin-doodle .sn-switch__rail {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-sm);
  box-shadow: 2rpx 2rpx 0 var(--sn-mp-color-text-primary);
}
.snui-skin-doodle .sn-switch__action {
  border: 3rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
}
</style>
