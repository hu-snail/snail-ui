<script setup lang="ts">
/** Demo: sn-input — native miniprogram attributes: cursorSpacing / confirmHold / ignoreCompositionEvent / enableNative. */
import { ref } from 'vue'
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'

const spaced = ref('')
const held = ref('')
const composing = ref('')
const alipay = ref('')
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">cursorSpacing (keep 24px between caret and keyboard)</text>
    <SnInput v-model="spaced" :cursor-spacing="24" placeholder="24px caret spacing" />

    <text class="sn-demo__title">confirmHold + confirmType="send"</text>
    <SnInput v-model="held" confirm-hold confirm-type="send" placeholder="Confirm keeps the keyboard up" />

    <text class="sn-demo__title">ignoreCompositionEvent=false (input also fires mid-composition)</text>
    <SnInput v-model="composing" :ignore-composition-event="false" placeholder="Syncs per character while composing" />

    <text class="sn-demo__title">enableNative=false (Alipay MP uses the simulated field)</text>
    <SnInput v-model="alipay" :enable-native="false" placeholder="The page does not shift when the keyboard opens" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
