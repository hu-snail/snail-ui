<script setup lang="ts">
/** Demo: sn-input — prefixIcon / suffixIcon name mode + cssIcon class mode. */
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
    <SnInput v-model="q" placeholder="Search" prefix-icon="Search" clearable />
    <SnInput v-model="handle" placeholder="Username" prefix-icon="User" />
    <SnInput v-model="url" placeholder="https://" suffix-icon="ChevronRight" />
    <SnInput
      v-model="cssClick"
      placeholder="cssIcon: class as icon (sized by --sn-input-icon-size)"
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
/* css-icon mode: the class lands on the icon spot, sized to the input
 * icon token. */
:deep(.my-icon-glossary) {
  display: inline-flex;
  width: var(--sn-input-icon-size);
  height: var(--sn-input-icon-size);
  background: var(--sn-mp-color-action-primary);
  border-radius: 50%;
}
</style>
