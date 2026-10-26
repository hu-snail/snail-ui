<script setup lang="ts">
/** Demo: SnMention — disabled / readonly. */
import { ref } from 'vue'
import { SnMention } from '@snui/vue-web'
const value = ref('已提及 @张三')
const options = ['张三', '李四']
</script>

<template>
  <div class="demo-row">
    <SnMention v-model="value" :options="options" disabled style="width: 220px;" />
    <SnMention v-model="value" :options="options" readonly style="width: 220px;" />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
</style>
