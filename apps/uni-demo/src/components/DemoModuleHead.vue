<script setup lang="ts">
/**
 * DemoModuleHead —— 组件页场景模块标题行：场景标题 + 场景徽标。
 *
 * 徽标（badge）展示场景 key（mono 小字，如 `form-type`），空串不渲染；
 * 标题由调用方经 useDemoUi 的 t() 传入双语。
 *
 * `inset` 由通栏页传入：那些页面把 `.module` 的左右内边距去掉了，让 cell
 * 入口行铺满整行；标题行需要自己补回左右留白，否则贴屏边。内边距写在组件
 * 自己的样式里而不是页面上的后代选择器——mp-weixin 的 WXSS 不支持后代
 * 选择器（只支持 class），写在外面会静默失效。
 */
withDefaults(
  defineProps<{
    /** 场景标题（双语）。 */
    title: string;
    /** 场景徽标文案（场景 key）；空串不渲染。 */
    badge?: string;
    /** 左右留白（通栏页用：模块自身已无左右内边距）。 */
    inset?: boolean;
  }>(),
  { badge: '', inset: false },
);
</script>

<template>
  <view class="demo-module-head" :class="{ 'demo-module-head--inset': inset }">
    <text class="demo-module-head__title">{{ title }}</text>
    <text v-if="badge !== ''" class="demo-module-head__badge">{{ badge }}</text>
  </view>
</template>

<style scoped>
.demo-module-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16rpx;
  padding-bottom: 24rpx;
}

/* 通栏页：模块左右内边距已归零，标题行自己补回留白。 */
.demo-module-head--inset {
  padding-left: var(--sn-mp-spacing-4);
  padding-right: var(--sn-mp-spacing-4);
}

.demo-module-head__title {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--demo-title);
}

.demo-module-head__badge {
  margin-left: auto;
  padding: 4rpx 12rpx;
  font-size: 20rpx;
  font-family: Menlo, Consolas, monospace;
  color: var(--demo-text-3);
  background: var(--demo-chip-bg);
  border: 1px solid var(--demo-chip-border);
  border-radius: 4rpx;
}
</style>
