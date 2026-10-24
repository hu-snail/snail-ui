<script setup lang="ts">
/**
 * Demo: sn-drop-menu — 无蒙层、点击蒙层不关闭、面板高度与自定义面板样式。
 *
 * - `modal=false` 不渲染蒙层（列表页里想保留页面可交互时用）
 * - `close-on-click-modal=false` 让蒙层只做视觉遮罩，点击不关闭
 * - `popup-height` 限制面板高度（面板默认最多 80vh）
 * - `custom-popup-class` / `custom-popup-style` 作用于选项面板
 * - `disabled` 禁用整条菜单栏，点击无反应
 * - `duration` 控制展开 / 收起动画时长
 * - `default` 插槽替换选项列表（仍复用面板与动画）
 *
 * 预览专用：`custom-class="sn-demo-contained"` 让面板的定位上下文收在 demo 内。
 */
import { ref } from 'vue'
import SnDropMenu from '@snui/uni-src/components/sn-drop-menu/sn-drop-menu.vue'

const noModal = ref('default')
const styled = ref('')
const disabledValue = ref('a')

const sortOptions = [
  { label: '综合排序', value: 'default' },
  { label: '价格从低到高', value: 'price-asc' },
  { label: '价格从高到低', value: 'price-desc' },
]

const styledOptions = [
  { label: '北京', value: 'bj', tip: '默认城市' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
]

const customOptions = [
  { label: '最近 7 天', value: '7d' },
  { label: '最近 30 天', value: '30d' },
]
const customValue = ref('7d')
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">modal=false + duration=400</text>
    <SnDropMenu
      v-model="noModal"
      :options="sortOptions"
      :modal="false"
      :duration="400"
      title="排序"
      custom-class="sn-demo-contained"
    />

    <text class="sn-demo__label">close-on-click-modal=false + popup-height + custom-popup-*</text>
    <SnDropMenu
      v-model="styled"
      :options="styledOptions"
      :close-on-click-modal="false"
      popup-height="240rpx"
      custom-popup-class="sn-demo__panel"
      custom-popup-style="padding: var(--sn-mp-spacing-2);"
      custom-class="sn-demo-contained"
    />

    <text class="sn-demo__label">disabled + default 插槽替换选项列表</text>
    <SnDropMenu
      v-model="disabledValue"
      :options="customOptions"
      disabled
      title="已禁用"
      custom-class="sn-demo-contained"
    />

    <SnDropMenu
      v-model="customValue"
      :options="customOptions"
      title="自定义面板"
      custom-class="sn-demo-contained"
    >
      <view class="sn-demo__custom">
        <text
          v-for="option in customOptions"
          :key="option.value"
          class="sn-demo__custom-item"
          @tap="customValue = option.value"
        >
          {{ option.label }}{{ customValue === option.value ? ' ✓' : '' }}
        </text>
      </view>
    </SnDropMenu>

    <text class="sn-demo__meta">选中：{{ noModal }} / {{ styled || '未选' }} / {{ customValue }}</text>
  </view>
</template>

<style scoped>
.sn-demo__label {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__custom {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-3);
}
.sn-demo__custom-item {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
/* Docs-preview only — the panel is absolutely positioned inside the root. */
.sn-demo :deep(.sn-drop-menu.sn-demo-contained) {
  position: relative;
}
/* custom-popup-class lands on the option panel. */
.sn-demo :deep(.sn-demo__panel) {
  border-radius: var(--sn-mp-radius-sm);
}
</style>
