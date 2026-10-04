<script setup lang="ts">
/** Demo: sn-input — prefixIcon / suffixIcon / iconPrefix / iconSuffix + cssIcon mode. */
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'
import { ref } from 'vue'
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry'
import { Search, User, ChevronRight } from '@snui/uni-src/components/sn-icon/sn-icon-set'

registerSnIcons({ Search, User, ChevronRight })

const q = ref('')
const handle = ref('')
const url = ref('')
const cssClick = ref('')
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="q" placeholder="Search…" prefix-icon="Search" clearable />
    <SnInput v-model="handle" placeholder="@username" prefix-icon="User" />
    <SnInput v-model="url" placeholder="https://" suffix-icon="ChevronRight" />
    <SnInput
      v-model="cssClick"
      placeholder="CSS-class icon (no registry)"
      :prefix-icon="'my-icon-glossary'"
      css-icon
    />
  </view>
</template>

<style scoped>
.sn-input-demo { display: flex; flex-direction: column; gap: 16rpx; max-width: 600rpx; }
:deep(.my-icon-glossary) {
  display: inline-flex;
  width: 32rpx;
  height: 32rpx;
  background: var(--sn-mp-color-action-primary);
  border-radius: 50%;
}
</style>