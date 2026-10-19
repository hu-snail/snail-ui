<script setup lang="ts">
/**
 * SnDocsFooter — footer chrome for the docs site. Replaces vitepress's
 * default VPFooter.
 *
 * Visual intent: a plain text line, not a card. A single hairline rule
 * separates the footer from the page content; the two text columns sit on
 * one row (space-between) on wide viewports and stack on narrow ones. No
 * container chrome, no fills, no shadows. Type is muted and compact.
 */
</script>

<template>
  <footer class="sn-docs-footer">
    <div class="sn-docs-footer__inner">
      <p class="sn-docs-footer__msg">Released under the MIT License.</p>
      <p class="sn-docs-footer__copyright">Copyright © 2026 hu-snail</p>
    </div>
  </footer>
</template>

<style scoped>
.sn-docs-footer {
  /* `border-default` is the lightest border tone that still reads as a line in
   * light mode (`border-subtle` resolves to the same wash tone as the hover
   * fills there); in dark mode both tones are identical. */
  border-top: 1px solid var(--sn-web-color-border-default);
  padding: 24px 0;
}

.sn-docs-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 4px 16px;
  padding: 0 24px;
}

.sn-docs-footer__msg,
.sn-docs-footer__copyright {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--sn-web-color-text-tertiary);
}

/* Narrow viewports: stack the two columns, left aligned. */
@media (max-width: 640px) {
  .sn-docs-footer__inner {
    flex-direction: column;
    align-items: flex-start;
    padding: 0 16px;
  }
}
</style>
