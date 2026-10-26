<script setup lang="ts">
/**
 * tabs-web-bar-width — pinning the active bar to a fixed width.
 */
import { ref } from 'vue'
import { SnTabPane, SnTabs } from '@snui/vue-web'

const natural = ref('a')
const pinned = ref('a')
</script>

<template>
  <div class="tabs-bar">
    <div class="tabs-bar__row">
      <span class="tabs-bar__cap">默认：标签条与标签等宽</span>
      <SnTabs v-model:value="natural" type="bar">
        <SnTabPane name="a" tab="短">内容 A</SnTabPane>
        <SnTabPane name="b" tab="很长的一个标签">内容 B</SnTabPane>
        <SnTabPane name="c" tab="中">内容 C</SnTabPane>
      </SnTabs>
    </div>

    <div class="tabs-bar__row">
      <span class="tabs-bar__cap">barWidth=32：标签条固定 32px</span>
      <SnTabs v-model:value="pinned" type="bar" :bar-width="32">
        <SnTabPane name="a" tab="短">内容 A</SnTabPane>
        <SnTabPane name="b" tab="很长的一个标签">内容 B</SnTabPane>
        <SnTabPane name="c" tab="中">内容 C</SnTabPane>
      </SnTabs>
    </div>

    <p class="tabs-bar__hint">
      <code>barWidth</code> 把标签条从「跟随标签宽度」改成固定值，切换时长度不再跳动。
    </p>
  </div>
</template>

<style scoped>
.tabs-bar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}
.tabs-bar__row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tabs-bar__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.tabs-bar__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
