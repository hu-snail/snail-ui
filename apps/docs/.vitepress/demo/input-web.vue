<script setup lang="ts">
/**
 * Demo: SnInput (Web) — placeholder live render.
 *
 * Full SnInput requires v1.x Input contract not yet shipped. This demo uses
 * native input elements bound through Vue 3 reactivity. Replace with real
 * SnInput once AUI-WEB-FORM-003 ships.
 */

import { ref } from 'vue'
import SnButton from '@snui/vue-web/src/button/SnButton.vue'

const text = ref('')
const email = ref('ada@aui.dev')
const password = ref('')
const disabled = ref('禁用态示例')
const readonly = ref('只读态示例')
</script>

<template>
  <div class="sn-demo">
    <div class="sn-demo__row">
      <span class="sn-demo__label">text</span>
      <input v-model="text" type="text" placeholder="文本输入" class="sn-demo__input" />
      <span class="sn-demo__meta">{{ text }}</span>
    </div>

    <div class="sn-demo__row">
      <span class="sn-demo__label">email</span>
      <input v-model="email" type="email" placeholder="邮箱" class="sn-demo__input" />
    </div>

    <div class="sn-demo__row">
      <span class="sn-demo__label">password</span>
      <input v-model="password" type="password" placeholder="密码" class="sn-demo__input" />
    </div>

    <div class="sn-demo__row">
      <span class="sn-demo__label">disabled</span>
      <input v-model="disabled" type="text" disabled class="sn-demo__input" />
    </div>

    <div class="sn-demo__row">
      <span class="sn-demo__label">readonly</span>
      <input v-model="readonly" type="text" readonly class="sn-demo__input" />
    </div>

    <div class="sn-demo__row">
      <span class="sn-demo__label">clearable</span>
      <input v-model="text" type="text" placeholder="点击右侧 × 清空" class="sn-demo__input" />
      <SnButton size="x-small" @click="text = ''">×</SnButton>
    </div>

    <p class="sn-demo__note">
      完整 SnInput 组件（含 v-model + clearable + maxlength 等完整 Props）见
      <a href="/components/web/input">/components/web/input</a>。
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
  align-items: center;
  gap: 8px;
}
.sn-demo__label {
  width: 80px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.sn-demo__input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
}
.sn-demo__meta {
  font-size: 11px;
  color: var(--vp-c-text-3);
  min-width: 80px;
}
.sn-demo__note {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin: 4px 0 0;
}
.sn-demo__note a {
  color: var(--vp-c-brand-1);
}
</style>