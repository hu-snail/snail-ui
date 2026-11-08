<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — icon trigger + "icon + text" pill action items.
 *
 *   - The trigger uses the built-in plus / close icons (one of the two
 *     icon-name tracks; the other — the trigger slot with IconData — see
 *     fab-mp-icons). Glyph size rides the --sn-mp-icon-size-* tier, keeping
 *     a ~0.42 ratio to the 96rpx button.
 *   - Action items are pills (icon + text); expansion is driven by
 *     v-model:active and slides out sequentially along direction="up".
 *   - Copy: Publish post / Take photo / Upload image, icons colored per
 *     action (semantic tokens); copy stays in parity with fab-mp-basic.vue.
 *   - Tapping an item records the feedback and collapses the menu.
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
      <text class="sn-fab-demo__hint-title">Pill action items</text>
      <text class="sn-fab-demo__hint-text">
        Tap the bottom-right trigger; items slide out upwards one by one. Last picked:
        {{ lastAction === '' ? 'none yet' : lastAction }}
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
        aria-label="Publish post"
        @tap="pick('Publish post')"
      >
        <SnIcon
          class="sn-fab-demo__pill-icon sn-fab-demo__pill-icon--publish"
          :icon="Edit"
          size="var(--sn-mp-icon-size-medium)"
        />
        <text class="sn-fab-demo__pill-text">Publish post</text>
      </view>
      <view
        class="sn-fab-demo__pill"
        role="button"
        aria-label="Take photo"
        @tap="pick('Take photo')"
      >
        <SnIcon
          class="sn-fab-demo__pill-icon sn-fab-demo__pill-icon--photo"
          :icon="Camera"
          size="var(--sn-mp-icon-size-medium)"
        />
        <text class="sn-fab-demo__pill-text">Take photo</text>
      </view>
      <view
        class="sn-fab-demo__pill"
        role="button"
        aria-label="Upload image"
        @tap="pick('Upload image')"
      >
        <SnIcon
          class="sn-fab-demo__pill-icon sn-fab-demo__pill-icon--upload"
          :icon="Image"
          size="var(--sn-mp-icon-size-medium)"
        />
        <text class="sn-fab-demo__pill-text">Upload image</text>
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

/* Per-action icon colors (semantic tokens — follows theme / style pack). */
.sn-fab-demo__pill-icon--publish {
  color: var(--sn-mp-color-action-primary);
}

.sn-fab-demo__pill-icon--photo {
  color: var(--sn-mp-color-feedback-success);
}

.sn-fab-demo__pill-icon--upload {
  color: var(--sn-mp-color-feedback-warning);
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
