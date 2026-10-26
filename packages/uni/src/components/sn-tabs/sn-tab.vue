<script setup lang="ts">
/**
 * sn-tab (uni-end) — single pane inside a `sn-tabs` container.
 *
 * Reference library: wot-ui `wd-tab`
 *   (https://wot-ui.cn/component/tabs.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-tab 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * Lives next to `sn-tabs.vue` so the provide/inject contract types
 * (`sn-tabs-types.ts`) stay beside both halves of the pair — the same layout
 * `sn-radio` / `sn-radio-group` uses.
 *
 * ## Why registration happens in `onMounted`, not during setup
 *
 * The container keeps its pane list in a reactive array. Pushing into it while
 * the parent is mid-render would make the parent re-render from inside its own
 * render effect (Vue then warns about recursive updates). `onMounted` runs
 * after the parent's render pass and children mount in DOM order, so the array
 * ends up in template order — exactly the order the index-based `v-model`
 * resolves against.
 *
 * ## Lazy mounting
 *
 * `lazy` (default `true`) is wd-tab's contract: a pane's content is not
 * rendered until it has been active at least once. The `hasRendered` latch is
 * one-way on purpose — once a pane has mounted, hiding it again must not throw
 * its state away, otherwise a form would lose every keystroke on tab switch.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 页签导航条 — 由 sn-tabs 渲染
 *   - 面板切换动画编排 — 由 sn-tabs 的 animated / duration 决定
 */

import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { nextUid } from '../../utils/uid';
import { SN_TABS_KEY, type SnTabsValue } from './sn-tabs-types';

defineOptions({ name: 'SnTab' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-tab` 1:1 surface ────────────────────────────────────── */

    /** 标签唯一标识，默认取索引。 */
    name?: SnTabsValue | undefined;
    /** 标签标题。 */
    title?: string;
    /** 是否禁用。 */
    disabled?: boolean;
    /** 是否懒加载内容（首次激活后才渲染）。 */
    lazy?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    name: undefined,
    title: '',
    disabled: false,
    lazy: true,
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** 页签内容。 */
  default?(): unknown;
}>();

const tabs = inject(SN_TABS_KEY, null);

/** Stable registration id — keeps the unregister call unambiguous. */
const uid = nextUid();

/** Index inside the container; `-1` until the mount hook has run. */
const registrationIndex = ref(-1);

const active = computed(() => tabs?.isActive(registrationIndex.value, props.name) ?? false);

/** One-way latch: once active, the content stays mounted (`lazy` contract). */
const hasRendered = ref(!props.lazy || active.value);
watch(
  active,
  (isNowActive) => {
    if (isNowActive) hasRendered.value = true;
  },
  { immediate: true },
);

const shouldRender = computed(() => hasRendered.value && (active.value || !props.lazy));

onMounted(() => {
  if (!tabs) return;
  registrationIndex.value = tabs.registerTab({
    uid,
    getName: () => props.name,
    getTitle: () => props.title,
    getDisabled: () => props.disabled,
  });
});

onBeforeUnmount(() => tabs?.unregisterTab(uid));

const rootClass = computed(() => [
  'sn-tab',
  {
    'sn-tab--active': active.value,
  },
  props.customClass,
]);
</script>

<template>
  <view
    v-show="active"
    data-snui-component="tab"
    :class="rootClass"
    :style="customStyle || undefined"
    role="tabpanel"
    :aria-hidden="!active"
  >
    <slot v-if="shouldRender" />
  </view>
</template>

<style scoped>
.sn-tab {
  width: 100%;
  box-sizing: border-box;
  padding: var(--sn-mp-spacing-4);
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
}

.sn-tab--active {
  display: block;
}
</style>
