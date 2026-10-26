<script setup lang="ts">
/**
 * tabs-web-trigger — click vs hover activation.
 */
import { ref } from 'vue';
import { SnTabPane, SnTabs } from '@snui/vue-web';

const byClick = ref('a');
const byHover = ref('a');
</script>

<template>
  <div class="tabs-trigger">
    <div class="tabs-trigger__row">
      <span class="tabs-trigger__cap">trigger="click" (default)</span>
      <SnTabs v-model:value="byClick" type="line" trigger="click">
        <SnTabPane name="a" tab="Home">Home content</SnTabPane>
        <SnTabPane name="b" tab="Products">Product content</SnTabPane>
        <SnTabPane name="c" tab="Orders">Order content</SnTabPane>
      </SnTabs>
    </div>

    <div class="tabs-trigger__row">
      <span class="tabs-trigger__cap">trigger="hover"</span>
      <SnTabs v-model:value="byHover" type="line" trigger="hover">
        <SnTabPane name="a" tab="Home">Home content</SnTabPane>
        <SnTabPane name="b" tab="Products">Product content</SnTabPane>
        <SnTabPane name="c" tab="Orders">Order content</SnTabPane>
      </SnTabs>
    </div>

    <p class="tabs-trigger__hint">
      <code>hover</code> mode switches on hover; keyboard users can still press <kbd>Tab</kbd> and
      <kbd>Enter</kbd> to trigger.
    </p>
  </div>
</template>

<style scoped>
.tabs-trigger {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}
.tabs-trigger__row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tabs-trigger__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.tabs-trigger__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
