<script setup lang="ts">
/**
 * sn-tabbar (uni-end) — bottom tab bar container for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-tabbar`
 *   (https://wot-ui.cn/component/tabbar.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-tabbar 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-tabbar/sn-tabbar.vue
 * → auto-registered as `<sn-tabbar>` in any .vue that uses it.
 *
 * The bar owns the single-value `v-model`; children (`sn-tabbar-item`) read
 * the selection through `provide`/`inject` (`sn-tabbar-types.ts`) and fall
 * back to their own registration index when they carry no `name` — the
 * wd-tabbar "索引值或者名称" contract.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 页面切换 / 路由 — 由宿主 AppBridge 处理，组件只 emit `change`
 *   - 单个标签项渲染 — 用 sn-tabbar-item
 *   - 顶部导航 — 用 sn-navbar
 */

import { computed, provide, ref, toRef, watch } from 'vue';
import { SN_TABBAR_KEY, type SnTabbarValue } from './sn-tabbar-types';

defineOptions({ name: 'SnTabbar' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-tabbar` 1:1 surface ─────────────────────────────────── */

    /** 选中标签的索引值或者名称。 */
    modelValue?: SnTabbarValue;
    /** 是否固定在底部。 */
    fixed?: boolean;
    /** 是否显示顶部边框。 */
    bordered?: boolean;
    /** 是否设置底部安全区。 */
    safeAreaInsetBottom?: boolean;
    /** 标签栏形状：default / round。 */
    shape?: 'default' | 'round';
    /** 激活标签颜色（内联覆盖，空 = 令牌默认）。 */
    activeColor?: string;
    /** 未激活标签颜色（内联覆盖，空 = 令牌默认）。 */
    inactiveColor?: string;
    /** 固定在底部时，是否生成等高占位元素。 */
    placeholder?: boolean;
    /** 组件层级。 */
    zIndex?: number;
    /** 切换前的回调，返回 false 可阻止切换，支持 Promise<boolean>。 */
    beforeChange?: ((value: SnTabbarValue) => boolean | Promise<boolean>) | undefined;
    /**
     * 毛玻璃风格（additive，Human 指令 2026-11-01）：背景换成半透明表面 +
     * backdrop-filter 高斯模糊；固定在底部时页面内容从栏后透出。`bordered`
     * 照常叠加。
     */
    glass?: boolean;
    /**
     * 中心凸起项（additive，Human 指令 2026-11-01）：把第 `index` 个标签
     * 渲染成上凸的圆形主按钮（`icon` 为凸起按钮字形，title 不渲染）。值为
     * `null` 关闭。凸起项的行为与普通标签一致（点击即切换）。
     */
    elevate?: { index: number; icon: string } | null;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    modelValue: 0,
    fixed: false,
    bordered: false,
    safeAreaInsetBottom: false,
    shape: 'default',
    activeColor: '',
    inactiveColor: '',
    placeholder: false,
    zIndex: 10,
    glass: false,
    elevate: null,
    beforeChange: undefined,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model 同步。 */
  (e: 'update:modelValue', value: SnTabbarValue): void;
  /** 标签切换时触发。 */
  (e: 'change', payload: { value: SnTabbarValue }): void;
}>();

defineSlots<{
  /** TabbarItem 列表。 */
  default?(): unknown;
}>();

/** Uncontrolled fallback + controlled sync — both modes stay in step. */
const innerValue = ref<SnTabbarValue>(props.modelValue);
watch(
  () => props.modelValue,
  (next) => {
    innerValue.value = next;
  },
);
const activeValue = computed<SnTabbarValue>(() => innerValue.value);

/** Item registration counter — provides the default index-based `name`. */
let itemCounter = 0;

function nextIndex(): number {
  const index = itemCounter;
  itemCounter += 1;
  return index;
}

function isActive(value: SnTabbarValue): boolean {
  return activeValue.value === value;
}

/**
 * Commit a selection. `beforeChange` runs first and can veto (sync `false`
 * or a rejected / `false` promise) — wd-tabbar's documented contract.
 */
async function select(value: SnTabbarValue): Promise<void> {
  if (isActive(value)) return;
  if (props.beforeChange) {
    let allowed: boolean;
    try {
      allowed = await props.beforeChange(value);
    } catch {
      return;
    }
    if (!allowed) return;
  }
  innerValue.value = value;
  emit('update:modelValue', value);
  emit('change', { value });
}

provide(SN_TABBAR_KEY, {
  activeValue,
  isActive,
  select: (value: SnTabbarValue) => {
    void select(value);
  },
  nextIndex,
  activeColor: toRef(props, 'activeColor'),
  inactiveColor: toRef(props, 'inactiveColor'),
  shape: toRef(props, 'shape'),
  elevate: toRef(props, 'elevate'),
});

/** Public imperative API — host pages can drive the bar from code (§14). */
defineExpose({ select });

/** Whether the elevated center action is configured (drives placeholder height). */
const hasElevate = computed(() => props.elevate !== null && props.elevate !== undefined);

const rootClass = computed(() => [
  'sn-tabbar',
  `sn-tabbar--${props.shape}`,
  {
    'sn-tabbar--fixed': props.fixed,
    'sn-tabbar--bordered': props.bordered,
    'sn-tabbar--safe-area': props.safeAreaInsetBottom,
    'sn-tabbar--glass': props.glass,
    'sn-tabbar--elevated': hasElevate.value,
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  const parts: string[] = [];
  if (props.fixed) parts.push(`z-index: ${props.zIndex}`);
  if (props.customStyle) parts.push(props.customStyle);
  return parts.length > 0 ? parts.join('; ') : undefined;
});
</script>

<template>
  <view
    v-if="fixed && placeholder"
    class="sn-tabbar__placeholder"
    :class="{ 'sn-tabbar__placeholder--elevated': hasElevate }"
    aria-hidden="true"
  />
  <view data-snui-component="tabbar" :class="rootClass" :style="rootStyle" role="tablist">
    <slot />
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-tabbar {
  /* Items (slotted, own scope) read this to match the bar surface — the
   * elevated fab + its ring follow glass mode with zero prop plumbing. */
  --sn-tabbar-bar-bg: var(--sn-mp-color-background-surface);
  display: flex;
  align-items: stretch;
  box-sizing: border-box;
  width: 100%;
  height: 100rpx;
  background-color: var(--sn-tabbar-bar-bg);
}

.sn-tabbar--fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.sn-tabbar--bordered {
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-tabbar--safe-area {
  height: auto;
  min-height: 100rpx;
  padding-bottom: env(safe-area-inset-bottom);
}

.sn-tabbar--round {
  height: auto;
  min-height: 100rpx;
  margin: 0 var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-full);
  box-shadow: var(--sn-mp-shadow-md);
}

.sn-tabbar__placeholder {
  width: 100%;
  height: 100rpx;
}

/* fixed + placeholder + elevated: reserve the taller bar (128rpx). */
.sn-tabbar__placeholder--elevated {
  height: 128rpx;
}

/* ── Glass（additive）：半透明表面 + backdrop 高斯模糊。固定在底部时页面
 * 内容从栏后透出；暗色由 .sn-theme-dark 的玻璃色插槽翻转。 ────────────── */
.sn-tabbar--glass {
  --sn-tabbar-bar-bg: var(--sn-mp-color-glass-bar, rgba(255, 255, 255, 0.72));
  backdrop-filter: blur(20rpx) saturate(1.6);
  -webkit-backdrop-filter: blur(20rpx) saturate(1.6);
}

.sn-theme-dark .sn-tabbar--glass,
.sn-tabbar--glass.sn-theme-dark {
  --sn-tabbar-bar-bg: var(--sn-mp-color-glass-bar-dark, rgba(24, 24, 27, 0.72));
}

/* 凸起中心项要向上溢出栏体：加高栏身给圆钮留呼吸空间（fixed + placeholder
 * 时占位元素用同一变量等高，见 .sn-tabbar__placeholder）。 ─────────────── */
.sn-tabbar--elevated {
  height: auto;
  min-height: 128rpx;
}

/* Doodle skin — heavier rule above the bar. */
.snui-skin-doodle .sn-tabbar {
  border-top: 4rpx solid var(--sn-mp-color-text-primary);
}
</style>
