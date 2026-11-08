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
 * ## Additive abilities (AUI-OPT-10, AGENTS.md §112.3a)
 *
 *   - `icon` / `iconImage`     导航项标题左侧的图标（数据 / 注册名 / 图片地址）
 *   - `badgeProps`             标题角标配置，透传 `sn-badge`（对齐 wd-tab `badge-props`）
 *   - swiper 内容区             容器的 `swipeable` 打开后本面板渲染为
 *                              `<swiper-item>`（原生 swiper 只接受该子节点形态）
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 页签导航条 — 由 sn-tabs 渲染
 *   - 面板切换动画编排 — 由 sn-tabs 的 animated / duration 决定
 */

import { computed, useSlots, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { nextUid } from '../../utils/uid';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { SN_TABS_KEY, type SnTabBadgeProps, type SnTabsValue } from './sn-tabs-types';

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
    /** 标题角标配置，透传给 `sn-badge`（对齐 wd-tab `badge-props`）。 */
    badgeProps?: SnTabBadgeProps | undefined;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;

    /* ── AUI-OPT-10 追加能力（AGENTS.md §112.3a） ────────────────────────── */

    /** 导航项标题左侧图标：IconData 数据或注册 / 内置图标名。 */
    icon?: IconData | string | undefined;
    /** 标题左侧图标图片地址（URL / base64），优先于 `icon`。 */
    iconImage?: string;
  }>(),
  {
    name: undefined,
    title: '',
    disabled: false,
    lazy: true,
    customClass: '',
    customStyle: '',
    iconImage: '',
  },
);

defineSlots<{
  /** 页签内容。 */
  default?(): unknown;
}>();

const tabs = inject(SN_TABS_KEY, null);

const slots = useSlots();

/** Whether the caller supplied pane content. Header-only tabs (pure nav
 * usage) render no pane shell — an empty pane's padding would otherwise
 * push the nav off-centre inside the container. */
const hasPaneContent = computed(() => typeof slots.default === 'function');

/** The container renders the pane list inside a native `<swiper>` when swipeable. */
const inSwiper = computed(() => tabs?.swiperMode.value ?? false);

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

// The latch alone decides rendering: once a pane has been shown it stays
// mounted (hidden by `v-show`), so switching tabs never drops its state.
//
// In swiper mode every pane is a slide the gesture can reveal mid-drag, so
// deferring the content would show an empty pane until the change event lands.
// The native swiper already renders all slides, so the lazy latch is skipped
// there (`lazy` keeps its meaning in the flow body).
const shouldRender = computed(() => inSwiper.value || hasRendered.value);

onMounted(() => {
  if (!tabs) return;
  registrationIndex.value = tabs.registerTab({
    uid,
    getName: () => props.name,
    getTitle: () => props.title,
    getDisabled: () => props.disabled,
    getIcon: () => props.icon,
    getIconImage: () => props.iconImage,
    getBadge: () => props.badgeProps,
  });
});

onBeforeUnmount(() => tabs?.unregisterTab(uid));

const rootClass = computed(() => [
  'sn-tab',
  {
    /* swiper-item is laid out by the native swiper; only the flow branch
     * needs the active display rule. */
    'sn-tab--active': !inSwiper.value && active.value,
    /* Header-only usage (pure nav tabs): keep the shell for customClass,
     * but drop the padding so an empty active pane cannot push the nav
     * off-centre inside the container. */
    'sn-tab--empty': !hasPaneContent.value,
  },
  props.customClass,
]);
</script>

<template>
  <swiper-item
    v-if="inSwiper"
    data-snui-component="tab"
    :class="rootClass"
    :style="customStyle || undefined"
    role="tabpanel"
    :aria-hidden="!active"
  >
    <slot v-if="shouldRender" />
  </swiper-item>

  <view
    v-else
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
.sn-tab--empty {
  padding: 0;
}
</style>
