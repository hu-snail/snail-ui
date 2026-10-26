<script setup lang="ts">
/** Demo: SnDescriptions — bordered 描边网格（含左置 label 变体）。 */
import { SnDescriptions, SnDescriptionsItem } from '@snui/vue-web'
</script>

<template>
  <div class="descriptions-demo">
    <SnDescriptions title="Enable bordered for multi-line content" bordered>
      <SnDescriptionsItem label="Breakfast">Apple</SnDescriptionsItem>
      <SnDescriptionsItem label="Lunch">Apple</SnDescriptionsItem>
      <SnDescriptionsItem label="Dinner">Apple</SnDescriptionsItem>
      <SnDescriptionsItem label="Notes">
        Multi-line content aligns more easily in a bordered grid; long text expands its cell automatically.
      </SnDescriptionsItem>
    </SnDescriptions>

    <SnDescriptions title="bordered + label-placement = left" bordered label-placement="left" label-align="right">
      <SnDescriptionsItem label="Breakfast">Apple</SnDescriptionsItem>
      <SnDescriptionsItem label="Lunch">Apple</SnDescriptionsItem>
      <SnDescriptionsItem label="Dinner">Apple</SnDescriptionsItem>
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
