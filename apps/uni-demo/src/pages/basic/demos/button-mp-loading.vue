<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — 加载状态全场景（唯一加载模块）。
 *
 * 覆盖：语义色 loading、点击触发、`loading-props` 对象写法（wot-ui
 * `wd-button` 兼容：color / size，扁平 `loading-color` / `loading-size`
 * 优先）、`loading-color` / `loading-size` 直接定制。
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
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">加载中（loading × 语义色）</text>
    <view class="sn-demo__row">
      <SnButton loading type="primary">保存中</SnButton>
      <SnButton loading type="success">提交中</SnButton>
      <SnButton loading type="danger">删除中</SnButton>
      <SnButton :loading="loading" type="primary" @click="trigger">点击触发加载</SnButton>
    </view>

    <text class="sn-demo__meta">loading-props 只给 color：spinner 换成品牌色</text>
    <view class="sn-demo__row">
      <SnButton type="primary" loading :loading-props="{ color: 'var(--sn-mp-color-feedback-success)' }">
        品牌色加载图标
      </SnButton>
      <SnButton type="primary" loading>默认加载图标</SnButton>
    </view>

    <text class="sn-demo__meta">loading-props 同时给 color + size（size 走 rpx）</text>
    <view class="sn-demo__row">
      <SnButton type="success" loading :loading-props="spinnerFromProps">大号加载图标</SnButton>
      <SnButton type="success" loading>默认大小加载图标</SnButton>
    </view>

    <text class="sn-demo__meta">扁平属性优先生效：loading-color / loading-size 覆盖 loading-props 同名项</text>
    <view class="sn-demo__row">
      <SnButton
        type="warning"
        loading
        loading-color="var(--sn-mp-color-feedback-danger)"
        :loading-props="{ color: 'var(--sn-mp-color-action-primary)', size: 64 }"
      >
        扁平属性优先生效
      </SnButton>
    </view>

    <text class="sn-demo__meta">loading-color / loading-size 直接定制 spinner</text>
    <view class="sn-demo__row">
      <SnButton loading loading-color="var(--sn-mp-color-feedback-success)" type="primary">
        自定义颜色
      </SnButton>
      <SnButton loading loading-size="48" type="success">自定义大小</SnButton>
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
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
