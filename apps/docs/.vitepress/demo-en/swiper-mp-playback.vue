<script setup lang="ts">
/**
 * Demo: sn-swiper (uni-end) — autoplay / interval / duration / loop / easing.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-swiper from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnSwiper from '@snui/uni-src/components/sn-swiper/sn-swiper.vue'

const list = [
  'https://picsum.photos/seed/snui-sw-p1/750/400',
  'https://picsum.photos/seed/snui-sw-p2/750/400',
  'https://picsum.photos/seed/snui-sw-p3/750/400',
]

const autoplay = ref(true)
const loop = ref(true)
const interval = ref(2000)
const duration = ref(300)
const easing = ref<'default' | 'linear'>('default')
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSwiper
      :list="list"
      :height="240"
      :autoplay="autoplay"
      :loop="loop"
      :interval="interval"
      :duration="duration"
      :easing-function="easing"
    />

    <view class="sn-demo__row">
      <SnButton size="small" @tap="autoplay = !autoplay">
        autoplay: {{ autoplay ? 'on' : 'off' }}
      </SnButton>
      <SnButton size="small" @tap="loop = !loop">
        loop: {{ loop ? 'on' : 'off' }}
      </SnButton>
      <SnButton size="small" @tap="interval = interval === 2000 ? 6000 : 2000">
        interval: {{ interval }}ms
      </SnButton>
      <SnButton size="small" @tap="duration = duration === 300 ? 1000 : 300">
        duration: {{ duration }}ms
      </SnButton>
      <SnButton size="small" @tap="easing = easing === 'default' ? 'linear' : 'default'">
        easing: {{ easing }}
      </SnButton>
    </view>

    <text class="sn-demo__meta">
      autoplay / interval / duration / loop are forwarded to the native swiper; easing-function only honours the
      platform's own ease set, anything else is dropped.
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
