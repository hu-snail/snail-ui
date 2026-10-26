<script setup lang="ts">
/** Demo: sn-cell — link arrow, icons and tap feedback. */
import { ref } from 'vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

const tapped = ref('—');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup title="Settings">
      <SnCell
        title="Notifications"
        label="Receive pushes and reminders"
        is-link
        prefix-icon="Bell"
        @click="tapped = 'Notifications'"
      />
      <SnCell
        title="Account security"
        value="Enabled"
        is-link
        arrow-direction="down"
        prefix-icon="User"
        @click="tapped = 'Account security'"
      />
      <SnCell title="About" value="v0.1.0" clickable @click="tapped = 'About'" />
    </SnCellGroup>
    <text class="sn-demo__meta">Last tapped: {{ tapped }}</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
