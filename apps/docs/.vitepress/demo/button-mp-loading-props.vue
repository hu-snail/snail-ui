<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — `loading-props` 对象写法 + `hairline` 细边框对比。
 *
 * `loading-props` 是 wot-ui `wd-button` 的写法（`{ color, size, text }`），本组件
 * 读 `color` / `size` 两项，其余字段忽略 —— 这样为 wd-button 写的配置能原样通过。
 *
 * 优先级：扁平的 `loading-color` / `loading-size` 先赢；没设时才回落到
 * `loading-props.color` / `loading-props.size`。
 *
 * `hairline` 只对 `type="default"` 生效（其它类型本来就有语义色描边），
 * 默认 true，置 false 后边框变透明。
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'

const busy = ref(false)

function toggleBusy(): void {
  busy.value = !busy.value
}

const spinnerFromProps = { color: 'var(--sn-mp-color-action-primary)', size: 48 }
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">loading-props 只给 color：spinner 换成品牌色</text>
    <view class="sn-demo__row">
      <SnButton type="primary" loading :loading-props="{ color: 'var(--sn-mp-color-feedback-success)' }">
        品牌色 spinner
      </SnButton>
      <SnButton type="primary" loading>默认 spinner</SnButton>
    </view>

    <text class="sn-demo__meta">loading-props 同时给 color + size（size 走 rpx）</text>
    <view class="sn-demo__row">
      <SnButton type="success" loading :loading-props="spinnerFromProps">48rpx spinner</SnButton>
      <SnButton type="success" loading>32rpx spinner</SnButton>
    </view>

    <text class="sn-demo__meta">
      扁平 prop 优先：loading-color / loading-size 会覆盖 loading-props 里的同名项
    </text>
    <view class="sn-demo__row">
      <SnButton
        type="warning"
        loading
        loading-color="var(--sn-mp-color-feedback-danger)"
        :loading-props="{ color: 'var(--sn-mp-color-action-primary)', size: 64 }"
      >
        loading-color 赢
      </SnButton>
    </view>

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
