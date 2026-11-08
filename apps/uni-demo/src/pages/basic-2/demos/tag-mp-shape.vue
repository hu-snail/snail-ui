<script setup lang="ts">
/**
 * Demo: sn-tag (uni-end) — 异形标签：shape 六种形态一格一样张。
 *
 * square 直角（基准）/ round 胶囊 / skew 平行四边形（内部反向补偿，
 * 文字保持水平）/ ribbon 右端旗标 / fold 右上折角（深色折角）/
 * ticket 两侧票券缺口。`round` prop 等价于 shape="round"，两者同传时
 * shape 优先。
 */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';

/** 六种形态 × 贴合形态的业务文案。 */
const shapes = [
  { shape: 'square', type: 'default', label: '置顶', name: 'square' },
  { shape: 'round', type: 'primary', label: 'NEW', name: 'round' },
  { shape: 'skew', type: 'danger', label: '促销', name: 'skew' },
  { shape: 'ribbon', type: 'volcano', label: '热卖', name: 'ribbon' },
  { shape: 'fold', type: 'cyan', label: '限量', name: 'fold' },
  { shape: 'ticket', type: 'warning', label: '满减券', name: 'ticket' },
] as const;
</script>

<template>
  <view class="sn-demo">
    <view v-for="item in shapes" :key="item.shape" class="shape-cell">
      <SnTag :type="item.type" :shape="item.shape">{{ item.label }}</SnTag>
      <text class="shape-cell__name">{{ item.name }}</text>
    </view>
  </view>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-6) var(--sn-mp-spacing-5);
}

.shape-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  width: 200rpx;
}

.shape-cell__name {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
