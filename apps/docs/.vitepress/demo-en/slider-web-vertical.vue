<script setup lang="ts">
/** Demo: SnSlider — vertical + reverse + vertical marks. */
import { ref } from 'vue';
import { SnSlider } from '@snui/vue-web';
const v = ref(40);
const r = ref(60);
const m = ref(5);
</script>

<template>
  <div class="demo-row" style="height: 220px">
    <SnSlider v-model="v" vertical />
    <SnSlider v-model="r" vertical reverse />
    <SnSlider v-model="m" vertical :min="0" :max="15" :marks="{ 5: '5km', 10: '10km' }" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 40px;
  align-items: center;
}
</style>
