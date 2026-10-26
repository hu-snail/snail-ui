<script setup lang="ts">
/**
 * Demo: SnPopover — width control, `width="trigger"` vs a fixed px width.
 *
 * Both bubbles start open (`default-show`) so the two sizing strategies can
 * be compared side by side without hovering; clicking a trigger toggles its
 * own bubble, and `placement="right"` keeps the two panels from overlapping.
 */
import { SnButton, SnPopover } from '@snui/vue-web';
</script>

<template>
  <div class="popover-width-demo">
    <div class="popover-width-demo__stack">
      <SnPopover
        default-show
        trigger="click"
        width="trigger"
        placement="right"
        show-arrow
        header="与触发器等宽"
        content='width="trigger" 让气泡横向尺寸跟随触发元素，适合承载与按钮同宽的短说明。'
      >
        <SnButton>width=&quot;trigger&quot;</SnButton>
      </SnPopover>

      <SnPopover
        default-show
        trigger="click"
        :width="240"
        placement="right"
        show-arrow
        header="固定 240px"
        content="数值宽度适合承载整段说明文字：无论触发元素多窄，正文都有稳定的阅读宽度，不会因为按钮短而频繁折行。"
      >
        <SnButton>width = 240</SnButton>
      </SnPopover>
    </div>

    <p class="popover-width-demo__hint">
      两个气泡默认展开以便对照，点击触发按钮可切换显示。宽度在气泡打开时计算：上例随触发元素宽度变化，下例固定
      240px；卡片自身还有 280px 的宽度上限，超出视口时会沿交叉轴回收到可见区域内。
    </p>
  </div>
</template>

<style scoped>
.popover-width-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.popover-width-demo__stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 72px;
}

.popover-width-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
