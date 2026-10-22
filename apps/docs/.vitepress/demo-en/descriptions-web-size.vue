<script setup lang="ts">
/** Demo: SnDescriptions — size 三档字号与内边距。 */
import { SnDescriptions, SnDescriptionsItem } from '@snui/vue-web'
</script>

<template>
  <div class="descriptions-demo">
    <SnDescriptions title="small" size="small" bordered>
      <SnDescriptionsItem label="Field A">Value A</SnDescriptionsItem>
      <SnDescriptionsItem label="Field B">Value B</SnDescriptionsItem>
      <SnDescriptionsItem label="Field C">Value C</SnDescriptionsItem>
    </SnDescriptions>

    <SnDescriptions title="medium (default)" bordered>
      <SnDescriptionsItem label="Field A">Value A</SnDescriptionsItem>
      <SnDescriptionsItem label="Field B">Value B</SnDescriptionsItem>
      <SnDescriptionsItem label="Field C">Value C</SnDescriptionsItem>
    </SnDescriptions>

    <SnDescriptions title="large" size="large" bordered>
      <SnDescriptionsItem label="Field A">Value A</SnDescriptionsItem>
      <SnDescriptionsItem label="Field B">Value B</SnDescriptionsItem>
      <SnDescriptionsItem label="Field C">Value C</SnDescriptionsItem>
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
