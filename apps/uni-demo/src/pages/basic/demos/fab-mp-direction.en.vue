<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — the four expansion directions (AUI-OPT-02 additive).
 *
 *   - `direction` decides the axis and order of the expanding action items:
 *     up / down run along the vertical axis (the reversed flows are handled
 *     inside the component), left / right along the horizontal axis.
 *   - `up` / `down` are new vocabulary this release; the legacy `top` /
 *     `bottom` values keep working (additive compatibility, see the Props
 *     table in the docs).
 *   - Action items are icon bubbles (IconData objects rendered directly, no
 *     registry); tapping one records an "action · direction" feedback and
 *     collapses that menu.
 *
 * Layout: up→bottom-right, down→top-left, left→right-center, right→left-
 * center; the hint block sits bottom-left, clear of all four expansion
 * zones. Copy is kept in parity with fab-mp-direction.vue.
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
  lastAction.value = `${label} (${direction})`;
  actives.value[direction as 'up' | 'down' | 'left' | 'right'] = false;
}
</script>

<template>
  <view class="sn-demo sn-fab-demo__stage">
    <view class="sn-fab-demo__hint">
      <text class="sn-fab-demo__hint-title">Four expansion directions</text>
      <text class="sn-fab-demo__hint-text">
        up (bottom-right) · down (top-left) · left (right-center) · right (left-center). Last action: {{ lastAction === '' ? 'none yet' : lastAction }}
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
      <view class="sn-fab-demo__bubble" role="button" aria-label="Compose" @tap="pick('up', 'Compose')">
        <SnIcon :icon="Edit" size="var(--sn-mp-icon-size-large)" />
      </view>
      <view class="sn-fab-demo__bubble" role="button" aria-label="Camera" @tap="pick('up', 'Camera')">
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
      <view class="sn-fab-demo__bubble" role="button" aria-label="Star" @tap="pick('down', 'Star')">
        <SnIcon :icon="Star" size="var(--sn-mp-icon-size-large)" />
      </view>
      <view class="sn-fab-demo__bubble" role="button" aria-label="Like" @tap="pick('down', 'Like')">
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
      <view class="sn-fab-demo__bubble" role="button" aria-label="Music" @tap="pick('left', 'Music')">
        <SnIcon :icon="Music" size="var(--sn-mp-icon-size-large)" />
      </view>
      <view class="sn-fab-demo__bubble" role="button" aria-label="Coffee" @tap="pick('left', 'Coffee')">
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
      <view class="sn-fab-demo__bubble" role="button" aria-label="Share" @tap="pick('right', 'Share')">
        <SnIcon :icon="Share2" size="var(--sn-mp-icon-size-large)" />
      </view>
      <view class="sn-fab-demo__bubble" role="button" aria-label="Quick launch" @tap="pick('right', 'Quick launch')">
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

/* Bottom-left: clear of the bottom-right (up) and top-left (down) zones. */
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
