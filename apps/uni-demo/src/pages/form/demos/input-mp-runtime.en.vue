<script setup lang="ts">
/** Demo: sn-input — MP-only runtime attrs (confirm-type / hold-keyboard / adjust-position / cursor / selection-* / placeholder-style). */
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import { ref } from 'vue';

const search = ref('');
const text = ref('Pre-selected region example');
const styled = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <text class="sn-input-demo__title">confirmType (label on the soft keyboard's return key)</text>
    <SnInput v-model="search" confirm-type="search" placeholder="Search (search key)" />
    <SnInput v-model="search" confirm-type="send" placeholder="Send (send key)" />
    <SnInput v-model="search" confirm-type="go" placeholder="Go (go key)" />

    <text class="sn-input-demo__title">holdKeyboard / adjustPosition / alwaysEmbed</text>
    <SnInput
      v-model="search"
      hold-keyboard
      adjust-position
      placeholder="Keep keyboard on blur + auto scroll"
    />

    <text class="sn-input-demo__title">cursor + selection-start / selection-end</text>
    <SnInput v-model="text" :cursor="5" selection-start="2" selection-end="8" />

    <text class="sn-input-demo__title"
      >placeholderStyle (inline styles injected into the placeholder)</text
    >
    <SnInput
      v-model="styled"
      placeholder-style="color: #ef4444; font-style: italic;"
      placeholder="Red italic placeholder"
    />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  max-width: 600rpx;
}
.sn-input-demo__title {
  margin-top: 16rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
</style>
