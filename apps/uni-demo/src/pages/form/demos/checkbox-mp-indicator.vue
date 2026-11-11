<script setup lang="ts">
/** Demo: sn-checkbox — 指示器位置与选中态（indicatorPlacement / checkedStyle）。 */
import { ref } from 'vue';
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue';
import SnCheckboxGroup from '@snui/uni-src/components/sn-checkbox/sn-checkbox-group.vue';

const topRight = ref<Array<string | number | boolean>>(['a']);
const bottomRight = ref<Array<string | number | boolean>>(['a']);
const none = ref<Array<string | number | boolean>>(['a']);
const borderOnly = ref<Array<string | number | boolean>>(['a']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">indicatorPlacement="top-right"（card 默认）</text>
    <SnCheckboxGroup v-model="topRight" variant="card" indicator-placement="top-right">
      <SnCheckbox name="a">选项 A</SnCheckbox>
      <SnCheckbox name="b">选项 B</SnCheckbox>
    </SnCheckboxGroup>

    <text class="sn-demo__title">indicatorPlacement="bottom-right"</text>
    <SnCheckboxGroup v-model="bottomRight" variant="card" indicator-placement="bottom-right">
      <SnCheckbox name="a">选项 A</SnCheckbox>
      <SnCheckbox name="b">选项 B</SnCheckbox>
    </SnCheckboxGroup>

    <text class="sn-demo__title">indicatorPlacement="none"</text>
    <SnCheckboxGroup v-model="none" variant="card" indicator-placement="none">
      <SnCheckbox name="a">选项 A</SnCheckbox>
      <SnCheckbox name="b">选项 B</SnCheckbox>
    </SnCheckboxGroup>

    <text class="sn-demo__title">checkedStyle="border"（仅主题色描边）</text>
    <SnCheckboxGroup v-model="borderOnly" variant="card" checked-style="border">
      <SnCheckbox name="a">选项 A</SnCheckbox>
    </SnCheckboxGroup>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-secondary);
}
</style>
