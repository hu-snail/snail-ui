<script setup lang="ts">
/**
 * sn-loadmore (uni-end) — list footer that reports the load state.
 *
 * Reference library: wot-ui `wd-loadmore`
 *   (https://wot-ui.cn/component/loadmore.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-loadmore 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-loadmore/sn-loadmore.vue
 * → auto-registered as `<sn-loadmore>` in any .vue that uses it.
 *
 * ## Why no timer / no scroll listener (AGENTS.md §41)
 *
 * The component is state-driven: the host page decides when `state` becomes
 * `loading` / `finished` / `error` (it owns the paging request). There is no
 * intersection observer, no scroll listener and no timer here, so nothing can
 * leak.
 *
 * ## Documented divergences from wd-loadmore
 *
 *   - `loading-props` is forwarded to `sn-loading`; the wd `LoadingProps` grid
 *     includes web-only members (`inheritColor` is supported, `color` / `size`
 *     / `type` / `text` are the honoured subset).
 *   - The reference's i18n default texts are hardcoded to Simplified Chinese
 *     here (the uni end has no locale provider yet); pass the `*-text` props to
 *     localize.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 分页请求 / 无限滚动触发 — 由宿主页面负责
 *   - 骨架屏 — 用 sn-skeleton
 *   - 空状态 — 用 sn-empty
 */

import { computed } from 'vue';
import SnLoading from '../sn-loading/sn-loading.vue';

defineOptions({ name: 'SnLoadmore' });

/** Load state. Mirrors `wd-loadmore` `state`. */
type LoadMoreState = '' | 'loading' | 'finished' | 'error';

const props = withDefaults(
  defineProps<{
    /** Current load state; empty renders nothing. */
    state?: LoadMoreState;
    /** Text shown while loading. */
    loadingText?: string;
    /** Text shown once everything is loaded. */
    finishedText?: string;
    /** Text shown after a failure. */
    errorText?: string;
    /** Props forwarded to the inner sn-loading. */
    loadingProps?: Record<string, unknown>;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
  }>(),
  {
    state: '',
    loadingText: '正在努力加载中...',
    finishedText: '已加载完毕',
    errorText: '加载失败',
    loadingProps: () => ({}),
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** Custom loading content. */
  loading?(): unknown;
  /** Custom finished content. */
  finished?(): unknown;
  /** Custom error content. */
  error?(): unknown;
}>();

const emit = defineEmits<{
  (e: 'reload'): void;
}>();

/** The error state is tappable and adds the retry hint. */
const isError = computed(() => props.state === 'error');

const rootClass = computed(() => [
  'sn-loadmore',
  { 'sn-loadmore--error': isError.value },
  props.customClass,
]);

const rootStyle = computed(() => (props.customStyle ? props.customStyle : undefined));

function onTap(): void {
  if (!isError.value) return;
  emit('reload');
}
</script>

<template>
  <view
    v-if="state !== ''"
    data-snui-component="loadmore"
    :class="rootClass"
    :style="rootStyle"
    role="status"
    aria-live="polite"
    :aria-busy="state === 'loading'"
    @tap="onTap"
  >
    <slot v-if="state === 'loading'" name="loading">
      <view class="sn-loadmore__spinner">
        <SnLoading v-bind="loadingProps" :text="''" size="28" />
      </view>
      <text class="sn-loadmore__text">{{ loadingText }}</text>
    </slot>

    <slot v-else-if="state === 'finished'" name="finished">
      <text class="sn-loadmore__text sn-loadmore__text--finished">{{ finishedText }}</text>
    </slot>

    <slot v-else name="error">
      <text class="sn-loadmore__text sn-loadmore__text--error">{{ errorText }}</text>
      <text class="sn-loadmore__hint">点击重试</text>
    </slot>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-loadmore {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: var(--sn-mp-spacing-2);
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-5) var(--sn-mp-spacing-4);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}

.sn-loadmore__spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sn-loadmore__text {
  color: var(--sn-mp-color-text-secondary);
  font-size: inherit;
  line-height: inherit;
}

.sn-loadmore__text--finished {
  color: var(--sn-mp-color-text-tertiary);
}

.sn-loadmore__text--error {
  color: var(--sn-mp-color-feedback-danger);
}

.sn-loadmore--error {
  cursor: pointer;
}

.sn-loadmore__hint {
  color: var(--sn-mp-color-action-primary);
  font-size: inherit;
  line-height: inherit;
}
</style>
