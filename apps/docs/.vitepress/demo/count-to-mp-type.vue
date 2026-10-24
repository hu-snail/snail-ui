<script setup lang="ts">
/**
 * Demo: sn-count-to (uni-end) — type colors + control methods.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-count-to from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnCountTo from '@snui/uni-src/components/sn-count-to/sn-count-to.vue'

const controlled = ref<InstanceType<typeof SnCountTo> | null>(null)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCountTo type="default" :end-val="1200" />
    <SnCountTo type="primary" :end-val="2400" />
    <SnCountTo type="success" :end-val="3600" />
    <SnCountTo type="warning" :end-val="4800" />
    <SnCountTo type="error" :end-val="6000" />

    <SnCountTo ref="controlled" :start-val="0" :end-val="5000" :duration="6000" :auto-start="false" />
    <view class="sn-count-to-demo__row">
      <SnButton size="small" @tap="controlled?.start()">开始</SnButton>
      <SnButton size="small" @tap="controlled?.pause()">暂停</SnButton>
      <SnButton size="small" @tap="controlled?.reset()">重置</SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-count-to-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
</style>
