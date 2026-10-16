<script setup lang="ts">
/**
 * tooltip-web-trigger — the four trigger gestures side by side.
 */
import { SnTooltip } from '@snui/vue-web'
</script>

<template>
  <div class="tt-trigger">
    <div class="tt-trigger__cell">
      <span class="tt-trigger__cap">hover（默认）</span>
      <SnTooltip content="悬停 100ms 后出现" trigger="hover">
        <button class="tt-btn" type="button">悬停我</button>
      </SnTooltip>
    </div>

    <div class="tt-trigger__cell">
      <span class="tt-trigger__cap">click</span>
      <SnTooltip content="点击切换，点外部关闭" trigger="click">
        <button class="tt-btn" type="button">点我</button>
      </SnTooltip>
    </div>

    <div class="tt-trigger__cell">
      <span class="tt-trigger__cap">focus</span>
      <SnTooltip content="聚焦时出现，失焦后隐藏" trigger="focus">
        <button class="tt-btn" type="button">聚焦我</button>
      </SnTooltip>
    </div>

    <div class="tt-trigger__cell">
      <span class="tt-trigger__cap">manual</span>
      <SnTooltip content="只由 show 控制，不响应手势" trigger="manual">
        <button class="tt-btn" type="button">手动控制</button>
      </SnTooltip>
    </div>
  </div>
</template>

<style scoped>
.tt-trigger {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  padding: 40px 0;
}
.tt-trigger__cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
.tt-trigger__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.tt-btn {
  border: 1px solid var(--sn-web-color-border);
  background: var(--sn-web-color-background);
  color: var(--sn-web-color-text);
  padding: 6px 14px;
  border-radius: 6px;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}
.tt-btn:hover {
  border-color: var(--sn-web-color-primary);
  color: var(--sn-web-color-primary);
}
</style>
