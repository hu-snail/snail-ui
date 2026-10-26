<script setup lang="ts">
/**
 * drawer-web-resizable — drag or arrow-key the inner edge to resize.
 *
 * Shows: `resizable` + `defaultWidth` + `minWidth` / `maxWidth`. The host
 * owns the committed size and receives it via `update:width`.
 */
import { ref } from 'vue';
import { SnButton, SnDrawer, SnDrawerContent } from '@snui/vue-web';

const open = ref(false);
const width = ref(360);

function onUpdateWidth(next: number): void {
  width.value = next;
}
</script>

<template>
  <div class="drw-resizable">
    <div class="drw-resizable__bar">
      <SnButton type="primary" @click="open = true">打开可调整宽度的抽屉</SnButton>
      <span class="drw-resizable__readout"
        >当前宽度：<code>{{ width }}px</code></span
      >
    </div>

    <SnDrawer
      v-model:show="open"
      placement="right"
      resizable
      :width="width"
      :min-width="280"
      :max-width="640"
      @update:width="onUpdateWidth"
    >
      <SnDrawerContent title="拖拽右边缘调整" closable @close="open = false">
        <p>把指针移到面板左边缘（那条约 12px 宽的可抓取带）按下拖动即可。</p>
        <p>键盘用户可以先 <kbd>Tab</kbd> 聚焦到分割条，再用方向键微调。</p>
        <p>宽度被限制在 280px 到 640px 之间。</p>
      </SnDrawerContent>
    </SnDrawer>
  </div>
</template>

<style scoped>
.drw-resizable {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.drw-resizable__bar {
  display: flex;
  align-items: center;
  gap: 16px;
}
.drw-resizable__readout {
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
