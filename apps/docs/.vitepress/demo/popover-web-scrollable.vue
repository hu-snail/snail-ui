<script setup lang="ts">
/**
 * Demo: SnPopover — long body content with `scrollable` and an explicit
 * `content-style` max-height.
 *
 * `scrollable` caps the body height (`max-height: 60vh` internally) and turns
 * on overflow scrolling; a `max-height` passed through `content-style` wins
 * over that default because it is inlined on the same element.
 */
import { SnButton, SnPopover } from '@snui/vue-web';

const changelog = [
  'v3.1.0 — 新增气泡卡片组件族，支持十二个方位与视口翻转。',
  'v3.0.2 — 修复滚动容器内弹层定位偏移的问题。',
  'v3.0.1 — 补齐键盘可达性：Esc 关闭、Tab 顺序与触发器一致。',
  'v3.0.0 — 弹层统一走 Teleport，避免被父级 overflow 裁切。',
  'v2.9.4 — 优化箭头绘制，气泡边缘不再出现接缝。',
  'v2.9.3 — 关闭延迟与打开延迟支持非对称配置。',
  'v2.9.2 — 文本提示与气泡卡片拆分，语义各自独立。',
  'v2.9.1 — 新增受控显示模式，外部状态可完全接管弹出。',
  'v2.9.0 — 弹层定位改为 fixed 坐标，滚动跟随更稳定。',
].join('\n');
</script>

<template>
  <div class="popover-scrollable-demo">
    <div class="popover-scrollable-demo__row">
      <SnPopover
        scrollable
        :width="260"
        show-arrow
        placement="bottom"
        header="变更记录（scrollable）"
        :content="changelog"
      >
        <SnButton>长内容自动滚动</SnButton>
      </SnPopover>

      <SnPopover
        scrollable
        :width="260"
        show-arrow
        placement="bottom"
        header="指定 maxHeight"
        :content="changelog"
        :content-style="{ maxHeight: '120px' }"
      >
        <SnButton>content-style 限制高度</SnButton>
      </SnPopover>
    </div>

    <p class="popover-scrollable-demo__hint">
      正文超出高度时在气泡内部滚动，页面本身不滚动；箭头与卡片描边保持固定，不随内容滚动。左侧使用内置的默认高度上限，右侧通过
      content-style 把可视高度压到 120px。
    </p>
  </div>
</template>

<style scoped>
.popover-scrollable-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.popover-scrollable-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.popover-scrollable-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
