<script setup lang="ts">
/**
 * tooltip-web-event — show / hide / update:show 事件与 onClickoutside。
 *
 * 左侧是事件回显日志，右侧是两个触发器 —— 用两栏布局把「操作区」
 * 与「结果区」分开，读者能立刻看出哪次操作产生了哪条日志。
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
    <section class="tt-event__panel">
      <h4 class="tt-event__title">触发</h4>
      <p class="tt-event__hint">
        开启 <code>:delay="0"</code> <code>:duration="0"</code> 便于即时观察事件时序。
      </p>
      <div class="tt-event__stage">
        <SnTooltip
          content="出现与隐藏都会记录"
          :delay="0"
          :duration="0"
          @show="record('show')"
          @hide="record('hide')"
          @update:show="record('update:show')"
        >
          <button class="tt-event__btn" type="button">悬停观察事件</button>
        </SnTooltip>

        <SnTooltip
          content="点击外部会触发 onClickoutside"
          trigger="click"
          :on-clickoutside="() => record('onClickoutside')"
        >
          <button class="tt-event__btn" type="button">点击外部试试</button>
        </SnTooltip>
      </div>
    </section>

    <section class="tt-event__panel">
      <h4 class="tt-event__title">事件日志</h4>
      <p class="tt-event__hint">最近 5 条，最新在最上。</p>
      <ul class="tt-event__log">
        <li v-for="(e, i) in log" :key="i" class="tt-event__entry">
          <code>{{ e }}</code>
        </li>
        <li v-if="!log.length" class="tt-event__empty">暂无事件</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.tt-event {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  width: 100%;
}
.tt-event__panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tt-event__title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.tt-event__hint {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-3);
}
.tt-event__hint code {
  font-size: 11px;
  padding: 1px 4px;
  border-radius: 3px;
  background: var(--vp-c-bg-alt);
}
.tt-event__stage {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 24px 0;
}
.tt-event__btn {
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
.tt-event__btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
/* A fixed-height, bordered well keeps the layout from jumping as log rows
 * arrive and disappear. */
.tt-event__log {
  margin: 0;
  padding: 10px 12px;
  list-style: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  min-height: 148px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.tt-event__entry code {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.tt-event__empty {
  font-size: 12px;
  color: var(--vp-c-text-3);
}
</style>
