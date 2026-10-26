<script setup lang="ts">
/**
 * alert-web-basic — the minimal alert: type + title + body.
 */
import { SnAlert } from '@snui/vue-web';
</script>

<template>
  <div class="alert-basic">
    <SnAlert title="Tip">This is the alert content; the close button is hidden by default.</SnAlert>
    <SnAlert type="info" title="Info">Routine maintenance runs tonight at 23:00.</SnAlert>
    <SnAlert type="success" title="Success">Settings saved and applied.</SnAlert>
    <SnAlert type="warning" title="Warning">Your plan has used 85% of its storage.</SnAlert>
    <SnAlert type="error" title="Error">Sync failed. Check your network and try again.</SnAlert>
  </div>
</template>

<style scoped>
.alert-basic {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
</style>
