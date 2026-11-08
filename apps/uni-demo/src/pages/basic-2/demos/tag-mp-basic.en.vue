<script setup lang="ts">
/** Demo: sn-tag (uni-end) — ten semantic colours across task stages and topics. */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';

/** Task stages: `default` still carries a scene (draft), the rest are semantic. */
const stages = [
  { type: 'default', label: 'Draft' },
  { type: 'primary', label: 'In progress' },
  { type: 'success', label: 'Done' },
  { type: 'warning', label: 'Pending' },
  { type: 'danger', label: 'Overdue' },
] as const;

/** Content topics: the five hues common in operations. */
const topics = [
  { type: 'volcano', label: 'Hot' },
  { type: 'lightblue', label: 'Notice' },
  { type: 'cyan', label: 'New' },
  { type: 'pink', label: 'Pick' },
  { type: 'purple', label: 'VIP' },
] as const;
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnTag v-for="stage in stages" :key="stage.type" :type="stage.type">
        {{ stage.label }}
      </SnTag>
    </view>
    <view class="sn-demo__row">
      <SnTag v-for="topic in topics" :key="topic.type" :type="topic.type">
        {{ topic.label }}
      </SnTag>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-5);
  align-items: flex-start;
}

.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-4) var(--sn-mp-spacing-5);
  align-items: center;
}
</style>
