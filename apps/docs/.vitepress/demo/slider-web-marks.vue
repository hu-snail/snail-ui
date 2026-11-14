<script setup lang="ts">
/** Demo: SnSlider — clickable marks. */
import { ref } from 'vue';
import { SnSlider } from '@snui/vue-web';
const v = ref(30);
</script>

<template>
  <div class="demo-col">
    <SnSlider v-model="v" :marks="{ 0: '0°C', 26: '26°C', 37: '37°C', 100: '100°C' }" />
  </div>
</template>

<style scoped>
.demo-col {
  /* Stage is a centered flex container: without an explicit width this
     column shrink-to-fits and the slider width:100% collapses. */
  width: 100%;
  max-width: 400px;
}
</style>
