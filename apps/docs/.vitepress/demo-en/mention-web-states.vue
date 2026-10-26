<script setup lang="ts">
/** Demo: SnMention — disabled / readonly. */
import { ref } from 'vue'
import { SnMention } from '@snui/vue-web'
const value = ref('Mentioned @Zhang San')
const options = ['Zhang San', 'Li Si']
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
