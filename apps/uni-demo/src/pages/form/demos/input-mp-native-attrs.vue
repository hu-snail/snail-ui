<script setup lang="ts">
/** Demo: sn-input — 小程序原生属性：cursorSpacing / confirmHold / ignoreCompositionEvent / enableNative。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const spaced = ref('');
const held = ref('');
const composing = ref('');
const alipay = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <text class="sn-input-demo__caption">cursorSpacing（光标与键盘保持 24px）</text>
    <SnInput v-model="spaced" :cursor-spacing="24" placeholder="24px 光标间距" />

    <text class="sn-input-demo__caption">confirmHold + confirmType="send"（点确认键保持键盘）</text>
    <SnInput v-model="held" confirm-hold confirm-type="send" placeholder="点确认键保持键盘" />

    <text class="sn-input-demo__caption">ignoreCompositionEvent=false（合成期间也触发 input）</text>
    <SnInput
      v-model="composing"
      :ignore-composition-event="false"
      placeholder="中文输入时逐字同步"
    />

    <text class="sn-input-demo__caption">enableNative=false（支付宝小程序用模拟输入框）</text>
    <SnInput v-model="alipay" :enable-native="false" placeholder="键盘弹起时页面不上移" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-input-demo__caption {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
