<script setup lang="ts">
/** Demo: sn-switch — basic toggle + the change event. */
import { ref } from 'vue';
import SnSwitch from '@snui/uni-src/components/sn-switch/sn-switch.vue';

const enabled = ref(false);
const lastChange = ref('—');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSwitch v-model="enabled" @change="lastChange = String($event)" />
    <text class="sn-demo__meta">v-model = {{ enabled }}; last change = {{ lastChange }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
