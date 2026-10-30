<script setup lang="ts">
/** Demo: sn-cell — tappable rows (arrow / toggle value / button value / hint + arrow). */
import { ref } from 'vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

const notificationsOn = ref(true);
const lastAction = ref('No action yet');

function toggleNotifications(): void {
  notificationsOn.value = !notificationsOn.value;
  lastAction.value = notificationsOn.value ? 'Notifications turned on' : 'Notifications turned off';
}

function record(action: string): void {
  lastAction.value = action;
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup>
      <SnCell
        title="Notifications"
        :value="notificationsOn ? 'On' : 'Off'"
        clickable
        @click="toggleNotifications"
      />
      <SnCell title="Shipping addresses" value="3" is-link @click="record('Open addresses')" />
      <SnCell title="Feedback">
        <SnButton size="small" type="primary" @click="record('Feedback submitted')">Give feedback</SnButton>
      </SnCell>
      <SnCell
        title="Account & security"
        label="Password, phone binding, account deletion"
        is-link
        @click="record('Open account & security')"
      />
    </SnCellGroup>
    <text class="sn-demo__meta">Last action: {{ lastAction }}</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
