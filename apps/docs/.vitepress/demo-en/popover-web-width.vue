<script setup lang="ts">
/**
 * Demo: SnPopover — width control, `width="trigger"` vs a fixed px width.
 *
 * Both bubbles start open (`default-show`) so the two sizing strategies can
 * be compared side by side without hovering; clicking a trigger toggles its
 * own bubble, and `placement="right"` keeps the two panels from overlapping.
 */
import { SnButton, SnPopover } from '@snui/vue-web';
</script>

<template>
  <div class="popover-width-demo">
    <div class="popover-width-demo__stack">
      <SnPopover
        default-show
        trigger="click"
        width="trigger"
        placement="right"
        show-arrow
        header="Same width as trigger"
        content='width="trigger" makes the bubble follow the trigger&apos;s width, good for short notes as wide as the button.'
      >
        <SnButton>width=&quot;trigger&quot;</SnButton>
      </SnPopover>

      <SnPopover
        default-show
        trigger="click"
        :width="240"
        placement="right"
        show-arrow
        header="Fixed 240px"
        content="A numeric width suits full paragraphs: the body keeps a stable reading width no matter how narrow the trigger is, instead of re-wrapping with every short button."
      >
        <SnButton>width = 240</SnButton>
      </SnPopover>
    </div>

    <p class="popover-width-demo__hint">
      Both bubbles start open for comparison; click the trigger buttons to toggle. Width is computed
      when the bubble opens: the top one tracks the trigger's width while the bottom one is fixed at
      240px; the card also caps at 280px and shrinks back into the visible area along the cross axis
      when the viewport is too narrow.
    </p>
  </div>
</template>

<style scoped>
.popover-width-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.popover-width-demo__stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 72px;
}

.popover-width-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
