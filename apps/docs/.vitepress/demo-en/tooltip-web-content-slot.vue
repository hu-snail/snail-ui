<script setup lang="ts">
/**
 * tooltip-web-content-slot — 用 `#content` 插槽承载结构化内容。
 *
 * 每个用例一个区块，说明它和默认 `content` prop 的差别：插槽里
 * 可以放多行、`<code>`、行内强调等任意 Vue 内容。
 */
import { SnTooltip } from '@snui/vue-web'
</script>

<template>
  <div class="tt-slot">
    <section class="tt-slot__section">
      <h4 class="tt-slot__title">Multiline + code</h4>
      <p class="tt-slot__hint">
        Default <code>content</code> prop only accepts plain text; use a slot for multi-line or inline markup.
      </p>
      <div class="tt-slot__stage">
        <SnTooltip placement="top">
          <button class="tt-slot__btn" type="button">Multiline + code</button>
          <template #content>
            <div class="tt-slot__rich">
              <div>Supports multi-line text</div>
              <code>code: SnTooltip</code>
            </div>
          </template>
        </SnTooltip>
      </div>
    </section>

    <section class="tt-slot__section">
      <h4 class="tt-slot__title">Paired with :arrow="false"</h4>
      <p class="tt-slot__hint">Slot content and appearance props combine freely.</p>
      <div class="tt-slot__stage">
        <SnTooltip placement="right" :arrow="false">
          <button class="tt-slot__btn" type="button">No arrow</button>
          <template #content>
            <span class="tt-slot__italic">arrow: false</span>
          </template>
        </SnTooltip>
      </div>
    </section>

    <section class="tt-slot__section">
      <h4 class="tt-slot__title">Paired with :delay="[200, 0]"</h4>
      <p class="tt-slot__hint">
        200ms open delay and no close delay — good for dense layouts the pointer tends to sweep across.
      </p>
      <div class="tt-slot__stage">
        <SnTooltip placement="bottom-start" :delay="[200, 0]">
          <button class="tt-slot__btn" type="button">Opens with a 200ms delay</button>
          <template #content>
            Use <code>:delay="[200, 0]"</code> to control the open delay; closing has no delay
          </template>
        </SnTooltip>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tt-slot {
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
}
.tt-slot__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tt-slot__title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.tt-slot__hint {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-3);
}
.tt-slot__hint code {
  font-size: 11px;
  padding: 1px 4px;
  border-radius: 3px;
  background: var(--vp-c-bg-alt);
}
.tt-slot__stage {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}
.tt-slot__btn {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 6px 14px;
  border-radius: 6px;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, color 0.15s;
}
.tt-slot__btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.tt-slot__rich {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.tt-slot__rich code {
  font-family: ui-monospace, monospace;
  font-size: 12px;
  opacity: 0.85;
}
.tt-slot__italic {
  font-style: italic;
}
</style>
