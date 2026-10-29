<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — position presets (corners + bottom edge midpoint)
 * with pill action items.
 *
 *   - `position` sets the anchor: left-top / right-top / left-bottom /
 *     bottom-center (the remaining presets are listed in the docs Props
 *     table); `gap` is tightened to 16px for the preview.
 *   - `direction` pairs with the anchor: top anchors expand down / sideways,
 *     bottom anchors expand up — "position decides where, direction decides
 *     how it opens" (complements the pure-direction fab-mp-direction demo).
 *   - Action items are "icon + text" pills (IconData rendered directly);
 *     tapping one records an "action (anchor)" feedback and collapses the
 *     menu.
 *
 * The hint block sits bottom-right, clear of all four expansion zones. Copy
 * is kept in parity with fab-mp-position.vue.
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
      <text class="sn-fab-demo__hint-title">Position presets</text>
      <text class="sn-fab-demo__hint-text">
        Top-left · Top-right · Bottom-left · Bottom-center. Last action: {{ lastAction === '' ? 'none yet' : lastAction }}
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
      <view class="sn-fab-demo__pill" role="button" aria-label="Star" @tap="pick('topLeft', 'Star (top-left)')">
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Star" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">Star</text>
      </view>
      <view class="sn-fab-demo__pill" role="button" aria-label="Like" @tap="pick('topLeft', 'Like (top-left)')">
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Heart" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">Like</text>
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
      <view class="sn-fab-demo__pill" role="button" aria-label="Camera" @tap="pick('topRight', 'Camera (top-right)')">
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Camera" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">Camera</text>
      </view>
      <view class="sn-fab-demo__pill" role="button" aria-label="Gallery" @tap="pick('topRight', 'Gallery (top-right)')">
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Image" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">Gallery</text>
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
      <view class="sn-fab-demo__pill" role="button" aria-label="Music" @tap="pick('bottomLeft', 'Music (bottom-left)')">
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Music" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">Music</text>
      </view>
      <view class="sn-fab-demo__pill" role="button" aria-label="Coffee" @tap="pick('bottomLeft', 'Coffee (bottom-left)')">
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Coffee" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">Coffee</text>
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
      <view class="sn-fab-demo__pill" role="button" aria-label="Share" @tap="pick('bottomCenter', 'Share (bottom-center)')">
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Share2" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">Share</text>
      </view>
      <view class="sn-fab-demo__pill" role="button" aria-label="Compose" @tap="pick('bottomCenter', 'Compose (bottom-center)')">
        <SnIcon class="sn-fab-demo__pill-icon" :icon="Edit" size="var(--sn-mp-icon-size-medium)" />
        <text class="sn-fab-demo__pill-text">Compose</text>
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

/* Bottom-right: the bottom-left / bottom-center expansion zones stay left of
 * the midline, so this corner stays clear. */
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
