<script setup lang="ts">
/**
 * Demo: sn-tabbar — active / inactive colour overrides and name-based values.
 *
 * - `active-color` / `inactive-color` override the label colour inline (empty
 *   string = token default)
 * - an item without `name` uses its registration index as the value; with `name`
 *   that name wins
 */
import { ref } from 'vue'
import SnTabbar from '@snui/uni-src/components/sn-tabbar/sn-tabbar.vue'
import SnTabbarItem from '@snui/uni-src/components/sn-tabbar/sn-tabbar-item.vue'

const indexValue = ref(0)
const namedValue = ref('inbox')
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTabbar
      v-model="indexValue"
      active-color="var(--sn-mp-color-action-primary)"
      inactive-color="var(--sn-mp-color-text-disabled)"
      bordered
    >
      <SnTabbarItem title="Home" icon="Home" />
      <SnTabbarItem title="Discover" icon="Search" />
      <SnTabbarItem title="Me" icon="User" />
    </SnTabbar>

    <text class="sn-demo__meta">Index value: {{ indexValue }}</text>

    <SnTabbar v-model="namedValue" active-color="var(--sn-mp-color-feedback-success)" bordered>
      <SnTabbarItem title="Inbox" name="inbox" icon="Bell" />
      <SnTabbarItem title="Starred" name="star" icon="Star" />
      <SnTabbarItem title="Settings" name="settings" icon="Settings" />
    </SnTabbar>

    <text class="sn-demo__meta">Name value: {{ namedValue }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
