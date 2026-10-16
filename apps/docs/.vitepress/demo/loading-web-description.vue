<script setup lang="ts">
/**
 * loading-web-description — the spinner with a text label beneath it.
 *
 * Shows: the `description` prop in both the bare and the wrapping form.
 */
import { ref } from 'vue'
import { SnButton, SnLoading } from '@snui/vue-web'

const loading = ref(true)
</script>

<template>
  <div class="ldg-desc">
    <div class="ldg-desc__row">
      <span class="ldg-desc__cap">仅指示器 + 文案</span>
      <SnLoading description="加载中…" />
    </div>

    <div class="ldg-desc__row">
      <span class="ldg-desc__cap">包裹内容 + 文案</span>
      <div class="ldg-desc__box">
        <SnLoading :show="loading" description="正在同步数据…">
          <p>这部分内容会保持挂载，只是被压暗且不可交互。</p>
          <p>加载结束后遮罩自动淡出。</p>
        </SnLoading>
      </div>
    </div>

    <SnButton size="small" @click="loading = !loading">
      {{ loading ? '结束加载' : '重新加载' }}
    </SnButton>
  </div>
</template>

<style scoped>
.ldg-desc {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
}
.ldg-desc__row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ldg-desc__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.ldg-desc__box {
  padding: 24px;
  border-radius: 8px;
  background: var(--sn-web-color-background-subtle);
}
</style>
