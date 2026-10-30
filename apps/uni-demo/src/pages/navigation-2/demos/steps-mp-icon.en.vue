<script setup lang="ts">
/**
 * Demo: sn-steps — the three icon sources plus size / colour.
 *
 * `icon` is the name track (registry → built-in catalogue; kebab-case names
 * resolve with zero registration); `iconData` takes an IconData object
 * (named imports from the built-in icon set, tree-shaking friendly) and wins
 * over the other two; `iconUrl` renders an `<image>`. `iconSize` tiers map to
 * `--sn-mp-icon-size-*`; `iconColor` overrides the stroke colour (the default
 * `currentColor` follows the step state).
 */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
import { Home, ShoppingCart, User } from '@snui/uni-src/components/sn-icon/sn-icon-set';

/** Image icon: shares the icon-size tiers with the vector glyphs. */
const riderAvatar = 'https://picsum.photos/seed/snui-steps-rider/48/48';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">icon name (built-in catalogue, no registration)</text>
    <SnSteps :active="1">
      <SnStep icon="clipboard" title="Order placed" description="09:00" />
      <SnStep icon="wallet" title="Paid" description="09:05" />
      <SnStep icon="house" title="Delivered" description="Pending" />
    </SnSteps>

    <text class="sn-demo__label">iconData object + iconSize tier</text>
    <SnSteps :active="1">
      <SnStep
        :icon-data="ShoppingCart"
        icon-size="small"
        title="Added to cart"
        description="09:00"
      />
      <SnStep :icon-data="User" title="Confirm recipient" description="09:05" />
      <SnStep :icon-data="Home" icon-size="large" title="Door delivery" description="Pending" />
    </SnSteps>

    <text class="sn-demo__label">iconUrl image (sized by the icon tiers)</text>
    <SnSteps :active="0">
      <SnStep :icon-url="riderAvatar" title="Rider assigned" description="Accepted" />
      <SnStep title="Out for delivery" description="About 20 minutes" />
      <SnStep title="Delivered" description="Awaiting confirmation" />
    </SnSteps>

    <text class="sn-demo__label">iconColor overrides the stroke colour</text>
    <SnSteps :active="1">
      <SnStep icon="bell" icon-color="var(--sn-mp-color-feedback-danger)" title="Low stock" />
      <SnStep icon="percent" icon-color="var(--sn-mp-color-action-primary)" title="Limited offer" />
      <SnStep title="Back to list price" status="wait" />
    </SnSteps>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  width: 100%;
}

.sn-demo__label {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
