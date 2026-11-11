<script setup lang="ts">
/** Demo: SnLink — underline on/off. */
import { SnLink } from '@snui/vue-web';
</script>

<template>
  <div class="link-state-demo">
    <div class="link-state-demo__row">
      <SnLink type="primary" href="#underline-off"
        >underline = false (default, shown on hover)</SnLink
      >
      <SnLink type="primary" underline href="#underline-on"
        >underline = true (always shown)</SnLink
      >
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
