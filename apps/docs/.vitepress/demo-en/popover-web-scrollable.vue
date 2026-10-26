<script setup lang="ts">
/**
 * Demo: SnPopover — long body content with `scrollable` and an explicit
 * `content-style` max-height.
 *
 * `scrollable` caps the body height (`max-height: 60vh` internally) and turns
 * on overflow scrolling; a `max-height` passed through `content-style` wins
 * over that default because it is inlined on the same element.
 */
import { SnButton, SnPopover } from '@snui/vue-web';

const changelog = [
  'v3.1.0 — Added the popover-card component family with twelve placements and viewport flipping.',
  'v3.0.2 — Fixed popup positioning offsets inside scrollable containers.',
  'v3.0.1 — Completed keyboard accessibility: Esc to close, Tab order consistent with the trigger.',
  'v3.0.0 — Popups now render through Teleport to avoid being clipped by parent overflow.',
  'v2.9.4 — Improved arrow rendering; no more seams on popover edges.',
  'v2.9.3 — Close and show delays now support asymmetric configuration.',
  'v2.9.2 — Split text tooltip and popover card into independently scoped semantics.',
  'v2.9.1 — Added a controlled display mode; external state can fully take over popping.',
  'v2.9.0 — Popup positioning moved to fixed coordinates for steadier scroll following.',
].join('\n');
</script>

<template>
  <div class="popover-scrollable-demo">
    <div class="popover-scrollable-demo__row">
      <SnPopover
        scrollable
        :width="260"
        show-arrow
        placement="bottom"
        header="Changelog (scrollable)"
        :content="changelog"
      >
        <SnButton>Long content scrolls automatically</SnButton>
      </SnPopover>

      <SnPopover
        scrollable
        :width="260"
        show-arrow
        placement="bottom"
        header="Explicit maxHeight"
        :content="changelog"
        :content-style="{ maxHeight: '120px' }"
      >
        <SnButton>Limit height via content-style</SnButton>
      </SnPopover>
    </div>

    <p class="popover-scrollable-demo__hint">
      When the body exceeds the height it scrolls inside the popover while the page itself does not;
      the arrow and card border stay fixed and do not scroll with the content. The left one uses the
      built-in default height cap; the right one limits the visible height to 120px via
      content-style.
    </p>
  </div>
</template>

<style scoped>
.popover-scrollable-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.popover-scrollable-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.popover-scrollable-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
