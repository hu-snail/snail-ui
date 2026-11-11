<script setup lang="ts">
/**
 * Demo: SnPopover — hover trigger, header + content and the arrow.
 */
import { SnButton, SnPopover } from '@snui/vue-web';
</script>

<template>
  <div class="popover-demo">
    <section class="popover-demo__block">
      <h4 class="popover-demo__title">标题 + 正文（hover 触发）</h4>
      <div class="popover-demo__row">
        <SnPopover
          header="导出数据"
          content="将当前表格视图导出为 CSV 文件，包含全部可见列与筛选条件。"
        >
          <SnButton>悬停查看说明</SnButton>
        </SnPopover>
        <SnPopover
          header="导出数据"
          content="带上箭头的气泡卡片，箭头自动指向触发元素边缘。"
          show-arrow
          placement="bottom"
        >
          <SnButton>带箭头 + 下方弹出</SnButton>
        </SnPopover>
      </div>
    </section>
  </div>
</template>

<style scoped>
.popover-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.popover-demo__block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popover-demo__title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--sn-web-color-text-secondary, #4b4f55);
}

.popover-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
