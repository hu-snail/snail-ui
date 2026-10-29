<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — 状态与手势：click-only / disabled / draggable。
 *
 *   - `expandable=false`：点触发按钮不展开，只抛 `click`（右下，trigger
 *     插槽渲染 Phone 图标，语义是单动作拨号键）；计数展示反馈。
 *   - `disabled`：拦截一切交互，触发按钮半透明（左下，内置 plus 图标，
 *     尺寸走 --sn-mp-icon-size-large）。
 *   - `draggable`：手势拖动触发按钮，松手钳制在视口内；拖完仍可点开
 *     菜单（右上，direction="down" 向下展开图标气泡）。
 *
 * 文案与 fab-mp-disabled.en.vue 对等。
 */
import { computed, ref } from 'vue';
import SnFab from '@snui/uni-src/components/sn-fab/sn-fab.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Bell, Phone, Zap } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const clicks = ref(0);
const dragActive = ref(false);
const lastAction = ref('');

const actionNote = computed(() =>
  lastAction.value === '' ? '' : `最近动作：${lastAction.value}`,
);

function onClick(): void {
  clicks.value += 1;
}

function pick(label: string): void {
  lastAction.value = label;
  dragActive.value = false;
}
</script>

<template>
  <view class="sn-demo sn-fab-demo__stage">
    <view class="sn-fab-demo__hint">
      <text class="sn-fab-demo__hint-title">状态与手势</text>
      <text class="sn-fab-demo__hint-text">
        右下：expandable=false 只抛 click（已点 {{ clicks }} 次）；左下：disabled 拦截交互；右上：draggable 可拖动。{{ actionNote }}
      </text>
    </view>

    <SnFab
      position="right-bottom"
      :expandable="false"
      :gap="{ bottom: 16, right: 16 }"
      custom-class="sn-demo-contained"
      @click="onClick"
    >
      <template #trigger>
        <SnIcon :icon="Phone" size="var(--sn-mp-icon-size-large)" />
      </template>
    </SnFab>

    <SnFab
      position="left-bottom"
      disabled
      :gap="{ bottom: 16, left: 16 }"
      custom-class="sn-demo-contained"
    />

    <SnFab
      v-model:active="dragActive"
      type="info"
      position="right-top"
      direction="down"
      draggable
      :gap="{ top: 16, right: 16 }"
      custom-class="sn-demo-contained"
    >
      <view class="sn-fab-demo__bubble" role="button" aria-label="快捷启动" @tap="pick('快捷启动')">
        <SnIcon :icon="Zap" size="var(--sn-mp-icon-size-large)" />
      </view>
      <view class="sn-fab-demo__bubble" role="button" aria-label="提醒" @tap="pick('提醒')">
        <SnIcon :icon="Bell" size="var(--sn-mp-icon-size-large)" />
      </view>
    </SnFab>
  </view>
</template>

<style scoped>
.sn-fab-demo__stage {
  position: relative;
  width: 100%;
  height: 560rpx;
  overflow: hidden;
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-mp-color-background-subtle);
}

.sn-fab-demo__hint {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
  padding: var(--sn-mp-spacing-4) var(--sn-mp-spacing-5) 0;
  max-width: 60%;
}

.sn-fab-demo__hint-title {
  font-size: var(--sn-mp-font-size-md);
  font-weight: 600;
  color: var(--sn-mp-color-text-primary);
}

.sn-fab-demo__hint-text {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-secondary);
}

.sn-fab-demo__bubble {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-elevated);
  box-shadow: var(--sn-mp-shadow-sm);
  color: var(--sn-mp-color-text-secondary);
}

/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-fab.sn-demo-contained {
  position: absolute;
}
</style>
