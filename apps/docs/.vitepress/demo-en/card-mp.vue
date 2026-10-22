<script setup lang="ts">
/**
 * Demo: sn-card (uni) — live render of the new uni card component
 * (AUI-MP-BIZ-001). Two cards:
 *   1. Default card: title prop + body + footer with sn-button.
 *   2. Rectangle variant: type="rectangle" (mobile list-style card).
 *
 * Per AGENTS.md §113, UI icons come from SnIcon registry — never an emoji
 * glyph. The Check icon below is resolved through `<SnIcon>`.
 */

import { ref } from 'vue'
import { SnButton, SnCard, SnIcon } from '@snui/uni'
import { Check } from 'lucide-vue-next'
import { markRaw } from 'vue'

const ok = ref(false)
const CheckIcon = markRaw(Check)
function handleOk(): void {
  ok.value = true
  setTimeout(() => { ok.value = false }, 1200)
}
</script>

<template>
  <div class="sn-demo">
    <SnCard title="Today's picks">
      <view class="body">
        <text>Record of Yueyang Tower — In the mild spring light and clear air, the waves lie calm; sky and water merge into one boundless expanse of blue.</text>
      </view>
      <template #footer>
        <SnButton size="small" plain @click="handleOk">
          <SnIcon v-if="ok" :icon="CheckIcon" :size="14" />
          {{ ok ? 'Liked' : 'Like' }}
        </SnButton>
      </template>
    </SnCard>

    <SnCard type="rectangle" title="Life log">
      <view class="rectangle-row">
        <text>The weather is really nice today</text>
        <text class="rectangle-row__desc">October 2026, sunny, 22℃</text>
      </view>
      <template #footer>
        <SnButton size="small" plain>View details</SnButton>
      </template>
    </SnCard>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 8px;
}
.body {
  margin-top: 6px;
}
.rectangle-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
}
.rectangle-row__desc {
  font-size: 12px;
  color: #888;
}
</style>