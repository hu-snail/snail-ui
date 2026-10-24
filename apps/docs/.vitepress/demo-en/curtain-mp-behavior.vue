<script setup lang="ts">
/**
 * Demo: sn-curtain (uni-end) — close-on-click-modal / close-on-click /
 * hide-when-close / z-index / root-portal.
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
      + `<text x="300" y="360" font-size="42" text-anchor="middle" fill="slateblue">${label}</text>`
      + `</svg>`,
    )
}

const keepOnImageTap = ref(false)
const closeOnScrim = ref(false)
const keepNode = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="keepOnImageTap = true">
      close-on-click=false (image tap keeps it open)
    </SnButton>
    <SnButton block @tap="closeOnScrim = true">
      close-on-click-modal=true (scrim tap closes)
    </SnButton>
    <SnButton block @tap="keepNode = true">
      hide-when-close=false + z-index=150
    </SnButton>

    <text class="sn-demo__meta">
      The close button always works; the scrim does not close by default and needs
      close-on-click-modal. root-portal is declared for wot-ui parity only — miniprogram
      has no portal host, so passing true changes nothing.
    </text>

    <SnCurtain
      v-model="keepOnImageTap"
      :src="poster('image tap keeps it open')"
      :width="260"
      :close-on-click="false"
      custom-class="sn-demo-contained"
    />

    <SnCurtain
      v-model="closeOnScrim"
      :src="poster('scrim tap closes')"
      :width="260"
      :close-on-click-modal="true"
      custom-class="sn-demo-contained"
    />

    <SnCurtain
      v-model="keepNode"
      :src="poster('node kept after close')"
      :width="260"
      :hide-when-close="false"
      :z-index="150"
      :root-portal="true"
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
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* Docs-preview only — keep the fixed-position curtain inside the phone screen. */
.sn-curtain.sn-demo-contained {
  position: absolute;
}
</style>
