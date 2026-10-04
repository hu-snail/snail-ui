<script setup lang="ts">
/**
 * Demo: SnCard (Web) — placeholder live render.
 *
 * Note: A full live SnCard mount requires the v3.0 protocol contract (Card,
 * Form, FormItem, Input, Button types) which is not exported by the
 * public @snui/vue-web surface. This demo uses a minimal Vue 3 SFC that
 * mimics Card's API via slot composition. Replace with the real Card once
 * AUI-WEB-LAYOUT-001 ships.
 */

import { ref } from 'vue'
import { SnButton } from '@snui/vue-web'

const ok = ref(false)
function handleOk(): void {
  ok.value = true
  setTimeout(() => { ok.value = false }, 1200)
}
</script>

<template>
  <div class="sn-demo">
    <section class="sn-card sn-card--default" role="region" aria-label="Order summary">
      <header class="sn-card__header">
        <h3>Order #1024</h3>
        <p>Pending payment</p>
      </header>
      <div class="sn-card__body">
        <p>请输入凭证编号以激活订单。</p>
        <input class="sn-card__input" placeholder="V-AUI-1024" />
      </div>
      <footer class="sn-card__footer">
        <SnButton @click="handleOk">{{ ok ? '✓ 已应用' : 'Apply' }}</SnButton>
      </footer>
    </section>

    <section class="sn-card sn-card--elevated" role="region" aria-label="Outlined example">
      <header class="sn-card__header">
        <h3>Elevated card</h3>
        <p>Borderless + drop shadow</p>
      </header>
      <div class="sn-card__body">
        <p>风格包切换时 Card 的视觉会跟随 Theme / Style / Density。</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sn-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
}
.sn-card--elevated {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.10);
}
.sn-card__header h3 {
  margin: 0;
  font-size: 16px;
}
.sn-card__header p {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.sn-card__body {
  margin-top: 12px;
  font-size: 13px;
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
.sn-card__footer {
  margin-top: 12px;
}
</style>