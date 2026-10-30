<script setup lang="ts">
/**
 * Demo: sn-tabs — nav icons (`icon` / `icon-image`) and badges (`badge-props`).
 *
 * - `icon` takes IconData data or a registered / built-in icon name; its size rides `--sn-mp-icon-size-small`
 * - `icon-image` takes an image address (URL / base64) and wins over `icon`
 * - `badge-props` is forwarded to `sn-badge`: value / overflow cap / dot / semantic colour
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';
import { Home, Search, Star, Heart, Bell } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const iconActive = ref(0);
const badgeActive = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">icon takes built-in icon data (IconData)</text>
    <SnTabs v-model="iconActive">
      <SnTab title="Home" :name="0" :icon="Home">Home content</SnTab>
      <SnTab title="Search" :name="1" :icon="Search">Search results</SnTab>
      <SnTab title="Saved" :name="2" :icon="Star">Saved items</SnTab>
      <SnTab title="Liked" :name="3" :icon="Heart">Liked songs</SnTab>
    </SnTabs>

    <text class="sn-demo__label">icon takes a built-in icon name (string)</text>
    <SnTabs v-model="iconActive" type="tag" active-theme="pill">
      <SnTab title="Home" :name="0" icon="house">Home content</SnTab>
      <SnTab title="Search" :name="1" icon="search">Search results</SnTab>
      <SnTab title="Saved" :name="2" icon="star">Saved items</SnTab>
    </SnTabs>

    <text class="sn-demo__label">badge-props: numeric / overflow cap / dot / semantic colour</text>
    <SnTabs v-model="badgeActive">
      <SnTab title="Messages" :name="0" :badge-props="{ value: 12 }">Message list</SnTab>
      <SnTab title="Todos" :name="1" :badge-props="{ value: 128, max: 99 }">Todo items</SnTab>
      <SnTab title="Feed" :name="2" :badge-props="{ isDot: true, type: 'success' }">
        Activity feed
      </SnTab>
      <SnTab title="Alerts" :name="3" :icon="Bell" :badge-props="{ value: 3, type: 'warning' }">
        Alert list
      </SnTab>
    </SnTabs>

    <text class="sn-demo__meta">Active tab: {{ iconActive }} / {{ badgeActive }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  align-items: stretch;
}
.sn-demo__label {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
