<script setup lang="ts">
/** Demo: sn-radio — 指示器位置与选中态（indicatorPlacement / checkedStyle）。 */
import { ref } from 'vue';
import SnRadio from '@snui/uni-src/components/sn-radio/sn-radio.vue';
import SnRadioGroup from '@snui/uni-src/components/sn-radio/sn-radio-group.vue';

const topRight = ref<string | number | boolean | undefined>('a');
const bottomRight = ref<string | number | boolean | undefined>('a');
const none = ref<string | number | boolean | undefined>('a');
const borderOnly = ref<string | number | boolean | undefined>('a');
const fillOnly = ref<string | number | boolean | undefined>('a');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">indicatorPlacement="top-right"（card 默认）</text>
    <SnRadioGroup v-model="topRight" variant="card" indicator-placement="top-right">
      <SnRadio value="a">方案 A</SnRadio>
      <SnRadio value="b">方案 B</SnRadio>
    </SnRadioGroup>

    <text class="sn-demo__title">indicatorPlacement="bottom-right"</text>
    <SnRadioGroup v-model="bottomRight" variant="card" indicator-placement="bottom-right">
      <SnRadio value="a">方案 A</SnRadio>
      <SnRadio value="b">方案 B</SnRadio>
    </SnRadioGroup>

    <text class="sn-demo__title">indicatorPlacement="none"（仅靠卡片态）</text>
    <SnRadioGroup v-model="none" variant="card" indicator-placement="none">
      <SnRadio value="a">方案 A</SnRadio>
      <SnRadio value="b">方案 B</SnRadio>
    </SnRadioGroup>

    <text class="sn-demo__title">checkedStyle="border" / "fill"</text>
    <SnRadioGroup v-model="borderOnly" variant="card" checked-style="border">
      <SnRadio value="a">仅描边</SnRadio>
    </SnRadioGroup>
    <SnRadioGroup v-model="fillOnly" variant="card" checked-style="fill">
      <SnRadio value="a">仅浅底</SnRadio>
    </SnRadioGroup>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-secondary);
}
</style>
