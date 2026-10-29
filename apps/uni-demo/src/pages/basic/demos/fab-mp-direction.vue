<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — 四个弹出方向（AUI-OPT-02 additive）。
 *
 *   - `direction` 决定动作项展开的轴线和顺序：up / down 沿纵轴
 *     （bottom / left… 反向流由组件内部处理），left / right 沿横轴。
 *   - `up` / `down` 是本版新增词汇；旧值 `top` / `bottom` 继续可用
 *     （additive 兼容，见组件文档 Props 表）。
 *   - 动作项为图标气泡（IconData 对象直渲染，不经 registry）；点气泡
 *     记录「动作 · 方向」反馈并收起对应菜单。
 *
 * 布局：up→右下、down→左上、left→右中、right→左中；提示块固定在左下，
 * 与四个展开区错开。文案与 fab-mp-direction.en.vue 对等。
 */
import { ref } from 'vue';
import SnFab from '@snui/uni-src/components/sn-fab/sn-fab.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import {
  Camera,
  Edit,
  Heart,
  Music,
  Coffee,
  Share2,
  Star,
  Zap,
} from '@snui/uni-src/components/sn-icon/sn-icon-set';

const actives = ref({ up: false, down: false, left: false, right: false });
const lastAction = ref('');

function pick(direction: string, label: string): void {
  lastAction.value = `${label}（${direction}）`;
  actives.value[direction as 'up' | 'down' | 'left' | 'right'] = false;
}
</script>

<template>
  <view class="sn-demo sn-fab-demo__stage">
    <view class="sn-fab-demo__hint">
      <text class="sn-fab-demo__hint-title">四个弹出方向</text>
      <text class="sn-fab-demo__hint-text">
        up（右下）· down（左上）· left（右中）· right（左中）。最近动作：{{ lastAction === '' ? '尚未选择' : lastAction }}
      </text>
    </view>

    <SnFab
      v-model:active="actives.up"
      direction="up"
      type="primary"
      position="right-bottom"
      :gap="{ bottom: 16, right: 16 }"
      custom-class="sn-demo-contained"
    >
      <view class="sn-fab-demo__bubble" role="button" aria-label="写文章" @tap="pick('up', '写文章')">
        <SnIcon :icon="Edit" size="var(--sn-mp-icon-size-large)" />
      </view>
      <view class="sn-fab-demo__bubble" role="button" aria-label="拍照" @tap="pick('up', '拍照')">
        <SnIcon :icon="Camera" size="var(--sn-mp-icon-size-large)" />
      </view>
    </SnFab>

    <SnFab
      v-model:active="actives.down"
      direction="down"
      type="success"
      position="left-top"
      :gap="{ top: 16, left: 16 }"
      custom-class="sn-demo-contained"
    >
      <view class="sn-fab-demo__bubble" role="button" aria-label="收藏" @tap="pick('down', '收藏')">
        <SnIcon :icon="Star" size="var(--sn-mp-icon-size-large)" />
      </view>
      <view class="sn-fab-demo__bubble" role="button" aria-label="喜欢" @tap="pick('down', '喜欢')">
        <SnIcon :icon="Heart" size="var(--sn-mp-icon-size-large)" />
      </view>
    </SnFab>

    <SnFab
      v-model:active="actives.left"
      direction="left"
      type="warning"
      position="right-center"
      :gap="{ right: 16 }"
      custom-class="sn-demo-contained"
    >
      <view class="sn-fab-demo__bubble" role="button" aria-label="音乐" @tap="pick('left', '音乐')">
        <SnIcon :icon="Music" size="var(--sn-mp-icon-size-large)" />
      </view>
      <view class="sn-fab-demo__bubble" role="button" aria-label="咖啡" @tap="pick('left', '咖啡')">
        <SnIcon :icon="Coffee" size="var(--sn-mp-icon-size-large)" />
      </view>
    </SnFab>

    <SnFab
      v-model:active="actives.right"
      direction="right"
      type="info"
      position="left-center"
      :gap="{ left: 16 }"
      custom-class="sn-demo-contained"
    >
      <view class="sn-fab-demo__bubble" role="button" aria-label="分享" @tap="pick('right', '分享')">
        <SnIcon :icon="Share2" size="var(--sn-mp-icon-size-large)" />
      </view>
      <view class="sn-fab-demo__bubble" role="button" aria-label="快捷启动" @tap="pick('right', '快捷启动')">
        <SnIcon :icon="Zap" size="var(--sn-mp-icon-size-large)" />
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

/* 左下角：与右下 up / 左上 down 的展开区错开。 */
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
