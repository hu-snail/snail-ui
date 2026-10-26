<script setup lang="ts">
/**
 * tooltip-web-controlled — 受控显示（v-model:show）。
 *
 * 两种受控写法各一个区块，每个区块都把当前 show 值回显在触发器旁，
 * 这样「受控」这件事本身是可见的，而不是只读代码去猜。
 */
import { ref } from 'vue';
import { SnTooltip } from '@snui/vue-web';

const controlledOpen = ref(false);
const clickOpen = ref(false);
</script>

<template>
  <div class="tt-ctl">
    <section class="tt-ctl__section">
      <header class="tt-ctl__head">
        <code class="tt-ctl__prop">v-model:show</code>
        <h4 class="tt-ctl__title">Controlled + hover</h4>
      </header>
      <p class="tt-ctl__hint">
        Hovering still requests the show, but the final state belongs to the parent's
        <code>show</code> binding.
      </p>
      <div class="tt-ctl__stage">
        <SnTooltip v-model:show="controlledOpen" content="Controlled display state">
          <button class="tt-ctl__btn" type="button">hover me</button>
        </SnTooltip>
        <span class="tt-ctl__state">
          show = <strong>{{ controlledOpen }}</strong>
        </span>
      </div>
    </section>

    <section class="tt-ctl__section">
      <header class="tt-ctl__head">
        <code class="tt-ctl__prop">trigger="click"</code>
        <h4 class="tt-ctl__title">Click to toggle</h4>
      </header>
      <p class="tt-ctl__hint">
        Click the trigger to toggle; clicking anywhere outside the trigger and popover closes it
        automatically.
      </p>
      <div class="tt-ctl__stage">
        <SnTooltip
          v-model:show="clickOpen"
          trigger="click"
          placement="right"
          content="Closes on click anywhere outside the trigger area"
        >
          <button class="tt-ctl__btn" type="button">click toggle</button>
        </SnTooltip>
        <span class="tt-ctl__state">
          show = <strong>{{ clickOpen }}</strong>
        </span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tt-ctl {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}
.tt-ctl__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tt-ctl__head {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.tt-ctl__prop {
  font-size: 11px;
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-3);
}
.tt-ctl__title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.tt-ctl__hint {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-3);
}
.tt-ctl__hint code {
  font-size: 11px;
  padding: 1px 4px;
  border-radius: 3px;
  background: var(--vp-c-bg-alt);
}
.tt-ctl__stage {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 40px 0;
}
.tt-ctl__btn {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 6px 14px;
  border-radius: 6px;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition:
    border-color 0.15s,
    color 0.15s;
}
.tt-ctl__btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.tt-ctl__state {
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-family: ui-monospace, monospace;
}
.tt-ctl__state strong {
  color: var(--vp-c-brand-1);
}
</style>
