<script setup lang="ts">
/**
 * Demo: sn-table (uni-end) — border / stripe / show-header / index 配置对象 / custom-class / custom-style。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-table from its SFC source.
 */
import SnTable from '@snui/uni-src/components/sn-table/sn-table.vue';
import SnTableColumn from '@snui/uni-src/components/sn-table/sn-table-column.vue';

interface Row {
  name: string;
  amount: number;
  status: string;
}

const rows: Row[] = [
  { name: '蜗牛 A', amount: 128, status: '已付款' },
  { name: '蜗牛 B', amount: 256, status: '待付款' },
  { name: '蜗牛 C', amount: 64, status: '已付款' },
  { name: '蜗牛 D', amount: 512, status: '已退款' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTable
      :data="rows"
      border
      stripe
      :index="{ label: '序号', width: 90, align: 'center' }"
      custom-class="sn-table-demo__root"
      custom-style="margin-bottom: 8rpx"
    >
      <SnTableColumn prop="name" label="名称" :width="150" />
      <SnTableColumn prop="amount" label="金额" :width="110" align="right" />
      <SnTableColumn prop="status" label="状态" :width="120" align="center" />
    </SnTable>
    <text class="sn-demo__meta">
      border + stripe 打开边框与斑马纹；index 传对象可自定义序号列表头 / 宽度 / 对齐； customClass /
      customStyle 作用在表格根节点。
    </text>

    <SnTable :data="rows" :border="false" :stripe="false">
      <SnTableColumn prop="name" label="名称" :width="150" />
      <SnTableColumn prop="amount" label="金额" :width="110" align="right" />
      <SnTableColumn prop="status" label="状态" :width="120" align="center" />
    </SnTable>
    <text class="sn-demo__meta">border=false + stripe=false：无边框、无斑马纹的轻量列表。</text>

    <SnTable :data="rows" :show-header="false">
      <SnTableColumn prop="name" label="名称" :width="150" />
      <SnTableColumn prop="amount" label="金额" :width="110" align="right" />
      <SnTableColumn prop="status" label="状态" :width="120" align="center" />
    </SnTable>
    <text class="sn-demo__meta">show-header=false 隐藏表头，只剩数据行。</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo :deep(.sn-table-demo__root) {
  box-shadow: var(--sn-mp-shadow-sm);
}
</style>
