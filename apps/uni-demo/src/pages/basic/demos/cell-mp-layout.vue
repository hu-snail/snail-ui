<script setup lang="ts">
/** Demo: sn-cell — 纵向布局、必填星号与对齐。 */
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup title="收货信息" layout="vertical" :title-width="120" center>
      <SnCell title="收货人" value="Ada" required />
      <SnCell title="详细地址" value="杭州市西湖区文三路 100 号" required asterisk-position="end" />
      <SnCell title="备注" placeholder="选填" value-align="left" />
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
