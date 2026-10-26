<script setup lang="ts">
/**
 * Demo: sn-segmented (uni-end) — the wot-ui `value` spelling plus `customClass` /
 * `customStyle`.
 *
 * ## The `value` alias
 *
 * wot-ui's `wd-segmented` calls the selection `value`; this component calls it
 * `modelValue`. Both are accepted, and `value` wins when both are passed, so a
 * config migrated from wd-segmented keeps working unchanged.
 *
 * ## Event name: `update:modelValue` (not `update:value`)
 *
 * The key difference: **the prop name is aligned, the event name is not**. The
 * component only emits `update:modelValue`, so a wot-ui-style `@update:value`
 * listener never fires — the demo's first control shows the thumb moving (internal
 * state) while the parent ref stays put. The second one uses
 * `@update:model-value` and stays in sync.
 *
 * When migrating, change `@update:value` to `@update:model-value` (or just use
 * `v-model`).
 *
 * ## customClass / customStyle
 *
 * Both land on the root node: `customClass` appends a class, `customStyle`
 * becomes the root inline style (replacing the component's own fill / radius).
 */
import { ref } from 'vue';
import SnSegmented from '@snui/uni-src/components/sn-segmented/sn-segmented.vue';

const options = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

/** First control: the wot-ui `@update:value` spelling (this component never emits it). */
const staleValue = ref('day');
/** Second control: correctly paired `@update:model-value`. */
const syncedValue = ref('week');

/** customStyle replaces the component's default fill / radius. */
const styledValue = ref('month');

function onSyncedUpdate(next: string | number): void {
  syncedValue.value = String(next);
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">
      wot-ui spelling `:value` + `@update:value`: the thumb moves but the parent value does not (the
      component never emits update:value)
    </text>
    <SnSegmented
      :value="staleValue"
      :options="options"
      @update:value="staleValue = String($event)"
    />
    <text class="sn-demo__meta">Parent value: {{ staleValue }} (unchanged)</text>

    <text class="sn-demo__meta">
      Correctly paired `:value` + `@update:model-value`: parent and child stay in sync
    </text>
    <SnSegmented :value="syncedValue" :options="options" @update:model-value="onSyncedUpdate" />
    <text class="sn-demo__meta">Parent value: {{ syncedValue }}</text>

    <text class="sn-demo__meta">customClass: appends a root class (dashed frame)</text>
    <SnSegmented
      v-model="styledValue"
      :options="options"
      custom-class="sn-segmented-demo--framed"
    />

    <text class="sn-demo__meta">
      customStyle: root inline style (replacing the default fill and radius)
    </text>
    <SnSegmented
      v-model="styledValue"
      :options="options"
      custom-style="background-color: var(--sn-mp-color-action-primary-soft); border-radius: var(--sn-mp-radius-lg);"
    />

    <text class="sn-demo__meta"
      >Both together: customClass adds the frame, customStyle changes the fill</text
    >
    <SnSegmented
      v-model="styledValue"
      :options="options"
      custom-class="sn-segmented-demo--framed"
      custom-style="background-color: var(--sn-mp-color-background-subtle);"
    />
    <text class="sn-demo__meta">Current value: {{ styledValue }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* customClass lands on the sn-segmented root node, so it needs :deep. */
.sn-demo :deep(.sn-segmented-demo--framed) {
  border: 2rpx dashed var(--sn-mp-color-border-default);
}
</style>
