<script setup lang="ts">
/** Demo: SnFlex — basic + gap. */
import { SnFlex, SnTag } from '@snui/vue-web';
</script>

<template>
  <div class="demo-col">
    <SnFlex :gap="12">
      <SnTag>gap=12</SnTag><SnTag>Direct pixels</SnTag><SnTag>No wrapper</SnTag>
    </SnFlex>
    <SnFlex gap="large" wrap>
      <SnTag v-for="i in 8" :key="i">Tag {{ i }}</SnTag>
    </SnFlex>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
</style>
