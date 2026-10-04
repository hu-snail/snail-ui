<script setup lang="ts">
/** Demo: SnButton (Web) — tag prop swaps root element. */
import { SnButton } from '@snui/vue-web'
</script>

<template>
  <div class="sn-demo">
    <SnButton tag="button" type="primary">tag=button</SnButton>
    <SnButton tag="a" type="primary" href="https://wot-ui.cn" target="_blank">
      tag=a (link)
    </SnButton>
    <SnButton tag="div" type="success">tag=div</SnButton>
    <SnButton tag="span" type="warning">tag=span (inline)</SnButton>
  </div>
</template>

<style scoped>
.sn-demo { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
</style>