<script setup lang="ts">
/**
 * Demo: SnPopover — hover trigger, header + content, arrow and placements.
 */
import { SnButton, SnPopover } from '@snui/vue-web'
</script>

<template>
  <div class="popover-demo">
    <section class="popover-demo__block">
      <h4 class="popover-demo__title">标题 + 正文（hover 触发）</h4>
      <div class="popover-demo__row">
        <SnPopover header="导出数据" content="将当前表格视图导出为 CSV 文件，包含全部可见列与筛选条件。">
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

    <section class="popover-demo__block">
      <h4 class="popover-demo__title">常用方位</h4>
      <div class="popover-demo__row">
        <SnPopover content="出现在上方。" placement="top" show-arrow>
          <SnButton>top</SnButton>
        </SnPopover>
        <SnPopover content="出现在下方。" placement="bottom" show-arrow>
          <SnButton>bottom</SnButton>
        </SnPopover>
        <SnPopover content="出现在左侧。" placement="left" show-arrow>
          <SnButton>left</SnButton>
        </SnPopover>
        <SnPopover content="出现在右侧。" placement="right" show-arrow>
          <SnButton>right</SnButton>
        </SnPopover>
      </div>
    </section>

    <section class="popover-demo__block">
      <h4 class="popover-demo__title">宽度与滚动</h4>
      <div class="popover-demo__row">
        <SnPopover
          header="与触发器等宽"
          content="width=&quot;trigger&quot; 时气泡宽度对齐触发元素。"
          width="trigger"
        >
          <SnButton>width="trigger"</SnButton>
        </SnPopover>
        <SnPopover
          header="可滚动正文"
          content="scrollable 开启后，正文超过最大高度时内部滚动：第一行说明。第二行说明。第三行说明。第四行说明。第五行说明。第六行说明。第七行说明。"
          scrollable
          width="220"
        >
          <SnButton>scrollable</SnButton>
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
