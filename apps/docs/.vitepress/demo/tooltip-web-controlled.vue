<script setup lang="ts">
/**
 * tooltip-web-controlled — SnTooltip 受控 + 点击触发。
 *
 * 1. 受控模式：把 `show` 和 `update:show` 接成 v-model，父组件拿到
 *    state 后才能决定是不是展示（默认 trigger='hover' 仍然有效，但
 *    受控时父组件说了算）。
 * 2. `trigger="click"` 把 hover 行为换成点击 —— toggle 按钮可以
 *    让 popover 在 click outside 时自动关掉。
 */
import { ref } from 'vue'
import { SnTooltip } from '@snui/vue-web'

const controlledOpen = ref(false)
const clickOpen = ref(false)
</script>

<template>
  <div class="sn-tooltip-controlled-demo">
    <div class="sn-tooltip-controlled-demo__row">
      <h4>受控 + v-model:show</h4>
      <div class="sn-tooltip-controlled-demo__pair">
        <SnTooltip v-model:show="controlledOpen" content="受控显示状态">
          <button class="sn-tooltip-controlled-demo__btn">
            hover me
          </button>
        </SnTooltip>
        <span class="sn-tooltip-controlled-demo__state">
          show = <strong>{{ controlledOpen }}</strong>
        </span>
      </div>
    </div>

    <div class="sn-tooltip-controlled-demo__row">
      <h4>trigger="click" + 自动 outside-click dismiss</h4>
      <div class="sn-tooltip-controlled-demo__pair">
        <SnTooltip
          v-model:show="clickOpen"
          trigger="click"
          placement="right"
          content="点 trigger 区域外任意位置关闭"
        >
          <button class="sn-tooltip-controlled-demo__btn">
            click toggle
          </button>
        </SnTooltip>
        <span class="sn-tooltip-controlled-demo__state">
          show = <strong>{{ clickOpen }}</strong>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sn-tooltip-controlled-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sn-tooltip-controlled-demo__row h4 {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--vp-c-text-1);
  font-weight: 600;
}
.sn-tooltip-controlled-demo__pair {
  display: flex;
  align-items: center;
  gap: 16px;
}
.sn-tooltip-controlled-demo__btn {
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
.sn-tooltip-controlled-demo__btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.sn-tooltip-controlled-demo__state {
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-family: ui-monospace, monospace;
}
</style>