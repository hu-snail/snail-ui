<script setup lang="ts">
/**
 * sn-sidebar (uni-end) — vertical side navigation container.
 *
 * Reference library: wot-ui `wd-sidebar`
 *   (https://wot-ui.cn/component/sidebar.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-sidebar 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-sidebar/sn-sidebar.vue
 * → auto-registered as `<sn-sidebar>` in any .vue that uses it.
 *
 * The container owns the single-value `v-model`; children
 * (`sn-sidebar-item`) read the selection through `provide`/`inject`
 * (`sn-sidebar-types.ts`).
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 右侧内容面板 — 由使用方按 `change` 自行切换
 *   - 横向分段器 — 用 sn-segmented
 *   - 顶部 / 底部导航 — 用 sn-navbar / sn-tabbar
 */

import { computed, provide, ref, toRef, watch } from 'vue';
import { SN_SIDEBAR_KEY, type SnSidebarValue } from './sn-sidebar-types';

defineOptions({ name: 'SnSidebar' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-sidebar` 1:1 surface ────────────────────────────────── */

    /** 当前激活项的值。 */
    modelValue?: SnSidebarValue;
    /** 切换前钩子，接收目标值，返回 boolean 或 Promise<boolean>。 */
    beforeChange?: ((value: SnSidebarValue) => boolean | Promise<boolean>) | undefined;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    modelValue: 0,
    beforeChange: undefined,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model 同步。 */
  (e: 'update:modelValue', value: SnSidebarValue): void;
  /** 激活项切换时触发。 */
  (e: 'change', payload: { value: SnSidebarValue; label: string }): void;
}>();

defineSlots<{
  /** SidebarItem 列表。 */
  default?(): unknown;
}>();

/** Uncontrolled fallback + controlled sync — both modes stay in step. */
const innerValue = ref<SnSidebarValue>(props.modelValue);
watch(
  () => props.modelValue,
  (next) => {
    innerValue.value = next;
  },
);
const activeValue = computed<SnSidebarValue>(() => innerValue.value);

function isActive(value: SnSidebarValue): boolean {
  return activeValue.value === value;
}

/** Commit a switch. `beforeChange` can veto (sync `false` / rejected promise). */
async function select(value: SnSidebarValue, label: string): Promise<void> {
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
  emit('change', { value, label });
}

provide(SN_SIDEBAR_KEY, {
  activeValue,
  isActive,
  select: (value: SnSidebarValue, label: string) => {
    void select(value, label);
  },
});

/** Public imperative API — host pages can drive the sidebar from code (§14). */
defineExpose({ select });

const rootClass = computed(() => ['sn-sidebar', props.customClass]);
</script>

<template>
  <view
    data-snui-component="sidebar"
    :class="rootClass"
    :style="customStyle || undefined"
    role="tablist"
    aria-orientation="vertical"
  >
    <slot />
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-sidebar {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 200rpx;
  height: 100%;
  overflow-y: auto;
  background-color: var(--sn-mp-color-background-soft);
}

/* Doodle skin — heavier left rule so the column reads as a drawn divider. */
.snui-skin-doodle .sn-sidebar {
  border-right: 4rpx solid var(--sn-mp-color-text-primary);
}
</style>
