<script setup lang="ts">
/** Demo: SnForm — inline label icon via `icon` / `iconName` props. */
import { defineComponent, h, reactive } from 'vue'
import { SnForm, SnFormItem, SnInput } from '@snui/vue-web'
import { Mail, Phone, Search } from 'lucide-vue-next'
import { registerSnIcons } from '@snui/vue-web'

registerSnIcons({ Mail, Phone, Search })

const form = reactive({ email: '', phone: '', search: '' })
</script>

<template>
  <div class="sn-form-demo">
    <SnForm :model="form" label-position="left" label-width="100">
      <SnFormItem prop="email" label="Email" :icon="Mail">
        <SnInput v-model="form.email" type="email" />
      </SnFormItem>
      <SnFormItem prop="phone" label="Phone" icon-name="Phone">
        <SnInput v-model="form.phone" type="tel" />
      </SnFormItem>
      <SnFormItem prop="search" label="Lookup" icon-name="Search">
        <SnInput v-model="form.search" placeholder="Search…" />
      </SnFormItem>
    </SnForm>
  </div>
</template>

<style scoped>
.sn-form-demo { max-width: 480px; }
</style>