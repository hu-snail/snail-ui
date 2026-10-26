<script setup lang="ts">
/**
 * Demo: SnCard (Web) — live render of the new card component
 * (AUI-WEB-LAYOUT-001). Two cards:
 *   1. Default variant: bordered, no shadow, title + description header
 *      (custom title slot with `<h3>` + `<p>`), body content, footer with
 *      SnButton + SnIcon Check feedback.
 *   2. Elevated variant: borderless + shadow, plain title prop.
 *
 * Per AGENTS.md §113, UI icons come from SnIcon / SnIcon registry — never
 * an emoji glyph.
 */

import { ref } from 'vue'
import { SnButton, SnCard, SnIcon } from '@snui/vue-web'
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
    <SnCard aria-label="Order summary">
      <template #header>
        <h3>Order #1024</h3>
        <p>Pending payment</p>
      </template>
      <p>请输入凭证编号以激活订单。</p>
      <input class="sn-card__input" placeholder="V-AUI-1024" />
      <template #footer>
        <SnButton @click="handleOk">
          <SnIcon v-if="ok" :icon="CheckIcon" :size="14" style="margin-right: 6px; vertical-align: -2px" />
          {{ ok ? '已应用' : 'Apply' }}
        </SnButton>
      </template>
    </SnCard>

    <SnCard title="Elevated card" variant="elevated" aria-label="Elevated example">
      <p>风格包切换时 Card 的视觉会跟随 Theme / Style / Density。</p>
    </SnCard>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sn-card__input {
  display: block;
  width: 100%;
  margin-top: 6px;
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
}
</style>