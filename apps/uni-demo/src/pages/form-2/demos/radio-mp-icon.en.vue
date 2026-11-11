<script setup lang="ts">
/** Demo: sn-radio — 图标模式（variant="icon"，纯图标网格）。 */
import { ref } from 'vue';
import SnRadio from '@snui/uni-src/components/sn-radio/sn-radio.vue';
import SnRadioGroup from '@snui/uni-src/components/sn-radio/sn-radio-group.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Sun, Moon, Cloud, Zap } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const picked = ref<string | number | boolean | undefined>('sun');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnRadioGroup v-model="picked" variant="icon" direction="horizontal">
      <SnRadio value="sun" aria-label="Sunny">
        <template #icon><SnIcon :icon="Sun" :size="22" /></template>
      </SnRadio>
      <SnRadio value="moon" aria-label="Night">
        <template #icon><SnIcon :icon="Moon" :size="22" /></template>
      </SnRadio>
      <SnRadio value="cloud" aria-label="Cloudy">
        <template #icon><SnIcon :icon="Cloud" :size="22" /></template>
      </SnRadio>
      <SnRadio value="zap" aria-label="Storm">
        <template #icon><SnIcon :icon="Zap" :size="22" /></template>
      </SnRadio>
    </SnRadioGroup>
    <text class="sn-demo__meta">Selected: {{ picked }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
