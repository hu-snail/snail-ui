<script setup lang="ts">
/**
 * loading-web-delay — `delay` suppresses the flash for fast responses.
 *
 * Shows: two identical requests, one with a 600ms delay. The short task ends
 * before the timer fires, so no spinner is ever painted.
 */
import { ref } from 'vue'
import { SnButton, SnLoading } from '@snui/vue-web'

const fastDone = ref(false)
const fastLoading = ref(false)
const slowLoading = ref(false)

function run(target: typeof fastLoading, ms: number): void {
  target.value = true
  setTimeout(() => {
    target.value = false
  }, ms)
}
</script>

<template>
  <div class="ldg-delay">
    <div class="ldg-delay__row">
      <div class="ldg-delay__meta">
        <span class="ldg-delay__cap">无 delay，200ms 任务</span>
        <span class="ldg-delay__note">转圈会闪一下</span>
      </div>
      <div class="ldg-delay__stage">
        <SnLoading :show="fastLoading" description="加载中…">
          <span class="ldg-delay__body">{{ fastDone ? '已完成' : '等待触发' }}</span>
        </SnLoading>
      </div>
      <SnButton
        size="small"
        @click="run(fastLoading, 200); fastDone = false; setTimeout(() => fastDone = true, 220)"
      >
        运行
      </SnButton>
    </div>

    <div class="ldg-delay__row">
      <div class="ldg-delay__meta">
        <span class="ldg-delay__cap">delay=600，200ms 任务</span>
        <span class="ldg-delay__note">任务先结束，转圈从不出现</span>
      </div>
      <div class="ldg-delay__stage">
        <SnLoading :show="slowLoading" :delay="600" description="加载中…">
          <span class="ldg-delay__body">内容始终可见</span>
        </SnLoading>
      </div>
      <SnButton size="small" @click="run(slowLoading, 200)">
        运行
      </SnButton>
    </div>

    <p class="ldg-delay__hint">
      <code>delay</code> 的意义是避免「一闪而过」的加载态。当请求在延迟时间内
      返回时，加载指示器根本不会渲染。
    </p>
  </div>
</template>

<style scoped>
.ldg-delay {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}
.ldg-delay__row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.ldg-delay__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 180px;
}
.ldg-delay__cap {
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.ldg-delay__note {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.ldg-delay__stage {
  flex: 1 1 260px;
  padding: 20px;
  border-radius: 8px;
  background: var(--sn-web-color-background-subtle);
}
.ldg-delay__body {
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.ldg-delay__hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--sn-web-color-text-secondary);
}
</style>
