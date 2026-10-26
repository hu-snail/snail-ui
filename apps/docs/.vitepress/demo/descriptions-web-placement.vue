<script setup lang="ts">
/** Demo: SnDescriptions — label-placement：label 在上 / 在左。 */
import { SnDescriptions, SnDescriptionsItem } from '@snui/vue-web';
</script>

<template>
  <div class="descriptions-demo">
    <SnDescriptions title="label-placement = top（默认）">
      <SnDescriptionsItem label="早餐">苹果</SnDescriptionsItem>
      <SnDescriptionsItem label="午餐">苹果</SnDescriptionsItem>
      <SnDescriptionsItem label="晚餐">苹果</SnDescriptionsItem>
    </SnDescriptions>

    <SnDescriptions title="label-placement = left" label-placement="left">
      <SnDescriptionsItem label="早餐">苹果</SnDescriptionsItem>
      <SnDescriptionsItem label="午餐">苹果</SnDescriptionsItem>
      <SnDescriptionsItem label="晚餐">苹果</SnDescriptionsItem>
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
