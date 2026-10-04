<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — real-component live render.
 */

import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'

const loading = ref(false)
const lastClicked = ref<string | null>(null)

function trigger(label: string): void {
  lastClicked.value = label
  loading.value = true
  setTimeout(() => { loading.value = false }, 800)
}
</script>

<template>
  <div class="sn-demo">
    <div class="sn-demo__row">
      <SnButton>默认</SnButton>
      <SnButton type="primary" @click="trigger('primary')">主要</SnButton>
      <SnButton type="success" @click="trigger('success')">成功</SnButton>
      <SnButton type="warning" @click="trigger('warning')">警告</SnButton>
      <SnButton type="danger" @click="trigger('danger')">危险</SnButton>
    </div>

    <div class="sn-demo__row">
      <SnButton size="small">small</SnButton>
      <SnButton size="medium">medium</SnButton>
      <SnButton size="large">large</SnButton>
    </div>

    <div class="sn-demo__row">
      <SnButton block type="primary">块级按钮</SnButton>
      <SnButton round type="success">圆角</SnButton>
    </div>

    <div class="sn-demo__row">
      <SnButton disabled>禁用</SnButton>
      <SnButton :loading="loading" type="primary" @click="trigger('loading')">
        加载中
      </SnButton>
    </div>

    <p v-if="lastClicked" class="sn-demo__log">
      最后点击：<code>{{ lastClicked }}</code>
    </p>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.sn-demo__log {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.sn-demo__log code {
  background: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>