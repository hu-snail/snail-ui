<script setup lang="ts">
/**
 * Demo: sn-steps — the three icon sources plus size / colour, with scenarios.
 *
 * `icon` is the name track (registry → built-in catalogue; kebab-case names
 * resolve with zero registration); `iconData` takes an IconData object
 * (named imports from the built-in icon set, tree-shaking friendly) and wins
 * over the other two; `iconUrl` renders an `<image>`. `iconSize` tiers map to
 * `--sn-mp-icon-size-*`; `iconColor` overrides the stroke colour (the default
 * `currentColor` follows the step state).
 *
 * Every horizontal bar opts into `align-center` so indicators and copy line up
 * and the connector runs from one indicator to the next.
 */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
import { Home, ShoppingCart, Truck, User } from '@snui/uni-src/components/sn-icon/sn-icon-set';

/** Image icon: shares the icon-size tiers with the vector glyphs. */
const riderAvatar = 'https://cdn.uviewui.com/uview/album/10.jpg';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">icon name (built-in catalogue, no registration)</text>
    <SnSteps :active="1" align-center>
      <SnStep icon="clipboard" title="Order placed" description="09:00" />
      <SnStep icon="wallet" title="Paid" description="09:05" />
      <SnStep icon="house" title="Delivered" description="Pending" />
    </SnSteps>

    <text class="sn-demo__label">iconData object + iconSize tier</text>
    <SnSteps :active="1" align-center>
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
    <SnSteps :active="0" align-center>
      <SnStep :icon-url="riderAvatar" title="Rider assigned" description="Accepted" />
      <SnStep title="Out for delivery" description="About 20 minutes" />
      <SnStep title="Delivered" description="Awaiting confirmation" />
    </SnSteps>

    <text class="sn-demo__label">iconColor overrides the stroke colour</text>
    <SnSteps :active="1" align-center>
      <SnStep icon="bell" icon-color="var(--sn-mp-color-feedback-danger)" title="Low stock" />
      <SnStep icon="percent" icon-color="var(--sn-mp-color-action-primary)" title="Limited offer" />
      <SnStep title="Back to list price" status="wait" />
    </SnSteps>

    <text class="sn-demo__label">Scenario: order fulfilment (icons + states)</text>
    <SnSteps :active="2" align-center>
      <SnStep icon="clipboard" title="Placed" description="10:00" />
      <SnStep icon="wallet" title="Paid" description="10:05" />
      <SnStep :icon-data="Truck" title="In transit" description="In progress" />
      <SnStep icon="house" title="Signed" description="Pending" />
    </SnSteps>

    <text class="sn-demo__label">Scenario: review flow (with an error state)</text>
    <SnSteps :active="2" align-center>
      <SnStep icon="clipboard" title="Submitted" description="Done" />
      <SnStep icon="user" title="Manual review" description="Approved" />
      <SnStep icon="bell" title="Risk check" description="Rejected" status="error" />
      <SnStep icon="house" title="Archived" description="Pending" />
    </SnSteps>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* MP / App drop flex gap: spacing rides on margins (§116). */
.sn-demo__label {
  margin: var(--sn-mp-spacing-4) 0 var(--sn-mp-spacing-2);
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo__label:first-child {
  margin-top: 0;
}
</style>
