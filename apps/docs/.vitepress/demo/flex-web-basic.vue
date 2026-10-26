<script setup lang="ts">
/** Demo: SnFlex — basic + gap. */
import { SnFlex, SnTag } from '@snui/vue-web';
</script>

<template>
  <div class="demo-col">
    <SnFlex :gap="12"> <SnTag>gap=12</SnTag><SnTag>直接像素</SnTag><SnTag>无包裹层</SnTag> </SnFlex>
    <SnFlex gap="large" wrap>
      <SnTag v-for="i in 8" :key="i">标签 {{ i }}</SnTag>
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
