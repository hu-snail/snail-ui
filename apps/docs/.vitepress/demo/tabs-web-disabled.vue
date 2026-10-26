<script setup lang="ts">
/**
 * tabs-web-disabled — individual panes locked out of interaction.
 */
import { ref } from 'vue';
import { SnTabPane, SnTabs } from '@snui/vue-web';

const active = ref('a');
</script>

<template>
  <div class="tabs-dis">
    <SnTabs v-model:value="active" type="line">
      <SnTabPane name="a" tab="可用">这个标签可以切换</SnTabPane>
      <SnTabPane name="b" tab="禁用" disabled> 内容不可达 —— 标签无法被选中 </SnTabPane>
      <SnTabPane name="c" tab="另一个可用">这个也可以切换</SnTabPane>
    </SnTabs>

    <p class="tabs-dis__hint">
      禁用的标签带 <code>aria-disabled="true"</code>，且被排除在键盘 tab 序列之外。 当前选中：<code
        >{{ active }}</code
      >
    </p>
  </div>
</template>

<style scoped>
.tabs-dis {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}
.tabs-dis__hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--sn-web-color-text-secondary);
}
</style>
