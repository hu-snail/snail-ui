<script setup lang="ts">
/** Demo: sn-cell — 基础单元格与分组。 */
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup title="账户" value="2 项" insert>
      <SnCell title="用户名" value="Ada" />
      <SnCell title="手机号" value="138****8000" />
      <SnCell title="邮箱" placeholder="未填写" />
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
