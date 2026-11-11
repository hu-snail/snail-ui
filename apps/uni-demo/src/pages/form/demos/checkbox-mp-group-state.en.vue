<script setup lang="ts">
/** Demo: sn-checkbox — group state and half-check (disabled / readonly / indeterminate). */
import { ref } from 'vue';
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue';
import SnCheckboxGroup from '@snui/uni-src/components/sn-checkbox/sn-checkbox-group.vue';

const readOnly = ref<Array<string | number | boolean>>(['a']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">disabled / readonly</text>
    <SnCheckboxGroup v-model="readOnly" disabled>
      <SnCheckbox name="a">Whole group disabled</SnCheckbox>
    </SnCheckboxGroup>
    <SnCheckboxGroup v-model="readOnly" readonly>
      <SnCheckbox name="a">Whole group read-only</SnCheckbox>
    </SnCheckboxGroup>

    <text class="sn-demo__title">indeterminate (half-checked)</text>
    <SnCheckbox :model-value="false" indeterminate>Half-checked state</SnCheckbox>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
