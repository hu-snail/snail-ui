<script setup lang="ts">
/**
 * Demo: SnPopover — delay / duration timing control (open & close debounce).
 */
import { ref } from 'vue';
import { SnButton, SnPopover } from '@snui/vue-web';

const defaultEvent = ref('(not triggered yet)');
const slowOpenEvent = ref('(not triggered yet)');
const asymmetricEvent = ref('(not triggered yet)');

function stamp(kind: 'show' | 'hide'): string {
  const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  return `${kind} @ ${time}`;
}
</script>

<template>
  <div class="popover-delay-demo">
    <section class="popover-delay-demo__block">
      <h4 class="popover-delay-demo__title">Default timing (delay 100ms / duration 100ms)</h4>
      <div class="popover-delay-demo__row">
        <SnPopover
          header="Default delay"
          content="Opens after ~100ms of hover and closes ~100ms after leave — avoids mis-triggers when the pointer sweeps past."
          show-arrow
          @show="defaultEvent = stamp('show')"
          @hide="defaultEvent = stamp('hide')"
        >
          <SnButton>Hover me (default)</SnButton>
        </SnPopover>
        <span class="popover-delay-demo__state">{{ defaultEvent }}</span>
      </div>
    </section>

    <section class="popover-delay-demo__block">
      <h4 class="popover-delay-demo__title">Open delay 600ms (delay)</h4>
      <div class="popover-delay-demo__row">
        <SnPopover
          header="Slow open"
          content="delay=600: hold the hover for 600ms before it opens — reduces noise in dense action areas."
          show-arrow
          :delay="600"
          @show="slowOpenEvent = stamp('show')"
          @hide="slowOpenEvent = stamp('hide')"
        >
          <SnButton>Hover and hold for 600ms</SnButton>
        </SnPopover>
        <span class="popover-delay-demo__state">{{ slowOpenEvent }}</span>
      </div>
    </section>

    <section class="popover-delay-demo__block">
      <h4 class="popover-delay-demo__title">
        Asymmetric delay [200, 800] (delay array + duration)
      </h4>
      <div class="popover-delay-demo__row">
        <SnPopover
          header="Fast open, slow close"
          content="delay=[200, 800]: opens quickly in 200ms and lingers 800ms after leave before closing — brief pointer exits do not flicker."
          show-arrow
          :delay="[200, 800]"
          :duration="800"
          @show="asymmetricEvent = stamp('show')"
          @hide="asymmetricEvent = stamp('hide')"
        >
          <SnButton>Opens fast, closes slowly</SnButton>
        </SnPopover>
        <span class="popover-delay-demo__state">{{ asymmetricEvent }}</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.popover-delay-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.popover-delay-demo__block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popover-delay-demo__title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--sn-web-color-text-secondary, #4b4f55);
}

.popover-delay-demo__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.popover-delay-demo__state {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
