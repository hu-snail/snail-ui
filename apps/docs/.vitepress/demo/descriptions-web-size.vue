<script setup lang="ts">
/** Demo: SnDescriptions — size 三档字号与内边距。 */
import { SnDescriptions, SnDescriptionsItem } from '@snui/vue-web';
</script>

<template>
  <div class="descriptions-demo">
    <SnDescriptions title="small" size="small" bordered>
      <SnDescriptionsItem label="字段 A">值 A</SnDescriptionsItem>
      <SnDescriptionsItem label="字段 B">值 B</SnDescriptionsItem>
      <SnDescriptionsItem label="字段 C">值 C</SnDescriptionsItem>
    </SnDescriptions>

    <SnDescriptions title="medium（默认）" bordered>
      <SnDescriptionsItem label="字段 A">值 A</SnDescriptionsItem>
      <SnDescriptionsItem label="字段 B">值 B</SnDescriptionsItem>
      <SnDescriptionsItem label="字段 C">值 C</SnDescriptionsItem>
    </SnDescriptions>

    <SnDescriptions title="large" size="large" bordered>
      <SnDescriptionsItem label="字段 A">值 A</SnDescriptionsItem>
      <SnDescriptionsItem label="字段 B">值 B</SnDescriptionsItem>
      <SnDescriptionsItem label="字段 C">值 C</SnDescriptionsItem>
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
