<script setup lang="ts">
/** Demo: SnLink — plain href link. */
import { SnLink } from '@snui/vue-web';
</script>

<template>
  <div class="link-demo">
    <div class="link-demo__row">
      <SnLink href="#default">默认链接</SnLink>
    </div>
  </div>
</template>

<style scoped>
.link-demo {
  display: grid;
  gap: 18px;
}
.link-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}
</style>
