<script setup lang="ts">
/** Demo: SnLink — disabled state blocks clicks and navigation. */
import { SnLink } from '@snui/vue-web';
</script>

<template>
  <div class="link-state-demo">
    <div class="link-state-demo__row">
      <SnLink href="#enabled">可用链接</SnLink>
      <SnLink disabled href="#disabled">禁用链接</SnLink>
      <SnLink type="error" disabled href="#disabled-error">禁用错误链接</SnLink>
    </div>
  </div>
</template>

<style scoped>
.link-state-demo {
  display: grid;
  gap: 20px;
}
.link-state-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}
</style>
