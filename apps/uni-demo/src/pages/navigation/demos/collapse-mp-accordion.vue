<script setup lang="ts">
/**
 * Demo: sn-collapse — 手风琴模式与禁用项。
 *
 * 标题图标走内置图标集对象；禁用的面板保持中性灰，图标不参与交互反馈。
 */
import { ref } from 'vue';
import { HelpCircle, Info, Lock } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCollapse from '@snui/uni-src/components/sn-collapse/sn-collapse.vue';
import SnCollapseItem from '@snui/uni-src/components/sn-collapse/sn-collapse-item.vue';

const open = ref('a');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCollapse v-model="open" accordion>
      <SnCollapseItem name="a" title="常见问题" :title-icon-data="HelpCircle">
        <text class="sn-demo__body">同时只展开一项。</text>
      </SnCollapseItem>
      <SnCollapseItem name="b" title="售后政策" :title-icon-data="Info">
        <text class="sn-demo__body">7 天无理由退换。</text>
      </SnCollapseItem>
      <SnCollapseItem name="c" title="暂不可用" :title-icon-data="Lock" disabled>
        <text class="sn-demo__body">该面板已禁用。</text>
      </SnCollapseItem>
    </SnCollapse>
    <text class="sn-demo__meta">当前展开：{{ open || '无' }}</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}
.sn-demo__body {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
