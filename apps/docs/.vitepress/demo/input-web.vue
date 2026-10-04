<script setup lang="ts">
/**
 * Demo: SnInput (Web) — live surface of every Phase 1 contract.
 *
 * Covers:
 *   - all 8 input types (text, password, email, number, tel, url,
 *     search, textarea)
 *   - 4 sizes (tiny, small, medium, large)
 *   - 3 statuses (default, error, warning)
 *   - clearable / showCount / disabled / readonly
 *   - prefix / suffix / clear-icon / count slots
 */

import { reactive } from 'vue'
import { SnIcon, SnInput } from '@snui/vue-web'
import { ChevronRight, Search, X } from 'lucide-vue-next'
import { registerSnIcons } from '@snui/vue-web'

registerSnIcons({ ChevronRight, Search, X })

const form = reactive({
  // Basic
  text: '',
  email: 'ada@aui.dev',
  password: '',
  number: 42,
  tel: '',
  url: '',
  search: '',

  // Visual
  tiny: '',
  small: '',
  medium: 'medium',
  large: '',
  bio: 'Hi, I am using @snui/vue-web.',

  // Status
  errorInput: 'not-an-email',
  warningInput: '',

  // Interactive
  clearable: 'click × to clear',
  counter: 'hel',
})
</script>

<template>
  <div class="sn-demo">
    <h3 class="sn-demo__title">Basic types</h3>
    <SnInput v-model="form.text" placeholder="Text" />
    <SnInput v-model="form.email" type="email" placeholder="Email" />
    <SnInput v-model="form.password" type="password" placeholder="Password" />
    <SnInput v-model="form.number" type="number" :min="0" :max="100" />
    <SnInput v-model="form.tel" type="tel" placeholder="Phone" />
    <SnInput v-model="form.url" type="url" placeholder="https://" />
    <SnInput v-model="form.search" type="search" placeholder="Search…" />

    <h3 class="sn-demo__title">Sizes</h3>
    <SnInput v-model="form.tiny" size="tiny" placeholder="Tiny" />
    <SnInput v-model="form.small" size="small" placeholder="Small" />
    <SnInput v-model="form.medium" size="medium" placeholder="Medium" />
    <SnInput v-model="form.large" size="large" placeholder="Large" />

    <h3 class="sn-demo__title">Status</h3>
    <SnInput v-model="form.errorInput" status="error" />
    <SnInput v-model="form.warningInput" status="warning" />

    <h3 class="sn-demo__title">States</h3>
    <SnInput model-value="Disabled" disabled />
    <SnInput model-value="Read-only" readonly />

    <h3 class="sn-demo__title">Clearable</h3>
    <SnInput v-model="form.clearable" clearable placeholder="Type then click ×" />

    <h3 class="sn-demo__title">Counter</h3>
    <SnInput v-model="form.counter" :maxlength="10" show-count />

    <h3 class="sn-demo__title">Slots</h3>
    <SnInput v-model="form.search" placeholder="Search…" clearable>
      <template #prefix>
        <SnIcon :icon="Search" :size="14" />
      </template>
      <template #clear-icon>
        <SnIcon :icon="X" :size="12" />
      </template>
    </SnInput>

    <SnInput v-model="form.url" placeholder="https://" type="url">
      <template #suffix>
        <SnIcon :icon="ChevronRight" :size="14" />
      </template>
    </SnInput>

    <h3 class="sn-demo__title">Textarea</h3>
    <SnInput v-model="form.bio" type="textarea" :rows="3" />
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 360px;
}
.sn-demo__title {
  margin: 16px 0 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
</style>