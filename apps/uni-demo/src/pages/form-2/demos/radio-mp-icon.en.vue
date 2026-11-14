<script setup lang="ts">
/** Demo: sn-radio — Icon cards (card variant with an icon body; the selected card gets a corner tick)。 */
import { ref } from 'vue';
import SnRadio from '@snui/uni-src/components/sn-radio/sn-radio.vue';
import SnRadioGroup from '@snui/uni-src/components/sn-radio/sn-radio-group.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Sun, Moon, Cloud, Zap } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const picked = ref<string | number | boolean | undefined>('sun');
const options = [
  { value: 'sun', label: 'Sunny', icon: Sun },
  { value: 'moon', label: 'Night', icon: Moon },
  { value: 'cloud', label: 'Cloudy', icon: Cloud },
  { value: 'zap', label: 'Storm', icon: Zap },
];
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnRadioGroup v-model="picked" variant="card" direction="horizontal">
      <SnRadio
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :aria-label="option.label"
      >
        <template #card>
          <view class="tile">
            <SnIcon :icon="option.icon" :size="22" />
            <text class="tile__label">{{ option.label }}</text>
          </view>
        </template>
      </SnRadio>
    </SnRadioGroup>
    <text class="sn-demo__meta">已选：{{ picked }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}
.tile__label {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-secondary);
}
</style>
