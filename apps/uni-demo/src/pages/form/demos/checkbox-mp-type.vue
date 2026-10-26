<script setup lang="ts">
/** Demo: sn-checkbox — type 形状（circle / square / button / dot）。 */
import { ref } from 'vue';
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue';
import SnCheckboxGroup from '@snui/uni-src/components/sn-checkbox/sn-checkbox-group.vue';

const circle = ref<Array<string | number | boolean>>(['a']);
const square = ref<Array<string | number | boolean>>(['a']);
const button = ref<Array<string | number | boolean>>(['a']);
const dot = ref<Array<string | number | boolean>>(['a']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">type="circle"（默认）</text>
    <SnCheckboxGroup v-model="circle">
      <SnCheckbox name="a">选项 A</SnCheckbox>
      <SnCheckbox name="b">选项 B</SnCheckbox>
    </SnCheckboxGroup>

    <text class="sn-demo__title">type="square"</text>
    <SnCheckboxGroup v-model="square" type="square">
      <SnCheckbox name="a">选项 A</SnCheckbox>
      <SnCheckbox name="b">选项 B</SnCheckbox>
    </SnCheckboxGroup>

    <text class="sn-demo__title">type="button"</text>
    <SnCheckboxGroup v-model="button" type="button" direction="horizontal">
      <SnCheckbox name="a">选项 A</SnCheckbox>
      <SnCheckbox name="b">选项 B</SnCheckbox>
    </SnCheckboxGroup>

    <text class="sn-demo__title">type="dot"</text>
    <SnCheckboxGroup v-model="dot" type="dot">
      <SnCheckbox name="a">选项 A</SnCheckbox>
      <SnCheckbox name="b">选项 B</SnCheckbox>
    </SnCheckboxGroup>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
