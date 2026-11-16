<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — 圆角按钮（`round`）× 变体场景。
 *
 * 胶囊形态叠加语义类型与常用变体：实心 / 朴素 / 虚线 / 柔和。
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

type ButtonVariant = 'base' | 'plain' | 'dashed' | 'soft';
type SemanticType = 'primary' | 'success' | 'info' | 'warning' | 'danger';

/** 变体分组标签（括号内为 API 枚举值）。 */
const variants: Array<{ key: ButtonVariant; label: string }> = [
  { key: 'base', label: '实心' },
  { key: 'plain', label: '朴素' },
  { key: 'dashed', label: '虚线' },
  { key: 'soft', label: '柔和' },
];

/** 每组展示的语义类型。 */
const types: Array<{ key: SemanticType; label: string }> = [
  { key: 'primary', label: '主要按钮' },
  { key: 'success', label: '成功按钮' },
  { key: 'info', label: '信息按钮' },
  { key: 'warning', label: '警告按钮' },
  { key: 'danger', label: '危险按钮' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view v-for="variant in variants" :key="variant.key" class="sn-demo__group">
      <text class="sn-demo__label">{{ variant.label }}（{{ variant.key }}）</text>
      <view class="sn-demo__row">
        <SnButton
          v-for="item in types"
          :key="item.key"
          round
          :type="item.key"
          :variant="variant.key === 'base' ? undefined : variant.key"
        >
          {{ item.label }}
        </SnButton>
      </view>
    </view>
  </view>
</template>

<style scoped>
.sn-demo__group {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  align-items: center;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
