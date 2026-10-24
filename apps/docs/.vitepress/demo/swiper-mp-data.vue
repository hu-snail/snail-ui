<script setup lang="ts">
/**
 * Demo: sn-swiper (uni-end) — valueKey / textKey / current / imageMode / showMenuByLongpress / 事件。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-swiper from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnSwiper from '@snui/uni-src/components/sn-swiper/sn-swiper.vue'

/** 自定义字段名：图片地址在 `url`，标题在 `title`。 */
const list = [
  { url: 'https://picsum.photos/seed/snui-sw-d1/750/400', title: '自定义字段 1' },
  { url: 'https://picsum.photos/seed/snui-sw-d2/750/400', title: '自定义字段 2' },
  { url: 'https://picsum.photos/seed/snui-sw-d3/750/400', title: '自定义字段 3' },
]

const current = ref(0)
const lastEvent = ref('—')

function onJump(index: number) {
  current.value = index
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSwiper
      :list="list"
      :height="260"
      value-key="url"
      text-key="title"
      v-model:current="current"
      image-mode="aspectFit"
      show-menu-by-longpress
      :autoplay="false"
      @change="(payload: { current: number }) => (lastEvent = `change → ${payload.current}`)"
      @animationfinish="(payload: { current: number }) => (lastEvent = `animationfinish → ${payload.current}`)"
      @click="(payload: { index: number }) => (lastEvent = `click → ${payload.index}`)"
    />

    <view class="sn-demo__row">
      <SnButton size="small" @tap="onJump(0)">第 1 张</SnButton>
      <SnButton size="small" @tap="onJump(1)">第 2 张</SnButton>
      <SnButton size="small" @tap="onJump(2)">第 3 张</SnButton>
    </view>
    <text class="sn-demo__meta">current（v-model:current）={{ current }}；最近事件：{{ lastEvent }}</text>
    <text class="sn-demo__meta">
      valueKey / textKey 改字段名；imageMode 透传给 sn-img（aspectFit 露出底盘）；
      showMenuByLongpress 长按弹出识别小程序码菜单（仅微信小程序）。
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
