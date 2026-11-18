<script setup lang="ts">
/** Demo: sn-input — prefixIcon / suffixIcon 名称模式 + cssIcon class 模式。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import { ChevronRight, Search, User } from '@snui/uni-src/components/sn-icon/sn-icon-set';

registerSnIcons({ ChevronRight, Search, User });

const q = ref('');
const handle = ref('');
const url = ref('');
const cssClick = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="q" placeholder="搜索" prefix-icon="Search" clearable />
    <SnInput v-model="handle" placeholder="用户名" prefix-icon="User" />
    <SnInput v-model="url" placeholder="https://" suffix-icon="ChevronRight" />
    <SnInput
      v-model="cssClick"
      placeholder="cssIcon：class 即图标（尺寸随 --sn-input-icon-size）"
      :prefix-icon="'my-icon-glossary'"
      css-icon
    />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
/* css-icon 模式：class 直接挂在图标位上，尺寸对齐输入框图标 token。 */
:deep(.my-icon-glossary) {
  display: inline-flex;
  width: var(--sn-input-icon-size);
  height: var(--sn-input-icon-size);
  background: var(--sn-mp-color-action-primary);
  border-radius: 50%;
}
</style>
