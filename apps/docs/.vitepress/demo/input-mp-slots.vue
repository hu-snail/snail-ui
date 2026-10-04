<script setup lang="ts">
/** Demo: sn-input — prefix / suffix / clear-icon / count slots (uni-end). */
import { ref } from 'vue'
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue'
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry'
import { ChevronRight, Search, X } from '@snui/uni-src/components/sn-icon/sn-icon-set'

registerSnIcons({ ChevronRight, Search, X })

const search = ref('')
const url = ref('')
const bio = ref('Hi, I am using @snui/uni.')
</script>

<template>
  <view class="sn-demo">
    <SnInput v-model="search" placeholder="Search…" clearable>
      <template #prefix>
        <SnIcon :icon="Search" :size="28" />
      </template>
      <template #clear-icon>
        <SnIcon :icon="X" :size="24" />
      </template>
    </SnInput>

    <SnInput v-model="url" placeholder="https://" type="url">
      <template #suffix>
        <SnIcon :icon="ChevronRight" :size="28" />
      </template>
    </SnInput>

    <SnInput v-model="bio" type="textarea" :rows="3" :maxlength="50" show-count>
      <template #count="{ current, max }">{{ current }} / {{ max }} 字符</template>
    </SnInput>
  </view>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 16rpx; max-width: 480rpx; }
</style>