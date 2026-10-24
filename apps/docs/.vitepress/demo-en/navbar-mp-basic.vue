<script setup lang="ts">
/** Demo: sn-navbar — basic bars: title plus left / right actions. */
import SnNavbar from '@snui/uni-src/components/sn-navbar/sn-navbar.vue'
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnNavbar title="Home" />
    <SnNavbar title="Order detail" left-text="Back" right-text="More" />
    <SnNavbar title="Settings" left-arrow bordered />
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
