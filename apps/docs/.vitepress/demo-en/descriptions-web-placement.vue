<script setup lang="ts">
/** Demo: SnDescriptions — label-placement：label 在上 / 在左。 */
import { SnDescriptions, SnDescriptionsItem } from '@snui/vue-web'
</script>

<template>
  <div class="descriptions-demo">
    <SnDescriptions title="label-placement = top (default)">
      <SnDescriptionsItem label="Breakfast">Apple</SnDescriptionsItem>
      <SnDescriptionsItem label="Lunch">Apple</SnDescriptionsItem>
      <SnDescriptionsItem label="Dinner">Apple</SnDescriptionsItem>
    </SnDescriptions>

    <SnDescriptions title="label-placement = left" label-placement="left">
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
