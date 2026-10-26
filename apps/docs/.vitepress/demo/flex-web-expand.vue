<script setup lang="ts">
/** Demo: SnFlex — expand children. */
import { SnFlex, SnButton } from '@snui/vue-web';
</script>

<template>
  <SnFlex gap="small" style="width: 100%">
    <SnButton style="flex: 1">占 1 份</SnButton>
    <SnButton style="flex: 2">占 2 份</SnButton>
    <SnButton style="flex: 1">占 1 份</SnButton>
  </SnFlex>
</template>
