<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — 细边框（`hairline`，全类型描边开关）。
 *
 * hairline 默认 true：default 类型显示灰细边框，语义类型以描边形态
 * 显示主题色；置 false 后全部类型去边框。加载态见「加载」模块。
 *
 * 布局说明：uni-app x 不支持 flex `gap`，间距用内联 `custom-style` margin
 * 兜底，显式 `flex-direction: row` 抵消 uni-app x 的 column 默认值。
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

/** 行内按钮间距（uni-app x 无 gap 兜底）。 */
const rowGap = { margin: '0 16rpx 16rpx 0' };
</script>

<template>
  <view class="sn-mp-btn-stack">
    <text class="sn-mp-btn-meta">细边框（默认开启）：语义类型以描边形态显示主题色</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap">默认按钮</SnButton>
      <SnButton :custom-style="rowGap" variant="plain" type="primary">主要按钮</SnButton>
      <SnButton :custom-style="rowGap" variant="plain" type="success">成功按钮</SnButton>
      <SnButton :custom-style="rowGap" variant="plain" type="info">信息按钮</SnButton>
      <SnButton :custom-style="rowGap" variant="plain" type="warning">警告按钮</SnButton>
      <SnButton :custom-style="rowGap" variant="plain" type="danger">危险按钮</SnButton>
    </view>

    <text class="sn-mp-btn-meta">去掉边框（hairline=false）：全部类型去描边</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap" :hairline="false">默认按钮</SnButton>
      <SnButton :custom-style="rowGap" :hairline="false" variant="plain" type="primary">
        主要按钮
      </SnButton>
      <SnButton :custom-style="rowGap" :hairline="false" variant="plain" type="success">
        成功按钮
      </SnButton>
      <SnButton :custom-style="rowGap" :hairline="false" variant="plain" type="info">
        信息按钮
      </SnButton>
      <SnButton :custom-style="rowGap" :hairline="false" variant="plain" type="warning">
        警告按钮
      </SnButton>
      <SnButton :custom-style="rowGap" :hairline="false" variant="plain" type="danger">
        危险按钮
      </SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-mp-btn-stack {
  display: flex;
  flex-direction: column;
}
.sn-mp-btn-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}
.sn-mp-btn-meta {
  margin-bottom: 12rpx;
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
