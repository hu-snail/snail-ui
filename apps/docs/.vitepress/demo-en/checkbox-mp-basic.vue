<script setup lang="ts">
/** Demo: sn-checkbox-group — basic multi-select (array v-model). */
import { ref } from 'vue'
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue'
import SnCheckboxGroup from '@snui/uni-src/components/sn-checkbox/sn-checkbox-group.vue'

const picked = ref<Array<string | number | boolean>>(['apple'])
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCheckboxGroup v-model="picked">
      <SnCheckbox name="apple">Apple</SnCheckbox>
      <SnCheckbox name="banana">Banana</SnCheckbox>
      <SnCheckbox name="cherry">Cherry</SnCheckbox>
    </SnCheckboxGroup>
    <text class="sn-demo__meta">Selected: {{ picked.join(', ') || '(none)' }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
