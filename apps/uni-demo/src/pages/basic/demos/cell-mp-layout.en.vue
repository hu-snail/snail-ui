<script setup lang="ts">
/** Demo: sn-cell — vertical layout, required asterisk and alignment. */
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup title="Shipping info" layout="vertical" :title-width="120" center>
      <SnCell title="Recipient" value="Ada" required />
      <SnCell title="Address" value="100 Wensan Rd, Hangzhou" required asterisk-position="end" />
      <SnCell title="Note" placeholder="Optional" value-align="left" />
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
