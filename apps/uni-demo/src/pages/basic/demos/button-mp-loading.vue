<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — 加载状态全场景（唯一加载模块）。
 *
 * 覆盖：语义色 loading、点击触发、`loading-props` 对象写法（wot-ui
 * `wd-button` 兼容：color / size，扁平 `loading-color` / `loading-size`
 * 优先）、`loading-color` / `loading-size` 直接定制。
 *
 * 布局说明：uni-app x 不支持 flex `gap`，间距用内联 `custom-style` margin
 * 兜底，显式 `flex-direction: row` 抵消 uni-app x 的 column 默认值。
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

const loading = ref(false);
function trigger(): void {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
}

/** loading-props 同时给 color + size（size 走 rpx）。 */
const spinnerFromProps = { color: 'var(--sn-mp-color-action-primary)', size: 48 };

/** 行内按钮间距（uni-app x 无 gap 兜底）。 */
const rowGap = { margin: '0 16rpx 16rpx 0' };
</script>

<template>
  <view class="sn-mp-btn-stack">
    <text class="sn-mp-btn-label">加载中（loading × 语义色）</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap" loading type="primary">保存中</SnButton>
      <SnButton :custom-style="rowGap" loading type="success">提交中</SnButton>
      <SnButton :custom-style="rowGap" loading type="danger">删除中</SnButton>
      <SnButton :custom-style="rowGap" :loading="loading" type="primary" @click="trigger">
        点击触发加载
      </SnButton>
    </view>

    <text class="sn-mp-btn-meta">loading-props 只给 color：spinner 换成品牌色</text>
    <view class="sn-mp-btn-row">
      <SnButton
        :custom-style="rowGap"
        type="primary"
        loading
        :loading-props="{ color: 'var(--sn-mp-color-feedback-success)' }"
      >
        品牌色加载图标
      </SnButton>
      <SnButton :custom-style="rowGap" type="primary" loading>默认加载图标</SnButton>
    </view>

    <text class="sn-mp-btn-meta">loading-props 同时给 color + size（size 走 rpx）</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap" type="success" loading :loading-props="spinnerFromProps">
        大号加载图标
      </SnButton>
      <SnButton :custom-style="rowGap" type="success" loading>默认大小加载图标</SnButton>
    </view>

    <text class="sn-mp-btn-meta">
      扁平属性优先生效：loading-color / loading-size 覆盖 loading-props 同名项
    </text>
    <view class="sn-mp-btn-row">
      <SnButton
        :custom-style="rowGap"
        type="warning"
        loading
        loading-color="var(--sn-mp-color-feedback-danger)"
        :loading-props="{ color: 'var(--sn-mp-color-action-primary)', size: 64 }"
      >
        扁平属性优先生效
      </SnButton>
    </view>

    <text class="sn-mp-btn-meta">loading-color / loading-size 直接定制 spinner</text>
    <view class="sn-mp-btn-row">
      <SnButton
        :custom-style="rowGap"
        loading
        loading-color="var(--sn-mp-color-feedback-success)"
        type="primary"
      >
        自定义颜色
      </SnButton>
      <SnButton :custom-style="rowGap" loading loading-size="48" type="success">自定义大小</SnButton>
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
.sn-mp-btn-label {
  margin-bottom: 12rpx;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-mp-btn-meta {
  margin-bottom: 12rpx;
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
