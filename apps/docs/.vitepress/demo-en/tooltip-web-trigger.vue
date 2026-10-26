<script setup lang="ts">
/**
 * tooltip-web-trigger — 四种触发手势对照。
 *
 * 用统一的「卡片 + 标注」结构：每个手势一个 card，顶部是 prop 名，
 * 中间是触发器，底部一句行为说明。这样四张卡片横向对照时，读者
 * 能直接看出 hover / click / focus / manual 的差异。
 */
import { SnTooltip } from '@snui/vue-web';

const cases = [
  {
    trigger: 'hover',
    label: 'hover (default)',
    desc: 'Shows on hover, hides on leave',
    content: 'Appears after a 100ms hover',
    btn: 'Hover me',
  },
  {
    trigger: 'click',
    label: 'click',
    desc: 'Click to toggle, click outside to close',
    content: 'Click to toggle, click outside to close',
    btn: 'Click me',
  },
  {
    trigger: 'focus',
    label: 'focus',
    desc: 'Shows on focus, hides on blur',
    content: 'Shows on focus, hides on blur',
    btn: 'Focus me',
  },
  {
    trigger: 'manual',
    label: 'manual',
    desc: 'Controlled by show only; gestures disabled',
    content: 'Controlled by show only; gestures disabled',
    btn: 'Manual control',
  },
] as const;
</script>

<template>
  <div class="tt-trigger">
    <article v-for="c in cases" :key="c.trigger" class="tt-trigger__card">
      <header class="tt-trigger__head">
        <code class="tt-trigger__prop">trigger="{{ c.trigger }}"</code>
        <span class="tt-trigger__name">{{ c.label }}</span>
      </header>

      <div class="tt-trigger__stage">
        <SnTooltip :content="c.content" :trigger="c.trigger">
          <button class="tt-trigger__btn" type="button">{{ c.btn }}</button>
        </SnTooltip>
      </div>

      <footer class="tt-trigger__desc">{{ c.desc }}</footer>
    </article>
  </div>
</template>

<style scoped>
.tt-trigger {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  width: 100%;
}
.tt-trigger__card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  padding: 14px;
}
.tt-trigger__head {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tt-trigger__prop {
  font-size: 11px;
  color: var(--vp-c-text-3);
}
.tt-trigger__name {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
/* Give the bubble room to open above / below the trigger without escaping
 * the card and getting clipped. */
.tt-trigger__stage {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
.tt-trigger__btn {
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
.tt-trigger__btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.tt-trigger__desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-3);
}
</style>
