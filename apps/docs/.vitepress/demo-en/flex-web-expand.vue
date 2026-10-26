<script setup lang="ts">
/** Demo: SnFlex — expand children. */
import { SnFlex, SnButton } from '@snui/vue-web';
</script>

<template>
  <SnFlex gap="small" style="width: 100%">
    <SnButton style="flex: 1">1 of N</SnButton>
    <SnButton style="flex: 2">2 shares</SnButton>
    <SnButton style="flex: 1">1 of N</SnButton>
  </SnFlex>
</template>
