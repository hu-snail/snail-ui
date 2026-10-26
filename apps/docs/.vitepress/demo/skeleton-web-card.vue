<script setup lang="ts">
/**
 * skeleton-web-card — a card placeholder assembled from primitives, plus the
 * `animated` and `sharp` switches.
 */
import { ref } from 'vue'
import { SnButton, SnSkeleton } from '@snui/vue-web'

const animated = ref(true)
const sharp = ref(true)
</script>

<template>
  <div class="sk-demo">
    <div class="sk-demo__controls">
      <SnButton size="small" @click="animated = !animated">
        animated: {{ animated }}
      </SnButton>
      <SnButton size="small" @click="sharp = !sharp">sharp: {{ sharp }}</SnButton>
    </div>

    <div class="sk-demo__card">
      <div class="sk-demo__header">
        <SnSkeleton circle :height="40" :animated="animated" :sharp="sharp" />
        <div class="sk-demo__meta">
          <SnSkeleton height="1em" width="30%" :animated="animated" :sharp="sharp" />
          <SnSkeleton height="0.75em" width="50%" :animated="animated" :sharp="sharp" />
        </div>
      </div>
      <SnSkeleton height="1em" :animated="animated" :sharp="sharp" />
      <SnSkeleton height="1em" :animated="animated" :sharp="sharp" />
      <SnSkeleton height="1em" width="70%" :animated="animated" :sharp="sharp" />
    </div>
  </div>
</template>

<style scoped>
.sk-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.sk-demo__controls {
  display: flex;
  gap: 8px;
}
.sk-demo__card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}
.sk-demo__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}
.sk-demo__meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
</style>
