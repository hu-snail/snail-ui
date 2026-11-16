<script setup lang="ts">
/** Demo: SnButton (Web) — tag prop swaps root element. */
import { SnButton } from '@snui/vue-web';
</script>

<template>
  <div class="sn-demo">
    <SnButton tag="button" type="primary">默认按钮</SnButton>
    <SnButton tag="a" type="primary" href="https://example.com" target="_blank">
      链接按钮
    </SnButton>
    <SnButton tag="div" type="success">容器按钮</SnButton>
    <SnButton tag="span" type="warning">行内按钮</SnButton>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
</style>
