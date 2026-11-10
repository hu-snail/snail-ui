<script setup lang="ts">
/**
 * Demo: SnPopover — hover trigger, header + content and the arrow.
 */
import { SnButton, SnPopover } from '@snui/vue-web';
</script>

<template>
  <div class="popover-demo">
    <section class="popover-demo__block">
      <h4 class="popover-demo__title">Header + content (hover trigger)</h4>
      <div class="popover-demo__row">
        <SnPopover
          header="Export data"
          content="Export the current table view as a CSV file, including all visible columns and filters."
        >
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
