<script setup lang="ts">
/** Demo: SnRadio — basic v-model + checkedValue. */
import { ref } from 'vue'
import { SnRadio } from '@snui/vue-web'
const picked = ref('apple')
</script>

<template>
  <div class="demo-row">
    <SnRadio v-model="picked" checked-value="apple" label="苹果" />
    <SnRadio v-model="picked" checked-value="banana" label="香蕉" />
    <SnRadio v-model="picked" checked-value="cherry" label="樱桃" />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; flex-wrap: wrap; }
</style>
