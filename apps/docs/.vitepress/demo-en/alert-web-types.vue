<script setup lang="ts">
/**
 * alert-web-types — shows all five semantic types side by side.
 */
import { SnAlert } from '@snui/vue-web';
</script>

<template>
  <div class="alert-demo">
    <SnAlert type="default" title="default">Neutral notice — no built-in icon.</SnAlert>
    <SnAlert type="info" title="info">General info that adds context.</SnAlert>
    <SnAlert type="success" title="success">The operation completed successfully.</SnAlert>
    <SnAlert type="warning" title="warning"
      >Needs attention but does not block the current flow.</SnAlert
    >
    <SnAlert type="error" title="error">Failed. Check the network and try again.</SnAlert>
  </div>
</template>

<style scoped>
.alert-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
</style>
