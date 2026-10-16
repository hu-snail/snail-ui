<script setup lang="ts">
/**
 * tabs-web-trigger — click vs hover activation.
 */
import { ref } from 'vue'
import { SnTabPane, SnTabs } from '@snui/vue-web'

const byClick = ref('a')
const byHover = ref('a')
</script>

<template>
  <div class="tabs-trigger">
    <div class="tabs-trigger__row">
      <span class="tabs-trigger__cap">trigger="click"（默认）</span>
      <SnTabs v-model:value="byClick" type="line" trigger="click">
        <SnTabPane name="a" tab="首页">首页内容</SnTabPane>
        <SnTabPane name="b" tab="商品">商品内容</SnTabPane>
        <SnTabPane name="c" tab="订单">订单内容</SnTabPane>
      </SnTabs>
    </div>

    <div class="tabs-trigger__row">
      <span class="tabs-trigger__cap">trigger="hover"</span>
      <SnTabs v-model:value="byHover" type="line" trigger="hover">
        <SnTabPane name="a" tab="首页">首页内容</SnTabPane>
        <SnTabPane name="b" tab="商品">商品内容</SnTabPane>
        <SnTabPane name="c" tab="订单">订单内容</SnTabPane>
      </SnTabs>
    </div>

    <p class="tabs-trigger__hint">
      <code>hover</code> 模式下鼠标划过即切换；键盘用户仍可用 <kbd>Tab</kbd> 加
      <kbd>Enter</kbd> 触发。
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
