<script setup lang="ts">
/**
 * alert-web-bordered — bordered (default) vs borderless side by side.
 *
 * Shows: the `bordered` prop. Borderless keeps the type tint on the fill
 * instead of drawing a full outline.
 */
import { SnAlert } from '@snui/vue-web'
</script>

<template>
  <div class="alert-bordered">
    <div class="alert-bordered__cell">
      <span class="alert-bordered__cap">bordered（默认）</span>
      <SnAlert type="info" title="带边框">边框与类型色同时生效，适合独立成块的信息。</SnAlert>
      <SnAlert type="success" title="带边框">操作已完成，可安全继续下一步。</SnAlert>
    </div>

    <div class="alert-bordered__cell">
      <span class="alert-bordered__cap">:bordered="false"</span>
      <SnAlert type="info" title="无边框" :bordered="false">
        去掉描边，只保留底色与图标，适合嵌套在卡片内部。
      </SnAlert>
      <SnAlert type="success" title="无边框" :bordered="false">
        视觉更轻，不会与卡片边框产生双线。
      </SnAlert>
    </div>
  </div>
</template>

<style scoped>
.alert-bordered {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
}
.alert-bordered__cell {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1 1 320px;
}
.alert-bordered__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
