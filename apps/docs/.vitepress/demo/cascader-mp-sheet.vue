<script setup lang="ts">
/** Demo: sn-cascader — 弹层与指示条：closeOnClickModal / zIndex / safeAreaInsetBottom / lineWidth / lineHeight / lineTheme / custom*。 */
import { ref } from 'vue'
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue'

const tree = [
  { value: 'zj', text: '浙江', children: [{ value: 'hz', text: '杭州' }, { value: 'nb', text: '宁波' }] },
  { value: 'js', text: '江苏', children: [{ value: 'nj', text: '南京' }] },
]

const underline = ref<string | number>('hz')
const openUnderline = ref(false)

const dot = ref<string | number>('hz')
const openDot = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">lineTheme="underline" + lineWidth / lineHeight（数字按 rpx 设计值）</text>
    <view class="sn-demo__button" @tap="openUnderline = true">下划线指示条</view>
    <SnCascader
      v-model="underline"
      v-model:visible="openUnderline"
      :options="tree"
      title="下划线指示条"
      line-theme="underline"
      :line-width="8"
      :line-height="44"
    />

    <text class="sn-demo__title">lineTheme="dot" + closeOnClickModal / zIndex / safeAreaInsetBottom / custom*</text>
    <view class="sn-demo__button" @tap="openDot = true">点状指示条</view>
    <SnCascader
      v-model="dot"
      v-model:visible="openDot"
      :options="tree"
      title="点状指示条"
      line-theme="dot"
      :close-on-click-modal="false"
      :safe-area-inset-bottom="false"
      :z-index="1250"
      root-portal
      custom-class="sn-demo__sheet"
      custom-style="border-radius: var(--sn-mp-radius-xl);"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 72rpx;
  padding: 0 32rpx;
  border-radius: var(--sn-mp-button-radius);
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-size: 28rpx;
}

.sn-demo__sheet {
  background-color: var(--sn-mp-color-background-elevated);
}
</style>
