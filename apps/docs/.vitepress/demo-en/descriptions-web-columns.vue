<script setup lang="ts">
/** Demo: SnDescriptions — column 控制总列数。 */
import { SnDescriptions, SnDescriptionsItem } from '@snui/vue-web';
</script>

<template>
  <div class="descriptions-demo">
    <SnDescriptions title="column = 1" :column="1">
      <SnDescriptionsItem label="Name">AUI</SnDescriptionsItem>
      <SnDescriptionsItem label="Location">AI-Native multi-end UI framework</SnDescriptionsItem>
      <SnDescriptionsItem label="Build">Vite + vue-tsc</SnDescriptionsItem>
    </SnDescriptions>

    <SnDescriptions title="column = 2" :column="2">
      <SnDescriptionsItem label="Name">AUI</SnDescriptionsItem>
      <SnDescriptionsItem label="Location">AI-Native multi-end UI framework</SnDescriptionsItem>
      <SnDescriptionsItem label="Build">Vite + vue-tsc</SnDescriptionsItem>
      <SnDescriptionsItem label="Test">vitest + happy-dom</SnDescriptionsItem>
    </SnDescriptions>

    <SnDescriptions title="column = 3" :column="3">
      <SnDescriptionsItem label="Name">AUI</SnDescriptionsItem>
      <SnDescriptionsItem label="Location">AI-Native multi-end UI framework</SnDescriptionsItem>
      <SnDescriptionsItem label="Build">Vite + vue-tsc</SnDescriptionsItem>
    </SnDescriptions>
  </div>
</template>

<style scoped>
.descriptions-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}
</style>
