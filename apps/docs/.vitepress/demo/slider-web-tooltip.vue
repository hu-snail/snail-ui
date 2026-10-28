<script setup lang="ts">
/** Demo: SnSlider — tooltip + formatTooltip + custom tooltip background. */
import { ref } from 'vue';
import { SnSlider } from '@snui/vue-web';
const v = ref(50);
</script>

<template>
  <div class="demo-col">
    <SnSlider v-model="v" />
    <SnSlider v-model="v" :format-tooltip="(x: number) => `${x}%`" />
    <SnSlider v-model="v" tooltip-background="rgba(32, 128, 240, 0.92)" />
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 360px;
}
</style>
