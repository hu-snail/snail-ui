<script setup lang="ts">
/**
 * Demo: SnPopover — hover trigger, header + content, arrow and placements.
 */
import { SnButton, SnPopover } from '@snui/vue-web'
</script>

<template>
  <div class="popover-demo">
    <section class="popover-demo__block">
      <h4 class="popover-demo__title">Header + content (hover trigger)</h4>
      <div class="popover-demo__row">
        <SnPopover header="Export data" content="Export the current table view as a CSV file, including all visible columns and filters.">
          <SnButton>Hover for details</SnButton>
        </SnPopover>
        <SnPopover
          header="Export data"
          content="A popover card with an arrow that automatically points at the trigger's edge."
          show-arrow
          placement="bottom"
        >
          <SnButton>With arrow + bottom placement</SnButton>
        </SnPopover>
      </div>
    </section>

    <section class="popover-demo__block">
      <h4 class="popover-demo__title">Common placements</h4>
      <div class="popover-demo__row">
        <SnPopover content="Appears above." placement="top" show-arrow>
          <SnButton>top</SnButton>
        </SnPopover>
        <SnPopover content="Appears below." placement="bottom" show-arrow>
          <SnButton>bottom</SnButton>
        </SnPopover>
        <SnPopover content="Appears to the left." placement="left" show-arrow>
          <SnButton>left</SnButton>
        </SnPopover>
        <SnPopover content="Appears to the right." placement="right" show-arrow>
          <SnButton>right</SnButton>
        </SnPopover>
      </div>
    </section>

    <section class="popover-demo__block">
      <h4 class="popover-demo__title">Width and scrolling</h4>
      <div class="popover-demo__row">
        <SnPopover
          header="Same width as trigger"
          content="With width=&quot;trigger&quot;, the popover width matches the trigger."
          width="trigger"
        >
          <SnButton>width="trigger"</SnButton>
        </SnPopover>
        <SnPopover
          header="Scrollable content"
          content="With scrollable on, content taller than the max height scrolls inside: Sample line 1. Sample line 2. Sample line 3. Sample line 4. Sample line 5. Sample line 6. Sample line 7."
          scrollable
          width="220"
        >
          <SnButton>scrollable</SnButton>
        </SnPopover>
      </div>
    </section>
  </div>
</template>

<style scoped>
.popover-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.popover-demo__block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popover-demo__title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--sn-web-color-text-secondary, #4b4f55);
}

.popover-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
