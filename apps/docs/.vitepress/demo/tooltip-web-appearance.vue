<script setup lang="ts">
/**
 * tooltip-web-appearance — arrow, body styling and width control.
 */
import { SnTooltip } from '@snui/vue-web'
</script>

<template>
  <div class="tt-appear">
    <div class="tt-appear__cell">
      <span class="tt-appear__cap">默认箭头</span>
      <SnTooltip content="带箭头的气泡" placement="top">
        <button class="tt-btn" type="button">悬停</button>
      </SnTooltip>
    </div>

    <div class="tt-appear__cell">
      <span class="tt-appear__cap">:arrow="false"</span>
      <SnTooltip content="没有箭头" placement="top" :arrow="false">
        <button class="tt-btn" type="button">悬停</button>
      </SnTooltip>
    </div>

    <div class="tt-appear__cell">
      <span class="tt-appear__cap">arrowPointToCenter</span>
      <SnTooltip content="箭头指向气泡中心" placement="top" arrow-point-to-center>
        <button class="tt-btn" type="button">悬停</button>
      </SnTooltip>
    </div>

    <div class="tt-appear__cell">
      <span class="tt-appear__cap">arrowClass</span>
      <SnTooltip content="箭头被放大并染色" placement="bottom" arrow-class="tt-appear__big-arrow">
        <button class="tt-btn" type="button">悬停</button>
      </SnTooltip>
    </div>

    <div class="tt-appear__cell">
      <span class="tt-appear__cap">contentStyle</span>
      <SnTooltip
        content="正文用了自定义样式"
        placement="top"
        :content-style="{ color: 'var(--sn-web-color-primary)', fontWeight: '600' }"
      >
        <button class="tt-btn" type="button">悬停</button>
      </SnTooltip>
    </div>

    <div class="tt-appear__cell">
      <span class="tt-appear__cap">width="trigger"</span>
      <SnTooltip content="宽度与触发器一致" placement="bottom" width="trigger">
        <button class="tt-btn tt-btn--wide" type="button">这是一个很宽的触发器</button>
      </SnTooltip>
    </div>

    <div class="tt-appear__cell">
      <span class="tt-appear__cap">:animated="false"</span>
      <SnTooltip content="无进出场动画" placement="top" :animated="false">
        <button class="tt-btn" type="button">悬停</button>
      </SnTooltip>
    </div>
  </div>
</template>

<style scoped>
.tt-appear {
  display: flex;
  flex-wrap: wrap;
  gap: 32px 40px;
  padding: 48px 0;
}
.tt-appear__cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
.tt-appear__cap {
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
.tt-btn--wide {
  min-width: 200px;
}
.tt-btn:hover {
  border-color: var(--sn-web-color-primary);
  color: var(--sn-web-color-primary);
}
/* Applied through the arrowClass prop; needs :deep to reach teleported DOM. */
:deep(.tt-appear__big-arrow) {
  border-width: 12px 12px 0 12px;
}
</style>
