<script setup lang="ts">
/**
 * card-web-closable — SnCard with `closable: true` + close event emission.
 * Mirrors n-card's `closable` prop + `on-close` event.
 */
import { ref } from 'vue'
import { SnCard } from '@snui/vue-web'

const visible = ref(true)
const lastClose = ref<string | null>(null)
</script>

<template>
  <div>
    <SnCard
      v-if="visible"
      title="Closable card"
      closable
      style="max-width:360px;"
      aria-label="Closable example"
      @close="lastClose = new Date().toLocaleTimeString()"
    >
      <p>卡片头部右侧的 × 按钮可关闭卡片。`closable` 默认 false。</p>
      <p style="margin:8px 0 0;color:var(--vp-c-text-2);font-size:13px;">
        上次关闭：{{ lastClose ?? '（未关闭）' }}
      </p>
    </SnCard>
    <div v-else style="padding:12px;border:1px dashed var(--vp-c-divider);border-radius:6px;color:var(--vp-c-text-2);font-size:13px;">
      已关闭。
      <button style="margin-left:8px;color:var(--sn-web-color-action-primary);background:none;border:none;cursor:pointer;" @click="visible = true">
        重置
      </button>
    </div>
  </div>
</template>