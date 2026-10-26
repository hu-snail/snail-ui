<script setup lang="ts">
/** Demo: SnDescriptionsItem — span 让条目占据多列。 */
import { SnDescriptions, SnDescriptionsItem } from '@snui/vue-web';
</script>

<template>
  <div class="descriptions-demo">
    <SnDescriptions title="Defect ticket" bordered>
      <SnDescriptionsItem label="Defect ID">AUI-WEB-DD-005</SnDescriptionsItem>
      <SnDescriptionsItem label="Priority">P1</SnDescriptionsItem>
      <SnDescriptionsItem label="Status" :span="2"
        >Fixing · regression due this week</SnDescriptionsItem
      >
      <SnDescriptionsItem label="Symptom" :span="3">
        In the multi-column grid, when label-placement is left, the last column's content cell does
        not fill the remaining track.
      </SnDescriptionsItem>
    </SnDescriptions>
  </div>
</template>

<style scoped>
.descriptions-demo {
  width: 100%;
}
</style>
