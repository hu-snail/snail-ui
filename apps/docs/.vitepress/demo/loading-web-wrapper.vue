<script setup lang="ts">
/**
 * loading-web-wrapper — passing a default slot turns the spinner into an
 * overlay and dims the wrapped content while `show` is true.
 */
import { ref } from 'vue'
import { SnButton, SnLoading } from '@snui/vue-web'

const loading = ref(false)
const text = ref('刷新后内容会更新')

function reload(): void {
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
    text.value = `刷新于 ${new Date().toLocaleTimeString()}`
  }, 1500)
}
</script>

<template>
  <div class="loading-demo">
    <SnButton :disabled="loading" @click="reload">模拟请求</SnButton>

    <SnLoading :show="loading" description="加载中..." class="loading-demo__box">
      <div class="loading-demo__content">{{ text }}</div>
    </SnLoading>
  </div>
</template>

<style scoped>
.loading-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.loading-demo__box {
  width: 100%;
}
.loading-demo__content {
  padding: 32px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  text-align: center;
}
</style>
