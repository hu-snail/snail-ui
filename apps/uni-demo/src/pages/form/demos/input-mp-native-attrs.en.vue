<script setup lang="ts">
/** Demo: sn-input — MP native attributes: cursorSpacing / confirmHold / ignoreCompositionEvent / enableNative. */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const spaced = ref('');
const held = ref('');
const composing = ref('');
const alipay = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <text class="sn-input-demo__caption">cursorSpacing (keep 24px above the keyboard)</text>
    <SnInput v-model="spaced" :cursor-spacing="24" placeholder="24px cursor spacing" />

    <text class="sn-input-demo__caption">confirmHold + confirmType="send"</text>
    <SnInput v-model="held" confirm-hold confirm-type="send" placeholder="Keyboard stays up on confirm" />

    <text class="sn-input-demo__caption">ignoreCompositionEvent=false (input fires mid-composition)</text>
    <SnInput
      v-model="composing"
      :ignore-composition-event="false"
      placeholder="Syncs while composing"
    />

    <text class="sn-input-demo__caption">enableNative=false (Alipay MP simulated widget)</text>
    <SnInput v-model="alipay" :enable-native="false" placeholder="Page stays put when keyboard opens" />
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
