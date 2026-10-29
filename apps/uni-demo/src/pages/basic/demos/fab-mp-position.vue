<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — 位置预设（四角 + 底边中点）配胶囊动作项。
 *
 *   - `position` 决定锚点：left-top / right-top / left-bottom / bottom-center
 *     四个预设（其余预设见文档 Props 表），`gap` 收紧到 16px 便于预览。
 *   - `direction` 与锚点配合：顶部锚点向下 / 向侧展开，底部锚点向上展开，
 *     体现「锚点管位置、方向管展开」的分工（与 direction demo 的纯方向
 *     对比场景互补）。
 *   - 动作项为「图标 + 文字」胶囊（IconData 直渲染）；点胶囊记录
 *     「动作（锚点）」反馈并收起。
 *
 * 提示块固定在右下，与四个展开区错开。文案与 fab-mp-position.en.vue 对等。
 */
import { ref } from 'vue';
import SnFab from '@snui/uni-src/components/sn-fab/sn-fab.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import {
  Camera,
  Coffee,
  Edit,
  Heart,
  Image,
  Music,
  Share2,
  Star,
} from '@snui/uni-src/components/sn-icon/sn-icon-set';

const actives = ref({ topLeft: false, topRight: false, bottomLeft: false, bottomCenter: false });
const lastAction = ref('');

function pick(key: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomCenter', label: string): void {
  lastAction.value = label;
  actives.value[key] = false;
}
</script>

<template>
  <view class="sn-demo sn-fab-demo__stage">
    <view class="sn-fab-demo__hint">
      <text class="sn-fab-demo__hint-title">位置预设</text>
      <text class="sn-fab-demo__hint-text">
        左上 · 右上 · 左下 · 底部居中。最近动作：{{ lastAction === '' ? '尚未选择' : lastAction }}
      </text>
    </view>

    <SnFab
      v-model:active="actives.topLeft"
      type="success"
      position="left-top"
      direction="down"
      :gap="{ top: 16, left: 16 }"
      custom-class="sn-demo-contained"
    >
      <view class="sn-fab-demo__pill" role="button" aria-label="收藏" @tap="pick('topLeft', '收藏（左上）')">
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Star" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">收藏</text>
      </view>
      <view class="sn-fab-demo__pill" role="button" aria-label="喜欢" @tap="pick('topLeft', '喜欢（左上）')">
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Heart" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">喜欢</text>
      </view>
    </SnFab>

    <SnFab
      v-model:active="actives.topRight"
      type="info"
      position="right-top"
      direction="left"
      :gap="{ top: 16, right: 16 }"
      custom-class="sn-demo-contained"
    >
      <view class="sn-fab-demo__pill" role="button" aria-label="拍照" @tap="pick('topRight', '拍照（右上）')">
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Camera" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">拍照</text>
      </view>
      <view class="sn-fab-demo__pill" role="button" aria-label="相册" @tap="pick('topRight', '相册（右上）')">
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Image" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">相册</text>
      </view>
    </SnFab>

    <SnFab
      v-model:active="actives.bottomLeft"
      type="warning"
      position="left-bottom"
      direction="up"
      :gap="{ bottom: 16, left: 16 }"
      custom-class="sn-demo-contained"
    >
      <view class="sn-fab-demo__pill" role="button" aria-label="音乐" @tap="pick('bottomLeft', '音乐（左下）')">
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Music" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">音乐</text>
      </view>
      <view class="sn-fab-demo__pill" role="button" aria-label="咖啡" @tap="pick('bottomLeft', '咖啡（左下）')">
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Coffee" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">咖啡</text>
      </view>
    </SnFab>

    <SnFab
      v-model:active="actives.bottomCenter"
      type="danger"
      position="bottom-center"
      direction="up"
      :gap="{ bottom: 16 }"
      custom-class="sn-demo-contained"
    >
      <view class="sn-fab-demo__pill" role="button" aria-label="分享" @tap="pick('bottomCenter', '分享（底部居中）')">
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Share2" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">分享</text>
      </view>
      <view class="sn-fab-demo__pill" role="button" aria-label="写文章" @tap="pick('bottomCenter', '写文章（底部居中）')">
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Edit" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">写文章</text>
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

/* 右下角：左下 / 底部居中的展开区都在中带以左，此处留白。 */
.sn-fab-demo__hint {
  position: absolute;
  bottom: var(--sn-mp-spacing-5);
  right: var(--sn-mp-spacing-5);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--sn-mp-spacing-1);
  max-width: 40%;
  text-align: right;
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
