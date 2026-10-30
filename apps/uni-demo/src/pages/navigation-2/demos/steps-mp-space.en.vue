<script setup lang="ts">
/**
 * Demo: sn-steps — `space`, `align-center`, explicit `status` and custom slots.
 *
 * - `space` overrides the default gap between indicators (horizontal uses `width`,
 *   vertical uses `padding-bottom`)
 * - `align-center` only applies horizontally and centres the whole step row
 * - `status` overrides the value derived from `active`
 *   (finished / process / error / wait)
 * - the `icon` / `title` / `description` slots replace their region entirely
 * - `custom-class` / `custom-style` land on the root node
 *
 * Every icon goes through SnIcon with the built-in icon set (AGENTS.md §113:
 * UI icons must never be emoji).
 */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Star } from '@snui/uni-src/components/sn-icon/sn-icon-set';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">space="120rpx" + align-center</text>
    <SnSteps :active="1" space="120rpx" align-center>
      <SnStep title="Order" description="09:00" />
      <SnStep title="Payment" description="09:05" />
      <SnStep title="Dispatch" description="Pending" />
    </SnSteps>

    <text class="sn-demo__label">explicit status overrides + custom-class</text>
    <SnSteps :active="1" custom-class="sn-demo__steps">
      <SnStep title="Approved" description="Passed" status="finished" />
      <SnStep title="Manual review" description="In progress" status="process" />
      <SnStep title="Auto-passed" description="Skipped" status="wait" />
    </SnSteps>

    <text class="sn-demo__label">icon / title / description slots</text>
    <SnSteps :active="0" vertical space="24rpx">
      <SnStep>
        <template #icon>
          <SnIcon :icon="Star" :size="'var(--sn-mp-icon-size-small)'" class="sn-demo__slot-icon" />
        </template>
        <template #title>
          <text class="sn-demo__title">Custom title</text>
        </template>
        <template #description>
          <text class="sn-demo__desc">The description slot accepts any structure</text>
        </template>
      </SnStep>
      <SnStep title="Plain step" description="Default rendering" />
    </SnSteps>
  </view>
</template>

<style scoped>
.sn-demo__label {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__slot-icon {
  color: var(--sn-mp-color-action-primary);
}
.sn-demo__title {
  font-size: 26rpx;
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__desc {
  font-size: 22rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* custom-class lands on the sn-steps root, so it needs :deep to reach. */
.sn-demo :deep(.sn-demo__steps) {
  padding: var(--sn-mp-spacing-2) 0;
}
</style>
