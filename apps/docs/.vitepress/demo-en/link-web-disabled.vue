<script setup lang="ts">
/** Demo: SnLink — disabled state blocks clicks and navigation. */
import { SnLink } from '@snui/vue-web';
</script>

<template>
  <div class="link-state-demo">
    <div class="link-state-demo__row">
      <SnLink href="#enabled">Available link</SnLink>
      <SnLink disabled href="#disabled">Disabled link</SnLink>
      <SnLink type="error" disabled href="#disabled-error">Disabled error link</SnLink>
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
