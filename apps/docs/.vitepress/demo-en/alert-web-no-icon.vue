<script setup lang="ts">
/**
 * alert-web-no-icon — `showIcon=false` with and without a title.
 *
 * Shows: the alert collapsing to a pure text block when the icon is off,
 * and how the text region reclaims the freed horizontal space.
 */
import { SnAlert } from '@snui/vue-web'
</script>

<template>
  <div class="alert-noicon">
    <SnAlert type="info" title="No icon (with title)" :show-icon="false">
      With the icon slot removed, the title and body shift left as a whole.
    </SnAlert>

    <SnAlert type="success" :show-icon="false">
      No title, no icon: a single line of body text, ideal for the lightest status hints.
    </SnAlert>

    <SnAlert type="warning" :show-icon="false" :bordered="false">
      No icon + no border; visually close to a plain note on a tinted background.
    </SnAlert>
  </div>
</template>

<style scoped>
.alert-noicon {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
</style>
