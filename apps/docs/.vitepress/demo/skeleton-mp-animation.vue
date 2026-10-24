<script setup lang="ts">
/**
 * Demo: sn-skeleton (uni-end) — gradient / flashed shimmer + loading toggle.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-skeleton from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnSkeleton from '@snui/uni-src/components/sn-skeleton/sn-skeleton.vue'

const loading = ref(true)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSkeleton theme="paragraph" animation="gradient" />
    <SnSkeleton theme="paragraph" animation="flashed" />

    <SnSkeleton :loading="loading" theme="paragraph" animation="gradient">
      <text class="sn-skeleton-demo__content">
        真实内容已渲染：loading=false 时骨架屏被 default 插槽替换。
      </text>
    </SnSkeleton>

    <SnButton size="small" @tap="loading = !loading">
      {{ loading ? '加载完成' : '重新加载' }}
    </SnButton>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.sn-skeleton-demo__content {
  font-size: 28rpx;
  color: var(--vp-c-text-2);
}
</style>
