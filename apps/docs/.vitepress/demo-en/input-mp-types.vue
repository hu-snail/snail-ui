<script setup lang="ts">
/** Demo: sn-input — every supported `type` variant (uni-end). */
import { reactive } from 'vue'
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'

const form = reactive({
  text: '',
  email: 'ada@aui.dev',
  password: '',
  number: 42,
  tel: '',
  url: '',
  search: '',
})
</script>

<template>
  <view class="sn-demo">
    <SnInput v-model="form.text" type="text" placeholder="Text" />
    <SnInput v-model="form.email" type="email" placeholder="Email" />
    <SnInput v-model="form.password" type="password" placeholder="Password" />
    <SnInput v-model="form.number" type="number" :min="0" :max="100" />
    <SnInput v-model="form.tel" type="tel" placeholder="Phone" />
    <SnInput v-model="form.url" type="url" placeholder="https://" />
    <SnInput v-model="form.search" type="search" placeholder="Search…" />
  </view>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 16rpx; max-width: 480rpx; }
</style>