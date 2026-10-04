<script setup lang="ts">
/** Demo: SnForm — basic model + reactive submit. */
import { reactive, ref } from 'vue'
import { SnButton, SnForm, SnFormItem, SnInput } from '@snui/vue-web'

const form = reactive({ name: '', email: '' })
const last = ref<string | null>(null)

function onSubmit(payload: { valid: boolean }): void {
  if (payload.valid) last.value = JSON.stringify(form, null, 2)
}
</script>

<template>
  <div class="sn-form-demo">
    <SnForm :model="form" @submit="onSubmit">
      <SnFormItem prop="name" label="Name">
        <SnInput v-model="form.name" placeholder="Your name" />
      </SnFormItem>
      <SnFormItem prop="email" label="Email">
        <SnInput v-model="form.email" type="email" placeholder="you@aui.dev" />
      </SnFormItem>
      <SnButton type="primary" html-type="submit">Save</SnButton>
    </SnForm>
    <pre v-if="last" class="sn-form-demo__log">{{ last }}</pre>
  </div>
</template>

<style scoped>
.sn-form-demo { max-width: 360px; display: flex; flex-direction: column; gap: 16px; }
.sn-form-demo__log {
  margin: 0; padding: 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  font-size: 12px; color: var(--vp-c-text-2);
}
</style>