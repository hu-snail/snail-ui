<script setup lang="ts">
/** Demo: sn-password-input — the `background` prop paints custom cell backgrounds (tokens or any CSS color). */
import { ref } from 'vue';
import SnPasswordInput from '@snui/uni-src/components/sn-password-input/sn-password-input.vue';

const token = ref('12');
const plain = ref('34');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPasswordInput
      v-model="token"
      :length="4"
      background="var(--sn-mp-color-background-sunken)"
      info="Token background: --sn-mp-color-background-sunken"
    />
    <SnPasswordInput
      v-model="plain"
      :length="4"
      background="#FFF7E6"
      info="Any CSS color: #FFF7E6"
    />
    <text class="sn-demo__meta"
      >background rides --sn-password-input-box-bg and follows dark mode</text
    >
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
