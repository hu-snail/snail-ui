<script setup lang="ts">
/** Demo: sn-input — prefix / suffix / clear-icon / count slots (uni-end). */
import { ref } from 'vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import { ChevronRight, Search, X } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const search = ref('');
const url = ref('');
const bio = ref('Hi, I am using @snui/uni.');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="search" placeholder="Slot-customized icons" clearable>
      <template #prefix>
        <SnIcon :icon="Search" size="var(--sn-input-icon-size)" />
      </template>
      <template #clear-icon>
        <SnIcon :icon="X" size="var(--sn-input-icon-size)" />
      </template>
    </SnInput>

    <SnInput v-model="url" placeholder="https://" type="url">
      <template #suffix>
        <SnIcon :icon="ChevronRight" size="var(--sn-input-icon-size)" />
      </template>
    </SnInput>

    <SnInput v-model="bio" type="textarea" :rows="3" :maxlength="50" show-count>
      <template #count="{ current, max }">{{ current }} / {{ max }} chars</template>
    </SnInput>
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
