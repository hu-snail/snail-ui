<script setup lang="ts">
/** Demo: sn-radio — allowUncheck / disabled / readonly / placement。 */
import { ref } from 'vue'
import SnRadio from '@snui/uni-src/components/sn-radio/sn-radio.vue'
import SnRadioGroup from '@snui/uni-src/components/sn-radio/sn-radio-group.vue'

const uncheckable = ref<string | number | boolean | undefined>('a')
const blocked = ref<string | number | boolean | undefined>('a')
const placed = ref<string | number | boolean | undefined>('a')
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">allowUncheck（再点一次取消选中）</text>
    <SnRadioGroup v-model="uncheckable" allow-uncheck>
      <SnRadio value="a">选项 A</SnRadio>
      <SnRadio value="b">选项 B</SnRadio>
    </SnRadioGroup>
    <text class="sn-demo__meta">当前：{{ uncheckable ?? '（未选）' }}</text>

    <text class="sn-demo__title">disabled</text>
    <SnRadioGroup v-model="blocked" disabled>
      <SnRadio value="a">整组禁用</SnRadio>
    </SnRadioGroup>

    <text class="sn-demo__title">readonly</text>
    <SnRadioGroup v-model="blocked" readonly>
      <SnRadio value="a">整组只读</SnRadio>
    </SnRadioGroup>

    <text class="sn-demo__title">placement="right"</text>
    <SnRadioGroup v-model="placed" placement="right">
      <SnRadio value="a">标记在右侧 A</SnRadio>
      <SnRadio value="b">标记在右侧 B</SnRadio>
    </SnRadioGroup>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
