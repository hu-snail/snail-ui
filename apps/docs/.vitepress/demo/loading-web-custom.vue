<script setup lang="ts">
/**
 * loading-web-custom — `stroke` recolours the arc, `description` and the
 * `icon` slot replace the default graphic, and `delay` defers the spinner so a
 * fast request never flashes.
 */
import { ref } from 'vue'
import { SnButton, SnLoading } from '@snui/vue-web'

const fast = ref(false)
const slow = ref(false)

function run(target: typeof fast, ms: number): void {
  target.value = true
  window.setTimeout(() => {
    target.value = false
  }, ms)
}
</script>

<template>
  <div class="loading-demo">
    <div class="loading-demo__row">
      <SnLoading stroke="var(--vp-c-brand-1)" size="large" description="自定义颜色" />
      <SnLoading size="large">
        <template #icon>
          <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="9" stroke-width="2" stroke-dasharray="6 6" />
          </svg>
        </template>
      </SnLoading>
    </div>

    <div class="loading-demo__row">
      <SnButton @click="run(fast, 200)">200ms 请求（不闪）</SnButton>
      <SnButton @click="run(slow, 2000)">2s 请求（延迟 400ms 后显示）</SnButton>
    </div>

    <SnLoading :show="fast" :delay="400" description="200ms 请求">
      <div class="loading-demo__content">请求在 delay 窗口内结束，spinner 从不出现。</div>
    </SnLoading>

    <SnLoading :show="slow" :delay="400" description="2s 请求">
      <div class="loading-demo__content">请求超过 400ms，spinner 才淡入。</div>
    </SnLoading>
  </div>
</template>

<style scoped>
.loading-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}
.loading-demo__row {
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}
.loading-demo__content {
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  text-align: center;
}
</style>
