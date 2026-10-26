<script setup lang="ts">
/** Demo: SnAvatar — error fallback chain. */
import { ref } from 'vue';
import { SnAvatar, SnButton } from '@snui/vue-web';
const src = ref('https://invalid.example.com/broken.png');
</script>

<template>
  <div class="demo-row">
    <SnAvatar :src="src" fallback-text="A" />
    <SnAvatar :src="src" icon="user" />
    <SnButton size="small" @click="src = src === '' ? 'https://invalid.example.com/broken.png' : ''"
      >Toggle src to reset</SnButton
    >
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
