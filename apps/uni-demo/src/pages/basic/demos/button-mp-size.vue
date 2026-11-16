<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — 尺寸 × 形态场景。
 *
 * 三档尺寸（small / medium / large，移动端无 tiny）分别叠加：实心主题色、
 * 朴素描边、柔和填充、细边框（hairline，default 类型）、圆形图标按钮
 * （图标随尺寸自适应：small 28 / medium 32 / large 40）。
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

type SizeKey = 'small' | 'medium' | 'large';
type SizeLabel = { key: SizeKey; label: string };

const sizes: SizeLabel[] = [
  { key: 'small', label: '小号' },
  { key: 'medium', label: '中号' },
  { key: 'large', label: '大号' },
];

/** 圆形图标按钮各档位的内置图标名（图标随尺寸自适应）。 */
const iconSizes: Array<{ key: SizeKey; icon: string }> = [
  { key: 'small', icon: 'settings' },
  { key: 'medium', icon: 'search' },
  { key: 'large', icon: 'plus' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">实心（type=primary）</text>
    <view class="sn-demo__row">
      <SnButton v-for="item in sizes" :key="item.key" type="primary" :size="item.key">
        {{ item.label }}按钮
      </SnButton>
    </view>

    <text class="sn-demo__label">朴素（plain）</text>
    <view class="sn-demo__row">
      <SnButton v-for="item in sizes" :key="item.key" type="primary" variant="plain" :size="item.key">
        {{ item.label }}按钮
      </SnButton>
    </view>

    <text class="sn-demo__label">柔和（soft）</text>
    <view class="sn-demo__row">
      <SnButton v-for="item in sizes" :key="item.key" type="primary" variant="soft" :size="item.key">
        {{ item.label }}按钮
      </SnButton>
    </view>

    <text class="sn-demo__label">细边框（hairline，default 类型）</text>
    <view class="sn-demo__row">
      <SnButton v-for="item in sizes" :key="item.key" :size="item.key">{{ item.label }}按钮</SnButton>
    </view>

    <text class="sn-demo__label">图标按钮（circle，图标随尺寸自适应）</text>
    <view class="sn-demo__row">
      <SnButton
        v-for="item in iconSizes"
        :key="item.key"
        circle
        type="primary"
        :size="item.key"
        :icon-name="item.icon"
      />
    </view>
  </view>
</template>

<style scoped>
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
