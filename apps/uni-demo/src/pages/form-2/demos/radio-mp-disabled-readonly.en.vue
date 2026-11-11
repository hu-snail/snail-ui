<script setup lang="ts">
/** Demo: sn-radio — disabled & readonly: `disabled` locks the whole group, `readonly` makes it non-interactive. */
import { ref } from 'vue';
import SnRadio from '@snui/uni-src/components/sn-radio/sn-radio.vue';
import SnRadioGroup from '@snui/uni-src/components/sn-radio/sn-radio-group.vue';

const blocked = ref<string | number | boolean | undefined>('a');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">disabled</text>
    <SnRadioGroup v-model="blocked" disabled>
      <SnRadio value="a">Whole group disabled</SnRadio>
    </SnRadioGroup>

    <text class="sn-demo__title">readonly</text>
    <SnRadioGroup v-model="blocked" readonly>
      <SnRadio value="a">Whole group read-only</SnRadio>
    </SnRadioGroup>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
