<script setup lang="ts">
/** Demo: SnForm + SnFormItem — Cell-style (border / ellipsis / clickable / isLink / placeholder / description). */
import { reactive } from 'vue'
import { SnForm, SnFormItem, SnInput } from '@snui/vue-web'

const data = reactive({
  email: '',
  nickname: '',
  bio: '',
  addr: '',
  notes: 'Tap the row → click event fires',
})
</script>

<template>
  <div class="sn-demo">
    <SnForm :model="data" border>
      <SnFormItem prop="email" label="Email (with description)" description="We'll never spam you.">
        <SnInput v-model="data.email" />
      </SnFormItem>
      <SnFormItem prop="nickname" label="A very long label that should ellipsis when it overflows" ellipsis>
        <SnInput v-model="data.nickname" placeholder="input" />
      </SnFormItem>
      <SnFormItem prop="bio" label="Empty (placeholder fallback)" placeholder="Not set yet" />
      <SnFormItem prop="addr" label="Clickable row (no input)" placeholder="Tap me" clickable is-link @click="data.notes = 'clicked'" />
      <SnFormItem prop="notes" label="Last value (read-only)" is-link>
        <SnInput v-model="data.notes" readonly />
      </SnFormItem>
    </SnForm>
  </div>
</template>

<style scoped>
.sn-demo { max-width: 460px; }
</style>