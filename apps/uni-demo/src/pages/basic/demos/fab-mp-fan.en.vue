<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — fan expansion shape (AUI-OPT-19 additive).
 *
 *   - `mode="fan"`: items bloom along an arc out of the trigger centre
 *     (45° step; edge-centre anchors cap at 120°, corner anchors fix a 90°
 *     quadrant), with a back-out easing and a per-item stagger.
 *   - bottom-center → symmetric centre fan; right-bottom / left-top →
 *     oblique quadrant fans pointing into the screen.
 *   - Items come from structured `actions` (icon = IconData, color from
 *     semantic tokens); tapping an item closes the fan and records the
 *     feedback. Copy stays in parity with fab-mp-fan.vue.
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

/* Centre fan (bottom-center): icon + text pills, palette from the basic demo. */
const centerActions: SnFabAction[] = [
  { icon: Edit, text: 'Publish post', color: 'var(--sn-mp-color-action-primary)' },
  { icon: Camera, text: 'Take photo', color: 'var(--sn-mp-color-feedback-success)' },
  { icon: Star, text: 'Star', color: 'var(--sn-mp-color-feedback-warning)' },
];

/* Oblique fan (right-bottom): icon bubbles, up-left quadrant. */
const cornerActions: SnFabAction[] = [
  { icon: Heart, color: 'var(--sn-mp-color-feedback-danger)' },
  { icon: Music, color: 'var(--sn-mp-color-feedback-info)' },
  { icon: Zap, color: 'var(--sn-mp-color-feedback-warning)' },
];

/* Oblique fan (left-top): icon bubbles, down-right quadrant. */
const topActions: SnFabAction[] = [
  { icon: Camera, color: 'var(--sn-mp-color-action-primary)' },
  { icon: Edit, color: 'var(--sn-mp-color-feedback-success)' },
];
</script>

<template>
  <view class="sn-demo sn-fab-demo__stage">
    <view class="sn-fab-demo__hint">
      <text class="sn-fab-demo__hint-title">Fan expansion</text>
      <text class="sn-fab-demo__hint-text">
        Centre anchors open a symmetric fan, side corners an oblique one; items auto-close on tap.
        Last action: {{ lastAction === '' ? 'none yet' : lastAction }}
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
      @action="() => pick('bottom-right')"
    />

    <SnFab
      v-model:active="actives.top"
      mode="fan"
      position="left-top"
      :actions="topActions"
      custom-class="sn-demo-contained"
      @action="() => pick('top-left')"
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

/* Bottom-left: clear of the bottom-center / left-top / right-bottom fans. */
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
