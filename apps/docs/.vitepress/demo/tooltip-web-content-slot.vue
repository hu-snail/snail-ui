<script setup lang="ts">
/**
 * tooltip-web-content-slot — SnTooltip content slot 富文本。组件留了
 * 一个 `#content` named slot，popover 体内可以塞任何 Vue 内容
 * （多行文本、code 标签、小图标、行内链接）。
 */
import { SnTooltip } from '@snui/vue-web'
</script>

<template>
  <div class="sn-tooltip-slot-demo">
    <SnTooltip placement="top">
      <button class="sn-tooltip-slot-demo__btn">多行 + code</button>
      <template #content>
        <div class="sn-tooltip-slot-demo__rich">
          <div>支持多行文本</div>
          <code>code: SnTooltip</code>
        </div>
      </template>
    </SnTooltip>

    <SnTooltip placement="right" :arrow="false">
      <button class="sn-tooltip-slot-demo__btn">无箭头</button>
      <template #content>
        <span style="font-style: italic">arrow: false</span>
      </template>
    </SnTooltip>

    <SnTooltip placement="bottom-start" :delay="[200, 0]">
      <button class="sn-tooltip-slot-demo__btn">延迟 200ms 打开</button>
      <template #content>
        用 <code>:delay="[200, 0]"</code> 控制打开延迟，关闭无延迟
      </template>
    </SnTooltip>
  </div>
</template>

<style scoped>
.sn-tooltip-slot-demo {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 40px 0;
  justify-content: center;
}
.sn-tooltip-slot-demo__btn {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 6px 14px;
  border-radius: 6px;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}
.sn-tooltip-slot-demo__btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.sn-tooltip-slot-demo__rich {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.sn-tooltip-slot-demo__rich code {
  font-family: ui-monospace, monospace;
  font-size: 12px;
  opacity: 0.85;
}
</style>