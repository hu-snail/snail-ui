<script setup lang="ts">
/** Demo: SnDescriptions — 默认三列 key/value 明细表。 */
import { SnDescriptions, SnDescriptionsItem } from '@snui/vue-web'
</script>

<template>
  <div class="descriptions-demo">
    <SnDescriptions title="Order info">
      <SnDescriptionsItem label="Order No.">SN-2026-0018</SnDescriptionsItem>
      <SnDescriptionsItem label="Status">Paid</SnDescriptionsItem>
      <SnDescriptionsItem label="Channel">WeChat Pay</SnDescriptionsItem>
      <SnDescriptionsItem label="Order time">2026-10-18 09:30</SnDescriptionsItem>
      <SnDescriptionsItem label="Payment time">2026-10-18 09:31</SnDescriptionsItem>
      <SnDescriptionsItem label="Support">snail-aui</SnDescriptionsItem>
    </SnDescriptions>
  </div>
</template>

<style scoped>
.descriptions-demo {
  width: 100%;
}
</style>
