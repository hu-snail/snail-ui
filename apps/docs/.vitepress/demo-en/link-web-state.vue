<script setup lang="ts">
/**
 * Demo: SnLink — underline on/off, the disabled state, and link-like
 * interaction rendered on a non-anchor tag.
 */
import { ref } from 'vue';
import { SnLink } from '@snui/vue-web';

const clickCount = ref(0);
</script>

<template>
  <div class="link-state-demo">
    <section class="link-state-demo__block">
      <h4>Underline</h4>
      <div class="link-state-demo__row">
        <SnLink type="primary" href="#underline-off"
          >underline = false (default, shown on hover)</SnLink
        >
        <SnLink type="primary" underline href="#underline-on"
          >underline = true (always shown)</SnLink
        >
      </div>
    </section>

    <section class="link-state-demo__block">
      <h4>Disabled (blocks clicks and navigation, href removed)</h4>
      <div class="link-state-demo__row">
        <SnLink href="#enabled">Available link</SnLink>
        <SnLink disabled href="#disabled">Disabled link</SnLink>
        <SnLink type="error" disabled href="#disabled-error">Disabled error link</SnLink>
      </div>
    </section>

    <section class="link-state-demo__block">
      <h4>Custom rendered tag (tag = 'span', only dispatches click)</h4>
      <div class="link-state-demo__row">
        <SnLink tag="span" type="primary" @click="clickCount += 1">span pseudo-link</SnLink>
        <span class="link-state-demo__hint">Triggered {{ clickCount }} times</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.link-state-demo {
  display: grid;
  gap: 20px;
}
.link-state-demo__block {
  display: grid;
  gap: 10px;
}
.link-state-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
.link-state-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}
.link-state-demo__hint {
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
