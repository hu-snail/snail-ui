<script setup lang="ts">
/**
 * tooltip-web-basic — SnTooltip 四方向 baseline：hover trigger，弹出
 * 对应方向的 popover。统一在 `display: grid; place-items: center` 的
 * 舞台上演示，每个按钮位置故意对应 placement 锚点。
 */
import { SnTooltip } from '@snui/vue-web'
</script>

<template>
  <div class="sn-tooltip-basic-demo">
    <SnTooltip content="Top" placement="top">
      <button class="sn-tooltip-trigger-btn">top</button>
    </SnTooltip>
    <SnTooltip content="Top Start" placement="top-start">
      <button class="sn-tooltip-trigger-btn">top-start</button>
    </SnTooltip>
    <SnTooltip content="Top End" placement="top-end">
      <button class="sn-tooltip-trigger-btn">top-end</button>
    </SnTooltip>

    <SnTooltip content="Bottom" placement="bottom">
      <button class="sn-tooltip-trigger-btn">bottom</button>
    </SnTooltip>
    <SnTooltip content="Bottom Start" placement="bottom-start">
      <button class="sn-tooltip-trigger-btn">bottom-start</button>
    </SnTooltip>
    <SnTooltip content="Bottom End" placement="bottom-end">
      <button class="sn-tooltip-trigger-btn">bottom-end</button>
    </SnTooltip>

    <SnTooltip content="Left" placement="left">
      <button class="sn-tooltip-trigger-btn">left</button>
    </SnTooltip>
    <SnTooltip content="Right" placement="right">
      <button class="sn-tooltip-trigger-btn">right</button>
    </SnTooltip>
  </div>
</template>

<style scoped>
.sn-tooltip-basic-demo {
  display: grid;
  grid-template-columns: repeat(3, max-content);
  gap: 16px;
  justify-content: center;
  padding: 60px 0;
}
.sn-tooltip-trigger-btn {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 6px 14px;
  border-radius: 6px;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.sn-tooltip-trigger-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
</style>