<script setup lang="ts">
/** Demo: SnDynamicInput — object rows via slot. */
import { ref } from 'vue'
import { SnDynamicInput, SnInput } from '@snui/vue-web'

interface Contact { name: string, phone: string }
const items = ref<Contact[]>([{ name: '张三', phone: '13800000000' }])
</script>

<template>
  <div class="demo-col">
    <SnDynamicInput v-model="items" :preset="() => ({ name: '', phone: '' })" style="max-width: 420px;">
      <template #default="{ value }">
        <div class="contact-row">
          <SnInput v-model="(value as Contact).name" placeholder="姓名" />
          <SnInput v-model="(value as Contact).phone" placeholder="电话" />
        </div>
      </template>
    </SnDynamicInput>
    <pre class="demo-log">{{ items }}</pre>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.contact-row { display: flex; gap: 8px; flex: 1; }
.demo-log { margin: 0; padding: 8px 12px; background: var(--vp-c-bg-soft); border-radius: 6px; font-size: 12px; }
</style>
