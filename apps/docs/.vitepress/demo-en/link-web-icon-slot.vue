<script setup lang="ts">
/** Demo: SnLink — leading icon via the #icon slot. */
import { ExternalLink, FileText } from 'lucide-vue-next';
import { SnLink } from '@snui/vue-web';
</script>

<template>
  <div class="link-demo">
    <div class="link-demo__row">
      <SnLink href="#doc">
        <template #icon><FileText :size="14" /></template>
        View docs
      </SnLink>
      <SnLink type="primary" href="#external" target="_blank" rel="noopener">
        <template #icon><ExternalLink :size="14" /></template>
        External link
      </SnLink>
    </div>
  </div>
</template>

<style scoped>
.link-demo {
  display: grid;
  gap: 18px;
}
.link-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}
</style>
