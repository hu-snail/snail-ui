<script setup lang="ts">
/**
 * Demo: sn-notify (uni-end) — customization: icon / background / radius /
 * close label / sticky duration / fully custom card slot (own container).
 * Per AUI-DOCS-016: imports the real @snui/uni sn-notify from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import SnNotify from '@snui/uni-src/components/sn-notify/sn-notify.vue';
import { Star } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import type { SnNotifyInstance } from '@snui/uni-src/components/sn-notify/sn-notify-types';

const notify = ref<SnNotifyInstance | null>(null);
const slotted = ref<SnNotifyInstance | null>(null);

/** Custom icon + warm tint + icon-only close (empty closeText → X pill). */
function showAchievement(): void {
  notify.value?.show({
    title: "You're on a 1-day study streak",
    description: 'New achievement unlocked',
    type: 'warning',
    icon: Star,
    background: 'var(--sn-mp-color-feedback-warning-soft)',
    radius: 24,
    closeText: '',
    duration: 0,
  });
}

/** The card slot fully replaces the card content (eyebrow + bold + own close). */
function showSlotted(): void {
  slotted.value?.show({
    title: 'Backup completed',
    description: '1,234 files (2.5 GB) backed up to the cloud',
    type: 'success',
    duration: 0,
  });
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="warning" variant="soft" block @tap="showAchievement">
      Custom icon / background / radius / X close
    </SnButton>
    <SnButton block variant="soft" @tap="notify?.show({ title: 'Sticky notification', description: 'duration = 0 — dismiss it via the pill', closeText: 'Got it', duration: 0 })">
      Sticky + custom close label
    </SnButton>
    <SnButton type="success" variant="soft" block @tap="showSlotted">
      Fully custom card slot
    </SnButton>
    <SnButton type="danger" variant="soft" block @tap="notify?.hideAll(); slotted?.hideAll()">
      Hide all toasts
    </SnButton>

    <text class="sn-demo__meta">
      The card slot scope is { id, title, description, type }; render your own
      close trigger and call hide(id). Swipe-to-dismiss stays on the container.
    </text>

    <SnNotify ref="notify" custom-class="sn-demo-contained" />
    <SnNotify ref="slotted" custom-class="sn-demo-contained">
      <template #card="{ item }">
        <view class="slot-card">
          <view class="slot-card__texts">
            <text class="slot-card__eyebrow">{{ item.description }}</text>
            <text class="slot-card__title">{{ item.title }}</text>
          </view>
          <view
            class="slot-card__close"
            role="button"
            aria-label="close"
            @tap.stop="slotted?.hide(item.id)"
          >
            <text class="slot-card__close-text">Close</text>
          </view>
        </view>
      </template>
    </SnNotify>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-notify.sn-demo-contained {
  position: absolute;
}

.slot-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: var(--sn-mp-spacing-4);
  width: 100%;
}

.slot-card__texts {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
}

.slot-card__eyebrow {
  font-size: var(--sn-mp-font-size-sm);
  line-height: 34rpx;
  color: var(--sn-mp-color-text-tertiary);
}

.slot-card__title {
  margin-top: var(--sn-mp-spacing-1);
  font-size: var(--sn-mp-font-size-lg);
  font-weight: 600;
  line-height: 44rpx;
  color: var(--sn-mp-color-text-primary);
}

.slot-card__close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  height: 64rpx;
  padding: 0 var(--sn-mp-spacing-5);
  border-radius: var(--sn-mp-radius-xl);
  background-color: var(--sn-mp-color-feedback-success);
}

.slot-card__close-text {
  font-size: var(--sn-mp-font-size-md);
  font-weight: 600;
  color: var(--sn-mp-color-text-primary);
}
</style>
