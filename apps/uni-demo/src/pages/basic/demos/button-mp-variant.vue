<script setup lang="ts">
/**
 * Demo: sn-button — 变体 × 语义类型全矩阵（base 即默认实心，见基础用法，不重复成组）。
 *
 * `variant`: 'plain' | 'dashed' | 'soft' | 'subtle' | 'text'。
 * plain / dashed 透明底 + 语义描边（dashed 为朴素虚线），soft 浅色填充，
 * text 只保留语义文字色，subtle 淡灰底 + 语义文字色。
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

type ButtonVariant = 'plain' | 'dashed' | 'soft' | 'subtle' | 'text';
type SemanticType = 'primary' | 'success' | 'info' | 'warning' | 'danger';

/** 变体分组标签（括号内为 API 枚举值）。 */
const variants: Array<{ key: ButtonVariant; label: string }> = [
  { key: 'plain', label: '朴素' },
  { key: 'dashed', label: '虚线' },
  { key: 'soft', label: '柔和' },
  { key: 'subtle', label: '淡雅' },
  { key: 'text', label: '文字' },
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
  <view class="sn-button-demo sn-button-demo--stack">
    <view v-for="variant in variants" :key="variant.key" class="sn-button-demo__group">
      <text class="sn-button-demo__label">{{ variant.label }}（{{ variant.key }}）</text>
      <view class="sn-button-demo__row">
        <SnButton
          v-for="item in types"
          :key="item.key"
          :type="item.key"
          :variant="variant.key"
        >
          {{ variant.key === 'text' ? '按钮' : item.label }}
        </SnButton>
      </view>
    </view>
  </view>
</template>

<style scoped>
.sn-button-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
}
.sn-button-demo__group {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.sn-button-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  align-items: center;
}
.sn-button-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
