<script setup lang="ts">
/**
 * Demo: sn-tabs — badges (`badge-props`).
 *
 * `badge-props` is forwarded to `sn-badge` (same prop name and shape as wd-tab):
 *   - `value` number / string; a number above `max` shows `{max}+`
 *   - `isDot` draws a dot instead of a value
 *   - `type` semantic colour: primary / success / warning / danger / info (danger red by default)
 *   - `showZero` renders `0` too (0 is suppressed by default)
 *   - `hidden` hides the marker but keeps the content
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

const active = ref(0);
const unread = ref(12);
const showZero = ref(false);
const hidden = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">Numeric badges and semantic colours</text>
    <SnTabs v-model="active">
      <SnTab title="Messages" :name="0" :badge-props="{ value: unread }">Message list</SnTab>
      <SnTab title="Todos" :name="1" :badge-props="{ value: 128, max: 99, type: 'primary' }">
        Todo items
      </SnTab>
      <SnTab title="Reminders" :name="2" :badge-props="{ value: 5, type: 'warning' }">
        Reminder list
      </SnTab>
      <SnTab title="Errors" :name="3" :badge-props="{ value: 2, type: 'danger' }">
        Error log
      </SnTab>
    </SnTabs>

    <text class="sn-demo__label">Dot badge / zero value / hidden</text>
    <SnTabs v-model="active" type="tag" active-theme="fill">
      <SnTab title="Feed" :name="0" :badge-props="{ isDot: true, type: 'success' }">
        Activity feed
      </SnTab>
      <SnTab title="Drafts" :name="1" :badge-props="{ value: 0, showZero: showZero, type: 'info' }">
        Draft box
      </SnTab>
      <SnTab title="Archive" :name="2" :badge-props="{ value: 9, hidden: hidden }">
        Archive records
      </SnTab>
    </SnTabs>

    <view class="sn-demo__row">
      <SnButton size="small" @click="unread = unread === 12 ? 120 : 12">
        Unread: {{ unread }}
      </SnButton>
      <SnButton size="small" @click="showZero = !showZero">
        showZero: {{ showZero ? 'on' : 'off' }}
      </SnButton>
      <SnButton size="small" @click="hidden = !hidden">
        hidden: {{ hidden ? 'on' : 'off' }}
      </SnButton>
    </view>

    <text class="sn-demo__meta">Active tab: {{ active }}</text>
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
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-3);
  align-items: center;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
