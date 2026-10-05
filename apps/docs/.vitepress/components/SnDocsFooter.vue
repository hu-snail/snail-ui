<script setup lang="ts">
/**
 * SnDocsFooter — footer chrome, built from real @snui/vue-web components
 * (SnDivider + SnCard). Replaces vitepress's default VPFooter.
 *
 * Wraps the page-end with a divider line + a 2-cell card grid holding the
 * MIT message and copyright. Follows the active SnConfigProvider skin.
 */

import { SnCard, SnDivider } from '@snui/vue-web'
</script>

<template>
  <footer class="sn-docs-footer">
    <SnDivider />
    <SnCard variant="outlined" :padding="'sm'" class="sn-footer-container">
      <p class="sn-docs-footer__msg">Released under the MIT License.</p>
      <p class="sn-docs-footer__copyright">Copyright © 2026 hu-snail</p>
    </SnCard>
  </footer>
</template>

<style scoped>
.sn-docs-footer {
  padding: 0 24px;
}
.sn-docs-footer__msg {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.sn-docs-footer__copyright {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--sn-web-color-text-secondary);
}

/* Doodle skin */
.snui-skin-doodle .sn-footer-container {
  border: 2.5px dashed #1a1a1a;
}
</style>