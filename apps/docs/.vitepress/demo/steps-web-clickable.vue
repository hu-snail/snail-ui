<script setup lang="ts">
/**
 * steps-web-clickable — SnSteps with `v-model:current`. Steps activate on
 * click (the disabled step does not), and the derived statuses update.
 */
import { ref } from 'vue'
import { SnSteps, SnStep } from '@snui/vue-web'

const current = ref(1)
const log = ref<number[]>([])
</script>

<template>
  <div class="steps-demo">
    <SnSteps v-model:current="current" @update:current="(v: number) => log.push(v)">
      <SnStep title="步骤一" description="可点击" />
      <SnStep title="步骤二" description="可点击" />
      <SnStep title="步骤三" description="已完成步骤" />
      <SnStep title="步骤四" description="禁用，点不动" disabled />
    </SnSteps>
    <p class="steps-demo__state">
      current：<code>{{ current }}</code>
      <span class="steps-demo__log">点击记录：{{ log.join(' → ') || '（未点击）' }}</span>
    </p>
  </div>
</template>

<style scoped>
.steps-demo {
  width: 100%;
}
.steps-demo__state {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin: 20px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.steps-demo__state code {
  background: var(--vp-c-bg-soft);
  padding: 1px 6px;
  border-radius: 3px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
.steps-demo__log {
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
</style>
