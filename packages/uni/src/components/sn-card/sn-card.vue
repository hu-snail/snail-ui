<script setup lang="ts">
/**
 * sn-card (uni-end) — card container for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-card`
 *   (https://wot-ui.cn/component/card.html)
 * Per AGENTS.md §112, this component's API surface is 1:1 with wd-card
 * (same prop names, defaults, control semantics). Anything new added here
 * MUST also be added to the wd-card reference list in AGENTS.md §112.
 *
 * Per Spec-02 v1.1 §3 (end: mp), uni-side component CSS uses only
 * `--sn-mp-*` aliases (rpx units). The `end: mp` marker in
 * ai-description.md is consumed by `@snui/cli` and MCP tools for per-end
 * filtering.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-card/sn-card.vue
 * → auto-registered as `<sn-card>` in any .vue that uses it.
 *
 * Usage:
 *   <sn-card title="标题">内容</sn-card>
 *   <sn-card title="标题" type="rectangle">
 *     #default slot#
 *     <template #footer>
 *       <sn-button size="small" plain>底部按钮</sn-button>
 *     </template>
 *   </sn-card>
 *
 * Not responsible for:
 *   - 复杂交互（折叠、拖拽）— 用 sn-collapse
 *   - 选择 / 复选 — 用 sn-checkbox
 *   - 懒加载 / 大图裁剪 — 用 sn-img
 */

defineOptions({ name: 'SnCard' })

// Reference: wot-ui wd-card Attributes
//   (https://wot-ui.cn/component/card.html)
// All prop names match wd-card 1:1. Web-only aliases (`variant` /
// `padding` / `shadow`) are intentionally NOT included — §112 forbids
// web-only props on the uni side.
const props = withDefaults(
  defineProps<{
    /** Card title. Rendered in the title region; can be empty. */
    title?: string
    /** Card type. 'rectangle' adds the rectangle (大格) visual style. */
    type?: string
    /** Custom class for the title region. */
    customTitleClass?: string
    /** Custom class for the content region. */
    customContentClass?: string
    /** Custom class for the footer region. */
    customFooterClass?: string
    /** Custom class for the root node. */
    customClass?: string
    /** Custom inline style for the root node. */
    customStyle?: string
  }>(),
  {
    title: '',
    type: '',
    customTitleClass: '',
    customContentClass: '',
    customFooterClass: '',
    customClass: '',
    customStyle: '',
  },
)

defineSlots<{
  /** Card body content (rendered between title and footer). */
  default?(): unknown
  /** Card title region (overrides `title` prop). */
  title?(): unknown
  /** Bottom action area. */
  footer?(): unknown
}>()
</script>

<template>
  <view
    :class="[
      'sn-card',
      type === 'rectangle' ? 'sn-card--rectangle' : '',
      customClass,
    ]"
    :style="customStyle"
    role="region"
  >
    <view
      v-if="$slots.title || title"
      :class="['sn-card__title', customTitleClass]"
    >
      <slot name="title">{{ title }}</slot>
    </view>
    <view
      v-if="$slots.default"
      :class="['sn-card__content', customContentClass]"
    >
      <slot />
    </view>
    <view
      v-if="$slots.footer"
      :class="['sn-card__footer', customFooterClass]"
    >
      <slot name="footer" />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: var(--sn-mp-card-padding, 32rpx);
  background: var(--sn-mp-color-background-surface, #ffffff);
  color: var(--sn-mp-color-text-primary, #333333);
  border-radius: var(--sn-mp-card-radius, 16rpx);
  font-size: 28rpx;
  line-height: 1.5;
}

/* Rectangle (大格) variant — heavy shadow + no radius. */
.sn-card--rectangle {
  border-radius: 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.sn-card__title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-primary, #333333);
  margin-bottom: 16rpx;
}

.sn-card__content {
  flex: 1 1 auto;
  min-height: 0;
}

.sn-card__footer {
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 2rpx solid var(--sn-mp-color-border-default, #e5e5e5);
}

/* Doodle skin */
.snui-skin-doodle .sn-card {
  border: 4rpx solid #1a1a1a;
  box-shadow: 6rpx 6rpx 0 #1a1a1a;
}
.snui-skin-doodle .sn-card__title {
  font-weight: 700;
}
.snui-skin-doodle .sn-card__footer {
  border-top: 4rpx dashed #1a1a1a;
}
</style>