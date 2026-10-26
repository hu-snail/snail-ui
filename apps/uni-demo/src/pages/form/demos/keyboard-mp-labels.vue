<script setup lang="ts">
/** Demo: sn-keyboard — 键位文案与删除键：deleteText / closeText / showDeleteKey / randomKeyOrder。 */
import { ref } from 'vue';
import SnKeyboard from '@snui/uni-src/components/sn-keyboard/sn-keyboard.vue';

const custom = ref('');
const openCustom = ref(false);

const noDelete = ref('');
const openNoDelete = ref(false);

const shuffled = ref('');
const openShuffled = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">deleteText + closeText（自定义删除键与关闭键文案）</text>
    <view class="sn-demo__button" @tap="openCustom = true">自定义文案</view>
    <text class="sn-demo__meta">当前值：{{ custom || '（空）' }}</text>
    <SnKeyboard
      v-model="custom"
      v-model:visible="openCustom"
      :maxlength="6"
      title="自定义文案"
      delete-text="退格"
      close-text="收起"
      :z-index="1050"
    />

    <text class="sn-demo__title">showDeleteKey=false（不渲染删除键）</text>
    <view class="sn-demo__button" @tap="openNoDelete = true">无删除键</view>
    <SnKeyboard
      v-model="noDelete"
      v-model:visible="openNoDelete"
      :maxlength="6"
      title="无删除键"
      :show-delete-key="false"
    />

    <text class="sn-demo__title">randomKeyOrder（数字键随机排列）</text>
    <view class="sn-demo__button" @tap="openShuffled = true">随机键序</view>
    <SnKeyboard
      v-model="shuffled"
      v-model:visible="openShuffled"
      :maxlength="6"
      title="随机键序"
      random-key-order
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

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
