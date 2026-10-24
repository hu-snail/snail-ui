<script setup lang="ts">
/** Demo: SnForm — labelPosition × labelWidth combinations. */
import { reactive } from 'vue'
import { SnButton, SnForm, SnFormItem, SnInput } from '@snui/vue-web'

const f1 = reactive({ a: '', b: '' })
const f2 = reactive({ a: '', b: '' })
const f3 = reactive({ a: '', b: '' })
</script>

<template>
  <div class="sn-form-demo">
    <h4 class="sn-form-demo__title">labelPosition: right + labelWidth: 80</h4>
    <SnForm :model="f1" label-position="right" label-width="80">
      <SnFormItem prop="a" label="Email">
        <SnInput v-model="f1.a" />
      </SnFormItem>
      <SnFormItem prop="b" label="Password">
        <SnInput v-model="f1.b" type="password" />
      </SnFormItem>
    </SnForm>

    <h4 class="sn-form-demo__title">labelPosition: left + labelWidth: 100</h4>
    <SnForm :model="f2" label-position="left" label-width="100">
      <SnFormItem prop="a" label="Email">
        <SnInput v-model="f2.a" />
      </SnFormItem>
      <SnFormItem prop="b" label="Password">
        <SnInput v-model="f2.b" type="password" />
      </SnFormItem>
    </SnForm>

    <h4 class="sn-form-demo__title">labelPosition: top</h4>
    <SnForm :model="f3" label-position="top">
      <SnFormItem prop="a" label="Email">
        <SnInput v-model="f3.a" />
      </SnFormItem>
      <SnFormItem prop="b" label="Password">
        <SnInput v-model="f3.b" type="password" />
      </SnFormItem>
    </SnForm>
  </div>
</template>

<style scoped>
.sn-form-demo { display: flex; flex-direction: column; gap: 24px; max-width: 480px; }
.sn-form-demo__title { margin: 0; font-size: 13px; font-weight: 600; color: var(--vp-c-text-1); }
</style>