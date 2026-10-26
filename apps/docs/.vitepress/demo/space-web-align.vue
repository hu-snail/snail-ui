<script setup lang="ts">
/** Demo: SnSpace — justify / align / wrap. */
import { SnButton, SnTag, SnSpace } from '@snui/vue-web'
</script>

<template>
  <div class="demo-col">
    <SnSpace justify="space-between" style="width: 100%;">
      <SnTag>左</SnTag><SnTag>中</SnTag><SnTag>右</SnTag>
    </SnSpace>
    <SnSpace align="center" style="width: 100%;">
      <SnButton>混排</SnButton>
      <SnText depth="2">与文本对齐</SnText>
    </SnSpace>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 12px; }
</style>
