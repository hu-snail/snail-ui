<script setup lang="ts">
/** Demo: sn-cell — basic cells inside a group. */
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue'
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue'
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup title="Account" value="2 items" insert>
      <SnCell title="Username" value="Ada" />
      <SnCell title="Phone" value="138****8000" />
      <SnCell title="Email" placeholder="Not set" />
    </SnCellGroup>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
</style>
