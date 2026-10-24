<script setup lang="ts">
/**
 * Demo: sn-curtain (uni-end) — close-position variants, with custom close styling.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-curtain from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnCurtain from '@snui/uni-src/components/sn-curtain/sn-curtain.vue'

/** Build an inline SVG poster so the demo needs no network asset. */
function poster(label: string): string {
  return 'data:image/svg+xml;charset=utf-8,'
    + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="700">`
      + `<rect width="600" height="700" rx="24" fill="lavender"/>`
      + `<text x="300" y="360" font-size="44" text-anchor="middle" fill="slateblue">${label}</text>`
      + `</svg>`,
    )
}

const showTop = ref(false)
const showCorner = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="showTop = true">Close button on top</SnButton>
    <SnButton block @tap="showCorner = true">Close button bottom-right</SnButton>

    <SnCurtain
      v-model="showTop"
      :src="poster('close position: top')"
      :width="260"
      close-position="top"
      custom-class="sn-demo-contained"
    />

    <SnCurtain
      v-model="showCorner"
      :src="poster('close position: bottom-right')"
      :width="260"
      close-position="bottom-right"
      custom-close-class="sn-curtain-demo__close"
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
.sn-curtain-demo__close {
  box-shadow: var(--sn-mp-shadow-md);
}
/* Docs-preview only — keep the fixed-position curtain inside the phone screen. */
.sn-curtain.sn-demo-contained {
  position: absolute;
}
</style>
