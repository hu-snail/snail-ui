<script setup lang="ts">
/** Demo: sn-navbar — slots and fixed positioning. */
import SnNavbar from '@snui/uni-src/components/sn-navbar/sn-navbar.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Bell, Settings } from '@snui/uni-src/components/sn-icon/sn-icon-set';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnNavbar title="Custom slots">
      <template #left>
        <SnIcon :icon="Settings" :size="36" />
      </template>
      <template #right>
        <SnIcon :icon="Bell" :size="36" />
      </template>
    </SnNavbar>
    <SnNavbar title="Fixed with placeholder" fixed placeholder bordered left-arrow />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
</style>
