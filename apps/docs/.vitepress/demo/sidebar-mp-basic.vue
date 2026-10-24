<script setup lang="ts">
/** Demo: sn-sidebar — 侧边导航 + 右侧内容联动。 */
import { ref, computed } from 'vue'
import SnSidebar from '@snui/uni-src/components/sn-sidebar/sn-sidebar.vue'
import SnSidebarItem from '@snui/uni-src/components/sn-sidebar/sn-sidebar-item.vue'

const active = ref(0)
const labels = ['全部', '待付款', '待发货', '已完成']
const current = computed(() => labels[active.value] ?? '')
</script>

<template>
  <view class="sn-demo sn-demo--row">
    <SnSidebar v-model="active" class="sn-demo__side">
      <SnSidebarItem v-for="(label, index) in labels" :key="label" :label="label" :value="index" />
    </SnSidebar>
    <view class="sn-demo__panel">
      <text>{{ current }} 的内容</text>
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
  flex: 0 0 100px;
}
.sn-demo__panel {
  flex: 1 1 auto;
  padding: 12px;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
</style>
