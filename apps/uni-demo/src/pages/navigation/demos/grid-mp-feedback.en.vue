<script setup lang="ts">
/**
 * Demo: sn-grid — background colour, tap feedback, centring and icon size.
 *
 * - `bg-color` overrides the grid background inline (empty string = token default)
 * - `clickable` makes every cell tappable and applies `hover-class` press feedback
 * - `hover-class` names the class added while a cell is pressed (defaults to
 *   `sn-grid-item__content--hover`)
 * - `center` controls whether cell content is centred (`false` aligns to the top)
 * - `icon-size` sets the icon size (numbers are px, strings forwarded verbatim)
 * - `custom-class` / `custom-style` land on the root node
 */
import { ref } from 'vue';
import SnGrid from '@snui/uni-src/components/sn-grid/sn-grid.vue';
import SnGridItem from '@snui/uni-src/components/sn-grid/sn-grid-item.vue';

const tapped = ref('—');

function onCellClick(payload: { url: string; linkType: string }): void {
  tapped.value = payload.url === '' ? '(no url)' : payload.url;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">bg-color + clickable + icon-size=48px</text>
    <SnGrid
      :column="4"
      bg-color="var(--sn-mp-color-background-subtle)"
      clickable
      icon-size="48px"
      @click="onCellClick"
    >
      <SnGridItem text="Scan" icon="Search" />
      <SnGridItem text="Pay" icon="Download" />
      <SnGridItem text="Receive" icon="Upload" />
      <SnGridItem text="More" icon="MoreHorizontal" />
    </SnGrid>

    <text class="sn-demo__label">custom hover-class + center=false + custom-style</text>
    <SnGrid
      :column="3"
      border
      clickable
      :center="false"
      hover-class="sn-demo__cell-press"
      custom-class="sn-demo__grid"
      custom-style="padding: var(--sn-mp-spacing-2);"
      @click="onCellClick"
    >
      <SnGridItem text="Top aligned" icon="Star" />
      <SnGridItem text="Second cell" icon="Heart" />
      <SnGridItem text="Third cell" icon="Bell" />
    </SnGrid>

    <text class="sn-demo__meta">Last tap: {{ tapped }}</text>
  </view>
</template>

<style scoped>
.sn-demo__label {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* custom-class lands on the sn-grid root, so it needs :deep to reach. */
.sn-demo :deep(.sn-demo__grid) {
  border-radius: var(--sn-mp-radius-md);
}
/* sn-grid forwards hover-class to every cell; the class itself lives here. */
.sn-demo :deep(.sn-demo__cell-press) {
  background-color: var(--sn-mp-color-action-primary-soft);
}
</style>
