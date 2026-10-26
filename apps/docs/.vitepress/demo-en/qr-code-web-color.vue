<script setup lang="ts">
/** Demo: SnQrCode — foreground / background colors. */
import { ref } from 'vue';
import { SnColorPicker, SnFlex, SnQrCode } from '@snui/vue-web';

const color = ref('#225a95');
</script>

<template>
  <div class="demo-col">
    <SnFlex>
      <SnQrCode value="https://snail.aui" color="#18a058" />
      <SnQrCode value="https://snail.aui" color="#409eff" background-color="#f5f5f5" />
    </SnFlex>
    <SnFlex vertical>
      <SnColorPicker v-model="color" :swatches="['#000000', '#18a058', '#225a95', '#9c3848']" />
      <SnQrCode value="https://snail.aui" :color="color" background-color="#f5f5f5" />
    </SnFlex>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
