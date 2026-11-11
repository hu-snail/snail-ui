<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — `hairline` 细边框。
 *
 * `hairline` 只对 `type="default"` 生效（其它类型本来就有语义色描边），
 * 默认 true，置 false 后边框变透明；可与 loading 态叠加。
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

const busy = ref(false);

function toggleBusy(): void {
  busy.value = !busy.value;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">hairline：default 类型下 true 显示细边框，false 去掉边框</text>
    <view class="sn-demo__row">
      <SnButton>hairline（默认）</SnButton>
      <SnButton :hairline="false">hairline=false</SnButton>
      <SnButton hairline :disabled="true">hairline + disabled</SnButton>
    </view>

    <text class="sn-demo__meta">loading 与 hairline 叠加：细边框按钮的加载态</text>
    <view class="sn-demo__row">
      <SnButton loading :loading-props="{ size: 40 }">加载中（hairline）</SnButton>
      <SnButton :hairline="false" loading>加载中（无边框）</SnButton>
      <SnButton type="primary" :loading="busy" @tap="toggleBusy">
        {{ busy ? '请求中…' : '点我切 loading' }}
      </SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
