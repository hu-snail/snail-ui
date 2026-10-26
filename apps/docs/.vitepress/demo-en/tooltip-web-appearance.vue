<script setup lang="ts">
/**
 * tooltip-web-appearance — 外观控制。
 *
 * 每个用例一张卡片：顶部写清用到的 prop，中间是触发器，底部补一句
 * 说明。所有卡片共用同一套 stage 内边距，避免「有的气泡能展开、
 * 有的被裁掉」。
 */
import { SnTooltip } from '@snui/vue-web';
</script>

<template>
  <div class="tt-appear">
    <article class="tt-appear__card">
      <header class="tt-appear__head">
        <code class="tt-appear__prop">Default</code>
        <span class="tt-appear__name">With arrow</span>
      </header>
      <div class="tt-appear__stage">
        <SnTooltip content="A popover with an arrow" placement="top">
          <button class="tt-appear__btn" type="button">Hover</button>
        </SnTooltip>
      </div>
      <p class="tt-appear__desc">
        The arrow is on by default and points to the center of the trigger.
      </p>
    </article>

    <article class="tt-appear__card">
      <header class="tt-appear__head">
        <code class="tt-appear__prop">:arrow="false"</code>
        <span class="tt-appear__name">No arrow</span>
      </header>
      <div class="tt-appear__stage">
        <SnTooltip content="No arrow" placement="top" :arrow="false">
          <button class="tt-appear__btn" type="button">Hover</button>
        </SnTooltip>
      </div>
      <p class="tt-appear__desc">Without the arrow the popover keeps the same spacing.</p>
    </article>

    <article class="tt-appear__card">
      <header class="tt-appear__head">
        <code class="tt-appear__prop">arrow-point-to-center</code>
        <span class="tt-appear__name">Arrow to center</span>
      </header>
      <div class="tt-appear__stage">
        <SnTooltip
          content="The arrow points to the popover center"
          placement="top"
          arrow-point-to-center
        >
          <button class="tt-appear__btn" type="button">Hover</button>
        </SnTooltip>
      </div>
      <p class="tt-appear__desc">
        Points to the trigger by default; when enabled it points to the popover's own center.
      </p>
    </article>

    <article class="tt-appear__card">
      <header class="tt-appear__head">
        <code class="tt-appear__prop">arrow-class</code>
        <span class="tt-appear__name">Custom arrow</span>
      </header>
      <div class="tt-appear__stage">
        <SnTooltip
          content="The arrow is enlarged and tinted"
          placement="bottom"
          arrow-class="tt-appear__big-arrow"
        >
          <button class="tt-appear__btn" type="button">Hover</button>
        </SnTooltip>
      </div>
      <p class="tt-appear__desc">
        Customize <code>arrowClass</code> to change the arrow's size and color.
      </p>
    </article>

    <article class="tt-appear__card">
      <header class="tt-appear__head">
        <code class="tt-appear__prop">content-style</code>
        <span class="tt-appear__name">Content style</span>
      </header>
      <div class="tt-appear__stage">
        <SnTooltip
          content="The content uses custom styles"
          placement="top"
          :content-style="{ color: 'var(--vp-c-brand-1)', fontWeight: '600' }"
        >
          <button class="tt-appear__btn" type="button">Hover</button>
        </SnTooltip>
      </div>
      <p class="tt-appear__desc">Affects only the popover content, not its frame.</p>
    </article>

    <article class="tt-appear__card">
      <header class="tt-appear__head">
        <code class="tt-appear__prop">width="trigger"</code>
        <span class="tt-appear__name">Trigger-width popover</span>
      </header>
      <div class="tt-appear__stage">
        <SnTooltip content="Same width as the trigger" placement="bottom" width="trigger">
          <button class="tt-appear__btn tt-appear__btn--wide" type="button">
            This is a very wide trigger
          </button>
        </SnTooltip>
      </div>
      <p class="tt-appear__desc">
        The popover width follows the trigger — good for hints aligned within a column.
      </p>
    </article>

    <article class="tt-appear__card">
      <header class="tt-appear__head">
        <code class="tt-appear__prop">:animated="false"</code>
        <span class="tt-appear__name">No animation</span>
      </header>
      <div class="tt-appear__stage">
        <SnTooltip content="No enter/leave animation" placement="top" :animated="false">
          <button class="tt-appear__btn" type="button">Hover</button>
        </SnTooltip>
      </div>
      <p class="tt-appear__desc">
        Disables the enter/leave animation — good for high-frequency or screenshot scenarios.
      </p>
    </article>
  </div>
</template>

<style scoped>
.tt-appear {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  width: 100%;
}
.tt-appear__card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  padding: 14px;
}
.tt-appear__head {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tt-appear__prop {
  font-size: 11px;
  color: var(--vp-c-text-3);
}
.tt-appear__name {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.tt-appear__stage {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
.tt-appear__btn {
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
.tt-appear__btn--wide {
  min-width: 200px;
}
.tt-appear__btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.tt-appear__desc {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-3);
}
.tt-appear__desc code {
  font-size: 11px;
  padding: 1px 4px;
  border-radius: 3px;
  background: var(--vp-c-bg-alt);
}
/* Applied through the arrowClass prop; needs :deep to reach teleported DOM. */
:deep(.tt-appear__big-arrow) {
  border-width: 12px 12px 0 12px;
}
</style>
