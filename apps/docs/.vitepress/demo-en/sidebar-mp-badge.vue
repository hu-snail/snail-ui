<script setup lang="ts">
/** Demo: sn-sidebar — icons, badges and a disabled entry. */
import { ref } from 'vue'
import SnSidebar from '@snui/uni-src/components/sn-sidebar/sn-sidebar.vue'
import SnSidebarItem from '@snui/uni-src/components/sn-sidebar/sn-sidebar-item.vue'

const active = ref('inbox')
</script>

<template>
  <view class="sn-demo sn-demo--row">
    <SnSidebar v-model="active" class="sn-demo__side">
      <SnSidebarItem label="Inbox" value="inbox" icon="Bell" :badge="12" />
      <SnSidebarItem label="Starred" value="star" icon="Star" is-dot />
      <SnSidebarItem label="Archived" value="archive" icon="Trash" disabled />
    </SnSidebar>
    <view class="sn-demo__panel">
      <text>Current: {{ active }}</text>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--row {
  display: flex;
  width: 100%;
  min-height: 200px;
}
.sn-demo__side {
  flex: 0 0 120px;
}
.sn-demo__panel {
  flex: 1 1 auto;
  padding: 12px;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
</style>
