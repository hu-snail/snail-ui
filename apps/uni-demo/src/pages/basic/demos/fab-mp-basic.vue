<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — 图标触发按钮 + 「图标 + 文字」胶囊动作项。
 *
 *   - 触发按钮用内置 plus / close 图标（icon-name 双轨之一，另一轨见
 *     fab-mp-icons 的 trigger 插槽 IconData），尺寸走 --sn-mp-icon-size-*
 *     档位，与 96rpx 按钮径保持约 0.42 的视觉比例。
 *   - 动作项为胶囊（icon + text），收起 / 展开由 v-model:active 驱动，
 *     沿 direction="up" 向上依次滑出。
 *   - 点动作项记录反馈并收起菜单；文案与 fab-mp-basic.en.vue 对等。
 *
 * Docs preview: `custom-class="sn-demo-contained"` pins the fixed layer to
 * the phone screen (the real runtime keeps `position: fixed`).
 */
import { ref } from 'vue';
import SnFab from '@snui/uni-src/components/sn-fab/sn-fab.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Camera, Edit, Image } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const active = ref(false);
const lastAction = ref('');

function pick(label: string): void {
  lastAction.value = label;
  active.value = false;
}
</script>

<template>
  <view class="sn-demo sn-fab-demo__stage">
    <view class="sn-fab-demo__hint">
      <text class="sn-fab-demo__hint-title">胶囊动作项</text>
      <text class="sn-fab-demo__hint-text">
        点右下角触发按钮，动作项沿上方依次滑出。最近选择：{{ lastAction === '' ? '尚未选择' : lastAction }}
      </text>
    </view>

    <SnFab
      v-model:active="active"
      position="right-bottom"
      direction="up"
      custom-class="sn-demo-contained"
    >
      <view
        class="sn-fab-demo__pill"
        role="button"
        aria-label="写文章"
        @tap="pick('写文章')"
      >
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Edit" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">写文章</text>
      </view>
      <view
        class="sn-fab-demo__pill"
        role="button"
        aria-label="拍照"
        @tap="pick('拍照')"
      >
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Camera" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">拍照</text>
      </view>
      <view
        class="sn-fab-demo__pill"
        role="button"
        aria-label="上传图片"
        @tap="pick('上传图片')"
      >
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Image" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">上传图片</text>
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

.sn-fab-demo__pill {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  height: 72rpx;
  padding: 0 var(--sn-mp-spacing-5);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-elevated);
  box-shadow: var(--sn-mp-shadow-sm);
}

.sn-fab-demo__pill-icon {
  color: var(--sn-mp-color-text-secondary);
}

.sn-fab-demo__pill-text {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-primary);
}

/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-fab.sn-demo-contained {
  position: absolute;
}
</style>
