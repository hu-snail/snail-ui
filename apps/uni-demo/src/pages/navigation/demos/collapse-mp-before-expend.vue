<script setup lang="ts">
/**
 * Demo: sn-collapse — `before-expend` 展开拦截。
 *
 * `before-expend` 在展开前调用（收 `name`），返回 `false` 阻止展开。
 */
import { ref } from 'vue';
import SnCollapse from '@snui/uni-src/components/sn-collapse/sn-collapse.vue';
import SnCollapseItem from '@snui/uni-src/components/sn-collapse/sn-collapse-item.vue';

const open = ref(['a']);
const attempts = ref(0);

/** 前两次展开被拦下。 */
function beforeExpend(): boolean {
  attempts.value += 1;
  return attempts.value > 2;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCollapse v-model="open">
      <SnCollapseItem name="a" title="配送方式" :before-expend="beforeExpend">
        <text class="sn-demo__body">顺丰速运，预计 2 天送达。</text>
      </SnCollapseItem>
      <SnCollapseItem name="b" title="支付方式">
        <text class="sn-demo__body">支持微信支付与支付宝。</text>
      </SnCollapseItem>
    </SnCollapse>

    <text class="sn-demo__meta"
      >before-expend 已拦截 {{ Math.min(attempts, 2) }} 次；已展开：{{
        open.join('、') || '无'
      }}</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
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
