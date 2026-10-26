<script setup lang="ts">
/** Demo: sn-keyboard — mode="car" 出车牌键盘，autoSwitchLang 在选中省份后自动切字母；mode="custom" 右侧加大号操作列，extraKey 追加额外键。 */
import { ref } from 'vue';
import SnKeyboard from '@snui/uni-src/components/sn-keyboard/sn-keyboard.vue';

const plate = ref('');
const open = ref(false);
const custom = ref('');
const open2 = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">车牌键盘</view>
    <text class="sn-demo__meta">车牌：{{ plate || '（空）' }}</text>
    <SnKeyboard
      v-model="plate"
      v-model:visible="open"
      mode="car"
      auto-switch-lang
      title="车牌号"
      :maxlength="8"
    />
    <SnKeyboard
      v-model="custom"
      v-model:visible="open2"
      mode="custom"
      extra-key="00"
      close-text="完成"
      title="自定义"
    />
  </view>
</template>

<style scoped>
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
