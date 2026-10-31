<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — 扇形展开形态（AUI-OPT-19 additive）。
 *
 *   - `mode="fan"`：动作项沿圆弧从触发按钮中心绽放（45° 步进；居中锚点
 *     跨度封顶 120°，角部锚点固定 90° 象限），back-out 缓动 + 逐项错峰。
 *   - bottom-center → 正中间扇形（绕正上方对称铺开）；right-bottom /
 *     left-top → 斜扇形（朝屏幕内侧的象限）。
 *   - 动作项为结构化 `actions`（icon = IconData 对象，color 走语义
 *     token），点选后自动收起并记录反馈。文案与 fab-mp-fan.en.vue 对等。
 *
 * Docs preview: `custom-class="sn-demo-contained"` pins the fixed layer to
 * the phone screen (the real runtime keeps `position: fixed`).
 */
import { ref } from 'vue';
import SnFab from '@snui/uni-src/components/sn-fab/sn-fab.vue';
import type { SnFabAction } from '@snui/uni-src/components/sn-fab/sn-fab.vue';
import {
  Camera,
  Edit,
  Heart,
  Music,
  Star,
  Zap,
} from '@snui/uni-src/components/sn-icon/sn-icon-set';

const actives = ref({ center: false, corner: false, top: false });
const lastAction = ref('');

function pick(label: string): void {
  lastAction.value = label;
}

/* 正中间扇形（bottom-center）：icon + 文字胶囊，配色沿用基础用法。 */
const centerActions: SnFabAction[] = [
  { icon: Edit, text: '发布文章', color: 'var(--sn-mp-color-action-primary)' },
  { icon: Camera, text: '拍照上传', color: 'var(--sn-mp-color-feedback-success)' },
  { icon: Star, text: '收藏', color: 'var(--sn-mp-color-feedback-warning)' },
];

/* 斜扇形（right-bottom）：图标气泡，向左上象限展开。 */
const cornerActions: SnFabAction[] = [
  { icon: Heart, color: 'var(--sn-mp-color-feedback-danger)' },
  { icon: Music, color: 'var(--sn-mp-color-feedback-info)' },
  { icon: Zap, color: 'var(--sn-mp-color-feedback-warning)' },
];

/* 斜扇形（left-top）：图标气泡，向右下象限展开。 */
const topActions: SnFabAction[] = [
  { icon: Camera, color: 'var(--sn-mp-color-action-primary)' },
  { icon: Edit, color: 'var(--sn-mp-color-feedback-success)' },
];
</script>

<template>
  <view class="sn-demo sn-fab-demo__stage">
    <view class="sn-fab-demo__hint">
      <text class="sn-fab-demo__hint-title">扇形展开</text>
      <text class="sn-fab-demo__hint-text">
        居中锚点=正中间扇形，两侧角部=斜扇形；点动作项自动收起。最近动作：{{
          lastAction === '' ? '尚未选择' : lastAction
        }}
      </text>
    </view>

    <SnFab
      v-model:active="actives.center"
      mode="fan"
      position="bottom-center"
      :actions="centerActions"
      custom-class="sn-demo-contained"
      @action="(action: SnFabAction) => pick(action.text ?? '')"
    />

    <SnFab
      v-model:active="actives.corner"
      mode="fan"
      position="right-bottom"
      :actions="cornerActions"
      custom-class="sn-demo-contained"
      @action="() => pick('右下角')"
    />

    <SnFab
      v-model:active="actives.top"
      mode="fan"
      position="left-top"
      :actions="topActions"
      custom-class="sn-demo-contained"
      @action="() => pick('左上角')"
    />
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

/* 左下角：与 bottom-center / left-top / right-bottom 三个展开区错开。 */
.sn-fab-demo__hint {
  position: absolute;
  bottom: var(--sn-mp-spacing-5);
  left: var(--sn-mp-spacing-5);
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
  max-width: 45%;
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

/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-fab.sn-demo-contained {
  position: absolute;
}
</style>
