<script setup lang="ts">
/**
 * Demo: sn-curtain (uni-end) — a promo curtain with the default inset close button.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-curtain from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnCurtain from '@snui/uni-src/components/sn-curtain/sn-curtain.vue'

const show = ref(false)

/** Inline SVG placeholder so the demo needs no external network asset. */
const promoImage = 'data:image/svg+xml;charset=utf-8,'
  + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800">'
    + '<rect width="600" height="800" rx="24" fill="lavender"/>'
    + '<text x="300" y="380" font-size="46" text-anchor="middle" fill="slateblue">'
    + '限时活动</text>'
    + '<text x="300" y="440" font-size="30" text-anchor="middle" fill="mediumslateblue">'
    + '满 199 减 50</text>'
    + '</svg>',
  )
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="show = true">打开活动幕帘</SnButton>

    <SnCurtain
      v-model="show"
      :src="promoImage"
      :width="280"
      close-position="inset"
      custom-class="sn-demo-contained"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
/* Docs-preview only — keep the fixed-position curtain inside the phone screen. */
.sn-curtain.sn-demo-contained {
  position: absolute;
}
</style>
