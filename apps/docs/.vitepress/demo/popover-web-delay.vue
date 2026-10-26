<script setup lang="ts">
/**
 * Demo: SnPopover — delay / duration timing control (open & close debounce).
 */
import { ref } from 'vue';
import { SnButton, SnPopover } from '@snui/vue-web';

const defaultEvent = ref('（尚未触发）');
const slowOpenEvent = ref('（尚未触发）');
const asymmetricEvent = ref('（尚未触发）');

function stamp(kind: 'show' | 'hide'): string {
  const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  return `${kind} @ ${time}`;
}
</script>

<template>
  <div class="popover-delay-demo">
    <section class="popover-delay-demo__block">
      <h4 class="popover-delay-demo__title">默认时序（delay 100ms / duration 100ms）</h4>
      <div class="popover-delay-demo__row">
        <SnPopover
          header="默认延时"
          content="悬停约 100ms 后弹出，移出约 100ms 后关闭，可避免指针划过时误触发。"
          show-arrow
          @show="defaultEvent = stamp('show')"
          @hide="defaultEvent = stamp('hide')"
        >
          <SnButton>悬停我（默认）</SnButton>
        </SnPopover>
        <span class="popover-delay-demo__state">{{ defaultEvent }}</span>
      </div>
    </section>

    <section class="popover-delay-demo__block">
      <h4 class="popover-delay-demo__title">打开延迟 600ms（delay）</h4>
      <div class="popover-delay-demo__row">
        <SnPopover
          header="慢速弹出"
          content="delay=600：悬停后需要停留 600ms 才会弹出，适合高密度操作区减少干扰。"
          show-arrow
          :delay="600"
          @show="slowOpenEvent = stamp('show')"
          @hide="slowOpenEvent = stamp('hide')"
        >
          <SnButton>悬停并停留 600ms</SnButton>
        </SnPopover>
        <span class="popover-delay-demo__state">{{ slowOpenEvent }}</span>
      </div>
    </section>

    <section class="popover-delay-demo__block">
      <h4 class="popover-delay-demo__title">非对称延时 [200, 800]（delay 数组 + duration）</h4>
      <div class="popover-delay-demo__row">
        <SnPopover
          header="快开慢关"
          content="delay=[200, 800]：200ms 快速弹出；移出后驻留 800ms 再关闭，指针短暂离开不会闪断。"
          show-arrow
          :delay="[200, 800]"
          :duration="800"
          @show="asymmetricEvent = stamp('show')"
          @hide="asymmetricEvent = stamp('hide')"
        >
          <SnButton>快速弹出，缓慢关闭</SnButton>
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
