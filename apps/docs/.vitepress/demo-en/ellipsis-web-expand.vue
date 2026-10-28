<script setup lang="ts">
/** Demo: SnEllipsis — fade smoke mask, expandTrigger click, and the
 * configurable expand / collapse toggle (suffix / bottom). */
import { SnEllipsis } from '@snui/vue-web';

const paragraph =
  "Snail AUI's text ellipsis component clamps content to the given line count and " +
  'shows the full text through a tooltip on overflow. With fade enabled the clamped ' +
  'edge dissolves like smoke instead of a hard cut; expandPosition decides where the ' +
  'expand / collapse toggle lives: suffix sits right after the text, bottom takes its ' +
  'own row; expandTrigger="click" toggles via the text itself.';
</script>

<template>
  <div class="ellipsis-expand-demo">
    <section class="ellipsis-expand-demo__block">
      <h4>Fade smoke mask (fade)</h4>
      <SnEllipsis :width="360" :line-clamp="3" fade>{{ paragraph }}</SnEllipsis>
    </section>

    <section class="ellipsis-expand-demo__block">
      <h4>Toggle after the text (expandPosition="suffix")</h4>
      <SnEllipsis :width="360" :line-clamp="2" expand-position="suffix">
        {{ paragraph }}
      </SnEllipsis>
    </section>

    <section class="ellipsis-expand-demo__block">
      <h4>Toggle on its own row (expandPosition="bottom")</h4>
      <SnEllipsis :width="360" :line-clamp="3" fade expand-position="bottom">
        {{ paragraph }}
      </SnEllipsis>
    </section>

    <section class="ellipsis-expand-demo__block">
      <h4>Click the text to expand / collapse (expandTrigger="click")</h4>
      <SnEllipsis :width="360" :line-clamp="2" expand-trigger="click">
        {{ paragraph }}
      </SnEllipsis>
    </section>
  </div>
</template>

<style scoped>
.ellipsis-expand-demo {
  display: grid;
  gap: 18px;
}
.ellipsis-expand-demo__block {
  display: grid;
  gap: 10px;
}
.ellipsis-expand-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary, #888);
}
</style>
