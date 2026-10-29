<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — the two trigger icon tracks + theme switching.
 *
 *   - icon-name track: `inactive-icon` / `active-icon` take registry names
 *     (bottom-left, Edit ↔ X), resolved after registerSnIcons().
 *   - IconData track: the `trigger` slot renders an SnIcon object directly
 *     (bottom-right, Sparkles ↔ X), swapped with the active state, no
 *     registry involved.
 *   - Action items are icon bubbles sized with --sn-mp-icon-size-large
 *     (~0.45 ratio inside an 88rpx bubble); tapping one records the
 *     feedback and collapses the menu.
 *   - The swatch row switches the bottom-right FAB's `type` (5 themes,
 *     applied live).
 *
 * Copy is kept in parity with fab-mp-icons.vue.
 */
import { onBeforeUnmount, ref } from 'vue';
import SnFab from '@snui/uni-src/components/sn-fab/sn-fab.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { registerSnIcons, clearSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import {
  Bell,
  Coffee,
  Edit,
  Heart,
  Music,
  Sparkles,
  Star,
  X,
  Zap,
} from '@snui/uni-src/components/sn-icon/sn-icon-set';

/** Mirrors the sn-fab `type` union; the component does not export the alias. */
type DemoFabType = 'primary' | 'success' | 'info' | 'warning' | 'danger';

registerSnIcons({ Edit, X });
onBeforeUnmount(() => clearSnIcons());

const nameTrackActive = ref(false);
const dataTrackActive = ref(false);
const dataTrackType = ref<DemoFabType>('success');
const lastAction = ref('');

const typeOptions: Array<{ value: DemoFabType; label: string; color: string }> = [
  { value: 'primary', label: 'Primary', color: 'var(--sn-mp-color-action-primary)' },
  { value: 'success', label: 'Success', color: 'var(--sn-mp-color-feedback-success)' },
  { value: 'info', label: 'Info', color: 'var(--sn-mp-color-feedback-info)' },
  { value: 'warning', label: 'Warning', color: 'var(--sn-mp-color-feedback-warning)' },
  { value: 'danger', label: 'Danger', color: 'var(--sn-mp-color-feedback-danger)' },
];

function pick(label: string): void {
  lastAction.value = label;
  nameTrackActive.value = false;
  dataTrackActive.value = false;
}
</script>

<template>
  <view class="sn-demo sn-fab-demo__stage">
    <view class="sn-fab-demo__hint">
      <text class="sn-fab-demo__hint-title">Trigger icon tracks and themes</text>
      <text class="sn-fab-demo__hint-text">
        Bottom-left: icon-name track (Edit ↔ X); bottom-right: trigger slot IconData (Sparkles ↔ X) + swatches for the theme. Last picked: {{ lastAction === '' ? 'none yet' : lastAction }}
      </text>
      <view class="sn-fab-demo__swatches" aria-label="Theme swatches">
        <view
          v-for="option in typeOptions"
          :key="option.value"
          class="sn-fab-demo__swatch"
          :class="{ 'sn-fab-demo__swatch--picked': option.value === dataTrackType }"
          :style="{ backgroundColor: option.color }"
          role="button"
          :aria-label="`Theme ${option.label}`"
          @tap="dataTrackType = option.value"
        />
      </view>
    </view>

    <SnFab
      v-model:active="nameTrackActive"
      inactive-icon="Edit"
      active-icon="X"
      type="warning"
      position="left-bottom"
      direction="up"
      :gap="{ bottom: 16, left: 16 }"
      custom-class="sn-demo-contained"
    >
      <view class="sn-fab-demo__bubble" role="button" aria-label="Star" @tap="pick('Star')">
        <SnIcon :icon="Star" size="var(--sn-mp-icon-size-large)" />
      </view>
      <view class="sn-fab-demo__bubble" role="button" aria-label="Like" @tap="pick('Like')">
        <SnIcon :icon="Heart" size="var(--sn-mp-icon-size-large)" />
      </view>
      <view class="sn-fab-demo__bubble" role="button" aria-label="Remind" @tap="pick('Remind')">
        <SnIcon :icon="Bell" size="var(--sn-mp-icon-size-large)" />
      </view>
    </SnFab>

    <SnFab
      v-model:active="dataTrackActive"
      :type="dataTrackType"
      position="right-bottom"
      direction="up"
      :gap="{ bottom: 16, right: 16 }"
      custom-class="sn-demo-contained"
    >
      <view class="sn-fab-demo__bubble" role="button" aria-label="Music" @tap="pick('Music')">
        <SnIcon :icon="Music" size="var(--sn-mp-icon-size-large)" />
      </view>
      <view class="sn-fab-demo__bubble" role="button" aria-label="Coffee" @tap="pick('Coffee')">
        <SnIcon :icon="Coffee" size="var(--sn-mp-icon-size-large)" />
      </view>
      <view class="sn-fab-demo__bubble" role="button" aria-label="Quick launch" @tap="pick('Quick launch')">
        <SnIcon :icon="Zap" size="var(--sn-mp-icon-size-large)" />
      </view>
      <template #trigger>
        <SnIcon
          :icon="dataTrackActive ? X : Sparkles"
          size="var(--sn-mp-icon-size-large)"
        />
      </template>
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

.sn-fab-demo__swatches {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-3);
  margin-top: var(--sn-mp-spacing-3);
}

.sn-fab-demo__swatch {
  width: 40rpx;
  height: 40rpx;
  border-radius: var(--sn-mp-radius-full);
  opacity: 0.45;
}

.sn-fab-demo__swatch--picked {
  opacity: 1;
  box-shadow: var(--sn-mp-shadow-sm);
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
