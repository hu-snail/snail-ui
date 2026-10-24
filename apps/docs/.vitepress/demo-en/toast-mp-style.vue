<script setup lang="ts">
/**
 * Demo: sn-toast (uni-end) — icon-size / icon-color / loading-size /
 * loading-color / cover / z-index / custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-toast from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnToast from '@snui/uni-src/components/sn-toast/sn-toast.vue'

const iconSized = ref(false)
const loadingSized = ref(false)
const covered = ref(false)
const styled = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="success" block @tap="iconSized = true">
      icon-size / icon-color
    </SnButton>
    <SnButton block @tap="loadingSized = true">
      loading-size / loading-color
    </SnButton>
    <SnButton type="warning" block @tap="covered = true">
      cover (transparent full-screen scrim blocks taps)
    </SnButton>
    <SnButton block @tap="styled = true">
      z-index=300 + custom-style
    </SnButton>

    <text class="sn-demo__meta">
      selector / class-prefix / css-icon / icon-class are declared for wot-ui parity only —
      uni icons are IconData objects, so they have no effect in the component form.
    </text>

    <SnToast
      v-model="iconSized"
      msg="Larger, recolored status glyph"
      icon-name="success"
      :icon-size="72"
      icon-color="var(--sn-mp-color-feedback-success)"
      custom-class="sn-demo-contained"
      icon-class="sn-demo__icon"
      class-prefix="wd-icon"
      :css-icon="false"
    />

    <SnToast
      v-model="loadingSized"
      msg="Larger, recolored spinner"
      icon-name="loading"
      :loading-size="64"
      loading-color="var(--sn-mp-color-feedback-warning)"
      direction="vertical"
      :duration="2000"
      icon-class="sn-demo__icon"
      class-prefix="wd-icon"
      :css-icon="false"
      custom-class="sn-demo-contained"
    />

    <SnToast
      v-model="covered"
      msg="cover: a transparent scrim blocks page taps"
      icon-name="warning"
      cover
      :duration="2500"
      custom-class="sn-demo-contained"
    />

    <SnToast
      v-model="styled"
      msg="z-index and custom-style"
      icon-name="info"
      :z-index="300"
      selector="sn-demo-toast"
      custom-style="padding: var(--sn-mp-spacing-5); border-radius: var(--sn-mp-radius-xl);"
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
/* icon-class lands on the toast's icon node (parity prop). */
.sn-demo :deep(.sn-demo__icon) {
  opacity: 0.9;
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-toast.sn-demo-contained {
  position: absolute;
}
</style>
