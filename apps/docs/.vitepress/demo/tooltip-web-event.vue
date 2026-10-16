<script setup lang="ts">
/**
 * tooltip-web-event — show / hide callbacks and outside-click.
 */
import { ref } from 'vue'
import { SnTooltip } from '@snui/vue-web'

const log = ref<string[]>([])

function record(name: string): void {
  log.value = [`${name} @ ${new Date().toLocaleTimeString()}`, ...log.value].slice(0, 5)
}
</script>

<template>
  <div class="tt-event">
    <div class="tt-event__row">
      <SnTooltip
        content="出现与隐藏都会记录"
        :delay="0"
        :duration="0"
        @show="record('show')"
        @hide="record('hide')"
        @update:show="record('update:show')"
      >
        <button class="tt-btn" type="button">悬停观察事件</button>
      </SnTooltip>

      <SnTooltip
        content="点击外部会触发 onClickoutside"
        trigger="click"
        :on-clickoutside="() => record('onClickoutside')"
      >
        <button class="tt-btn" type="button">点击外部试试</button>
      </SnTooltip>
    </div>

    <ul class="tt-event__log">
      <li v-for="(e, i) in log" :key="i"><code>{{ e }}</code></li>
      <li v-if="!log.length" class="tt-event__empty">暂无事件</li>
    </ul>
  </div>
</template>

<style scoped>
.tt-event {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}
.tt-event__row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 16px;
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
.tt-event__log {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
  min-height: 24px;
}
.tt-event__empty {
  list-style: none;
  margin-left: -18px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
