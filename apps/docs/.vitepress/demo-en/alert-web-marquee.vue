<script setup lang="ts">
/**
 * alert-web-marquee — horizontally scrolling announcement inside an alert.
 *
 * Shows: an alert whose body carries a continuous scroll. The alert itself
 * has no marquee prop; the scrolling track lives in the default slot, which
 * keeps the dismissal, icon and border behaviour untouched.
 */
import { SnAlert } from '@snui/vue-web'

const notices = [
  'Maintenance notice: the "Data Sync" service will be briefly unavailable on Oct 20, 02:00–04:00.',
  'Security alert: your account was signed in on a new device. If this was not you, change your password now.',
  'Release: v3.1 is live with 12 UX improvements and 4 bug fixes.',
].join('　　·　　')
</script>

<template>
  <div class="alert-marquee">
    <SnAlert type="warning" :bordered="false">
      <template #icon>
        <span class="alert-marquee__dot" aria-hidden="true" />
      </template>
      <div class="alert-marquee__viewport">
        <div class="alert-marquee__track">
          <span>{{ notices }}</span>
          <span aria-hidden="true">{{ notices }}</span>
        </div>
      </div>
    </SnAlert>

    <p class="alert-marquee__hint">
      The track duplicates the content and butts the copies end to end; translating one copy's width with a CSS animation loops seamlessly. Hovering over the text pauses the scrolling.
    </p>
  </div>
</template>

<style scoped>
.alert-marquee {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.alert-marquee__dot {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}
.alert-marquee__viewport {
  overflow: hidden;
  width: 100%;
}
.alert-marquee__track {
  display: inline-flex;
  gap: 40px;
  white-space: nowrap;
  animation: alert-marquee-scroll 26s linear infinite;
}
.alert-marquee__track:hover {
  animation-play-state: paused;
}
@keyframes alert-marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.alert-marquee__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
@media (prefers-reduced-motion: reduce) {
  .alert-marquee__track { animation: none; }
}
</style>
