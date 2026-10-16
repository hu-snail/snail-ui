<script setup lang="ts">
/**
 * tooltip-web-basic — SnTooltip 基础用法。
 *
 * 演示结构统一为「区块（section）」：每个区块有自己的标题 + 说明 +
 * 舞台（stage）。舞台内用 grid 让触发器之间保持等距，避免不同
 * placement 的触发器挤在一起看不出方位差异。
 */
import { SnTooltip } from '@snui/vue-web'
</script>

<template>
  <div class="tt-demo">
    <section class="tt-demo__section">
      <h4 class="tt-demo__title">四方向</h4>
      <p class="tt-demo__hint">最常用的四个方位。悬停触发器即可查看提示。</p>
      <div class="tt-demo__stage">
        <SnTooltip content="Top" placement="top">
          <button class="tt-demo__btn" type="button">top</button>
        </SnTooltip>
        <SnTooltip content="Right" placement="right">
          <button class="tt-demo__btn" type="button">right</button>
        </SnTooltip>
        <SnTooltip content="Bottom" placement="bottom">
          <button class="tt-demo__btn" type="button">bottom</button>
        </SnTooltip>
        <SnTooltip content="Left" placement="left">
          <button class="tt-demo__btn" type="button">left</button>
        </SnTooltip>
      </div>
    </section>

    <section class="tt-demo__section">
      <h4 class="tt-demo__title">边缘对齐</h4>
      <p class="tt-demo__hint">
        <code>-start</code> / <code>-end</code> 让气泡对齐触发器的一侧，
        适合图标按钮或窄列里的提示。
      </p>
      <div class="tt-demo__stage">
        <SnTooltip content="Top Start" placement="top-start">
          <button class="tt-demo__btn" type="button">top-start</button>
        </SnTooltip>
        <SnTooltip content="Top End" placement="top-end">
          <button class="tt-demo__btn" type="button">top-end</button>
        </SnTooltip>
        <SnTooltip content="Bottom Start" placement="bottom-start">
          <button class="tt-demo__btn" type="button">bottom-start</button>
        </SnTooltip>
        <SnTooltip content="Bottom End" placement="bottom-end">
          <button class="tt-demo__btn" type="button">bottom-end</button>
        </SnTooltip>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tt-demo {
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
}
.tt-demo__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tt-demo__title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.tt-demo__hint {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-3);
}
.tt-demo__hint code {
  font-size: 11px;
  padding: 1px 4px;
  border-radius: 3px;
  background: var(--vp-c-bg-alt);
}
/* Reserved vertical room so a `top` bubble has somewhere to open inside the
 * demo card and does not get clipped by the card's own boundary. */
.tt-demo__stage {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 56px 0;
  justify-content: center;
}
.tt-demo__btn {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 6px 14px;
  border-radius: 6px;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, color 0.15s;
}
.tt-demo__btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
</style>
