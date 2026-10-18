<script setup lang="ts">
/** Demo: SnDescriptions — 默认三列 key/value 明细表。 */
import { SnDescriptions, SnDescriptionsItem } from '@snui/vue-web'
</script>

<template>
  <div class="descriptions-demo">
    <SnDescriptions title="订单信息">
      <SnDescriptionsItem label="订单号">SN-2026-0018</SnDescriptionsItem>
      <SnDescriptionsItem label="状态">已支付</SnDescriptionsItem>
      <SnDescriptionsItem label="渠道">微信支付</SnDescriptionsItem>
      <SnDescriptionsItem label="下单时间">2026-10-18 09:30</SnDescriptionsItem>
      <SnDescriptionsItem label="支付时间">2026-10-18 09:31</SnDescriptionsItem>
      <SnDescriptionsItem label="客服">snail-aui</SnDescriptionsItem>
    </SnDescriptions>
  </div>
</template>

<style scoped>
.descriptions-demo {
  width: 100%;
}
</style>
