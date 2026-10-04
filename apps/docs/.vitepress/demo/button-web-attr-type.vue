<script setup lang="ts">
/** Demo: SnButton (Web) — attrType (form submit/reset) + focusable. */
import { reactive, ref } from 'vue'
import { SnButton, SnForm, SnFormItem, SnInput } from '@snui/vue-web'

const form = reactive({ email: '' })
const count = ref(0)
function submit(): void { count.value++ }
function reset(): void { form.email = '' }
</script>

<template>
  <div class="sn-demo">
    <SnForm :model="form" label-position="top">
      <SnFormItem label="Email" prop="email">
        <SnInput v-model="form.email" placeholder="you@example.com" />
      </SnFormItem>
      <div class="sn-demo__actions">
        <SnButton type="primary" attr-type="submit" @click="submit">Submit</SnButton>
        <SnButton attr-type="reset" @click="reset">Reset</SnButton>
        <SnButton :focusable="false">Not tab-focusable</SnButton>
      </div>
      <p>submit count: {{ count }}</p>
    </SnForm>
  </div>
</template>

<style scoped>
.sn-demo { max-width: 360px; }
.sn-demo__actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
p { margin-top: 12px; font-size: 12px; color: var(--vp-c-text-2); }
</style>