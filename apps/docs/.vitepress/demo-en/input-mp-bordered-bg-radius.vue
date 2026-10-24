<script setup lang="ts">
/** Demo: sn-input — bordered / bg / radius variants (uni-end). */
import { ref } from 'vue'
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'

const a = ref('')
const b = ref('')
const c = ref('')
const d = ref('search')
const e = ref('')
</script>

<template>
  <view class="sn-demo">
    <SnInput v-model="a" placeholder="bordered (default)" />
    <SnInput v-model="b" placeholder="borderless" :bordered="false" />

    <SnInput v-model="c" placeholder="surface (default)" bg="surface" />
    <SnInput v-model="d" placeholder="transparent" bg="transparent" :bordered="false" />
    <SnInput v-model="e" placeholder="soft" bg="soft" />

    <SnInput model-value="default radius" radius="default" readonly />
    <SnInput model-value="pill radius (search bar)" radius="pill" readonly />
    <SnInput model-value="square radius" radius="square" readonly />
  </view>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 16rpx; max-width: 480rpx; }
</style>