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
    <SnCard title="今日推荐">
      <view class="body">
        <text>岳阳楼记 — 至若春和景明，波澜不惊，上下天光，一碧万顷。</text>
      </view>
      <template #footer>
        <SnButton size="small" plain @click="handleOk">
          <SnIcon v-if="ok" :icon="CheckIcon" :size="14" />
          {{ ok ? '已点赞' : '点赞' }}
        </SnButton>
      </template>
    </SnCard>

    <SnCard type="rectangle" title="生活记录">
      <view class="rectangle-row">
        <text>今天天气真好</text>
        <text class="rectangle-row__desc">2026年10月 晴天 22℃</text>
      </view>
      <template #footer>
        <SnButton size="small" plain>查看详情</SnButton>
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